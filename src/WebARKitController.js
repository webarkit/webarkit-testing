import WARKit from "../build/webarkit_ES6_wasm.simd";
import packageInfo from "../package.json";

export default class WebARKitController {
  static GRAY;
  static ORB_TRACKER;
  static AKAZE_TRACKER;

  constructor() {
    this.id;
    this.videoWidth;
    this.videoHeight;
    this.imgWidth;
    this.imgHeight;

    this.listeners = {};
    this.params;
    this.webarkit;

    this.trackerType;
  }

  static async init_raw(videoWidth, videoHeight, trackerType) {
    // directly init with given width / height
    const webARC = new WebARKitController();

    return await webARC._initialize_raw( videoWidth, videoHeight, trackerType);
  }

  async _initialize_raw(videoWidth, videoHeight, trackerType) {

    this.videoWidth = videoWidth;
    this.videoHeight = videoHeight;
    // Create an instance of the WebARKit Emscripten C++ code.
    this.instance = await WARKit();
    console.log(this.instance);

    // Set the tracker types for the WebARKitController class.
    WebARKitController.ORB_TRACKER = this.instance.TRACKER_TYPE.TRACKER_ORB;
    WebARKitController.AKAZE_TRACKER = this.instance.TRACKER_TYPE.TRACKER_AKAZE;
    WebARKitController.FREAK_TRACKER = this.instance.TRACKER_TYPE.TRACKER_FREAK;
    WebARKitController.TEBLID_TRACKER = this.instance.TRACKER_TYPE.TRACKER_TEBLID;
    this.trackerType = this.setTrackerType(trackerType);

    // Initialize the WebARKit class.
    this.webarkit = new this.instance.WebARKit(
      this.videoWidth,
      this.videoHeight,
      this.trackerType
    );

    console.log("[WebARKitController]", "WebARKit initialized");
    WebARKitController.GRAY = this.instance.ColorSpace.GRAY;

    this.version = packageInfo.version;
    console.info("WebARKit ", this.version);

    setTimeout(() => {
      this.dispatchEvent({
        name: "load",
        target: this,
      });
    }, 1);
    return this;
  }

  setTrackerType(trackerType) {
    let trackerT;
    if (trackerType === undefined || trackerType === null) {
      throw new Error("Tracker type is not defined");
    }
    if (trackerType === "orb") {
      trackerT = WebARKitController.ORB_TRACKER;
    } else if (trackerType === "akaze") {
      trackerT = WebARKitController.AKAZE_TRACKER;
    } else if (trackerType === "freak") {
      trackerT = WebARKitController.FREAK_TRACKER;
    } else if (trackerType === "teblid") {
      trackerT = WebARKitController.TEBLID_TRACKER;
    }
    return trackerT;
  }

  process_raw(imageData) {
    let corners = [];
    let matrix = [];
    let pose = [];
    this.processFrame(imageData);

    if(this.isValid()) {

      corners = this.getCorners();
      matrix = this.getHomography();
      pose = this.getPoseMatrix();

      this.dispatchEvent({
        name: "getMarker",
        target: this,
        data: {
          index: 0,
          type: this.trackerType,
          corners: corners,
          matrix: matrix,
          pose: pose
        },
      })
    }
  }

  async loadTrackerGrayImage(imgData, width, height) {
    return this.webarkit.initTrackerGray(imgData, width, height);
  }

  processFrame(imageData) {
    this.webarkit.processFrame(imageData, WebARKitController.GRAY);
  }

  setLogLevel(level) {
    this.webarkit.setLogLevel(level);
  }

  isValid(){
    return this.webarkit.isValid();
  }

  getHomography() {
    return this.webarkit.getHomography();
  }

  getPoseMatrix() {
    return this.webarkit.getPoseMatrix();
  }

  getCameraProjectionMatrix() {
    return this.webarkit.getCameraProjectionMatrix();
  }

  getCorners() {
    return this.webarkit.getCorners();
  }

  addEventListener(name, callback) {
    if (!this.listeners[name]) {
      this.listeners[name] = [];
    }
    this.listeners[name].push(callback);
  }

  removeEventListener(name, callback) {
    if (this.listeners[name]) {
      let index = this.listeners[name].indexOf(callback);
      if (index > -1) {
        this.listeners[name].splice(index, 1);
      }
    }
  }

  dispatchEvent(event) {
    let listeners = this.listeners[event.name];
    if (listeners) {
      for (let i = 0; i < listeners.length; i++) {
        listeners[i].call(this, event);
      }
    }
  }
}
