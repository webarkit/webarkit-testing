import WARKit from "../build/webarkit_ES6_wasm";
import packageInfo from "../package.json";

export default class WebARKitController {
  static GRAY;
  static ORB_TRACKER;
  static AKAZE_TRACKER;
  static file_count = 0;

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

    return await webARC._initialize_raw(videoWidth, videoHeight, trackerType);
  }

  static async init_w(videoWidth, videoHeight, trackerType) {
    const webARC = new WebARKitController();
    //await webARC._initialize_w( videoWidth, videoHeight, trackerType);
    return await webARC._initialize_w(videoWidth, videoHeight, trackerType);
  }

  async _initialize_raw(videoWidth, videoHeight, trackerType) {

    this.videoWidth = videoWidth;
    this.videoHeight = videoHeight;
    // Create an instance of the WebARKit Emscripten C++ code.
    this.instance = await WARKit();

    // Set the tracker types for the WebARKitController class.
    WebARKitController.ORB_TRACKER = this.instance.TRACKER_TYPE.TRACKER_ORB;
    WebARKitController.AKAZE_TRACKER = this.instance.TRACKER_TYPE.TRACKER_AKAZE;
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

  async _initialize_w(videoWidth, videoHeight, trackerType) {

    this.videoWidth = videoWidth;
    this.videoHeight = videoHeight;
    // Create an instance of the WebARKit Emscripten C++ code.
    this.instance = await WARKit();

    // Set the tracker types for the WebARKitController class.
    WebARKitController.ORB_TRACKER = this.instance.TRACKER_TYPE.TRACKER_ORB;
    WebARKitController.AKAZE_TRACKER = this.instance.TRACKER_TYPE.TRACKER_AKAZE;
    this.trackerType = this.setTrackerType(trackerType);

    // Initialize the WebARKit class.
    this.webarkit = new this.instance.WebARKit();

    await this.loadCamera("./data/camera_para.dat");

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
    }
    return trackerT;
  }

  process_raw(imageData) {
    let corners = [];
    let matrix = [];
    this.processFrame(imageData);

    if (this.isValid()) {

      corners = this.getCorners();
      matrix = this.getHomography();

      this.dispatchEvent({
        name: "getMarker",
        target: this,
        data: {
          index: 0,
          type: this.trackerType,
          corners: corners,
          matrix: matrix
        },
      })
    }
  }

  process_w(imageData) {
    let corners = [];
    let matrix = [];
    this.processFrame_w(imageData);

    let pose = this.updatePose(0);
    console.log(pose);

    if (this.isValid()) {

      corners = this.getCorners();
      matrix = this.getHomography();

      this.dispatchEvent({
        name: "getMarker",
        target: this,
        data: {
          index: 0,
          type: this.trackerType,
          corners: corners,
          matrix: matrix
        },
      })
    }
  }

  async loadCamera(camearParam) {
    var filename = "/load_calib_" + WebARKitController.file_count++ + ".dat";
    const response = await fetch(camearParam);
    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    const data = await response.arrayBuffer();
    const buffer = new Uint8Array(data);
    this.instance.FS.writeFile(filename, buffer, { encoding: "binary" });
    console.info('loaded camera');
    return this.webarkit.loadARParam(filename, this.trackerType, this.videoWidth, this.videoHeight)
  }

  async loadTrackerGrayImage(imgData, width, height) {
    return this.webarkit.initTrackerGray(imgData, width, height);
  }

  async addMarkerGrayImage(imgData, width, height) {
    return this.webarkit.addMarker(imgData, 'test', width, height, 0, 0.5);
  }

  processFrame(imageData) {
    this.webarkit.processFrame(imageData, WebARKitController.GRAY);
  }

  processFrame_w(imageData) {
    this.webarkit.processFrame_w(imageData);
  }

  updatePose(id) {
    return this.webarkit.updatePose(id);
  }

  isValid() {
    return this.webarkit.isValid();
  }

  getHomography() {
    return this.webarkit.getHomography();
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
