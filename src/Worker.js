import WARKit from "../build/webarkit_ES6_wasm";

var instance;
var webarkit;
var GRAY;
var next = null;
var markerResult = null;

self.onmessage = function (e) {
  var msg = e.data;
  switch (msg.type) {
    case "loadTracker": {
      load(msg);
      return;
    }
    case "process": {
      next = msg.data;
      processFrame(msg, webarkit);
    }
  }
};

const load = async (msg) => {
  console.log(msg);
  instance = await WARKit();
  console.log(instance);
  GRAY = instance.ColorSpace.GRAY;

  webarkit = new instance.WebARKit(
    msg.videoWidth,
    msg.videoHeight,
    instance.TRACKER_TYPE.TRACKER_AKAZE.value
  );

  console.log("[WebARKitController]", "WebARKit initialized");

  webarkit.initTrackerGray(msg.imgData, msg.imgWidth, msg.imgHeight);
};

const processFrame = () => {
  if (webarkit && webarkit.processFrame) {
    webarkit.processFrame(next, GRAY);
  }
  if (webarkit.isValid() == true) {
    markerResult = {
      type: "sendData",
      matrix: webarkit.getHomography(),
      corners: webarkit.getCorners(),
    };
  } else {
    markerResult = null;
  }
  if (markerResult) {
    self.postMessage(markerResult);
  }
  next = null;
};
