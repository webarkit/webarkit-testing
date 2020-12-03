import WebARKit from './WebARKit'
import Utils from './utils/Utils'
import Container from './utils/html/Container'
import { createCanvas, loadImage } from 'canvas'

export default class WebARKitController {
  constructor(){
    this.id
    this.width = 120
    this.height = 120
    this.videoWidth = 640
    this.videoHeight = 480
    this.framepointer = null
    this.framesize = null
    this.dataHeap = null
    this.listeners = {}
    this.params
    this.webarkit
    this.config
  }

  static async init (videoWidth, videoHeight, config) {
    this.videoWidth = videoWidth
    this.videoHeight = videoHeight
    this.config = config
    console.log(config);
    // directly init with given width / height
    const webARC = new WebARKitController()
    return await webARC._initialize()
  }

  async _initialize () {
    // initialize the toolkit
    this.webarkit = await new WebARKit().init()
    console.log('[WebARKitController]', 'WebARKit initialized')

    this.id = this.webarkit.setup(this.videoWidth, this.videoHeight)
    console.log('[WebARKitController]', 'Got ID from setup', this.id)

    this.params = this.webarkit.frameMalloc
    //console.log(this.params);
    this.framepointer = this.params.framevideopointer
    this.framesize = this.params.framevideosize

    this.dataHeap = new Uint8Array(this.webarkit.instance.HEAPU8.buffer, this.framepointer, this.framesize)

    //const config = this.config
    //console.log(config);

    const config = {
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

    Container.createLoading(config)
        //Container.createStats(stats)
        const containerObj = Container.createContainer()
        const container = containerObj.container
        const canvas = containerObj.canvas  
    
    // the jsonParser need to be fixed, for now we load the configs in the old way...
    // const data = Utils.jsonParser(config)
    // data.then((configData) => {

    Utils.getUserMedia(config).then((video) => {
      this._copyImageToHeap(video)
    })

    //})

    setTimeout(() => {
      this.dispatchEvent({
        name: 'load',
        target: this
      })
    }, 1)
      return this
  }

  loadTracker(url) {
    loadImage(url).then((image) => {
      this.webarkit.test()
      this.width = image.width
      this.height = image.height
      console.log('Width of image is: ', this.width)
      console.log('Height of image is: ', this.height)

      const canvas = createCanvas(this.width, this.height)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0)
      let data = ctx.getImageData(0, 0, this.width, this.height).data

      this.frame2Dpointer = this.params.frame2Dpointer
      this.frame2Dsize = this.params.frame2Dsize
      console.log(this.framepointer);

      this.image2Dframe = new Uint8Array(this.webarkit.instance.HEAPU8.buffer, this.frame2Dpointer, this.frame2Dsize)
      this._copyDataToImage2dFrame(data)
      console.log('Hey, i am here!');
      console.log(this.width);
      //console.log(this.dataHeap);
      this.webarkit.initTracking(this.id, this.width, this.height)
    })
  }

  _copyDataToImage2dFrame(data) {
    if (this.image2Dframe) {
      this.image2Dframe.set(data)
      return true
    }
  }
  
  _copyImageToHeap(data) {
    if (this.dataHeap) {
      this.dataHeap.set(data)
      return true
    }
  }

  track () {

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
}
