import WARKit from '../build/webarkit_ES6_wasm'
import Utils from './utils/Utils'
import Container from './utils/html/Container'
import { createCanvas } from 'canvas'
import ThreejsRenderer from './renderers/ThreejsRenderer'

export default class WebARKitController {
  constructor() {
    this.id
    this.jpegCount = 0
    this.videoWidth = 640
    this.videoHeight = 480

    this.listeners = {}
    this.params
    this.webarkit
    this.config
    this.canvas
    this.canvasHeap
    this.root
    this.config
  }

  static async init(videoWidth, videoHeight, config) {
    this.videoWidth = videoWidth
    this.videoHeight = videoHeight
    this.config = config
    // directly init with given width / height
    const webARC = new WebARKitController()
    return await webARC._initialize()
  }

  async _initialize() {
    const root = this.root
    // Create an instance of the WebARKit Emscripten C++ code.
    this.instance = await WARKit()
    // Initialize the WebARKit class.
    this.webarkit = new this.instance.WebARKit(this.videoWidth, this.videoHeight, this.instance.TRACKER_TYPE.TRACKER_ORB)
    console.log('[WebARKitController]', 'WebARKit initialized')

    this.version = '0.1.0'
    console.info('WebARKit ', this.version)

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

    Container.createLoading(this.config)
    //Container.createStats(stats)
    const containerObj = Container.createContainer()
    const container = containerObj.container
    this.canvas = containerObj.canvas
    this.canvasHeap = createCanvas(this.videoWidth, this.videoHeight)

    // the jsonParser need to be fixed, for now we load the configs in the old way...
    // const data = Utils.jsonParser(config)
    // data.then((configData) => {

    //})

    if (this.config.renderer.type === 'three') {
      const renderer = new ThreejsRenderer(this.config, canvas, root)
      renderer.initRenderer()
      const tick = () => {
        renderer.draw()
        window.requestAnimationFrame(tick)
      }
      tick()
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
    this._imageToProcess(video)
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

  async loadTrackerImage(urlOrData) {
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

    //this._storeDataFile(data, target)

    // return the internal marker ID
    return this.webarkit.initTracker(data, 1637, 2048);
  }

  async loadTrackerImage2(imageSource) {
    var img = null;
    if (typeof imageSource === 'string') {
      img = document.getElementById(imageSource);
    } else {
      img = imageSource;
    }
    var canvas = null;
    var ctx = null;
    if (img instanceof HTMLImageElement) {
      canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);
    } else if (img instanceof HTMLCanvasElement) {
      canvas = img;
      ctx = canvas.getContext('2d');
    } else {
      throw new Error('Please input the valid canvas or img id.');
      return;
    }

    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    return this.webarkit.initTracker(imgData.data, canvas.width, canvas.height);
  }


  _imageToProcess(video) {
    this.ctx = this.canvasHeap.getContext('2d')
    this.ctx.save()
    this.ctx.drawImage(video, 0, 0, this.videoWidth, this.videoHeight) // draw video
    this.ctx.restore()

    const getImageData = () => {
      let imageData = this.ctx.getImageData(0, 0, this.videoWidth, this.videoHeight)
      let data = imageData.data
      if (data) {
        this.processFrame(data);
        return true;
      }
    }

    getImageData()

    return false
  }

  processFrame(imageData) {
    this.webarkit.processFrame(imageData);
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

  _storeDataFile(data, target) {
    // FS is provided by emscripten
    // Note: valid data must be in binary format encoded as Uint8Array
    this.instance.FS.writeFile(target, data, {
      encoding: 'binary'
    })
  }
}
