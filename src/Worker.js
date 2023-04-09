import WARKit from "../build/webarkit_ES6_wasm";

var instance;
var webarkit;
var GRAY;

self.onmessage = function (e) {
  var msg = e.data;
  switch (msg.type) {
    case "loadTracker": {
      webarkit = load(msg);
      return;
    }
    case "process": {
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
  return await webarkit;
};

const processFrame = async (msg, webarkit) => {
  const wk = await webarkit
  wk.processFrame(msg.data, GRAY);
  self.postMessage({ type: "sendData", matrix: wk.getHomography(), corners: wk.getCorners()})
}
