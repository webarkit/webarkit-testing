var oWidth = window.innerWidth;
var oHeight = window.innerHeight;

//var oWidth = 640;
//var oHeight = 480;

function isMobile () {
  return /Android|mobile|iPad|iPhone/i.test(navigator.userAgent);
}

var setMatrix = function (matrix, value) {
  var array = [];
  for (var key in value) {
    array[key] = value[key];
  }
  if (typeof matrix.elements.set === "function") {
    matrix.elements.set(array);
  } else {
    matrix.elements = [].slice.call(array);
  }
};

function start(markerUrl, video, input_width, input_height, render_update, track_update) {
  var vw, vh;
  var sw, sh;
  var pscale, sscale;
  var w, h;
  var pw, ph;
  var ox, oy;
  var worker;

  var canvas_process = document.createElement('canvas');
  var context_process = canvas_process.getContext('2d', { willReadFrequently: true });
  var targetCanvas = document.querySelector("#canvas");

  var renderer = new THREE.WebGLRenderer({ canvas: targetCanvas, alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);

  var scene = new THREE.Scene();

  var camera = new THREE.Camera();
  camera.matrixAutoUpdate = false;

  scene.add(camera);

  var sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 8, 8),
    new THREE.MeshNormalMaterial()
  );

  var root = new THREE.Object3D();
  scene.add(root);

  var marker;

  sphere.material.flatShading;
  sphere.scale.set(10, 10, 10);

  root.matrixAutoUpdate = false;
  root.add(sphere);

  var load = function () {
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

    const refIm = document.getElementById("refIm");

    var type = setTrackerType();
    const loadImage =  (URL) => {
      fetch(URL)
          .then(response => response.arrayBuffer())
          .then(buff => {
            //console.log(buff);
            let buffer = new Uint8Array(buff);
            worker.postMessage({
              type: "initTracker",
              trackerType: type,
              imageData: buffer,
              imgWidth: refIm.width,
              imgHeight: refIm.height,
              videoWidth: oWidth,
              videoHeight: oHeight,
            });
            return buffer;
          })
    }

    loadImage(markerUrl)

    worker.onmessage = function (ev) {
      var msg = ev.data;
      switch (msg.type) {
        case "loadedTracker": {
          //console.log(msg)
          var proj = JSON.parse(msg.cameraProjMat);
          //var proj = [1.9102363924347978, 0, 0, 0, 0, 2.5377457054523322, 0, 0, -0.013943280545895442, -0.005830389685211879, -1.0000002000000199, -1, 0, 0, -0.00020000002000000202, 0];
          //console.log("proj: ", proj);
          var ratioW = pw / w;
          var ratioH = ph / h;
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
          if (msg.end == true) {
            // removing loader page if present
            var loader = document.getElementById('loading');
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
          process();
          break;
        }
        case 'not found': {
          found(null);
          process();
          break;
        }
      }
      track_update();
      process();
    };
  };

  var world;

  var found = function (msg) {
    if (!msg) {
      world = null;
    } else {
      //world = JSON.parse(msg.matrixGL_RH);
      world = JSON.parse(msg.viewMatrix_GL);
    }
  };

  var lasttime = Date.now();
  var time = 0;

  var draw = function () {
    render_update();
    var now = Date.now();
    var dt = now - lasttime;
    time += dt;
    lasttime = now;

    if (!world) {
      sphere.visible = false;
    } else {
      sphere.visible = true;
      sphere.position.y = 1;
      sphere.position.x = 1;
      //sphere.position.z = 1;
      // set matrix of 'root' by detected 'world' matrix
      //console.log("world: ", world);
      var world2= [0.04984269657942322, 0.0011028004165823837, 0.0037468644060579515, 0, -0.00015674864315588379, 0.048456810395189856, -0.012054592420455989, 0, -0.003895003003705642, 0.012004841145274035, 0.04830878467734379, 0, -5.418834804971434, -3.6673568534354173, -10.857604385997499, 1];
      setMatrix(root.matrix, world);
    }
    renderer.render(scene, camera);
  };

  var process = function () {
    context_process.fillStyle = 'black';
    context_process.fillRect(0, 0, pw, ph);
    context_process.drawImage(video, 0, 0, vw, vh, ox, oy, w, h);

    var imageData = context_process.getImageData(0, 0, pw, ph);
    worker.postMessage({ type: 'process', data: imageData }, [imageData.data.buffer]);
  }
  var tick = function () {
    draw();
    requestAnimationFrame(tick);
  };

  load();
  tick();
  process();
}
