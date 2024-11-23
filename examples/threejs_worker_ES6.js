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
  sphere.scale.set(.5, .5, .5);

  root.matrixAutoUpdate = false;
  root.add(sphere);

  const load = function () {
    vw = input_width;
    vh = input_height;

    pscale = 320 / Math.max(vw, vh / 3 * 4);
    sscale = isMobile() ? window.outerWidth / input_width : 1;

    sw = vw * sscale;
    sh = vh * sscale;

    w = vw * pscale;
    h = vh * pscale;
    pw = Math.max(w, h / 3 * 4);
    ph = Math.max(h, w / 4 * 3);
    ox = (pw - w) / 2;
    oy = (ph - h) / 2;
    canvas_process.style.clientWidth = pw + "px";
    canvas_process.style.clientHeight = ph + "px";
    canvas_process.width = pw;
    canvas_process.height = ph;

    renderer.setSize(sw, sh);

    worker = new Worker('./worker_threejs.js')

    //const refIm = document.getElementById("refIm");

    const type = setTrackerType();
    const loadImage =  (URL) => {
      fetch(URL)
          .then(response => response.arrayBuffer())
          .then(buff => {
            let buffer = new Uint8Array(buff);
            worker.postMessage({
              type: "initTracker",
              trackerType: type,
              imageData: buffer,
              //imgWidth: refIm.width,
              imgWidth: 1637,
              //imgHeight: refIm.height,
              imgHeight: 2048,
              //videoWidth: oWidth,
              //videoHeight: oHeight,
              videoWidth: vw,
              videoHeight: vh,
            });
            return buffer;
          })
    }

    loadImage(markerUrl)

    worker.onmessage = function (ev) {
      const msg = ev.data;
      switch (msg.type) {
        case "loadedTracker": {
          const proj = JSON.parse(msg.cameraProjMat);
          //console.log("proj: ", proj);
          const ratioW = pw / w;
          const ratioH = ph / h;
          proj[0] *= ratioW;
          proj[4] *= ratioW;
          proj[8] *= ratioW;
          proj[12] *= ratioW;
          proj[1] *= ratioH;
          proj[5] *= ratioH;
          proj[9] *= ratioH;
          proj[13] *= ratioH;
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
      //process();
    };
  };

  let world;

  const found = function (msg) {
    if (!msg) {
      world = null;
    } else {
      world = JSON.parse(msg.pose);
      //world = JSON.parse(msg.matrixGL_RH);
      //world = JSON.parse(msg.viewMatrix_GL);

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
    context_process.fillStyle = 'black';
    context_process.fillRect(0, 0, pw, ph);
    context_process.drawImage(video, 0, 0, vw, vh, ox, oy, w, h);

    const imageData = context_process.getImageData(0, 0, pw, ph);
    worker.postMessage({ type: 'process', imagedata: imageData }, [imageData.data.buffer]);
  }

  const tick = function () {
    draw();
    process();
    requestAnimationFrame(tick);
  };

  load();
  tick();
  //process();
}
