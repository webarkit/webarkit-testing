import WebARKit from './WebARKit'
import { loadImage } from 'canvas'

export default class WebARKitController {
  constructor(){
    this.id
    this.width = 120
    this.height = 120
    this.framepointer = null
    this.framesize = null
    this.dataHeap = null
    this.listeners = {}
    this.webarkit
  }
  static async init (url) {
    // directly init with given width / height
    const webARC = new WebARKitController()
    return await webARC._initialize(url)
  }

  async _initialize (url) {
    // initialize the toolkit
    this.webarkit = await new WebARKit().init()
    console.log('[WebARKitController]', 'WebARKit initialized')

    loadImage(url).then((image) => {
      this.width = image.width
      this.height = image.height
      console.log('Width of image is: ', this.width)
      console.log('Height of image is: ', this.height)
      // setup
      this.id = this.webarkit.setup(this.width, this.height)
      console.log('[WebARKitController]', 'Got ID from setup', this.id)

      let params = this.webarkit.frameMalloc
      this.framepointer = params.framepointer
      this.framesize = params.framesize
      this.videoLumaPointer = params.videoLumaPointer

      this.dataHeap = new Uint8Array(this.webarkit.instance.HEAPU8.buffer, this.framepointer, this.framesize)
    })

    setTimeout(() => {
      this.dispatchEvent({
        name: 'load',
        target: this
      })
    }, 1)
      return this
  }

  initTracking(data, refCols, refRows) {
    this.webarkit.initTracking(data, refCols, refRows)
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
