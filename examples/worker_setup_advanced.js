function multiplyMatrices(a, b) {
  const ae = a;
  const be = b;
  const te = new Float64Array(16);

  const a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
  const a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
  const a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
  const a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];

  const b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
  const b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
  const b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
  const b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];

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
  const { x, y, z } = xyz;
  const e = m;

  const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

  const r = {};
  r.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
  r.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
  r.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;

  return r;
}

const oWidth = window.innerWidth;
const oHeight = window.innerHeight;

let videoEl;
let arElem;
let grayScaleVideo;
let grayScaleImage;
let grayVideoData;
let overlayCanvas;
let videoCanvas;
let stats;
let loadingPopUp;
let worker;

let proj;

const type = setTrackerType();

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
  const videoSource = await initVideo();

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
    const msg = ev.data;
    switch (msg.type) {
      case "loadedTracker": {
        proj = JSON.parse(msg.cameraProjMat);
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
  };

  const update = () => {
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
      arElem.style.display = "none";
      
      const v = JSON.parse(msg.viewMatrix_GL);
      // The 12-element viewMatrix_GL is a 3x4 matrix arranged as 4 columns of 3 rows each.
      // We convert it to a 16-element column-major matrix by adding the final row [0,0,0,1].
      const world = [
        v[0], v[1], v[2], 0,
        v[3], v[4], v[5], 0,
        v[6], v[7], v[8], 0,
        v[9], v[10], v[11], 1
      ];
      
      const mat = multiplyMatrices(proj, world);

      function glpointToCanvas(xyz) {
        return {
          x: (xyz.x + 1) * 0.5 * overlayCanvas.width,
          y: (1 - xyz.y) * 0.5 * overlayCanvas.height,
        }
      }
      function drawpoint(x, y, z) {
        const r = transformPoint(mat, {x: x, y: y, z: z});
        const c = glpointToCanvas(r);
        return c;
      }

      const overlayCtx = overlayCanvas.getContext("2d");
      clearOverlayCtx();

      // Physical size of the marker in millimeters
      const mwidth = 1637;
      const mheight = 2048;
      const dpi = 220;

      const w = mwidth / dpi * 2.54 * 10;
      const h = mheight / dpi * 2.54 * 10;

      const w2 = w / 2;
      const h2 = h / 2;

      // We flip the Y coordinate of the points to account for the difference
      // between the OpenCV coordinate system (Y down) and WebGL (Y up).
      const p1 = drawpoint(-w2, h2, 0);
      const p2 = drawpoint(w2, h2, 0);
      const p3 = drawpoint(w2, -h2, 0);
      const p4 = drawpoint(-w2, -h2, 0);

      // this will draw a fixed red square, uncomment only for debugging...
      /*p1 = {x:100, y: 100};
      p2 = {x:200, y: 100};
      p3 = {x:200, y: 200};
      p4 = {x:100, y: 200};*/

      overlayCtx.beginPath();
      overlayCtx.moveTo(p1.x, p1.y);
      overlayCtx.lineTo(p2.x, p2.y);
      overlayCtx.lineTo(p3.x, p3.y);
      overlayCtx.lineTo(p4.x, p4.y);
      overlayCtx.closePath();
      overlayCtx.strokeStyle = "lime";
      overlayCtx.lineWidth = 5;
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

function clearOverlayCtx() {
  const overlayCtx = overlayCanvas.getContext("2d");
  overlayCtx.clearRect(0, 0, oWidth, oHeight);
}
