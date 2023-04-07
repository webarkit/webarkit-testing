import WARKit from "../build/webarkit_ES6_wasm";
import { GrayScaleMedia } from "./utils/Grayscale";
import { WebARKitWorker } from "./WebARKitWorker";
import packageInfo from "../package.json";

export default class WebARKitController {
  static GRAY;
  static ORB_TRACKER;
  static AKAZE_TRACKER;

  constructor(video) {
    this.id;
    this.videoWidth = window.innerWidth;
    this.videoHeight = window.innerHeight;
    this.imgWidth;
    this.imgHeight;

    this.listeners = {};
    this.params;
    this.webarkit;

    this.video = video;
    this.grayVideo;
    this.trackerType;
  }

  static async init(video, videoWidth, videoHeight, trackerType) {
    this.videoWidth = videoWidth;
    this.videoHeight = videoHeight;

    // directly init with given width / height
    const webARC = new WebARKitController(video);

    return await webARC._initialize(trackerType);
  }

  static async init2(video, grayImageData, videoWidth, videoHeight, imgWidth, imgHeight, trackerType) {
    this.grayImageData = grayImageData;
    this.videoWidth = videoWidth;
    this.videoHeight = videoHeight;
    this.imgWidth = imgWidth;
    this.imgHeight = imgHeight;

    // directly init with given width / height
    const webARC = new WebARKitController(video);

    return await webARC._initialize2(this.grayImageData, this.videoWidth, this.videoHeight, this.imgWidth, this.imgHeight, trackerType);
  }

  async _initialize(trackerType) {
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

    this.grayVideo = new GrayScaleMedia(
      this.video,
      this.videoWidth,
      this.videoHeight
    );

    setTimeout(() => {
      this.dispatchEvent({
        name: "load",
        target: this,
      });
    }, 1);
    return this;
  }

  async _initialize2(grayImageData, videoWidth, videoHeight, imgWidth, imgHeight, trackerType) {
    const worker = new WebARKitWorker(grayImageData, videoWidth, videoHeight, imgWidth, imgHeight, trackerType);
    await worker.initialize();

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

  startVideo(callback) {
    this.grayVideo
      .requestStream()
      .then((source) => {
        callback(source);
      })
      .catch((err) => {
        console.warn("ERROR: " + err);
      });
  }

  process(video) {
    this._imageToProcess(video);
  }

  async loadTrackerGrayImage(imgData, width, height) {
    return this.webarkit.initTrackerGray(imgData, width, height);
  }

  _imageToProcess(video) {
    const getImageData = () => {
      let data = this.grayVideo.getFrame();
      if (data) {
        this.processFrame(data);
        return true;
      }
    };

    getImageData();

    return false;
  }

  processFrame(imageData) {
    this.webarkit.processFrame(imageData, WebARKitController.GRAY);
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
