function isMobile () {
  return /Android|mobile|iPad|iPhone/i.test(navigator.userAgent);
}

const setMatrix = function (matrix, value) {
  const array = [];
  for (const key in value) {
    array[key] = value[key];
  }
  if (typeof matrix.elements.set === "function") {
    matrix.elements.set(array);
  } else {
    matrix.elements = [].slice.call(array);
  }
};

// Same signature as threejs_worker_ES6.js, but `image` is an HTMLImageElement.
// Static-image variant: the frame is processed at full resolution (matching the
// tracker init size) and only once, since the input never changes.
function start(markerUrl, image, input_width, input_height, render_update, track_update) {
  let vw, vh;
  let sw, sh;
  let sscale;
  let worker;

  const canvas_process = document.createElement('canvas');
  const context_process = canvas_process.getContext('2d', {willReadFrequently: true});
  const targetCanvas = document.querySelector("#canvas");

  const renderer = new THREE.WebGLRenderer({canvas: targetCanvas, alpha: true, antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();

  let fov = (0.8 * 180) / Math.PI;
  let ratio = input_width / input_height;

  const cameraConfig = {
    fov: fov,
    aspect: ratio,
    near: 0.01,
    far: 1000,
  };

  const camera = new THREE.PerspectiveCamera(cameraConfig);
  camera.matrixAutoUpdate = false;

  scene.add(camera);

  const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 8, 8),
      new THREE.MeshNormalMaterial()
  );

  const root = new THREE.Object3D();
  scene.add(root);

  sphere.material.flatShading;
  sphere.scale.set(.5, .5, .5);

  root.matrixAutoUpdate = false;

  // TEST (WebARKitLib#35): no render-side compensation, so we read the
  // library's raw pose with the Y-flipped feed. Sphere + axes on root directly.
  // Orient the content to the marker's image convention: +X right, +Y toward
  // the bottom of the reference image, +Z into the marker. A 180-degree rotation
  // about X (a proper rotation) flips green (Y) toward the bottom and reverses
  // blue (Z) relative to the raw tracked frame.
  const markerFrame = new THREE.Object3D();
  markerFrame.rotation.x = Math.PI;
  root.add(markerFrame);

  // TEST cube: with +Z now into the marker, place it on the -Z side so it rests
  // on the surface toward the viewer. Axes attached to the same frame.
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.6, 0.6),
    new THREE.MeshNormalMaterial()
  );
  box.position.set(0, 0, -0.3);
  markerFrame.add(box);
  const axes = new THREE.AxesHelper(1.0); // X=red, Y=green, Z=blue
  markerFrame.add(axes);

  const load = function () {
    vw = input_width;
    vh = input_height;

    sscale = isMobile() ? window.outerWidth / input_width : 1;
    sw = vw * sscale;
    sh = vh * sscale;

    // Process the image at its full resolution so the frame matches the
    // tracker's frame buffer size (videoWidth x videoHeight).
    canvas_process.width = vw;
    canvas_process.height = vh;

    renderer.setSize(sw, sh);

    worker = new Worker('./worker_threejs.js')

    const type = setTrackerType();
    // Decode the marker JPEG into RGBA pixels with a 2D canvas. The tracker's
    // initTrackerGray() treats the buffer as raw pixels (no JPEG decode), so we
    // must hand it decoded data, not the compressed file bytes.
    // Optional real camera calibration: fetch camera_para.dat in parallel.
    // If absent (404) we fall back to the synthetic FOV camera. Returns a
    // Uint8Array of the file bytes, or null.
    const cameraParaPromise = fetch('data/camera_para.dat')
      .then(r => (r.ok ? r.arrayBuffer() : null))
      .then(buf => (buf ? new Uint8Array(buf) : null))
      .catch(() => null);

    const loadMarker = (URL) => {
      const markerImg = new Image();
      markerImg.onload = async () => {
        const mw = markerImg.naturalWidth;
        const mh = markerImg.naturalHeight;
        const markerCanvas = document.createElement('canvas');
        markerCanvas.width = mw;
        markerCanvas.height = mh;
        const markerCtx = markerCanvas.getContext('2d', {willReadFrequently: true});
        markerCtx.drawImage(markerImg, 0, 0, mw, mh);
        const markerData = markerCtx.getImageData(0, 0, mw, mh);
        const cameraPara = await cameraParaPromise; // Uint8Array or null
        worker.postMessage({
          type: "initTracker",
          trackerType: type,
          imageData: markerData.data,
          imgWidth: mw,
          imgHeight: mh,
          videoWidth: vw,
          videoHeight: vh,
          cameraPara: cameraPara,
        });
      };
      markerImg.src = URL;
    }

    loadMarker(markerUrl)

    worker.onmessage = function (ev) {
      const msg = ev.data;
      switch (msg.type) {
        case "loadedTracker": {
          // Tracker is calibrated at the full image size, so the projection
          // matrix is used as-is (no letterbox scaling).
          const proj = JSON.parse(msg.cameraProjMat);
          setMatrix(camera.projectionMatrix, proj);
          // Kick off the frame sequence (first frame is a blank warmup).
          process();
          break;
        }
        case "endLoading": {
          if (msg.end === true) {
            // removing loader page if present
            const loader = document.getElementById('loading');
            if (loader) {
              loader.querySelector('.loading-text').innerText = 'Start the tracking!';
              setTimeout(function(){
                loader.parentElement.removeChild(loader);
              }, 2000);
            }
          }
          break;
        }
        case 'found': {
          found(msg);
          // Static image: once tracked, the pose is stable. Stop feeding frames
          // and let the render loop keep drawing the result.
          tracked = true;
          break;
        }
        case 'not found': {
          found(null);
          // Keep sending the (static) image until the tracker locks on, or until
          // we give up after a bounded number of attempts.
          if (!tracked && processCount < MAX_PROCESS_ATTEMPTS) {
            process();
          }
          break;
        }
      }
      track_update();
    };
  };

  let world;

  const found = function (msg) {
    if (!msg) {
      world = null;
    } else {
      world = JSON.parse(msg.matrixGL_RH);
      // CV->GL orientation fix for top-down (canvas) input (WebARKitLib#35).
      // Negate the modelview's Y row (row 1) AND Z column (column 2). One row +
      // one column negation keeps the determinant +1 → a PROPER rotation (not a
      // reflection), so normals / back-faces stay correct for real meshes.
      // Column-major indices: row 1 = [1,5,9,13], column 2 = [8,9,10,11];
      // they overlap at world[9] (M12), which is negated twice → left unchanged.
      world[1]  = -world[1];   // row 1 (Y): M10
      world[5]  = -world[5];   //           M11
      world[13] = -world[13];  //           M13 (translation Y)
      world[8]  = -world[8];   // column 2 (Z): M02
      world[10] = -world[10];  //              M22
    }
  };

  var lasttime = Date.now();
  var time = 0;

  const draw = function () {
    render_update();
    var now = Date.now();
    var dt = now - lasttime;
    time += dt;
    lasttime = now;

    if (!world) {
      sphere.visible = false;
    } else {
      sphere.visible = true;
      // set matrix of 'root' by detected 'world' matrix
      setMatrix(root.matrix, world);
    }
    renderer.render(scene, camera);
  };

  let processCount = 0;
  let tracked = false;
  const MAX_PROCESS_ATTEMPTS = 12;

  const process = function () {
    context_process.fillStyle = 'black';
    context_process.fillRect(0, 0, vw, vh);

    // Feed one blank warmup frame first, then the real static image 1:1
    // (UNFLIPPED — normal working feed; only the display is flipped for this test).
    if (processCount > 0) {
      context_process.drawImage(image, 0, 0, vw, vh);
    }
    processCount++;

    const imageData = context_process.getImageData(0, 0, vw, vh);
    worker.postMessage({ type: 'process', imagedata: imageData }, [imageData.data.buffer]);
  }

  // Render loop only; frames are fed to the tracker via the worker ping-pong.
  const tick = function () {
    draw();
    requestAnimationFrame(tick);
  };

  load();
  tick();
}
