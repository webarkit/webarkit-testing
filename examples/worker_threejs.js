importScripts("../dist/WebARKit.js");

var ar;
var next = null;
var markerResult = null;

self.onmessage = (e) => {
  var msg = e.data;
  switch (msg.type) {
    case "initTracker": {
      initTracker(msg);
      return;
    }
    case "process": {
      next = msg.data;
      processFrame();
      return;
    }
  }
};

function initTracker(msg) {
  var trackerType = msg.trackerType;
  //console.log("msg from initTracker: ", msg);

  var onLoad = function (wark) {
    ar = wark;
    //console.log("wark: ", wark)
    //wark.setLogLevel(0);
    wark.loadTrackerGrayImage(msg.imageData, msg.imgWidth, msg.imgHeight, WebARKit.WebARKitController.RGBA);

    var cameraProjMat = wark.getCameraProjectionMatrix();
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
    var u8 = new Uint8Array(next);
    ar.process_raw(u8, WebARKit.WebARKitController.RGBA, false)
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
