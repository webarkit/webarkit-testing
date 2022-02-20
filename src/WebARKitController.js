import WebARKit from './WebARKit'
import Utils from './Utils'

export default class WebARKitController {
  constructor(){
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
  }

  static async init (videoWidth, videoHeight) {
    this.videoWidth = videoWidth
    this.videoHeight = videoHeight
    // directly init with given width / height
    const webARC = new WebARKitController()
    return await webARC._initialize()
  }

  async _initialize () {
    // initialize the toolkit
    this.webarkit = await new WebARKit().init()
    console.log('[WebARController]', 'WebARKit initialized')
    this.id = this.webarkit.setup(this.videoWidth, this.videoHeight)

    setTimeout(() => {
      this.dispatchEvent({
        name: 'load',
        target: this
      })
    }, 1)
      return this
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

  

  _storeDataFile (data, target) {
    // FS is provided by emscripten
    // Note: valid data must be in binary format encoded as Uint8Array
    this.webarkit.FS.writeFile(target, data, {
      encoding: 'binary'
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
