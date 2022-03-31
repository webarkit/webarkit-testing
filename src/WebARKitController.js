import WebARKit from './WebARKit'
import Utils from './Utils'
import { createCanvas } from 'canvas'

export default class WebARKitController {
  constructor() {
    this.id
    this.jpegCount = 0
    this.videoWidth = 640
    this.videoHeight = 480
    //pointers
    this.framepointer = null
    this.framesize = null
    this.dataHeap = null
    this.listeners = {}
    this.params
    this.webarkit
    this.canvas
    this.canvasHeap
    this.output_t_valid = 0
    this.output_t_data = null
  }

  static async init(videoWidth, videoHeight) {
    this.videoWidth = videoWidth
    this.videoHeight = videoHeight
    // directly init with given width / height
    const webARC = new WebARKitController()
    return await webARC._initialize()
  }

  async _initialize() {
    // initialize the toolkit
    this.webarkit = await new WebARKit().init()
    console.log('[WebARController]', 'WebARKit initialized')
    this.id = this.webarkit.setup(this.videoWidth, this.videoHeight)
    // setting malloc params
    this.params = this.webarkit.instance.frameMalloc
    this.framepointer = this.params.framevideopointer
    this.framesize = this.params.framevideosize
    this.dataHeap = new Uint8Array(this.webarkit.instance.HEAPU8.buffer, this.framepointer, this.framesize)
    this.canvasHeap = createCanvas(this.videoWidth, this.videoHeight)
    this.config = {
      "addPath": "",
      "cameraPara": "examples/Data/camera_para.dat",
      "videoSettings": {
        "width": {
          "min": 640,
          "max": 800
        },
        "height": {
          "min": 480,
          "max": 600
        },
        "facingMode": "environment"
      },
      "loading": {
        "logo": {
          "src": "data/arNFT-logo.gif",
          "alt": "arNFT.js logo"
        },
        "loadingMessage": "Loading, please wait..."
      },
      "renderer": {
        "type": "three",
        "alpha": true,
        "antialias": true,
        "precision": "mediump"
      }
    }
    setTimeout(() => {
      this.dispatchEvent({
        name: 'load',
        target: this
      })
    }, 1)
    return this
  }

  startVideo(callback) {
    Utils.getUserMedia(this.config).then((video) => {
      callback(video)
    })
  }

  process(video) {
    this._copyImageToHeap(video)
  }

  async loadTracker(urlOrData) {
    const targetPrefix = '/load_jpeg_' + this.jpegCount++

    let data
    let ext = 'jpg'
    const fullUrl = urlOrData + '.' + ext
    const target = targetPrefix + '.' + ext

    if (urlOrData instanceof Uint8Array) {
      // assume preloaded camera params
      data = urlOrData

    } else {
      // fetch data via HTTP
      try { data = await Utils.fetchRemoteData(urlOrData) } catch (error) { throw error }
    }

    this._storeDataFile(data, target)

    // return the internal marker ID
    return this.webarkit.readJpeg(this.id, target)
  }

  track(){
    let obj;
    if(this.output_t_valid == 0){
      obj = this.webarkit.instance.resetTrackingAR(this.id, this.videoWidth, this.videoHeight);
      console.log(obj);

      this.output_t_valid = obj.valid;
      this.output_t_data = obj.data;
      console.log(this.output_t_valid);
      console.log(this.output_t_data);
    }

    obj = this.webarkit.instance.trackAR(this.id, this.videoWidth, this.videoHeight);
    console.log(obj);

    this.output_t_valid = obj.valid
  }

  _storeDataFile(data, target) {
    // FS is provided by emscripten
    // Note: valid data must be in binary format encoded as Uint8Array
    this.webarkit.FS.writeFile(target, data, {
      encoding: 'binary'
    })
  }

  _copyImageToHeap(video) {
    this.ctx = this.canvasHeap.getContext('2d')
    this.ctx.save()
    this.ctx.drawImage(video, 0, 0, this.videoWidth, this.videoHeight) // draw video
    this.ctx.restore()
    let imageData = this.ctx.getImageData(0, 0, this.videoWidth, this.videoHeight)
    let data = imageData.data
    if (this.dataHeap) {
      this.dataHeap.set(data)
      return true
    }
    return false
  }

  addEventListener(name, callback) {
    if (!this.listeners[name]) {
      this.listeners[name] = [];
    }
    this.listeners[name].push(callback);
  };

  removeEventListener(name, callback) {
    if (this.listeners[name]) {
      let index = this.listeners[name].indexOf(callback);
      if (index > -1) {
        this.listeners[name].splice(index, 1);
      }
    }
  };

  dispatchEvent(event) {
    let listeners = this.listeners[event.name];
    if (listeners) {
      for (let i = 0; i < listeners.length; i++) {
        listeners[i].call(this, event);
      }
    }
  };
}
