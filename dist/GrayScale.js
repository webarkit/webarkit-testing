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
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
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

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, (0,_toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__["default"])(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
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
/* harmony export */   "default": () => (/* binding */ _toPrimitive)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");

function _toPrimitive(input, hint) {
  if ((0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if ((0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
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
/* harmony export */   "default": () => (/* binding */ _toPropertyKey)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./toPrimitive.js */ "./node_modules/@babel/runtime/helpers/esm/toPrimitive.js");


function _toPropertyKey(arg) {
  var key = (0,_toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arg, "string");
  return (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(key) === "symbol" ? key : String(key);
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
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
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
/* harmony export */   "GrayScaleMedia": () => (/* binding */ GrayScaleMedia)
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
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(GrayScaleMedia, [{
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
  return GrayScaleMedia;
}();
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TUFBTSxFQUFFO2NBQUU0RixLQUFLLEVBQUVULEtBQUksQ0FBQzlFO1lBQVEsQ0FBQztZQUMvQndGLFdBQVcsRUFBRTtjQUFFRCxLQUFLLEVBQUVIO1lBQU8sQ0FBQztZQUM5QkssVUFBVSxFQUFFO1VBQ2hCO1FBQ0osQ0FBQyxDQUFDLENBQ0dDLElBQUksQ0FBQyxVQUFBQyxNQUFNLEVBQUk7VUFDWixJQUFBQyxxQkFBQSxHQUF3QkQsTUFBTSxDQUFDRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDQyxXQUFXLENBQUMsQ0FBQztZQUFyRHBHLEtBQUssR0FBQWtHLHFCQUFBLENBQUxsRyxLQUFLO1lBQUVDLE1BQU0sR0FBQWlHLHFCQUFBLENBQU5qRyxNQUFNO1VBQ25Cb0csT0FBTyxDQUFDQyxHQUFHLHdDQUFBQyxNQUFBLENBQXlDdkcsS0FBSyxPQUFBdUcsTUFBQSxDQUFJdEcsTUFBTSxDQUFFLENBQUM7VUFDdEVtRixLQUFJLENBQUNoRixPQUFPLENBQUNvRyxTQUFTLEdBQUdQLE1BQU07VUFDL0JiLEtBQUksQ0FBQ2hGLE9BQU8sQ0FBQ3FHLGdCQUFnQixHQUFHLFVBQUFDLENBQUMsRUFBSTtZQUNqQ3RCLEtBQUksQ0FBQ2hGLE9BQU8sQ0FBQ3VHLElBQUksQ0FBQyxDQUFDO1lBQ25CckIsT0FBTyxDQUFDRixLQUFJLENBQUNoRixPQUFPLENBQUM7VUFDekIsQ0FBQztRQUNMLENBQUMsQ0FBQyxTQUNJLENBQUMsVUFBQXdHLEdBQUcsRUFBSTtVQUNWckIsTUFBTSxDQUFDcUIsR0FBRyxDQUFDO1FBQ2YsQ0FBQyxDQUFDO01BQ1YsQ0FBQyxDQUFDO0lBQ047RUFBQztFQUFBLE9BQUE5RyxjQUFBO0FBQUEsSSIsInNvdXJjZXMiOlsid2VicGFjazovL0dyYXlTY2FsZS93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vR3JheVNjYWxlLy4vc3JjL3V0aWxzL3NoYWRlcnMvZmxpcC1pbWFnZS5nbHNsIiwid2VicGFjazovL0dyYXlTY2FsZS8uL3NyYy91dGlscy9zaGFkZXJzL2dyYXlzY2FsZS5nbHNsIiwid2VicGFjazovL0dyYXlTY2FsZS8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9jbGFzc0NhbGxDaGVjay5qcyIsIndlYnBhY2s6Ly9HcmF5U2NhbGUvLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vY3JlYXRlQ2xhc3MuanMiLCJ3ZWJwYWNrOi8vR3JheVNjYWxlLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL3RvUHJpbWl0aXZlLmpzIiwid2VicGFjazovL0dyYXlTY2FsZS8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS90b1Byb3BlcnR5S2V5LmpzIiwid2VicGFjazovL0dyYXlTY2FsZS8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS90eXBlb2YuanMiLCJ3ZWJwYWNrOi8vR3JheVNjYWxlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0dyYXlTY2FsZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vR3JheVNjYWxlL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vR3JheVNjYWxlL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vR3JheVNjYWxlLy4vc3JjL3V0aWxzL0dyYXlTY2FsZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJHcmF5U2NhbGVcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiR3JheVNjYWxlXCJdID0gZmFjdG9yeSgpO1xufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMsICgpID0+IHtcbnJldHVybiAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiYXR0cmlidXRlIHZlYzIgcG9zaXRpb247XFxudmFyeWluZyB2ZWMyIHRleF9jb29yZHM7XFxudW5pZm9ybSBmbG9hdCBmbGlwWTtcXG52b2lkIG1haW4odm9pZCkge1xcbnRleF9jb29yZHMgPSAocG9zaXRpb24gKyAxLjApIC8gMi4wO1xcbnRleF9jb29yZHMueSA9IDEuMCAtIHRleF9jb29yZHMueTtcXG5nbF9Qb3NpdGlvbiA9IHZlYzQocG9zaXRpb24gKiB2ZWMyKDEsIGZsaXBZKSwgMC4wLCAxLjApO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdV9pbWFnZTtcXG52YXJ5aW5nIHZlYzIgdGV4X2Nvb3JkcztcXG5jb25zdCB2ZWMzIGcgPSB2ZWMzKDAuMjk5LCAwLjU4NywgMC4xMTQpO1xcbnZvaWQgbWFpbih2b2lkKSB7XFxudmVjNCBjb2xvciA9IHRleHR1cmUyRCh1X2ltYWdlLCB0ZXhfY29vcmRzKTtcXG5mbG9hdCBncmF5ID0gZG90KGNvbG9yLnJnYiwgZyk7XFxuZ2xfRnJhZ0NvbG9yID0gdmVjNCh2ZWMzKGdyYXkpLCAxLjApO1xcbn1cIiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59IiwiaW1wb3J0IHRvUHJvcGVydHlLZXkgZnJvbSBcIi4vdG9Qcm9wZXJ0eUtleS5qc1wiO1xuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgdG9Qcm9wZXJ0eUtleShkZXNjcmlwdG9yLmtleSksIGRlc2NyaXB0b3IpO1xuICB9XG59XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gIGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb25zdHJ1Y3RvciwgXCJwcm90b3R5cGVcIiwge1xuICAgIHdyaXRhYmxlOiBmYWxzZVxuICB9KTtcbiAgcmV0dXJuIENvbnN0cnVjdG9yO1xufSIsImltcG9ydCBfdHlwZW9mIGZyb20gXCIuL3R5cGVvZi5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX3RvUHJpbWl0aXZlKGlucHV0LCBoaW50KSB7XG4gIGlmIChfdHlwZW9mKGlucHV0KSAhPT0gXCJvYmplY3RcIiB8fCBpbnB1dCA9PT0gbnVsbCkgcmV0dXJuIGlucHV0O1xuICB2YXIgcHJpbSA9IGlucHV0W1N5bWJvbC50b1ByaW1pdGl2ZV07XG4gIGlmIChwcmltICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgcmVzID0gcHJpbS5jYWxsKGlucHV0LCBoaW50IHx8IFwiZGVmYXVsdFwiKTtcbiAgICBpZiAoX3R5cGVvZihyZXMpICE9PSBcIm9iamVjdFwiKSByZXR1cm4gcmVzO1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJAQHRvUHJpbWl0aXZlIG11c3QgcmV0dXJuIGEgcHJpbWl0aXZlIHZhbHVlLlwiKTtcbiAgfVxuICByZXR1cm4gKGhpbnQgPT09IFwic3RyaW5nXCIgPyBTdHJpbmcgOiBOdW1iZXIpKGlucHV0KTtcbn0iLCJpbXBvcnQgX3R5cGVvZiBmcm9tIFwiLi90eXBlb2YuanNcIjtcbmltcG9ydCB0b1ByaW1pdGl2ZSBmcm9tIFwiLi90b1ByaW1pdGl2ZS5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX3RvUHJvcGVydHlLZXkoYXJnKSB7XG4gIHZhciBrZXkgPSB0b1ByaW1pdGl2ZShhcmcsIFwic3RyaW5nXCIpO1xuICByZXR1cm4gX3R5cGVvZihrZXkpID09PSBcInN5bWJvbFwiID8ga2V5IDogU3RyaW5nKGtleSk7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiO1xuXG4gIHJldHVybiBfdHlwZW9mID0gXCJmdW5jdGlvblwiID09IHR5cGVvZiBTeW1ib2wgJiYgXCJzeW1ib2xcIiA9PSB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID8gZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqO1xuICB9IDogZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiBvYmogJiYgXCJmdW5jdGlvblwiID09IHR5cGVvZiBTeW1ib2wgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG4gIH0sIF90eXBlb2Yob2JqKTtcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImZ1bmN0aW9uIGlzTW9iaWxlKCkge1xyXG4gICAgbGV0IG1vYmlsZSA9IGZhbHNlO1xyXG4gICAgKGZ1bmN0aW9uIChhKSB7IGlmICgvKGFuZHJvaWR8YmJcXGQrfG1lZWdvKS4rbW9iaWxlfGF2YW50Z298YmFkYVxcL3xibGFja2JlcnJ5fGJsYXplcnxjb21wYWx8ZWxhaW5lfGZlbm5lY3xoaXB0b3B8aWVtb2JpbGV8aXAoaG9uZXxvZCl8aXJpc3xraW5kbGV8bGdlIHxtYWVtb3xtaWRwfG1tcHxtb2JpbGUuK2ZpcmVmb3h8bmV0ZnJvbnR8b3BlcmEgbShvYnxpbilpfHBhbG0oIG9zKT98cGhvbmV8cChpeGl8cmUpXFwvfHBsdWNrZXJ8cG9ja2V0fHBzcHxzZXJpZXMoNHw2KTB8c3ltYmlhbnx0cmVvfHVwXFwuKGJyb3dzZXJ8bGluayl8dm9kYWZvbmV8d2FwfHdpbmRvd3MgY2V8eGRhfHhpaW5vL2kudGVzdChhKSB8fCAvMTIwN3w2MzEwfDY1OTB8M2dzb3w0dGhwfDUwWzEtNl1pfDc3MHN8ODAyc3xhIHdhfGFiYWN8YWMoZXJ8b298c1xcLSl8YWkoa298cm4pfGFsKGF2fGNhfGNvKXxhbW9pfGFuKGV4fG55fHl3KXxhcHR1fGFyKGNofGdvKXxhcyh0ZXx1cyl8YXR0d3xhdShkaXxcXC1tfHIgfHMgKXxhdmFufGJlKGNrfGxsfG5xKXxiaShsYnxyZCl8YmwoYWN8YXopfGJyKGV8dil3fGJ1bWJ8YndcXC0obnx1KXxjNTVcXC98Y2FwaXxjY3dhfGNkbVxcLXxjZWxsfGNodG18Y2xkY3xjbWRcXC18Y28obXB8bmQpfGNyYXd8ZGEoaXR8bGx8bmcpfGRidGV8ZGNcXC1zfGRldml8ZGljYXxkbW9ifGRvKGN8cClvfGRzKDEyfFxcLWQpfGVsKDQ5fGFpKXxlbShsMnx1bCl8ZXIoaWN8azApfGVzbDh8ZXooWzQtN10wfG9zfHdhfHplKXxmZXRjfGZseShcXC18Xyl8ZzEgdXxnNTYwfGdlbmV8Z2ZcXC01fGdcXC1tb3xnbyhcXC53fG9kKXxncihhZHx1bil8aGFpZXxoY2l0fGhkXFwtKG18cHx0KXxoZWlcXC18aGkocHR8dGEpfGhwKCBpfGlwKXxoc1xcLWN8aHQoYyhcXC18IHxffGF8Z3xwfHN8dCl8dHApfGh1KGF3fHRjKXxpXFwtKDIwfGdvfG1hKXxpMjMwfGlhYyggfFxcLXxcXC8pfGlicm98aWRlYXxpZzAxfGlrb218aW0xa3xpbm5vfGlwYXF8aXJpc3xqYSh0fHYpYXxqYnJvfGplbXV8amlnc3xrZGRpfGtlaml8a2d0KCB8XFwvKXxrbG9ufGtwdCB8a3djXFwtfGt5byhjfGspfGxlKG5vfHhpKXxsZyggZ3xcXC8oa3xsfHUpfDUwfDU0fFxcLVthLXddKXxsaWJ3fGx5bnh8bTFcXC13fG0zZ2F8bTUwXFwvfG1hKHRlfHVpfHhvKXxtYygwMXwyMXxjYSl8bVxcLWNyfG1lKHJjfHJpKXxtaShvOHxvYXx0cyl8bW1lZnxtbygwMXwwMnxiaXxkZXxkb3x0KFxcLXwgfG98dil8enopfG10KDUwfHAxfHYgKXxtd2JwfG15d2F8bjEwWzAtMl18bjIwWzItM118bjMwKDB8Mil8bjUwKDB8Mnw1KXxuNygwKDB8MSl8MTApfG5lKChjfG0pXFwtfG9ufHRmfHdmfHdnfHd0KXxub2soNnxpKXxuenBofG8yaW18b3AodGl8d3YpfG9yYW58b3dnMXxwODAwfHBhbihhfGR8dCl8cGR4Z3xwZygxM3xcXC0oWzEtOF18YykpfHBoaWx8cGlyZXxwbChheXx1Yyl8cG5cXC0yfHBvKGNrfHJ0fHNlKXxwcm94fHBzaW98cHRcXC1nfHFhXFwtYXxxYygwN3wxMnwyMXwzMnw2MHxcXC1bMi03XXxpXFwtKXxxdGVrfHIzODB8cjYwMHxyYWtzfHJpbTl8cm8odmV8em8pfHM1NVxcL3xzYShnZXxtYXxtbXxtc3xueXx2YSl8c2MoMDF8aFxcLXxvb3xwXFwtKXxzZGtcXC98c2UoYyhcXC18MHwxKXw0N3xtY3xuZHxyaSl8c2doXFwtfHNoYXJ8c2llKFxcLXxtKXxza1xcLTB8c2woNDV8aWQpfHNtKGFsfGFyfGIzfGl0fHQ1KXxzbyhmdHxueSl8c3AoMDF8aFxcLXx2XFwtfHYgKXxzeSgwMXxtYil8dDIoMTh8NTApfHQ2KDAwfDEwfDE4KXx0YShndHxsayl8dGNsXFwtfHRkZ1xcLXx0ZWwoaXxtKXx0aW1cXC18dFxcLW1vfHRvKHBsfHNoKXx0cyg3MHxtXFwtfG0zfG01KXx0eFxcLTl8dXAoXFwuYnxnMXxzaSl8dXRzdHx2NDAwfHY3NTB8dmVyaXx2aShyZ3x0ZSl8dmsoNDB8NVswLTNdfFxcLXYpfHZtNDB8dm9kYXx2dWxjfHZ4KDUyfDUzfDYwfDYxfDcwfDgwfDgxfDgzfDg1fDk4KXx3M2MoXFwtfCApfHdlYmN8d2hpdHx3aShnIHxuY3xudyl8d21sYnx3b251fHg3MDB8eWFzXFwtfHlvdXJ8emV0b3x6dGVcXC0vaS50ZXN0KGEuc3Vic3RyKDAsIDQpKSkgbW9iaWxlID0gdHJ1ZTsgfSkobmF2aWdhdG9yLnVzZXJBZ2VudCB8fCBuYXZpZ2F0b3IudmVuZG9yIHx8IHdpbmRvdy5vcGVyYSk7XHJcbiAgICByZXR1cm4gbW9iaWxlO1xyXG59O1xyXG5cclxuZXhwb3J0IGNsYXNzIEdyYXlTY2FsZU1lZGlhIHtcclxuICAgIGNvbnN0cnVjdG9yKHNvdXJjZSwgd2lkdGgsIGhlaWdodCwgY2FudmFzKSB7XHJcbiAgICAgICAgdGhpcy5fc291cmNlID0gc291cmNlO1xyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuX2NhbnZhcyA9IGNhbnZhcyA/IGNhbnZhcyA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgICAgICAgdGhpcy5fY2FudmFzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5fY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuXHJcbiAgICAgICAgdGhpcy5fZmxpcEltYWdlUHJvZyA9IHJlcXVpcmUoXCIuL3NoYWRlcnMvZmxpcC1pbWFnZS5nbHNsXCIpO1xyXG4gICAgICAgIHRoaXMuX2dyYXlzY2FsZVByb2cgPSByZXF1aXJlKFwiLi9zaGFkZXJzL2dyYXlzY2FsZS5nbHNsXCIpO1xyXG4gICAgICAgIHRoaXMuZ2xSZWFkeSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuaW5pdEdMKHRoaXMuX2ZsaXBJbWFnZVByb2csIHRoaXMuX2dyYXlzY2FsZVByb2cpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRHTCh2ZXJ0U2hhZGVyU291cmNlLCBmcmFnU2hhZGVyU291cmNlKSB7XHJcbiAgICAgICAgdGhpcy5nbCA9IHRoaXMuX2NhbnZhcy5nZXRDb250ZXh0KFwid2ViZ2xcIik7XHJcblxyXG4gICAgICAgIHRoaXMuZ2wudmlld3BvcnQoMCwgMCwgdGhpcy5nbC5kcmF3aW5nQnVmZmVyV2lkdGgsIHRoaXMuZ2wuZHJhd2luZ0J1ZmZlckhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5nbC5jbGVhckNvbG9yKDAuMSwgMC4xLCAwLjEsIDEuMCk7XHJcbiAgICAgICAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQpO1xyXG5cclxuICAgICAgICBjb25zdCB2ZXJ0U2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbC5WRVJURVhfU0hBREVSKTtcclxuICAgICAgICBjb25zdCBmcmFnU2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbC5GUkFHTUVOVF9TSEFERVIpO1xyXG5cclxuICAgICAgICB0aGlzLmdsLnNoYWRlclNvdXJjZSh2ZXJ0U2hhZGVyLCB2ZXJ0U2hhZGVyU291cmNlKTtcclxuICAgICAgICB0aGlzLmdsLnNoYWRlclNvdXJjZShmcmFnU2hhZGVyLCBmcmFnU2hhZGVyU291cmNlKTtcclxuXHJcbiAgICAgICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKHZlcnRTaGFkZXIpO1xyXG4gICAgICAgIHRoaXMuZ2wuY29tcGlsZVNoYWRlcihmcmFnU2hhZGVyKTtcclxuXHJcbiAgICAgICAgY29uc3QgcHJvZ3JhbSA9IHRoaXMuZ2wuY3JlYXRlUHJvZ3JhbSgpO1xyXG4gICAgICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIHZlcnRTaGFkZXIpO1xyXG4gICAgICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIGZyYWdTaGFkZXIpO1xyXG5cclxuICAgICAgICB0aGlzLmdsLmxpbmtQcm9ncmFtKHByb2dyYW0pO1xyXG5cclxuICAgICAgICB0aGlzLmdsLnVzZVByb2dyYW0ocHJvZ3JhbSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHZlcnRpY2VzID0gbmV3IEZsb2F0MzJBcnJheShbXHJcbiAgICAgICAgICAgIC0xLCAtMSxcclxuICAgICAgICAgICAgLTEsIDEsXHJcbiAgICAgICAgICAgIDEsIDEsXHJcbiAgICAgICAgICAgIC0xLCAtMSxcclxuICAgICAgICAgICAgMSwgMSxcclxuICAgICAgICAgICAgMSwgLTEsXHJcbiAgICAgICAgXSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbiAgICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBidWZmZXIpO1xyXG4gICAgICAgIHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdmVydGljZXMsIHRoaXMuZ2wuU1RBVElDX0RSQVcpO1xyXG5cclxuICAgICAgICBjb25zdCBwb3NpdGlvbkxvY2F0aW9uID0gdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbihwcm9ncmFtLCBcInBvc2l0aW9uXCIpO1xyXG4gICAgICAgIHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcihwb3NpdGlvbkxvY2F0aW9uLCAyLCB0aGlzLmdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcbiAgICAgICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShwb3NpdGlvbkxvY2F0aW9uKTtcclxuXHJcbiAgICAgICAgdGhpcy5mbGlwTG9jYXRpb24gPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtLCBcImZsaXBZXCIpO1xyXG5cclxuICAgICAgICBjb25zdCB0ZXh0dXJlID0gdGhpcy5nbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgICAgICAgdGhpcy5nbC5hY3RpdmVUZXh0dXJlKHRoaXMuZ2wuVEVYVFVSRTApO1xyXG4gICAgICAgIHRoaXMuZ2wuYmluZFRleHR1cmUodGhpcy5nbC5URVhUVVJFXzJELCB0ZXh0dXJlKTtcclxuXHJcbiAgICAgICAgLy8gaWYgZWl0aGVyIGRpbWVuc2lvbiBvZiBpbWFnZSBpcyBub3QgYSBwb3dlciBvZiAyXHJcbiAgICAgICAgdGhpcy5nbC50ZXhQYXJhbWV0ZXJpKHRoaXMuZ2wuVEVYVFVSRV8yRCwgdGhpcy5nbC5URVhUVVJFX1dSQVBfUywgdGhpcy5nbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICB0aGlzLmdsLnRleFBhcmFtZXRlcmkodGhpcy5nbC5URVhUVVJFXzJELCB0aGlzLmdsLlRFWFRVUkVfV1JBUF9ULCB0aGlzLmdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgIHRoaXMuZ2wudGV4UGFyYW1ldGVyaSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRoaXMuZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCB0aGlzLmdsLkxJTkVBUik7XHJcbiAgICAgICAgdGhpcy5nbC50ZXhQYXJhbWV0ZXJpKHRoaXMuZ2wuVEVYVFVSRV8yRCwgdGhpcy5nbC5URVhUVVJFX01BR19GSUxURVIsIHRoaXMuZ2wuTElORUFSKTtcclxuXHJcbiAgICAgICAgdGhpcy5nbFJlYWR5ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnBpeGVsQnVmID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5nbC5kcmF3aW5nQnVmZmVyV2lkdGggKiB0aGlzLmdsLmRyYXdpbmdCdWZmZXJIZWlnaHQgKiA0KTtcclxuICAgICAgICB0aGlzLmdyYXlCdWYgPSBuZXcgVWludDhBcnJheSh0aGlzLmdsLmRyYXdpbmdCdWZmZXJXaWR0aCAqIHRoaXMuZ2wuZHJhd2luZ0J1ZmZlckhlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RnJhbWUoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmdsUmVhZHkpIHJldHVybiB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIHRoaXMuZ2wudW5pZm9ybTFmKHRoaXMuZmxpcExvY2F0aW9uLCAtMSk7IC8vIGZsaXAgaW1hZ2VcclxuICAgICAgICB0aGlzLmdsLnRleEltYWdlMkQodGhpcy5nbC5URVhUVVJFXzJELCAwLCB0aGlzLmdsLlJHQkEsIHRoaXMuZ2wuUkdCQSwgdGhpcy5nbC5VTlNJR05FRF9CWVRFLCB0aGlzLl9zb3VyY2UpO1xyXG4gICAgICAgIHRoaXMuZ2wuZHJhd0FycmF5cyh0aGlzLmdsLlRSSUFOR0xFUywgMCwgNik7XHJcblxyXG4gICAgICAgIHRoaXMuZ2wucmVhZFBpeGVscygwLCAwLCB0aGlzLmdsLmRyYXdpbmdCdWZmZXJXaWR0aCwgdGhpcy5nbC5kcmF3aW5nQnVmZmVySGVpZ2h0LCB0aGlzLmdsLlJHQkEsIHRoaXMuZ2wuVU5TSUdORURfQllURSwgdGhpcy5waXhlbEJ1Zik7XHJcblxyXG4gICAgICAgIGxldCBqID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGl4ZWxCdWYubGVuZ3RoOyBpICs9IDQpIHtcclxuICAgICAgICAgICAgdGhpcy5ncmF5QnVmW2pdID0gdGhpcy5waXhlbEJ1ZltpXTtcclxuICAgICAgICAgICAgaisrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5ncmF5QnVmO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcXVlc3RTdHJlYW0oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgaWYgKCFuYXZpZ2F0b3IubWVkaWFEZXZpY2VzIHx8ICFuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSlcclxuICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEhhY2sgZm9yIG1vYmlsZSBicm93c2VyczogYXNwZWN0IHJhdGlvIGlzIGZsaXBwZWQuXHJcbiAgICAgICAgICAgIHZhciBhc3BlY3QgPSB0aGlzLl93aWR0aCAvIHRoaXMuX2hlaWdodDtcclxuICAgICAgICAgICAgaWYgKGlzTW9iaWxlKCkpIHtcclxuICAgICAgICAgICAgICAgIGFzcGVjdCA9IDEgLyBhc3BlY3Q7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKHtcclxuICAgICAgICAgICAgICAgIGF1ZGlvOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHZpZGVvOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHsgaWRlYWw6IHRoaXMuX3dpZHRoIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB7IGlkZWFsOiB0aGlzLl9oZWlnaHQgfSxcclxuICAgICAgICAgICAgICAgICAgICBhc3BlY3RSYXRpbzogeyBpZGVhbDogYXNwZWN0IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZmFjaW5nTW9kZTogXCJlbnZpcm9ubWVudFwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihzdHJlYW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB7IHdpZHRoLCBoZWlnaHQgfSA9IHN0cmVhbS5nZXRUcmFja3MoKVswXS5nZXRTZXR0aW5ncygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBgVmlkZW8gZGltZW5zaW9ucyBmcm9tIG1lZGlhRGV2aWNlczogJHt3aWR0aH14JHtoZWlnaHR9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc291cmNlLnNyY09iamVjdCA9IHN0cmVhbTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zb3VyY2Uub25sb2FkZWRtZXRhZGF0YSA9IGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zb3VyY2UucGxheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMuX3NvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiJdLCJuYW1lcyI6WyJpc01vYmlsZSIsIm1vYmlsZSIsImEiLCJ0ZXN0Iiwic3Vic3RyIiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwidmVuZG9yIiwid2luZG93Iiwib3BlcmEiLCJHcmF5U2NhbGVNZWRpYSIsInNvdXJjZSIsIndpZHRoIiwiaGVpZ2h0IiwiY2FudmFzIiwiX2NsYXNzQ2FsbENoZWNrIiwiX3NvdXJjZSIsIl93aWR0aCIsIl9oZWlnaHQiLCJfY2FudmFzIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiX2ZsaXBJbWFnZVByb2ciLCJyZXF1aXJlIiwiX2dyYXlzY2FsZVByb2ciLCJnbFJlYWR5IiwiaW5pdEdMIiwiX2NyZWF0ZUNsYXNzIiwia2V5IiwidmFsdWUiLCJ2ZXJ0U2hhZGVyU291cmNlIiwiZnJhZ1NoYWRlclNvdXJjZSIsImdsIiwiZ2V0Q29udGV4dCIsInZpZXdwb3J0IiwiZHJhd2luZ0J1ZmZlcldpZHRoIiwiZHJhd2luZ0J1ZmZlckhlaWdodCIsImNsZWFyQ29sb3IiLCJjbGVhciIsIkNPTE9SX0JVRkZFUl9CSVQiLCJ2ZXJ0U2hhZGVyIiwiY3JlYXRlU2hhZGVyIiwiVkVSVEVYX1NIQURFUiIsImZyYWdTaGFkZXIiLCJGUkFHTUVOVF9TSEFERVIiLCJzaGFkZXJTb3VyY2UiLCJjb21waWxlU2hhZGVyIiwicHJvZ3JhbSIsImNyZWF0ZVByb2dyYW0iLCJhdHRhY2hTaGFkZXIiLCJsaW5rUHJvZ3JhbSIsInVzZVByb2dyYW0iLCJ2ZXJ0aWNlcyIsIkZsb2F0MzJBcnJheSIsImJ1ZmZlciIsImNyZWF0ZUJ1ZmZlciIsImJpbmRCdWZmZXIiLCJBUlJBWV9CVUZGRVIiLCJidWZmZXJEYXRhIiwiU1RBVElDX0RSQVciLCJwb3NpdGlvbkxvY2F0aW9uIiwiZ2V0QXR0cmliTG9jYXRpb24iLCJ2ZXJ0ZXhBdHRyaWJQb2ludGVyIiwiRkxPQVQiLCJlbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSIsImZsaXBMb2NhdGlvbiIsImdldFVuaWZvcm1Mb2NhdGlvbiIsInRleHR1cmUiLCJjcmVhdGVUZXh0dXJlIiwiYWN0aXZlVGV4dHVyZSIsIlRFWFRVUkUwIiwiYmluZFRleHR1cmUiLCJURVhUVVJFXzJEIiwidGV4UGFyYW1ldGVyaSIsIlRFWFRVUkVfV1JBUF9TIiwiQ0xBTVBfVE9fRURHRSIsIlRFWFRVUkVfV1JBUF9UIiwiVEVYVFVSRV9NSU5fRklMVEVSIiwiTElORUFSIiwiVEVYVFVSRV9NQUdfRklMVEVSIiwicGl4ZWxCdWYiLCJVaW50OEFycmF5IiwiZ3JheUJ1ZiIsImdldEZyYW1lIiwidW5kZWZpbmVkIiwidW5pZm9ybTFmIiwidGV4SW1hZ2UyRCIsIlJHQkEiLCJVTlNJR05FRF9CWVRFIiwiZHJhd0FycmF5cyIsIlRSSUFOR0xFUyIsInJlYWRQaXhlbHMiLCJqIiwiaSIsImxlbmd0aCIsInJlcXVlc3RTdHJlYW0iLCJfdGhpcyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwibWVkaWFEZXZpY2VzIiwiZ2V0VXNlck1lZGlhIiwiYXNwZWN0IiwiYXVkaW8iLCJ2aWRlbyIsImlkZWFsIiwiYXNwZWN0UmF0aW8iLCJmYWNpbmdNb2RlIiwidGhlbiIsInN0cmVhbSIsIl9zdHJlYW0kZ2V0VHJhY2tzJDAkZyIsImdldFRyYWNrcyIsImdldFNldHRpbmdzIiwiY29uc29sZSIsImxvZyIsImNvbmNhdCIsInNyY09iamVjdCIsIm9ubG9hZGVkbWV0YWRhdGEiLCJlIiwicGxheSIsImVyciJdLCJzb3VyY2VSb290IjoiIn0=