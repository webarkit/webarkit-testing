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

function toGrayscale(data, width, height, flip = false) {
  const gray = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const r = data[i * 4];
      const g = data[i * 4 + 1];
      const b = data[i * 4 + 2];

      let grayIndex;
      if (flip) {
        grayIndex = (height - 1 - y) * width + x;
      } else {
        grayIndex = i;
      }

      gray[grayIndex] = (0.299 * r + 0.587 * g + 0.114 * b);
    }
  }
  return gray;
}

function start(markerUrl, video, input_width, input_height, render_update, track_update) {
  let vw, vh;
  let sw, sh;
  let pscale, sscale;
  let w, h;
  let pw, ph;
  let ox, oy;
  let worker;

  let imageData;

  //var canvas_process = document.getElementById('canvas_process');
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
  sphere.scale.set(1, 1, 1);

  root.matrixAutoUpdate = false;
  root.add(sphere);

  const load = function () {
    vw = input_width;
    vh = input_height;

    sscale = isMobile() ? window.outerWidth / input_width : 1;

    sw = vw * sscale;
    sh = vh * sscale;

    w = vw;
    h = vh;
    pw = vw;
    ph = vh;
    ox = 0;
    oy = 0;
    canvas_process.style.clientWidth = pw + "px";
    canvas_process.style.clientHeight = ph + "px";
    canvas_process.width = pw;
    canvas_process.height = ph;

    renderer.setSize(sw, sh);

    worker = new Worker('./worker_threejs.js')

    //const refIm = document.getElementById("refIm");

    const type = setTrackerType();
    const loadImage =  (URL) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          // Use standard orientation (no flip)
          const gray = toGrayscale(imageData.data, img.width, img.height, false);
          worker.postMessage({
            type: "initTracker",
            trackerType: type,
            imageData: gray,
            imgWidth: img.width,
            imgHeight: img.height,
            videoWidth: vw,
            videoHeight: vh,
          }, [gray.buffer]);
          resolve();
        };
        img.onerror = reject;
        img.src = URL;
      });
    }

    loadImage(markerUrl)

    worker.onmessage = function (ev) {
      const msg = ev.data;
      switch (msg.type) {
        case "loadedTracker": {
          const proj = JSON.parse(msg.cameraProjMat);
          // The video frame is flipped vertically, so we might need to flip the projection matrix Y-axis
          // or the camera view. Let's try flipping the projection Y scale.
          // proj[5] is the Y scale (1/tan(fov/2) * aspect?).
          // Actually, usually [1][1] (index 5).
          // Try negating it.
          // proj[5] *= -1;
          // Wait, if we used matrixGL_RH which handles coordinate conversion, maybe projection matches?
          // But if image was flipped, the geometry in camera space is flipped.

          setMatrix(camera.projectionMatrix, proj);
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
          //process();
          break;
        }
        case 'not found': {
          found(null);
          //process();
          break;
        }
      }
      track_update();
      process();
    };
  };

  let world;

  const found = function (msg) {
    if (!msg) {
      world = null;
    } else {
      const m = JSON.parse(msg.viewMatrix_GL);
      // C++ bug workaround: The library computes raw OpenCV pose [R|t] and transposes it,
      // but fails to apply the coordinate conversion to OpenGL (flip Y and Z axes).
      // We apply the conversion matrix diag(1, -1, -1, 1) here.
      // Since m is Column-Major:
      // Row 1 (indices 1, 5, 9, 13) corresponding to Y-axis
      // Row 2 (indices 2, 6, 10, 14) corresponding to Z-axis

      m[1] = -m[1];
      m[5] = -m[5];
      m[9] = -m[9];
      m[13] = -m[13];

      m[2] = -m[2];
      m[6] = -m[6];
      m[10] = -m[10];
      m[14] = -m[14];

      world = m;
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
      //console.log("world: ", world);
      setMatrix(root.matrix, world);
    }
    renderer.render(scene, camera);
  };

  const process = function () {
    context_process.drawImage(video, 0, 0, vw, vh);

    const imageData = context_process.getImageData(0, 0, vw, vh);
    // Send RGBA to worker to offload conversion and avoid main thread jank
    worker.postMessage({ type: 'process', imagedata: imageData }, [imageData.data.buffer]);
  }

  const tick = function () {
    draw();
    requestAnimationFrame(tick);
  };

  load();
  tick();
  //process();
}
