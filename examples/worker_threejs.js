importScripts("../dist/WebARKit.js");

var ar;
let next = null;
let markerResult = null;

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
    wark.loadTrackerGrayImage(msg.imageData, msg.imgWidth, msg.imgHeight, WebARKit.WebARKitController.RGBA);
    // Allocate the persistent WASM frame buffer once — avoids convertJSArrayToNumberVector on every frame.
    wark.initFrameBuffer(WebARKit.WebARKitController.RGBA);

    // Optional: override the synthetic FOV camera with real calibration from a
    // camera_para.dat (Uint8Array) before the projection matrix is read.
    if (msg.cameraPara) {
      const ok = wark.loadCameraParam(msg.cameraPara);
      console.log('loadCameraParam:', ok ? 'real camera_para.dat loaded' : 'FAILED (using default camera)');
    }

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
        //viewMatrix_GL: JSON.stringify(event.data.viewMatrix_GL),
        pose: JSON.stringify(event.data.pose),
        matrixGL_RH: JSON.stringify(event.data.matrixGL_RH),
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
    //var u8 = new Uint8Array(next.data);
    ar.process_raw(next.data, WebARKit.WebARKitController.RGBA)
    //ar.process_raw(u8, WebARKit.WebARKitController.RGBA)
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
