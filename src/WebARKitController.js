import WARKit from "../build/webarkit_ES6_wasm.simd";
import packageInfo from "../package.json";

export default class WebARKitController {
  static RGBA;
  static RGB;
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
    WebARKitController.RGBA = this.instance.ColorSpace.RGBA;
    WebARKitController.RGB = this.instance.ColorSpace.RGB;

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

  process_raw(imageData, colorSpace) {
    let corners = [];
    let matrix = [];
    let matrixGL_RH = new Float64Array(16)
    let pose = new Float64Array(16);
    let viewMatrix_GL = new Float64Array(16);
    this.processFrame(imageData, colorSpace);

    if(this.isValid()) {

      corners = this.getCorners();
      matrix = this.getHomography();
      this.transMatToGLMat(this.getPoseMatrix(), pose);
      viewMatrix_GL = this.getGLViewMatrix();
      matrixGL_RH = this.arglCameraViewRHf(pose, matrixGL_RH, 1.0);


      this.dispatchEvent({
        name: "getMarker",
        target: this,
        data: {
          index: 0,
          type: this.trackerType,
          corners: corners,
          matrix: matrix,
          matrixGL_RH: matrixGL_RH,
          viewMatrix_GL: viewMatrix_GL,
          pose: pose
        },
      })
    }
  }

  async loadTrackerGrayImage(imgData, width, height, trackerType) {
    return this.webarkit.initTrackerGray(imgData, width, height, trackerType);
  }

  processFrame(imageData, colorSpace) {
    this.webarkit.processFrame(imageData, colorSpace);
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

  getGLViewMatrix() {
    return this.webarkit.getGLViewMatrix();
  }

  getCameraProjectionMatrix() {
    return this.webarkit.getCameraProjectionMatrix();
  }

  getCorners() {
    return this.webarkit.getCorners();
  }

  transMatToGLMat(transMat, glMat, scale) {
    if (glMat == undefined) {
      glMat = new Float64Array(16);
    }
    glMat[0 + 0 * 4] = transMat[0]; // R1C1
    glMat[0 + 1 * 4] = transMat[1]; // R1C2
    glMat[0 + 2 * 4] = transMat[2];
    glMat[0 + 3 * 4] = transMat[3];
    glMat[1 + 0 * 4] = transMat[4]; // R2
    glMat[1 + 1 * 4] = transMat[5];
    glMat[1 + 2 * 4] = transMat[6];
    glMat[1 + 3 * 4] = transMat[7];
    glMat[2 + 0 * 4] = transMat[8]; // R3
    glMat[2 + 1 * 4] = transMat[9];
    glMat[2 + 2 * 4] = transMat[10];
    glMat[2 + 3 * 4] = transMat[11];
    glMat[3 + 0 * 4] = 0.0;
    glMat[3 + 1 * 4] = 0.0;
    glMat[3 + 2 * 4] = 0.0;
    glMat[3 + 3 * 4] = 1.0;
    if (scale != undefined && scale !== 0.0) {
      glMat[12] *= scale;
      glMat[13] *= scale;
      glMat[14] *= scale;
    }
    return glMat;
  };

  arglCameraViewRHf(glMatrix, glRhMatrix, scale) {
    var m_modelview;
    if (glRhMatrix == undefined)
      m_modelview = new Float64Array(16);
    else
      m_modelview = glRhMatrix;

    // x
    m_modelview[0] = glMatrix[0];
    m_modelview[4] = glMatrix[4];
    m_modelview[8] = glMatrix[8];
    m_modelview[12] = glMatrix[12];
    // y
    m_modelview[1] = -glMatrix[1];
    m_modelview[5] = -glMatrix[5];
    m_modelview[9] = -glMatrix[9];
    m_modelview[13] = -glMatrix[13];
    // z
    m_modelview[2] = -glMatrix[2];
    m_modelview[6] = -glMatrix[6];
    m_modelview[10] = -glMatrix[10];
    m_modelview[14] = -glMatrix[14];

    // 0 0 0 1
    m_modelview[3] = 0;
    m_modelview[7] = 0;
    m_modelview[11] = 0;
    m_modelview[15] = 1;

    if (scale != undefined && scale !== 0.0) {
      m_modelview[12] *= scale;
      m_modelview[13] *= scale;
      m_modelview[14] *= scale;
    }

    glRhMatrix = m_modelview;

    return glRhMatrix;
  };

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
