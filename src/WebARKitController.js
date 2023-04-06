import WARKit from "../build/webarkit_ES6_wasm";
import Utils from "./utils/Utils";
import Container from "./utils/html/Container";
import { createCanvas } from "canvas";
import { GrayScaleMedia } from "./utils/Grayscale";

export default class WebARKitController {
  static GRAY;
  static ORB_TRACKER;
  static AKAZE_TRACKER;
  constructor() {
    this.id;
    this.jpegCount = 0;
    this.videoWidth = window.innerWidth;
    this.videoHeight = window.innerHeight;

    this.listeners = {};
    this.params;
    this.webarkit;
    this.config;
    this.canvas;
    this.canvasHeap;
    this.root;
    this.video;
    this.grayVideo;
    this.config;
    this.trackerType;
  }

  static async init(videoWidth, videoHeight, config, trackerType) {
    this.videoWidth = videoWidth;
    this.videoHeight = videoHeight;
    this.config = config;

    // directly init with given width / height
    const webARC = new WebARKitController();

    return await webARC._initialize(trackerType);
  }

  async _initialize(trackerType) {
    const root = this.root;
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

    this.version = "0.1.0";
    console.info("WebARKit ", this.version);

    this.config = {
      addPath: "",
      cameraPara: "examples/Data/camera_para.dat",
      videoSettings: {
        width: {
          //"min": 640,
          //"max": 800
          ideal: 640,
        },
        height: {
          //"min": 480,
          //"max": 600
          ideal: 480,
        },
        aspectRatio: { ideal: 640 / 480 },
        facingMode: "environment",
      },
      loading: {
        logo: {
          src: "data/arNFT-logo.gif",
          alt: "arNFT.js logo",
        },
        loadingMessage: "Loading, please wait...",
      },
    };

    //Container.createLoading(this.config);
    //Container.createStats(stats)
    const containerObj = Container.createContainer();
    const container = containerObj.container;
    this.canvas = containerObj.canvas;
    this.canvasHeap = createCanvas(this.videoWidth, this.videoHeight);

    this.video = document.getElementById("video");
    console.log(this.video);
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
    // return the internal marker ID
    this.removeLoading();
    return this.webarkit.initTrackerGray(imgData, width, height);
  }

  removeLoading() {
    var loading = document.getElementById("loading");

    if (loading) {
      console.log("Remove loading");
      loading.parentElement.removeChild(loading);
    }
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
