importScripts("../dist/WebARKit.js");

var ar;
let next = null;
let markerResult = null;

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

self.onmessage = (e) => {
  const msg = e.data;
  switch (msg.type) {
    case "initTracker": {
      initTracker(msg);
      return;
    }
    case "process": {
      next = msg.imagedata;
      processFrame();
      return;
    }
  }
};

function initTracker(msg) {
  const trackerType = msg.trackerType;
  //console.log("msg from initTracker: ", msg);

  const onLoad = function (wark) {
    ar = wark;
    //console.log("wark: ", wark)
    wark.setLogLevel(WebARKit.WebARKitController.WEBARKIT_LOG_LEVEL_DEBUG);
    wark.loadTrackerGrayImage(msg.imageData, msg.imgWidth, msg.imgHeight, WebARKit.WebARKitController.GRAY);

    const cameraProjMat = wark.getCameraProjectionMatrix();
    console.log("camera proj Mat: ", cameraProjMat);

    postMessage({
      type: "loadedTracker",
      cameraProjMat: JSON.stringify(cameraProjMat),
    })

    postMessage({ type: "endLoading", end: true })

    wark.addEventListener("getMarker", function (event) {
      //console.log(event.data);
      markerResult = {
        type: "found",
        //corners: JSON.stringify(event.data.corners),
        //matrix: JSON.stringify(event.data.matrix),
        //matrixGL_RH: JSON.stringify(event.data.matrixGL_RH),
        transMatrix: JSON.stringify(event.data.transMatrix),
        //viewMatrix_GL: JSON.stringify(event.data.viewMatrix_GL),
        pose: JSON.stringify(event.data.pose),
      };
    });
  };

  var onError = function (error) {
    console.error(error);
  };

  WebARKit.WebARKitController.init_raw(msg.videoWidth, msg.videoHeight, trackerType)
    .then(onLoad)
    .catch(onError);
}

function processFrame() {
  markerResult = null;
  if (ar && ar.process_raw) {
    // Convert RGBA to Grayscale and Flip Y (to match GL coordinate system used by tracker)
    // next is ImageData object {data: Uint8ClampedArray, width, height} or just the object passed
    // from main thread. In main thread we passed { type: 'process', imagedata: imageData }
    // where imageData is ImageData object. structuredClone or Transferable passes it.
    // 'next' is assigned msg.imagedata.
    // Check if next has width/height properties.
    const width = next.width;
    const height = next.height;
    const gray = toGrayscale(next.data, width, height, false);

    ar.process_raw(gray, WebARKit.WebARKitController.GRAY)
  }
  if (markerResult) {
    postMessage(markerResult);
  } else {
    postMessage({
      type: "not found",
    });
  }

  next = null;
}
