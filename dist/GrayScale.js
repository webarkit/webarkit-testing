(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["GrayScale"] = factory();
	else
		root["GrayScale"] = factory();
})(typeof self !== 'undefined' ? self : this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/utils/shaders/flip-image.glsl":
/*!*******************************************!*\
  !*** ./src/utils/shaders/flip-image.glsl ***!
  \*******************************************/
/***/ ((module) => {

module.exports = "attribute vec2 position;\nvarying vec2 tex_coords;\nuniform float flipY;\nvoid main(void) {\ntex_coords = (position + 1.0) / 2.0;\ntex_coords.y = 1.0 - tex_coords.y;\ngl_Position = vec4(position * vec2(1, flipY), 0.0, 1.0);\n}"

/***/ }),

/***/ "./src/utils/shaders/grayscale.glsl":
/*!******************************************!*\
  !*** ./src/utils/shaders/grayscale.glsl ***!
  \******************************************/
/***/ ((module) => {

module.exports = "precision highp float;\nuniform sampler2D u_image;\nvarying vec2 tex_coords;\nconst vec3 g = vec3(0.299, 0.587, 0.114);\nvoid main(void) {\nvec4 color = texture2D(u_image, tex_coords);\nfloat gray = dot(color.rgb, g);\ngl_FragColor = vec4(vec3(gray), 1.0);\n}"

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _classCallCheck)
/* harmony export */ });
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/createClass.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/createClass.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _createClass)
/* harmony export */ });
/* harmony import */ var _toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toPropertyKey.js */ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js");

function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, (0,_toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toPrimitive.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toPrimitive.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toPrimitive)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");

function toPrimitive(t, r) {
  if ("object" != (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toPropertyKey)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./toPrimitive.js */ "./node_modules/@babel/runtime/helpers/esm/toPrimitive.js");


function toPropertyKey(t) {
  var i = (0,_toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__["default"])(t, "string");
  return "symbol" == (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(i) ? i : i + "";
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _typeof)
/* harmony export */ });
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!********************************!*\
  !*** ./src/utils/GrayScale.js ***!
  \********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GrayScaleMedia: () => (/* binding */ GrayScaleMedia)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");


function isMobile() {
  var mobile = false;
  (function (a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) mobile = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return mobile;
}
;
var GrayScaleMedia = /*#__PURE__*/function () {
  function GrayScaleMedia(source, width, height, canvas) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, GrayScaleMedia);
    this._source = source;
    this._width = width;
    this._height = height;
    this._canvas = canvas ? canvas : document.createElement("canvas");
    this._canvas.width = width;
    this._canvas.height = height;
    this._flipImageProg = __webpack_require__(/*! ./shaders/flip-image.glsl */ "./src/utils/shaders/flip-image.glsl");
    this._grayscaleProg = __webpack_require__(/*! ./shaders/grayscale.glsl */ "./src/utils/shaders/grayscale.glsl");
    this.glReady = false;
    this.initGL(this._flipImageProg, this._grayscaleProg);
  }
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(GrayScaleMedia, [{
    key: "initGL",
    value: function initGL(vertShaderSource, fragShaderSource) {
      this.gl = this._canvas.getContext("webgl");
      this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
      this.gl.clearColor(0.1, 0.1, 0.1, 1.0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      var vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
      var fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
      this.gl.shaderSource(vertShader, vertShaderSource);
      this.gl.shaderSource(fragShader, fragShaderSource);
      this.gl.compileShader(vertShader);
      this.gl.compileShader(fragShader);
      var program = this.gl.createProgram();
      this.gl.attachShader(program, vertShader);
      this.gl.attachShader(program, fragShader);
      this.gl.linkProgram(program);
      this.gl.useProgram(program);
      var vertices = new Float32Array([-1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1]);
      var buffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
      var positionLocation = this.gl.getAttribLocation(program, "position");
      this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(positionLocation);
      this.flipLocation = this.gl.getUniformLocation(program, "flipY");
      var texture = this.gl.createTexture();
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

      // if either dimension of image is not a power of 2
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
      this.glReady = true;
      this.pixelBuf = new Uint8Array(this.gl.drawingBufferWidth * this.gl.drawingBufferHeight * 4);
      this.grayBuf = new Uint8Array(this.gl.drawingBufferWidth * this.gl.drawingBufferHeight);
    }
  }, {
    key: "getContext",
    value: function getContext() {
      return this.gl;
    }
  }, {
    key: "getFrame",
    value: function getFrame() {
      if (!this.glReady) return undefined;
      this.gl.uniform1f(this.flipLocation, -1); // flip image
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this._source);
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
      this.gl.readPixels(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.pixelBuf);
      var j = 0;
      for (var i = 0; i < this.pixelBuf.length; i += 4) {
        this.grayBuf[j] = this.pixelBuf[i];
        j++;
      }
      return this.grayBuf;
    }
  }, {
    key: "requestStream",
    value: function requestStream() {
      var _this = this;
      return new Promise(function (resolve, reject) {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return reject();

        // Hack for mobile browsers: aspect ratio is flipped.
        var aspect = _this._width / _this._height;
        if (isMobile()) {
          aspect = 1 / aspect;
        }
        navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            width: {
              ideal: _this._width
            },
            height: {
              ideal: _this._height
            },
            aspectRatio: {
              ideal: aspect
            },
            facingMode: "environment"
          }
        }).then(function (stream) {
          var _stream$getTracks$0$g = stream.getTracks()[0].getSettings(),
            width = _stream$getTracks$0$g.width,
            height = _stream$getTracks$0$g.height;
          console.log("Video dimensions from mediaDevices: ".concat(width, "x").concat(height));
          _this._source.srcObject = stream;
          _this._source.onloadedmetadata = function (e) {
            _this._source.play();
            resolve(_this._source);
          };
        })["catch"](function (err) {
          reject(err);
        });
      });
    }
  }]);
}();
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q1pDLEtBQUssRUFBRTtZQUNINUYsS0FBSyxFQUFFO2NBQUU2RixLQUFLLEVBQUVULEtBQUksQ0FBQy9FO1lBQU8sQ0FBQztZQUM3QkosTUFBTSxFQUFFO2NBQUU0RixLQUFLLEVBQUVULEtBQUksQ0FBQzlFO1lBQVEsQ0FBQztZQUMvQndGLFdBQVcsRUFBRTtjQUFFRCxLQUFLLEVBQUVIO1lBQU8sQ0FBQztZQUM5QkssVUFBVSxFQUFFO1VBQ2hCO1FBQ0osQ0FBQyxDQUFDLENBQ0dDLElBQUksQ0FBQyxVQUFBQyxNQUFNLEVBQUk7VUFDWixJQUFBQyxxQkFBQSxHQUF3QkQsTUFBTSxDQUFDRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDQyxXQUFXLENBQUMsQ0FBQztZQUFyRHBHLEtBQUssR0FBQWtHLHFCQUFBLENBQUxsRyxLQUFLO1lBQUVDLE1BQU0sR0FBQWlHLHFCQUFBLENBQU5qRyxNQUFNO1VBQ25Cb0csT0FBTyxDQUFDQyxHQUFHLHdDQUFBQyxNQUFBLENBQXlDdkcsS0FBSyxPQUFBdUcsTUFBQSxDQUFJdEcsTUFBTSxDQUFFLENBQUM7VUFDdEVtRixLQUFJLENBQUNoRixPQUFPLENBQUNvRyxTQUFTLEdBQUdQLE1BQU07VUFDL0JiLEtBQUksQ0FBQ2hGLE9BQU8sQ0FBQ3FHLGdCQUFnQixHQUFHLFVBQUFDLENBQUMsRUFBSTtZQUNqQ3RCLEtBQUksQ0FBQ2hGLE9BQU8sQ0FBQ3VHLElBQUksQ0FBQyxDQUFDO1lBQ25CckIsT0FBTyxDQUFDRixLQUFJLENBQUNoRixPQUFPLENBQUM7VUFDekIsQ0FBQztRQUNMLENBQUMsQ0FBQyxTQUNJLENBQUMsVUFBQXdHLEdBQUcsRUFBSTtVQUNWckIsTUFBTSxDQUFDcUIsR0FBRyxDQUFDO1FBQ2YsQ0FBQyxDQUFDO01BQ1YsQ0FBQyxDQUFDO0lBQ047RUFBQztBQUFBLEkiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9HcmF5U2NhbGUvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL0dyYXlTY2FsZS8uL3NyYy91dGlscy9zaGFkZXJzL2ZsaXAtaW1hZ2UuZ2xzbCIsIndlYnBhY2s6Ly9HcmF5U2NhbGUvLi9zcmMvdXRpbHMvc2hhZGVycy9ncmF5c2NhbGUuZ2xzbCIsIndlYnBhY2s6Ly9HcmF5U2NhbGUvLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vY2xhc3NDYWxsQ2hlY2suanMiLCJ3ZWJwYWNrOi8vR3JheVNjYWxlLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2NyZWF0ZUNsYXNzLmpzIiwid2VicGFjazovL0dyYXlTY2FsZS8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS90b1ByaW1pdGl2ZS5qcyIsIndlYnBhY2s6Ly9HcmF5U2NhbGUvLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vdG9Qcm9wZXJ0eUtleS5qcyIsIndlYnBhY2s6Ly9HcmF5U2NhbGUvLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vdHlwZW9mLmpzIiwid2VicGFjazovL0dyYXlTY2FsZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9HcmF5U2NhbGUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0dyYXlTY2FsZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0dyYXlTY2FsZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0dyYXlTY2FsZS8uL3NyYy91dGlscy9HcmF5U2NhbGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiR3JheVNjYWxlXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkdyYXlTY2FsZVwiXSA9IGZhY3RvcnkoKTtcbn0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzLCAoKSA9PiB7XG5yZXR1cm4gIiwibW9kdWxlLmV4cG9ydHMgPSBcImF0dHJpYnV0ZSB2ZWMyIHBvc2l0aW9uO1xcbnZhcnlpbmcgdmVjMiB0ZXhfY29vcmRzO1xcbnVuaWZvcm0gZmxvYXQgZmxpcFk7XFxudm9pZCBtYWluKHZvaWQpIHtcXG50ZXhfY29vcmRzID0gKHBvc2l0aW9uICsgMS4wKSAvIDIuMDtcXG50ZXhfY29vcmRzLnkgPSAxLjAgLSB0ZXhfY29vcmRzLnk7XFxuZ2xfUG9zaXRpb24gPSB2ZWM0KHBvc2l0aW9uICogdmVjMigxLCBmbGlwWSksIDAuMCwgMS4wKTtcXG59XCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVfaW1hZ2U7XFxudmFyeWluZyB2ZWMyIHRleF9jb29yZHM7XFxuY29uc3QgdmVjMyBnID0gdmVjMygwLjI5OSwgMC41ODcsIDAuMTE0KTtcXG52b2lkIG1haW4odm9pZCkge1xcbnZlYzQgY29sb3IgPSB0ZXh0dXJlMkQodV9pbWFnZSwgdGV4X2Nvb3Jkcyk7XFxuZmxvYXQgZ3JheSA9IGRvdChjb2xvci5yZ2IsIGcpO1xcbmdsX0ZyYWdDb2xvciA9IHZlYzQodmVjMyhncmF5KSwgMS4wKTtcXG59XCIiLCJmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soYSwgbikge1xuICBpZiAoIShhIGluc3RhbmNlb2YgbikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG59XG5leHBvcnQgeyBfY2xhc3NDYWxsQ2hlY2sgYXMgZGVmYXVsdCB9OyIsImltcG9ydCB0b1Byb3BlcnR5S2V5IGZyb20gXCIuL3RvUHJvcGVydHlLZXkuanNcIjtcbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKGUsIHIpIHtcbiAgZm9yICh2YXIgdCA9IDA7IHQgPCByLmxlbmd0aDsgdCsrKSB7XG4gICAgdmFyIG8gPSByW3RdO1xuICAgIG8uZW51bWVyYWJsZSA9IG8uZW51bWVyYWJsZSB8fCAhMSwgby5jb25maWd1cmFibGUgPSAhMCwgXCJ2YWx1ZVwiIGluIG8gJiYgKG8ud3JpdGFibGUgPSAhMCksIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLCB0b1Byb3BlcnR5S2V5KG8ua2V5KSwgbyk7XG4gIH1cbn1cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhlLCByLCB0KSB7XG4gIHJldHVybiByICYmIF9kZWZpbmVQcm9wZXJ0aWVzKGUucHJvdG90eXBlLCByKSwgdCAmJiBfZGVmaW5lUHJvcGVydGllcyhlLCB0KSwgT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsIFwicHJvdG90eXBlXCIsIHtcbiAgICB3cml0YWJsZTogITFcbiAgfSksIGU7XG59XG5leHBvcnQgeyBfY3JlYXRlQ2xhc3MgYXMgZGVmYXVsdCB9OyIsImltcG9ydCBfdHlwZW9mIGZyb20gXCIuL3R5cGVvZi5qc1wiO1xuZnVuY3Rpb24gdG9QcmltaXRpdmUodCwgcikge1xuICBpZiAoXCJvYmplY3RcIiAhPSBfdHlwZW9mKHQpIHx8ICF0KSByZXR1cm4gdDtcbiAgdmFyIGUgPSB0W1N5bWJvbC50b1ByaW1pdGl2ZV07XG4gIGlmICh2b2lkIDAgIT09IGUpIHtcbiAgICB2YXIgaSA9IGUuY2FsbCh0LCByIHx8IFwiZGVmYXVsdFwiKTtcbiAgICBpZiAoXCJvYmplY3RcIiAhPSBfdHlwZW9mKGkpKSByZXR1cm4gaTtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQEB0b1ByaW1pdGl2ZSBtdXN0IHJldHVybiBhIHByaW1pdGl2ZSB2YWx1ZS5cIik7XG4gIH1cbiAgcmV0dXJuIChcInN0cmluZ1wiID09PSByID8gU3RyaW5nIDogTnVtYmVyKSh0KTtcbn1cbmV4cG9ydCB7IHRvUHJpbWl0aXZlIGFzIGRlZmF1bHQgfTsiLCJpbXBvcnQgX3R5cGVvZiBmcm9tIFwiLi90eXBlb2YuanNcIjtcbmltcG9ydCB0b1ByaW1pdGl2ZSBmcm9tIFwiLi90b1ByaW1pdGl2ZS5qc1wiO1xuZnVuY3Rpb24gdG9Qcm9wZXJ0eUtleSh0KSB7XG4gIHZhciBpID0gdG9QcmltaXRpdmUodCwgXCJzdHJpbmdcIik7XG4gIHJldHVybiBcInN5bWJvbFwiID09IF90eXBlb2YoaSkgPyBpIDogaSArIFwiXCI7XG59XG5leHBvcnQgeyB0b1Byb3BlcnR5S2V5IGFzIGRlZmF1bHQgfTsiLCJmdW5jdGlvbiBfdHlwZW9mKG8pIHtcbiAgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiO1xuXG4gIHJldHVybiBfdHlwZW9mID0gXCJmdW5jdGlvblwiID09IHR5cGVvZiBTeW1ib2wgJiYgXCJzeW1ib2xcIiA9PSB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID8gZnVuY3Rpb24gKG8pIHtcbiAgICByZXR1cm4gdHlwZW9mIG87XG4gIH0gOiBmdW5jdGlvbiAobykge1xuICAgIHJldHVybiBvICYmIFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgU3ltYm9sICYmIG8uY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvO1xuICB9LCBfdHlwZW9mKG8pO1xufVxuZXhwb3J0IHsgX3R5cGVvZiBhcyBkZWZhdWx0IH07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJmdW5jdGlvbiBpc01vYmlsZSgpIHtcclxuICAgIGxldCBtb2JpbGUgPSBmYWxzZTtcclxuICAgIChmdW5jdGlvbiAoYSkgeyBpZiAoLyhhbmRyb2lkfGJiXFxkK3xtZWVnbykuK21vYmlsZXxhdmFudGdvfGJhZGFcXC98YmxhY2tiZXJyeXxibGF6ZXJ8Y29tcGFsfGVsYWluZXxmZW5uZWN8aGlwdG9wfGllbW9iaWxlfGlwKGhvbmV8b2QpfGlyaXN8a2luZGxlfGxnZSB8bWFlbW98bWlkcHxtbXB8bW9iaWxlLitmaXJlZm94fG5ldGZyb250fG9wZXJhIG0ob2J8aW4paXxwYWxtKCBvcyk/fHBob25lfHAoaXhpfHJlKVxcL3xwbHVja2VyfHBvY2tldHxwc3B8c2VyaWVzKDR8NikwfHN5bWJpYW58dHJlb3x1cFxcLihicm93c2VyfGxpbmspfHZvZGFmb25lfHdhcHx3aW5kb3dzIGNlfHhkYXx4aWluby9pLnRlc3QoYSkgfHwgLzEyMDd8NjMxMHw2NTkwfDNnc298NHRocHw1MFsxLTZdaXw3NzBzfDgwMnN8YSB3YXxhYmFjfGFjKGVyfG9vfHNcXC0pfGFpKGtvfHJuKXxhbChhdnxjYXxjbyl8YW1vaXxhbihleHxueXx5dyl8YXB0dXxhcihjaHxnbyl8YXModGV8dXMpfGF0dHd8YXUoZGl8XFwtbXxyIHxzICl8YXZhbnxiZShja3xsbHxucSl8YmkobGJ8cmQpfGJsKGFjfGF6KXxicihlfHYpd3xidW1ifGJ3XFwtKG58dSl8YzU1XFwvfGNhcGl8Y2N3YXxjZG1cXC18Y2VsbHxjaHRtfGNsZGN8Y21kXFwtfGNvKG1wfG5kKXxjcmF3fGRhKGl0fGxsfG5nKXxkYnRlfGRjXFwtc3xkZXZpfGRpY2F8ZG1vYnxkbyhjfHApb3xkcygxMnxcXC1kKXxlbCg0OXxhaSl8ZW0obDJ8dWwpfGVyKGljfGswKXxlc2w4fGV6KFs0LTddMHxvc3x3YXx6ZSl8ZmV0Y3xmbHkoXFwtfF8pfGcxIHV8ZzU2MHxnZW5lfGdmXFwtNXxnXFwtbW98Z28oXFwud3xvZCl8Z3IoYWR8dW4pfGhhaWV8aGNpdHxoZFxcLShtfHB8dCl8aGVpXFwtfGhpKHB0fHRhKXxocCggaXxpcCl8aHNcXC1jfGh0KGMoXFwtfCB8X3xhfGd8cHxzfHQpfHRwKXxodShhd3x0Yyl8aVxcLSgyMHxnb3xtYSl8aTIzMHxpYWMoIHxcXC18XFwvKXxpYnJvfGlkZWF8aWcwMXxpa29tfGltMWt8aW5ub3xpcGFxfGlyaXN8amEodHx2KWF8amJyb3xqZW11fGppZ3N8a2RkaXxrZWppfGtndCggfFxcLyl8a2xvbnxrcHQgfGt3Y1xcLXxreW8oY3xrKXxsZShub3x4aSl8bGcoIGd8XFwvKGt8bHx1KXw1MHw1NHxcXC1bYS13XSl8bGlid3xseW54fG0xXFwtd3xtM2dhfG01MFxcL3xtYSh0ZXx1aXx4byl8bWMoMDF8MjF8Y2EpfG1cXC1jcnxtZShyY3xyaSl8bWkobzh8b2F8dHMpfG1tZWZ8bW8oMDF8MDJ8Yml8ZGV8ZG98dChcXC18IHxvfHYpfHp6KXxtdCg1MHxwMXx2ICl8bXdicHxteXdhfG4xMFswLTJdfG4yMFsyLTNdfG4zMCgwfDIpfG41MCgwfDJ8NSl8bjcoMCgwfDEpfDEwKXxuZSgoY3xtKVxcLXxvbnx0Znx3Znx3Z3x3dCl8bm9rKDZ8aSl8bnpwaHxvMmltfG9wKHRpfHd2KXxvcmFufG93ZzF8cDgwMHxwYW4oYXxkfHQpfHBkeGd8cGcoMTN8XFwtKFsxLThdfGMpKXxwaGlsfHBpcmV8cGwoYXl8dWMpfHBuXFwtMnxwbyhja3xydHxzZSl8cHJveHxwc2lvfHB0XFwtZ3xxYVxcLWF8cWMoMDd8MTJ8MjF8MzJ8NjB8XFwtWzItN118aVxcLSl8cXRla3xyMzgwfHI2MDB8cmFrc3xyaW05fHJvKHZlfHpvKXxzNTVcXC98c2EoZ2V8bWF8bW18bXN8bnl8dmEpfHNjKDAxfGhcXC18b298cFxcLSl8c2RrXFwvfHNlKGMoXFwtfDB8MSl8NDd8bWN8bmR8cmkpfHNnaFxcLXxzaGFyfHNpZShcXC18bSl8c2tcXC0wfHNsKDQ1fGlkKXxzbShhbHxhcnxiM3xpdHx0NSl8c28oZnR8bnkpfHNwKDAxfGhcXC18dlxcLXx2ICl8c3koMDF8bWIpfHQyKDE4fDUwKXx0NigwMHwxMHwxOCl8dGEoZ3R8bGspfHRjbFxcLXx0ZGdcXC18dGVsKGl8bSl8dGltXFwtfHRcXC1tb3x0byhwbHxzaCl8dHMoNzB8bVxcLXxtM3xtNSl8dHhcXC05fHVwKFxcLmJ8ZzF8c2kpfHV0c3R8djQwMHx2NzUwfHZlcml8dmkocmd8dGUpfHZrKDQwfDVbMC0zXXxcXC12KXx2bTQwfHZvZGF8dnVsY3x2eCg1Mnw1M3w2MHw2MXw3MHw4MHw4MXw4M3w4NXw5OCl8dzNjKFxcLXwgKXx3ZWJjfHdoaXR8d2koZyB8bmN8bncpfHdtbGJ8d29udXx4NzAwfHlhc1xcLXx5b3VyfHpldG98enRlXFwtL2kudGVzdChhLnN1YnN0cigwLCA0KSkpIG1vYmlsZSA9IHRydWU7IH0pKG5hdmlnYXRvci51c2VyQWdlbnQgfHwgbmF2aWdhdG9yLnZlbmRvciB8fCB3aW5kb3cub3BlcmEpO1xyXG4gICAgcmV0dXJuIG1vYmlsZTtcclxufTtcclxuXHJcbmV4cG9ydCBjbGFzcyBHcmF5U2NhbGVNZWRpYSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2UsIHdpZHRoLCBoZWlnaHQsIGNhbnZhcykge1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZSA9IHNvdXJjZTtcclxuICAgICAgICB0aGlzLl93aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCA9IGhlaWdodDtcclxuICAgICAgICB0aGlzLl9jYW52YXMgPSBjYW52YXMgPyBjYW52YXMgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gICAgICAgIHRoaXMuX2NhbnZhcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuX2NhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMuX2ZsaXBJbWFnZVByb2cgPSByZXF1aXJlKFwiLi9zaGFkZXJzL2ZsaXAtaW1hZ2UuZ2xzbFwiKTtcclxuICAgICAgICB0aGlzLl9ncmF5c2NhbGVQcm9nID0gcmVxdWlyZShcIi4vc2hhZGVycy9ncmF5c2NhbGUuZ2xzbFwiKTtcclxuICAgICAgICB0aGlzLmdsUmVhZHkgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmluaXRHTCh0aGlzLl9mbGlwSW1hZ2VQcm9nLCB0aGlzLl9ncmF5c2NhbGVQcm9nKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0R0wodmVydFNoYWRlclNvdXJjZSwgZnJhZ1NoYWRlclNvdXJjZSkge1xyXG4gICAgICAgIHRoaXMuZ2wgPSB0aGlzLl9jYW52YXMuZ2V0Q29udGV4dChcIndlYmdsXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmdsLnZpZXdwb3J0KDAsIDAsIHRoaXMuZ2wuZHJhd2luZ0J1ZmZlcldpZHRoLCB0aGlzLmdsLmRyYXdpbmdCdWZmZXJIZWlnaHQpO1xyXG4gICAgICAgIHRoaXMuZ2wuY2xlYXJDb2xvcigwLjEsIDAuMSwgMC4xLCAxLjApO1xyXG4gICAgICAgIHRoaXMuZ2wuY2xlYXIodGhpcy5nbC5DT0xPUl9CVUZGRVJfQklUKTtcclxuXHJcbiAgICAgICAgY29uc3QgdmVydFNoYWRlciA9IHRoaXMuZ2wuY3JlYXRlU2hhZGVyKHRoaXMuZ2wuVkVSVEVYX1NIQURFUik7XHJcbiAgICAgICAgY29uc3QgZnJhZ1NoYWRlciA9IHRoaXMuZ2wuY3JlYXRlU2hhZGVyKHRoaXMuZ2wuRlJBR01FTlRfU0hBREVSKTtcclxuXHJcbiAgICAgICAgdGhpcy5nbC5zaGFkZXJTb3VyY2UodmVydFNoYWRlciwgdmVydFNoYWRlclNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy5nbC5zaGFkZXJTb3VyY2UoZnJhZ1NoYWRlciwgZnJhZ1NoYWRlclNvdXJjZSk7XHJcblxyXG4gICAgICAgIHRoaXMuZ2wuY29tcGlsZVNoYWRlcih2ZXJ0U2hhZGVyKTtcclxuICAgICAgICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIoZnJhZ1NoYWRlcik7XHJcblxyXG4gICAgICAgIGNvbnN0IHByb2dyYW0gPSB0aGlzLmdsLmNyZWF0ZVByb2dyYW0oKTtcclxuICAgICAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCB2ZXJ0U2hhZGVyKTtcclxuICAgICAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCBmcmFnU2hhZGVyKTtcclxuXHJcbiAgICAgICAgdGhpcy5nbC5saW5rUHJvZ3JhbShwcm9ncmFtKTtcclxuXHJcbiAgICAgICAgdGhpcy5nbC51c2VQcm9ncmFtKHByb2dyYW0pO1xyXG5cclxuICAgICAgICBjb25zdCB2ZXJ0aWNlcyA9IG5ldyBGbG9hdDMyQXJyYXkoW1xyXG4gICAgICAgICAgICAtMSwgLTEsXHJcbiAgICAgICAgICAgIC0xLCAxLFxyXG4gICAgICAgICAgICAxLCAxLFxyXG4gICAgICAgICAgICAtMSwgLTEsXHJcbiAgICAgICAgICAgIDEsIDEsXHJcbiAgICAgICAgICAgIDEsIC0xLFxyXG4gICAgICAgIF0pO1xyXG5cclxuICAgICAgICBjb25zdCBidWZmZXIgPSB0aGlzLmdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG4gICAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgYnVmZmVyKTtcclxuICAgICAgICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHZlcnRpY2VzLCB0aGlzLmdsLlNUQVRJQ19EUkFXKTtcclxuXHJcbiAgICAgICAgY29uc3QgcG9zaXRpb25Mb2NhdGlvbiA9IHRoaXMuZ2wuZ2V0QXR0cmliTG9jYXRpb24ocHJvZ3JhbSwgXCJwb3NpdGlvblwiKTtcclxuICAgICAgICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIocG9zaXRpb25Mb2NhdGlvbiwgMiwgdGhpcy5nbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG4gICAgICAgIHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkocG9zaXRpb25Mb2NhdGlvbik7XHJcblxyXG4gICAgICAgIHRoaXMuZmxpcExvY2F0aW9uID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbSwgXCJmbGlwWVwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgdGV4dHVyZSA9IHRoaXMuZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG4gICAgICAgIHRoaXMuZ2wuYWN0aXZlVGV4dHVyZSh0aGlzLmdsLlRFWFRVUkUwKTtcclxuICAgICAgICB0aGlzLmdsLmJpbmRUZXh0dXJlKHRoaXMuZ2wuVEVYVFVSRV8yRCwgdGV4dHVyZSk7XHJcblxyXG4gICAgICAgIC8vIGlmIGVpdGhlciBkaW1lbnNpb24gb2YgaW1hZ2UgaXMgbm90IGEgcG93ZXIgb2YgMlxyXG4gICAgICAgIHRoaXMuZ2wudGV4UGFyYW1ldGVyaSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRoaXMuZ2wuVEVYVFVSRV9XUkFQX1MsIHRoaXMuZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgdGhpcy5nbC50ZXhQYXJhbWV0ZXJpKHRoaXMuZ2wuVEVYVFVSRV8yRCwgdGhpcy5nbC5URVhUVVJFX1dSQVBfVCwgdGhpcy5nbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICB0aGlzLmdsLnRleFBhcmFtZXRlcmkodGhpcy5nbC5URVhUVVJFXzJELCB0aGlzLmdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgdGhpcy5nbC5MSU5FQVIpO1xyXG4gICAgICAgIHRoaXMuZ2wudGV4UGFyYW1ldGVyaSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRoaXMuZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCB0aGlzLmdsLkxJTkVBUik7XHJcblxyXG4gICAgICAgIHRoaXMuZ2xSZWFkeSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5waXhlbEJ1ZiA9IG5ldyBVaW50OEFycmF5KHRoaXMuZ2wuZHJhd2luZ0J1ZmZlcldpZHRoICogdGhpcy5nbC5kcmF3aW5nQnVmZmVySGVpZ2h0ICogNCk7XHJcbiAgICAgICAgdGhpcy5ncmF5QnVmID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5nbC5kcmF3aW5nQnVmZmVyV2lkdGggKiB0aGlzLmdsLmRyYXdpbmdCdWZmZXJIZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENvbnRleHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2w7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RnJhbWUoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmdsUmVhZHkpIHJldHVybiB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIHRoaXMuZ2wudW5pZm9ybTFmKHRoaXMuZmxpcExvY2F0aW9uLCAtMSk7IC8vIGZsaXAgaW1hZ2VcclxuICAgICAgICB0aGlzLmdsLnRleEltYWdlMkQodGhpcy5nbC5URVhUVVJFXzJELCAwLCB0aGlzLmdsLlJHQkEsIHRoaXMuZ2wuUkdCQSwgdGhpcy5nbC5VTlNJR05FRF9CWVRFLCB0aGlzLl9zb3VyY2UpO1xyXG4gICAgICAgIHRoaXMuZ2wuZHJhd0FycmF5cyh0aGlzLmdsLlRSSUFOR0xFUywgMCwgNik7XHJcblxyXG4gICAgICAgIHRoaXMuZ2wucmVhZFBpeGVscygwLCAwLCB0aGlzLmdsLmRyYXdpbmdCdWZmZXJXaWR0aCwgdGhpcy5nbC5kcmF3aW5nQnVmZmVySGVpZ2h0LCB0aGlzLmdsLlJHQkEsIHRoaXMuZ2wuVU5TSUdORURfQllURSwgdGhpcy5waXhlbEJ1Zik7XHJcblxyXG4gICAgICAgIGxldCBqID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGl4ZWxCdWYubGVuZ3RoOyBpICs9IDQpIHtcclxuICAgICAgICAgICAgdGhpcy5ncmF5QnVmW2pdID0gdGhpcy5waXhlbEJ1ZltpXTtcclxuICAgICAgICAgICAgaisrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5ncmF5QnVmO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcXVlc3RTdHJlYW0oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgaWYgKCFuYXZpZ2F0b3IubWVkaWFEZXZpY2VzIHx8ICFuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSlcclxuICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEhhY2sgZm9yIG1vYmlsZSBicm93c2VyczogYXNwZWN0IHJhdGlvIGlzIGZsaXBwZWQuXHJcbiAgICAgICAgICAgIHZhciBhc3BlY3QgPSB0aGlzLl93aWR0aCAvIHRoaXMuX2hlaWdodDtcclxuICAgICAgICAgICAgaWYgKGlzTW9iaWxlKCkpIHtcclxuICAgICAgICAgICAgICAgIGFzcGVjdCA9IDEgLyBhc3BlY3Q7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKHtcclxuICAgICAgICAgICAgICAgIGF1ZGlvOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHZpZGVvOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHsgaWRlYWw6IHRoaXMuX3dpZHRoIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB7IGlkZWFsOiB0aGlzLl9oZWlnaHQgfSxcclxuICAgICAgICAgICAgICAgICAgICBhc3BlY3RSYXRpbzogeyBpZGVhbDogYXNwZWN0IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZmFjaW5nTW9kZTogXCJlbnZpcm9ubWVudFwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihzdHJlYW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB7IHdpZHRoLCBoZWlnaHQgfSA9IHN0cmVhbS5nZXRUcmFja3MoKVswXS5nZXRTZXR0aW5ncygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBgVmlkZW8gZGltZW5zaW9ucyBmcm9tIG1lZGlhRGV2aWNlczogJHt3aWR0aH14JHtoZWlnaHR9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc291cmNlLnNyY09iamVjdCA9IHN0cmVhbTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zb3VyY2Uub25sb2FkZWRtZXRhZGF0YSA9IGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zb3VyY2UucGxheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMuX3NvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiJdLCJuYW1lcyI6WyJpc01vYmlsZSIsIm1vYmlsZSIsImEiLCJ0ZXN0Iiwic3Vic3RyIiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwidmVuZG9yIiwid2luZG93Iiwib3BlcmEiLCJHcmF5U2NhbGVNZWRpYSIsInNvdXJjZSIsIndpZHRoIiwiaGVpZ2h0IiwiY2FudmFzIiwiX2NsYXNzQ2FsbENoZWNrIiwiX3NvdXJjZSIsIl93aWR0aCIsIl9oZWlnaHQiLCJfY2FudmFzIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiX2ZsaXBJbWFnZVByb2ciLCJyZXF1aXJlIiwiX2dyYXlzY2FsZVByb2ciLCJnbFJlYWR5IiwiaW5pdEdMIiwiX2NyZWF0ZUNsYXNzIiwia2V5IiwidmFsdWUiLCJ2ZXJ0U2hhZGVyU291cmNlIiwiZnJhZ1NoYWRlclNvdXJjZSIsImdsIiwiZ2V0Q29udGV4dCIsInZpZXdwb3J0IiwiZHJhd2luZ0J1ZmZlcldpZHRoIiwiZHJhd2luZ0J1ZmZlckhlaWdodCIsImNsZWFyQ29sb3IiLCJjbGVhciIsIkNPTE9SX0JVRkZFUl9CSVQiLCJ2ZXJ0U2hhZGVyIiwiY3JlYXRlU2hhZGVyIiwiVkVSVEVYX1NIQURFUiIsImZyYWdTaGFkZXIiLCJGUkFHTUVOVF9TSEFERVIiLCJzaGFkZXJTb3VyY2UiLCJjb21waWxlU2hhZGVyIiwicHJvZ3JhbSIsImNyZWF0ZVByb2dyYW0iLCJhdHRhY2hTaGFkZXIiLCJsaW5rUHJvZ3JhbSIsInVzZVByb2dyYW0iLCJ2ZXJ0aWNlcyIsIkZsb2F0MzJBcnJheSIsImJ1ZmZlciIsImNyZWF0ZUJ1ZmZlciIsImJpbmRCdWZmZXIiLCJBUlJBWV9CVUZGRVIiLCJidWZmZXJEYXRhIiwiU1RBVElDX0RSQVciLCJwb3NpdGlvbkxvY2F0aW9uIiwiZ2V0QXR0cmliTG9jYXRpb24iLCJ2ZXJ0ZXhBdHRyaWJQb2ludGVyIiwiRkxPQVQiLCJlbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSIsImZsaXBMb2NhdGlvbiIsImdldFVuaWZvcm1Mb2NhdGlvbiIsInRleHR1cmUiLCJjcmVhdGVUZXh0dXJlIiwiYWN0aXZlVGV4dHVyZSIsIlRFWFRVUkUwIiwiYmluZFRleHR1cmUiLCJURVhUVVJFXzJEIiwidGV4UGFyYW1ldGVyaSIsIlRFWFRVUkVfV1JBUF9TIiwiQ0xBTVBfVE9fRURHRSIsIlRFWFRVUkVfV1JBUF9UIiwiVEVYVFVSRV9NSU5fRklMVEVSIiwiTElORUFSIiwiVEVYVFVSRV9NQUdfRklMVEVSIiwicGl4ZWxCdWYiLCJVaW50OEFycmF5IiwiZ3JheUJ1ZiIsImdldEZyYW1lIiwidW5kZWZpbmVkIiwidW5pZm9ybTFmIiwidGV4SW1hZ2UyRCIsIlJHQkEiLCJVTlNJR05FRF9CWVRFIiwiZHJhd0FycmF5cyIsIlRSSUFOR0xFUyIsInJlYWRQaXhlbHMiLCJqIiwiaSIsImxlbmd0aCIsInJlcXVlc3RTdHJlYW0iLCJfdGhpcyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwibWVkaWFEZXZpY2VzIiwiZ2V0VXNlck1lZGlhIiwiYXNwZWN0IiwiYXVkaW8iLCJ2aWRlbyIsImlkZWFsIiwiYXNwZWN0UmF0aW8iLCJmYWNpbmdNb2RlIiwidGhlbiIsInN0cmVhbSIsIl9zdHJlYW0kZ2V0VHJhY2tzJDAkZyIsImdldFRyYWNrcyIsImdldFNldHRpbmdzIiwiY29uc29sZSIsImxvZyIsImNvbmNhdCIsInNyY09iamVjdCIsIm9ubG9hZGVkbWV0YWRhdGEiLCJlIiwicGxheSIsImVyciJdLCJzb3VyY2VSb290IjoiIn0=