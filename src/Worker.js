import WARKit from "../build/webarkit_ES6_wasm";

self.onmessage = function (e) {
  var msg = e.data;
  switch (msg.type) {
    case "loadTracker": {
      load(msg);
      return;
    }
  }
};

var instance;
var webarkit;

const load = async (msg) => {
  console.log(msg);
  instance = await WARKit();
  console.log(instance);
 
  webarkit = new instance.WebARKit(
    msg.videoWidth,
    msg.videoHeight,
    instance.TRACKER_TYPE.TRACKER_AKAZE.value
  );
  console.log(webarkit);
  console.log("[WebARKitController]", "WebARKit initialized");

  webarkit.initTrackerGray(msg.imgData, msg.imgWidth, msg.imgHeight);
};
