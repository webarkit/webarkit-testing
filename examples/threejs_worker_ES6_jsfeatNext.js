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

function color2gray(data, videoSize) {
  let q = 0;
  let gray = new Uint8Array(videoSize);

  // Create luma from video data assuming Pixelformat AR_PIXEL_FORMAT_RGBA
  // see (ARToolKitJS.cpp L: 43)
  for (let p = 0; p < videoSize; p++) {
    let r = data[q + 0],
        g = data[q + 1],
        b = data[q + 2];
    // @see https://stackoverflow.com/a/596241/5843642
    gray[p] = (r + r + r + b + g + g + g + g) >> 3;
    q += 4;
  }
  return gray;
}

function start(markerUrl, video, input_width, input_height, render_update, track_update) {
  var vw, vh;
  var sw, sh;
  var pscale, sscale;
  var w, h;
  var pw, ph;
  var ox, oy;
  var worker;

  var imageData;

  var jsfeat = jsfeatNext.jsfeatNext;

  var imgproc = new jsfeat.imgproc();

  var img_u8 = new jsfeat.matrix_t(input_width, input_height, jsfeat.U8_t | jsfeat.C1_t);
  //var img_u8 = new jsfeat.matrix_t(oWidth, oHeight, jsfeat.U8_t | jsfeat.C1_t);
  //var grayV = new Uint8ClampedArray(input_width * input_height);
  //var grayV = new Uint8ClampedArray(oWidth * oHeight);

  //var canvas_process = document.getElementById('canvas_process');
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
  sphere.scale.set(1, 1, 1);

  root.matrixAutoUpdate = false;
  root.add(sphere);

  var load = function () {
    vw = input_width;
    vh = input_height;
    //vw = oWidth;
    //vh = oHeight;

    sscale = isMobile() ? window.outerWidth / input_width : 1;
    //sscale = isMobile() ? window.outerWidth / oWidth : 1;

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

    worker = new Worker('./worker_jsfeatNext.js')

    //const refIm = document.getElementById("refIm");

    const image_H = 2048;
    const image_W = 1637;

    var type = setTrackerType();
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

          let img_u8_tracker = new jsfeat.matrix_t(img.width, img.height, jsfeat.U8_t | jsfeat.C1_t);
          imgproc.grayscale(imageData.data, img.width, img.height, img_u8_tracker);

          worker.postMessage({
            type: "initTracker",
            trackerType: type,
            imageData: img_u8_tracker.data,
            imgWidth: img.width,
            imgHeight: img.height,
            videoWidth: vw,
            videoHeight: vh,
          }, [img_u8_tracker.data.buffer]);
          resolve();
        };
        img.onerror = reject;
        img.src = URL;
      });
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
          //process();
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

  var world;

  var found = function (msg) {
    if (!msg) {
      world = null;
    } else {
      world = JSON.parse(msg.pose);
      //world = JSON.parse(msg.matrixGL_RH);
      //world = JSON.parse(msg.viewMatrix_GL);

    }
  };

  //var lasttime = Date.now();
  //var time = 0;

  var draw = function () {
    render_update();
    /*var now = Date.now();
    var dt = now - lasttime;
    time += dt;
    lasttime = now;*/

    if (!world) {
      sphere.visible = false;
    } else {
      sphere.visible = true;
      //sphere.position.y = 1;
      //sphere.position.x = 1;
      //sphere.position.z = 1;
      // set matrix of 'root' by detected 'world' matrix
      //console.log("world: ", world);
      //var world2= [0.04984269657942322, 0.0011028004165823837, 0.0037468644060579515, 0, -0.00015674864315588379, 0.048456810395189856, -0.012054592420455989, 0, -0.003895003003705642, 0.012004841145274035, 0.04830878467734379, 0, -5.418834804971434, -3.6673568534354173, -10.857604385997499, 1];
      setMatrix(root.matrix, world);
    }
    renderer.render(scene, camera);
  };

  const process = function () {
    context_process.fillStyle = 'black';
    //console.log("vw, vh, pw, ph, ox, oy: ",vw, vh, pw, ph, ox, oy);
    //context_process.fillRect(0, 0, pw, ph);
    context_process.fillRect(0, 0, vw, vh);
    //context_process.drawImage(video, 0, 0, vw, vh, ox, oy, w, h);
    context_process.drawImage(video, 0, 0, vw, vh);

    const imageData = context_process.getImageData(0, 0, vw, vh);
    imgproc.grayscale(imageData.data, vw, vh, img_u8);
    //console.log(img_u8)
    worker.postMessage({ type: 'process', imagedata: img_u8.data });
  }

  var tick = function () {
    draw();
    //update();
    requestAnimationFrame(tick);
  };

  load();
  tick();
  //process();
}
