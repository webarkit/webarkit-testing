function multiplyMatrices(a, b) {
  var ae = a;
  var be = b;
  var te = new Float64Array(16);

  var a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
  var a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
  var a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
  var a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];

  var b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
  var b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
  var b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
  var b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];

  te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
  te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
  te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
  te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

  te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
  te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
  te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
  te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

  te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
  te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
  te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
  te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

  te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
  te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
  te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
  te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

  return te;
}

function transformPoint(m, xyz) {
  var x = xyz.x, y = xyz.y, z = xyz.z;
  var e = m;

  var w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

  var r = {};
  r.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
  r.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
  r.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;

  return r;
}

function isMobile () {
  return /Android|mobile|iPad|iPhone/i.test(navigator.userAgent);
}

var oWidth = window.innerWidth;
var oHeight = window.innerHeight;

var vw = oWidth;
var vh = oHeight;

var pscale = 320 / Math.max(vw, vh / 3 * 4);
var sscale = isMobile() ? window.outerWidth / oWidth : 1;

var sw = vw * sscale;
var sh = vh * sscale;

var w = vw * pscale;
var h = vh * pscale;
var pw = Math.max(w, h / 3 * 4);
var ph = Math.max(h, w / 4 * 3);

var ox = (pw - w) / 2;
var oy = (ph - h) / 2;

var videoEl;
var arElem;
var grayScaleVideo;
var grayScaleImage;
var grayVideoData;
var overlayCanvas;
var videoCanvas;
var stats;
var loadingPopUp;
var worker;

var proj;

var type = setTrackerType();

window.onload = async function () {
  videoEl = createVideo();
  createVideoCanvas();
  createOverlayCanvas();
  loadingPopUp = document.getElementById("loading");
  loadingPopUp.className = "show";

  const refIm = document.getElementById("refIm");
  grayScaleImage = new GrayScale.GrayScaleMedia(
    refIm,
    refIm.width,
    refIm.height
  );
  const grayImageData = grayScaleImage.getFrame();
  arElem = document.getElementById("arElem");
  grayScaleVideo = new GrayScale.GrayScaleMedia(videoEl, oWidth, oHeight);
  var videoSource = await initVideo();

  worker = new Worker("./worker.js");

  initStats();

  worker.postMessage({
    type: "initTracker",
    trackerType: type,
    imageData: grayImageData,
    imgWidth: refIm.width,
    imgHeight: refIm.height,
    videoWidth: oWidth,
    videoHeight: oHeight,
  });

  arElem.style["transform-origin"] = "top left"; // default is center
  arElem.style.zIndex = 2;

  worker.onmessage = function (ev) {
    var msg = ev.data;
    switch (msg.type) {
      case "loadedTracker": {
        proj = JSON.parse(msg.cameraProjMat);
        /*const ratioW = pw / w;
        const ratioH = ph / h;
        proj[0] *= ratioW;
        proj[4] *= ratioW;
        proj[8] *= ratioW;
        proj[12] *= ratioW;
        proj[1] *= ratioH;
        proj[5] *= ratioH;
        proj[9] *= ratioH;
        proj[13] *= ratioH;*/
        hideLoading();
        process();
        break;
      }
      case "found": {
        found(msg);
        process();
        break;
      }
      case "not found": {
        found(null);
        process();
        break;
      }
    }
    //process();
  };

  let update = () => {
    stats.begin();
    grayVideoData = grayScaleVideo.getFrame();
    const videoCanvasCtx = videoCanvas.getContext("2d");
    videoCanvasCtx.drawImage(videoSource, 0, 0, oWidth, oHeight);
    stats.end();
    requestAnimationFrame(update);
  };
  update();

  function hideLoading() {
    loadingPopUp.className = "hide";
  }

  function found(msg) {
    if (!msg) {
      clearOverlayCtx();
      arElem.style.display = "none";
    } else {
      //arElem.style.display = "block";
      arElem.style.display = "none";
      console.log("matrixGL_RH matrix: ", JSON.parse(msg.matrixGL_RH));
      const world = JSON.parse(msg.matrixGL_RH);
      const mat = multiplyMatrices(proj, world);

      function glpointToCanvas(xyz) {
        return {
          x: (xyz.x + 1) * 0.5 * pw / pscale * sscale - ox / pscale * sscale,
          y: (1 - xyz.y) * 0.5 * ph / pscale * sscale - oy / pscale * sscale,
        }
      }
      function drawpoint(x, y, z) {
        const r = transformPoint(mat, {x: x, y: y, z: z});
        const c = glpointToCanvas(r);
        return c;
      }

      //drawCorners(JSON.parse(msg.corners));
      //transformElem(JSON.parse(msg.matrix), arElem);

      const overlayCtx = overlayCanvas.getContext("2d");
      clearOverlayCtx();
      //drawCorners(JSON.parse(msg.corners));

      //var width = marker.width;
      const mwidth = 1637;
      //var height = marker.height;
      const mheight = 2048;
      const dpi = 150;

      const w = mwidth / dpi * 2.54 * 10;
      const h = mheight / dpi * 2.54 * 10;

      let p1 = drawpoint(0, 0, 0);
      let p2 = drawpoint(w, 0, 0);
      let p3 = drawpoint(w, h, 0);
      let p4 = drawpoint(0, h, 0);

      // this will draw a fixed red square, uncomment only for debugging...
      /*p1 = {x:100, y: 100};
      p2 = {x:200, y: 100};
      p3 = {x:200, y: 200};
      p4 = {x:100, y: 200};*/

      console.log(p1, p2, p3, p4)

      overlayCtx.beginPath();
      overlayCtx.moveTo(p1.x, p1.y);
      overlayCtx.lineTo(p2.x, p2.y);
      overlayCtx.lineTo(p3.x, p3.y);
      overlayCtx.lineTo(p4.x, p4.y);
      overlayCtx.closePath();
      overlayCtx.strokeStyle = "red";
      overlayCtx.stroke();

    }
  }

  function process() {
    if (grayVideoData) {
      worker.postMessage({ type: "process", data: grayVideoData });
    }
  }
  update();
};

async function initVideo() {
  return await grayScaleVideo.requestStream().catch((err) => {
    console.error(err);
  });
}

function initStats() {
  stats = new Stats();
  stats.showPanel(0);
  document.getElementById("stats").appendChild(stats.domElement);
}

function setVideoStyle(elem) {
  elem.style.position = "absolute";
  elem.style.top = 0;
  elem.style.left = 0;
}

function createVideo() {
  const video = document.createElement("video");
  video.id = "video";
  video.setAttribute("autoplay", "");
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  return video;
}

function createVideoCanvas() {
  videoCanvas = document.createElement("canvas");
  setVideoStyle(videoCanvas);
  videoCanvas.id = "video-canvas";
  videoCanvas.width = oWidth;
  videoCanvas.height = oHeight;
  document.body.appendChild(videoCanvas);
}

function createOverlayCanvas() {
  overlayCanvas = document.createElement("canvas");
  setVideoStyle(overlayCanvas);
  overlayCanvas.id = "overlay";
  overlayCanvas.width = oWidth;
  overlayCanvas.height = oHeight;
  overlayCanvas.style.zIndex = 1;
  document.body.appendChild(overlayCanvas);
}

function transformElem(h, elem) {
  // column major order
  let transform = [
    h[0],
    h[3],
    0,
    h[6],
    h[1],
    h[4],
    0,
    h[7],
    0,
    0,
    1,
    0,
    h[2],
    h[5],
    0,
    h[8],
  ];
  transform = "matrix3d(" + transform.join(",") + ")";
  elem.style["-ms-transform"] = transform;
  elem.style["-webkit-transform"] = transform;
  elem.style["-moz-transform"] = transform;
  elem.style["-o-transform"] = transform;
  elem.style.transform = transform;
  elem.style.display = "block";
}

function clearOverlayCtx() {
  const overlayCtx = overlayCanvas.getContext("2d");
  overlayCtx.clearRect(0, 0, oWidth, oHeight);
}

function drawCorners(corners) {
  const overlayCtx = overlayCanvas.getContext("2d");
  clearOverlayCtx();

  overlayCtx.beginPath();
  overlayCtx.strokeStyle = "blue";
  overlayCtx.lineWidth = 3;

  // [x1,y1,x2,y2,x3,y3,x4,y4]
  overlayCtx.moveTo(corners[0], corners[1]);
  overlayCtx.lineTo(corners[2], corners[3]);
  overlayCtx.lineTo(corners[4], corners[5]);
  overlayCtx.lineTo(corners[6], corners[7]);
  overlayCtx.lineTo(corners[0], corners[1]);

  overlayCtx.stroke();
}

