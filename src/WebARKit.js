import ModuleLoader from './ModuleLoader'
import Utils from './Utils'

export default class WebARKit {
  // construction
  constructor () {
    // reference to WASM module
    this.instance
    this.marker2DCount = 0
    this.version = '0.0.0'
    console.info('WebARKit ', this.version)
  }
  // ---------------------------------------------------------------------------

  // initialization
  async init () {
    const runtime = await ModuleLoader.init()
    this.instance = runtime.instance
    this._decorate()
    const scope = (typeof window !== 'undefined') ? window : global
    scope.webarkit = this

    return this
  }
  _decorate () {
    // add delegate methods
    [
      'test',
      'initTracking'
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

  async add2DMarker (url, width, height) {
    // url doesn't need to be a valid url. Extensions to make it valid will be added here
    const target = '/marker2D_' + this.marker2DCount++

    let data

    try { data = await Utils.fetchRemoteData(url) } catch (error) { throw error }

    this._storeDataFile(data, target)

    // return the internal marker ID
    return this.instance.initTracking(target, width, height)
  }

  _storeDataFile (data, target) {
    // FS is provided by emscripten
    // Note: valid data must be in binary format encoded as Uint8Array
    this.instance.FS.writeFile(target, data, {
      encoding: 'binary'
    })
  }
}
