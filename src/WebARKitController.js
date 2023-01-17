import WebARKit from './WebARKit'
import Utils from './utils/Utils'
import Container from './utils/html/Container'
import { createCanvas, loadImage } from 'canvas'
import ThreejsRenderer from './renderers/ThreejsRenderer'

export default class WebARKitController {
  constructor(){
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

  static async init (videoWidth, videoHeight, config) {
    this.videoWidth = videoWidth
    this.videoHeight = videoHeight
    this.config = config
    // directly init with given width / height
    const webARC = new WebARKitController()
    return await webARC._initialize()
  }

  async _initialize () {
    const root = this.root
    // initialize the toolkit
    this.webarkit = await new WebARKit().init()
    console.log('[WebARKitController]', 'WebARKit initialized')

    this.id = this.webarkit.setup(this.videoWidth, this.videoHeight)
    console.log('[WebARKitController]', 'Got ID from setup', this.id)

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

  _copyImageToHeap(video) {
    this.ctx = this.canvasHeap.getContext('2d')
    this.ctx.save()
    this.ctx.drawImage(video, 0, 0, this.videoWidth, this.videoHeight) // draw video
    this.ctx.restore()

    const getImageData = () => {
      let imageData = this.ctx.getImageData(0, 0, this.videoWidth, this.videoHeight)
      let data = imageData.data
      if(data) {
        this.processFrame(data);
        return true;
      }
    }

    getImageData()

    return false
  }

  parseResult(ptr) {
    const valid = this.webarkit.getValue(ptr, "i8");
    const dataPtr = this.webarkit.getValue(ptr + 4, "*");
    let data = new Float64Array(this.webarkit.HEAPF64.buffer, dataPtr, 17);

    const h = data.slice(0, 9);
    const warped = data.slice(9, 17);

    return {
        valid: valid,
        H: h,
        corners: warped
    };
  }

  processFrame(imageData) {
    this.webarkit.processFrame(this.id, imageData);
  }

  addEventListener(name, callback) {
    if(!this.listeners[name]) {
      this.listeners[name] = [];
    }
    this.listeners[name].push(callback);
  };

  removeEventListener(name, callback) {
    if(this.listeners[name]) {
      let index = this.listeners[name].indexOf(callback);
      if(index > -1) {
        this.listeners[name].splice(index, 1);
      }
    }
  };

  dispatchEvent(event) {
    let listeners = this.listeners[event.name];
    if(listeners) {
      for(let i = 0; i < listeners.length; i++) {
        listeners[i].call(this, event);
      }
    }
  };

  _storeDataFile (data, target) {
    // FS is provided by emscripten
    // Note: valid data must be in binary format encoded as Uint8Array
    this.webarkit.FS.writeFile(target, data, {
      encoding: 'binary'
    })
  }
}
