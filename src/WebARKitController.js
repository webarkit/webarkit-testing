import WebARKit from './WebARKit'
import { createCanvas, loadImage } from 'canvas'

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
  static async init () {
    // directly init with given width / height
    const webARC = new WebARKitController()
    return await webARC._initialize()
  }

  async _initialize () {
    // initialize the toolkit
    this.webarkit = await new WebARKit().init()
    console.log('[WebARKitController]', 'WebARKit initialized')

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
      // setup
      this.id = this.webarkit.setup(this.width, this.height)
      console.log('[WebARKitController]', 'Got ID from setup', this.id)

      const canvas = createCanvas(this.width, this.height)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0)
      let data = ctx.getImageData(0, 0, this.width, this.height).data

      let params = this.webarkit.frameMalloc
      this.framepointer = params.framepointer
      this.framesize = params.framesize

      this.dataHeap = new Uint8Array(this.webarkit.instance.HEAPU8.buffer, this.framepointer, this.framesize)

      if (this.dataHeap) {
        this.dataHeap.set(data)
        //console.log(this.dataHeap);
        this.webarkit.initTracking(this.id, this.width, this.height)
        return true
      }
      //this.webarkit.initTracking(this.id, this.width, this.height)
    })
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
