
import webarkit from '../build/webarkit_ES6_wasm'

export default class WebARKit {
  // construction
  constructor () {
    // reference to WASM module
    this.instance
    this.version = '0.0.0'
    console.info('WebARKit ', this.version)
  }
  // ---------------------------------------------------------------------------

  // initialization
  async init () {
    const runtime = await webarkit();
    this.instance = runtime
    this._decorate()
    const scope = (typeof window !== 'undefined') ? window : global
    scope.webarkit = this
    return this
  }

  _decorate () {
    // add delegate methods
    [
      'setup',      
      'readJpeg',
      'resetTrackingAR',
      'trackAR',
      'FS',
    ].forEach(method => {
      this[method] = this.instance[method]
    })

    // expose constants
    for (const co in this.instance) {
      if (co.match(/^WebAR/)) {
        this[co] = this.instance[co]
      }
    }
  }
}
