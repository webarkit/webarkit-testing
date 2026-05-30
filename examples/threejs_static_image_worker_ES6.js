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

  // Frame correction. The library's marker frame uses image-coordinate
  // conventions (+X right, +Y down, +Z into the marker), which puts AR
  // content "behind" the marker in a three.js scene. A 180 degree rotation
  // around the local Y axis (a proper rotation, no reflection) flips X and
  // Z so that +Z faces the camera and the content sits above the marker.
  // The remaining axis tilt observed in some demo images is tied to an
  // unresolved projection X-mirror in the upstream library (see
  // webarkit/WebARKitLib#35) and cannot be fully corrected from the example
  // side until that lands.
  const markerFrame = new THREE.Object3D();
  markerFrame.rotation.y = Math.PI;
  root.add(markerFrame);

  markerFrame.add(sphere);

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
    const loadMarker = (URL) => {
      const markerImg = new Image();
      markerImg.onload = () => {
        const mw = markerImg.naturalWidth;
        const mh = markerImg.naturalHeight;
        const markerCanvas = document.createElement('canvas');
        markerCanvas.width = mw;
        markerCanvas.height = mh;
        const markerCtx = markerCanvas.getContext('2d', {willReadFrequently: true});
        markerCtx.drawImage(markerImg, 0, 0, mw, mh);
        const markerData = markerCtx.getImageData(0, 0, mw, mh);
        worker.postMessage({
          type: "initTracker",
          trackerType: type,
          imageData: markerData.data,
          imgWidth: mw,
          imgHeight: mh,
          videoWidth: vw,
          videoHeight: vh,
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
      // Use the GL right-handed modelview (matrixGL_RH) — this is the pose
      // after the full CV->GL handedness flip (Y and Z rows negated incl.
      // translation), so the tracked object sits in front of the GL camera.
      // The raw `pose` field is the OpenCV camera pose (+Z forward) and would
      // place the object behind the camera under three.js' GL projection.
      world = JSON.parse(msg.matrixGL_RH);
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

    // The tracker crashes if it detects a marker on its very first frame
    // (its tracking-point selection only runs from the second frame onward).
    // Feed one blank warmup frame first, then the real static image 1:1.
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
