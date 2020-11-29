import WebARKit from './WebARKit'

export default class WebARKitController {
  constructor(){
    this.id
    this.listeners = {}
  }
  static async init () {
    // directly init with given width / height
    const webARC = new WebARKitController()
    return await webARC._initialize()
  }

  async _initialize () {
    // initialize the toolkit
    this.webarkit = await new WebARKit().init()
    console.log('[WebARController]', 'WebARKit initialized')

    setTimeout(() => {
      this.dispatchEvent({
        name: 'load',
        target: this
      })
    }, 1)
      return this
  }

  setup (width, height) {
    return this.id = this.webarkit.setup(width, height)
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
