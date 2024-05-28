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
  return "symbol" == (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(i) ? i : String(i);
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
  return GrayScaleMedia;
}();
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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aW9uIiwid2VicGFjazovL0dyYXlTY2FsZS8uL3NyYy91dGlscy9zaGFkZXJzL2ZsaXAtaW1hZ2UuZ2xzbCIsIndlYnBhY2s6Ly9HcmF5U2NhbGUvLi9zcmMvdXRpbHMvc2hhZGVycy9ncmF5c2NhbGUuZ2xzbCIsIndlYnBhY2s6Ly9HcmF5U2NhbGUvLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vY2xhc3NDYWxsQ2hlY2suanMiLCJ3ZWJwYWNrOi8vR3JheVNjYWxlLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2NyZWF0ZUNsYXNzLmpzIiwid2VicGFjazovL0dyYXlTY2FsZS8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS90b1ByaW1pdGl2ZS5qcyIsIndlYnBhY2s6Ly9HcmF5U2NhbGUvLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vdG9Qcm9wZXJ0eUtleS5qcyIsIndlYnBhY2s6Ly9HcmF5U2NhbGUvLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vdHlwZW9mLmpzIiwid2VicGFjazovL0dyYXlTY2FsZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9HcmF5U2NhbGUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0dyYXlTY2FsZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0dyYXlTY2FsZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0dyYXlTY2FsZS8uL3NyYy91dGlscy9HcmF5U2NhbGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiR3JheVNjYWxlXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkdyYXlTY2FsZVwiXSA9IGZhY3RvcnkoKTtcbn0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzLCAoKSA9PiB7XG5yZXR1cm4gIiwibW9kdWxlLmV4cG9ydHMgPSBcImF0dHJpYnV0ZSB2ZWMyIHBvc2l0aW9uO1xcbnZhcnlpbmcgdmVjMiB0ZXhfY29vcmRzO1xcbnVuaWZvcm0gZmxvYXQgZmxpcFk7XFxudm9pZCBtYWluKHZvaWQpIHtcXG50ZXhfY29vcmRzID0gKHBvc2l0aW9uICsgMS4wKSAvIDIuMDtcXG50ZXhfY29vcmRzLnkgPSAxLjAgLSB0ZXhfY29vcmRzLnk7XFxuZ2xfUG9zaXRpb24gPSB2ZWM0KHBvc2l0aW9uICogdmVjMigxLCBmbGlwWSksIDAuMCwgMS4wKTtcXG59XCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVfaW1hZ2U7XFxudmFyeWluZyB2ZWMyIHRleF9jb29yZHM7XFxuY29uc3QgdmVjMyBnID0gdmVjMygwLjI5OSwgMC41ODcsIDAuMTE0KTtcXG52b2lkIG1haW4odm9pZCkge1xcbnZlYzQgY29sb3IgPSB0ZXh0dXJlMkQodV9pbWFnZSwgdGV4X2Nvb3Jkcyk7XFxuZmxvYXQgZ3JheSA9IGRvdChjb2xvci5yZ2IsIGcpO1xcbmdsX0ZyYWdDb2xvciA9IHZlYzQodmVjMyhncmF5KSwgMS4wKTtcXG59XCIiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufSIsImltcG9ydCB0b1Byb3BlcnR5S2V5IGZyb20gXCIuL3RvUHJvcGVydHlLZXkuanNcIjtcbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHRvUHJvcGVydHlLZXkoZGVzY3JpcHRvci5rZXkpLCBkZXNjcmlwdG9yKTtcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ29uc3RydWN0b3IsIFwicHJvdG90eXBlXCIsIHtcbiAgICB3cml0YWJsZTogZmFsc2VcbiAgfSk7XG4gIHJldHVybiBDb25zdHJ1Y3Rvcjtcbn0iLCJpbXBvcnQgX3R5cGVvZiBmcm9tIFwiLi90eXBlb2YuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRvUHJpbWl0aXZlKHQsIHIpIHtcbiAgaWYgKFwib2JqZWN0XCIgIT0gX3R5cGVvZih0KSB8fCAhdCkgcmV0dXJuIHQ7XG4gIHZhciBlID0gdFtTeW1ib2wudG9QcmltaXRpdmVdO1xuICBpZiAodm9pZCAwICE9PSBlKSB7XG4gICAgdmFyIGkgPSBlLmNhbGwodCwgciB8fCBcImRlZmF1bHRcIik7XG4gICAgaWYgKFwib2JqZWN0XCIgIT0gX3R5cGVvZihpKSkgcmV0dXJuIGk7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkBAdG9QcmltaXRpdmUgbXVzdCByZXR1cm4gYSBwcmltaXRpdmUgdmFsdWUuXCIpO1xuICB9XG4gIHJldHVybiAoXCJzdHJpbmdcIiA9PT0gciA/IFN0cmluZyA6IE51bWJlcikodCk7XG59IiwiaW1wb3J0IF90eXBlb2YgZnJvbSBcIi4vdHlwZW9mLmpzXCI7XG5pbXBvcnQgdG9QcmltaXRpdmUgZnJvbSBcIi4vdG9QcmltaXRpdmUuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRvUHJvcGVydHlLZXkodCkge1xuICB2YXIgaSA9IHRvUHJpbWl0aXZlKHQsIFwic3RyaW5nXCIpO1xuICByZXR1cm4gXCJzeW1ib2xcIiA9PSBfdHlwZW9mKGkpID8gaSA6IFN0cmluZyhpKTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfdHlwZW9mKG8pIHtcbiAgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiO1xuXG4gIHJldHVybiBfdHlwZW9mID0gXCJmdW5jdGlvblwiID09IHR5cGVvZiBTeW1ib2wgJiYgXCJzeW1ib2xcIiA9PSB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID8gZnVuY3Rpb24gKG8pIHtcbiAgICByZXR1cm4gdHlwZW9mIG87XG4gIH0gOiBmdW5jdGlvbiAobykge1xuICAgIHJldHVybiBvICYmIFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgU3ltYm9sICYmIG8uY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvO1xuICB9LCBfdHlwZW9mKG8pO1xufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiZnVuY3Rpb24gaXNNb2JpbGUoKSB7XHJcbiAgICBsZXQgbW9iaWxlID0gZmFsc2U7XHJcbiAgICAoZnVuY3Rpb24gKGEpIHsgaWYgKC8oYW5kcm9pZHxiYlxcZCt8bWVlZ28pLittb2JpbGV8YXZhbnRnb3xiYWRhXFwvfGJsYWNrYmVycnl8YmxhemVyfGNvbXBhbHxlbGFpbmV8ZmVubmVjfGhpcHRvcHxpZW1vYmlsZXxpcChob25lfG9kKXxpcmlzfGtpbmRsZXxsZ2UgfG1hZW1vfG1pZHB8bW1wfG1vYmlsZS4rZmlyZWZveHxuZXRmcm9udHxvcGVyYSBtKG9ifGluKWl8cGFsbSggb3MpP3xwaG9uZXxwKGl4aXxyZSlcXC98cGx1Y2tlcnxwb2NrZXR8cHNwfHNlcmllcyg0fDYpMHxzeW1iaWFufHRyZW98dXBcXC4oYnJvd3NlcnxsaW5rKXx2b2RhZm9uZXx3YXB8d2luZG93cyBjZXx4ZGF8eGlpbm8vaS50ZXN0KGEpIHx8IC8xMjA3fDYzMTB8NjU5MHwzZ3NvfDR0aHB8NTBbMS02XWl8Nzcwc3w4MDJzfGEgd2F8YWJhY3xhYyhlcnxvb3xzXFwtKXxhaShrb3xybil8YWwoYXZ8Y2F8Y28pfGFtb2l8YW4oZXh8bnl8eXcpfGFwdHV8YXIoY2h8Z28pfGFzKHRlfHVzKXxhdHR3fGF1KGRpfFxcLW18ciB8cyApfGF2YW58YmUoY2t8bGx8bnEpfGJpKGxifHJkKXxibChhY3xheil8YnIoZXx2KXd8YnVtYnxid1xcLShufHUpfGM1NVxcL3xjYXBpfGNjd2F8Y2RtXFwtfGNlbGx8Y2h0bXxjbGRjfGNtZFxcLXxjbyhtcHxuZCl8Y3Jhd3xkYShpdHxsbHxuZyl8ZGJ0ZXxkY1xcLXN8ZGV2aXxkaWNhfGRtb2J8ZG8oY3xwKW98ZHMoMTJ8XFwtZCl8ZWwoNDl8YWkpfGVtKGwyfHVsKXxlcihpY3xrMCl8ZXNsOHxleihbNC03XTB8b3N8d2F8emUpfGZldGN8Zmx5KFxcLXxfKXxnMSB1fGc1NjB8Z2VuZXxnZlxcLTV8Z1xcLW1vfGdvKFxcLnd8b2QpfGdyKGFkfHVuKXxoYWllfGhjaXR8aGRcXC0obXxwfHQpfGhlaVxcLXxoaShwdHx0YSl8aHAoIGl8aXApfGhzXFwtY3xodChjKFxcLXwgfF98YXxnfHB8c3x0KXx0cCl8aHUoYXd8dGMpfGlcXC0oMjB8Z298bWEpfGkyMzB8aWFjKCB8XFwtfFxcLyl8aWJyb3xpZGVhfGlnMDF8aWtvbXxpbTFrfGlubm98aXBhcXxpcmlzfGphKHR8dilhfGpicm98amVtdXxqaWdzfGtkZGl8a2VqaXxrZ3QoIHxcXC8pfGtsb258a3B0IHxrd2NcXC18a3lvKGN8ayl8bGUobm98eGkpfGxnKCBnfFxcLyhrfGx8dSl8NTB8NTR8XFwtW2Etd10pfGxpYnd8bHlueHxtMVxcLXd8bTNnYXxtNTBcXC98bWEodGV8dWl8eG8pfG1jKDAxfDIxfGNhKXxtXFwtY3J8bWUocmN8cmkpfG1pKG84fG9hfHRzKXxtbWVmfG1vKDAxfDAyfGJpfGRlfGRvfHQoXFwtfCB8b3x2KXx6eil8bXQoNTB8cDF8diApfG13YnB8bXl3YXxuMTBbMC0yXXxuMjBbMi0zXXxuMzAoMHwyKXxuNTAoMHwyfDUpfG43KDAoMHwxKXwxMCl8bmUoKGN8bSlcXC18b258dGZ8d2Z8d2d8d3QpfG5vayg2fGkpfG56cGh8bzJpbXxvcCh0aXx3dil8b3Jhbnxvd2cxfHA4MDB8cGFuKGF8ZHx0KXxwZHhnfHBnKDEzfFxcLShbMS04XXxjKSl8cGhpbHxwaXJlfHBsKGF5fHVjKXxwblxcLTJ8cG8oY2t8cnR8c2UpfHByb3h8cHNpb3xwdFxcLWd8cWFcXC1hfHFjKDA3fDEyfDIxfDMyfDYwfFxcLVsyLTddfGlcXC0pfHF0ZWt8cjM4MHxyNjAwfHJha3N8cmltOXxybyh2ZXx6byl8czU1XFwvfHNhKGdlfG1hfG1tfG1zfG55fHZhKXxzYygwMXxoXFwtfG9vfHBcXC0pfHNka1xcL3xzZShjKFxcLXwwfDEpfDQ3fG1jfG5kfHJpKXxzZ2hcXC18c2hhcnxzaWUoXFwtfG0pfHNrXFwtMHxzbCg0NXxpZCl8c20oYWx8YXJ8YjN8aXR8dDUpfHNvKGZ0fG55KXxzcCgwMXxoXFwtfHZcXC18diApfHN5KDAxfG1iKXx0MigxOHw1MCl8dDYoMDB8MTB8MTgpfHRhKGd0fGxrKXx0Y2xcXC18dGRnXFwtfHRlbChpfG0pfHRpbVxcLXx0XFwtbW98dG8ocGx8c2gpfHRzKDcwfG1cXC18bTN8bTUpfHR4XFwtOXx1cChcXC5ifGcxfHNpKXx1dHN0fHY0MDB8djc1MHx2ZXJpfHZpKHJnfHRlKXx2ayg0MHw1WzAtM118XFwtdil8dm00MHx2b2RhfHZ1bGN8dngoNTJ8NTN8NjB8NjF8NzB8ODB8ODF8ODN8ODV8OTgpfHczYyhcXC18ICl8d2ViY3x3aGl0fHdpKGcgfG5jfG53KXx3bWxifHdvbnV8eDcwMHx5YXNcXC18eW91cnx6ZXRvfHp0ZVxcLS9pLnRlc3QoYS5zdWJzdHIoMCwgNCkpKSBtb2JpbGUgPSB0cnVlOyB9KShuYXZpZ2F0b3IudXNlckFnZW50IHx8IG5hdmlnYXRvci52ZW5kb3IgfHwgd2luZG93Lm9wZXJhKTtcclxuICAgIHJldHVybiBtb2JpbGU7XHJcbn07XHJcblxyXG5leHBvcnQgY2xhc3MgR3JheVNjYWxlTWVkaWEge1xyXG4gICAgY29uc3RydWN0b3Ioc291cmNlLCB3aWR0aCwgaGVpZ2h0LCBjYW52YXMpIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2UgPSBzb3VyY2U7XHJcbiAgICAgICAgdGhpcy5fd2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5fY2FudmFzID0gY2FudmFzID8gY2FudmFzIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuICAgICAgICB0aGlzLl9jYW52YXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLl9jYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cclxuICAgICAgICB0aGlzLl9mbGlwSW1hZ2VQcm9nID0gcmVxdWlyZShcIi4vc2hhZGVycy9mbGlwLWltYWdlLmdsc2xcIik7XHJcbiAgICAgICAgdGhpcy5fZ3JheXNjYWxlUHJvZyA9IHJlcXVpcmUoXCIuL3NoYWRlcnMvZ3JheXNjYWxlLmdsc2xcIik7XHJcbiAgICAgICAgdGhpcy5nbFJlYWR5ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5pbml0R0wodGhpcy5fZmxpcEltYWdlUHJvZywgdGhpcy5fZ3JheXNjYWxlUHJvZyk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdEdMKHZlcnRTaGFkZXJTb3VyY2UsIGZyYWdTaGFkZXJTb3VyY2UpIHtcclxuICAgICAgICB0aGlzLmdsID0gdGhpcy5fY2FudmFzLmdldENvbnRleHQoXCJ3ZWJnbFwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5nbC52aWV3cG9ydCgwLCAwLCB0aGlzLmdsLmRyYXdpbmdCdWZmZXJXaWR0aCwgdGhpcy5nbC5kcmF3aW5nQnVmZmVySGVpZ2h0KTtcclxuICAgICAgICB0aGlzLmdsLmNsZWFyQ29sb3IoMC4xLCAwLjEsIDAuMSwgMS4wKTtcclxuICAgICAgICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHZlcnRTaGFkZXIgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsLlZFUlRFWF9TSEFERVIpO1xyXG4gICAgICAgIGNvbnN0IGZyYWdTaGFkZXIgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsLkZSQUdNRU5UX1NIQURFUik7XHJcblxyXG4gICAgICAgIHRoaXMuZ2wuc2hhZGVyU291cmNlKHZlcnRTaGFkZXIsIHZlcnRTaGFkZXJTb3VyY2UpO1xyXG4gICAgICAgIHRoaXMuZ2wuc2hhZGVyU291cmNlKGZyYWdTaGFkZXIsIGZyYWdTaGFkZXJTb3VyY2UpO1xyXG5cclxuICAgICAgICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIodmVydFNoYWRlcik7XHJcbiAgICAgICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKGZyYWdTaGFkZXIpO1xyXG5cclxuICAgICAgICBjb25zdCBwcm9ncmFtID0gdGhpcy5nbC5jcmVhdGVQcm9ncmFtKCk7XHJcbiAgICAgICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgdmVydFNoYWRlcik7XHJcbiAgICAgICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgZnJhZ1NoYWRlcik7XHJcblxyXG4gICAgICAgIHRoaXMuZ2wubGlua1Byb2dyYW0ocHJvZ3JhbSk7XHJcblxyXG4gICAgICAgIHRoaXMuZ2wudXNlUHJvZ3JhbShwcm9ncmFtKTtcclxuXHJcbiAgICAgICAgY29uc3QgdmVydGljZXMgPSBuZXcgRmxvYXQzMkFycmF5KFtcclxuICAgICAgICAgICAgLTEsIC0xLFxyXG4gICAgICAgICAgICAtMSwgMSxcclxuICAgICAgICAgICAgMSwgMSxcclxuICAgICAgICAgICAgLTEsIC0xLFxyXG4gICAgICAgICAgICAxLCAxLFxyXG4gICAgICAgICAgICAxLCAtMSxcclxuICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgY29uc3QgYnVmZmVyID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcclxuICAgICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIGJ1ZmZlcik7XHJcbiAgICAgICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB2ZXJ0aWNlcywgdGhpcy5nbC5TVEFUSUNfRFJBVyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uTG9jYXRpb24gPSB0aGlzLmdsLmdldEF0dHJpYkxvY2F0aW9uKHByb2dyYW0sIFwicG9zaXRpb25cIik7XHJcbiAgICAgICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHBvc2l0aW9uTG9jYXRpb24sIDIsIHRoaXMuZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuICAgICAgICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHBvc2l0aW9uTG9jYXRpb24pO1xyXG5cclxuICAgICAgICB0aGlzLmZsaXBMb2NhdGlvbiA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sIFwiZmxpcFlcIik7XHJcblxyXG4gICAgICAgIGNvbnN0IHRleHR1cmUgPSB0aGlzLmdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICAgICAgICB0aGlzLmdsLmFjdGl2ZVRleHR1cmUodGhpcy5nbC5URVhUVVJFMCk7XHJcbiAgICAgICAgdGhpcy5nbC5iaW5kVGV4dHVyZSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRleHR1cmUpO1xyXG5cclxuICAgICAgICAvLyBpZiBlaXRoZXIgZGltZW5zaW9uIG9mIGltYWdlIGlzIG5vdCBhIHBvd2VyIG9mIDJcclxuICAgICAgICB0aGlzLmdsLnRleFBhcmFtZXRlcmkodGhpcy5nbC5URVhUVVJFXzJELCB0aGlzLmdsLlRFWFRVUkVfV1JBUF9TLCB0aGlzLmdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgIHRoaXMuZ2wudGV4UGFyYW1ldGVyaSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRoaXMuZ2wuVEVYVFVSRV9XUkFQX1QsIHRoaXMuZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgdGhpcy5nbC50ZXhQYXJhbWV0ZXJpKHRoaXMuZ2wuVEVYVFVSRV8yRCwgdGhpcy5nbC5URVhUVVJFX01JTl9GSUxURVIsIHRoaXMuZ2wuTElORUFSKTtcclxuICAgICAgICB0aGlzLmdsLnRleFBhcmFtZXRlcmkodGhpcy5nbC5URVhUVVJFXzJELCB0aGlzLmdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgdGhpcy5nbC5MSU5FQVIpO1xyXG5cclxuICAgICAgICB0aGlzLmdsUmVhZHkgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucGl4ZWxCdWYgPSBuZXcgVWludDhBcnJheSh0aGlzLmdsLmRyYXdpbmdCdWZmZXJXaWR0aCAqIHRoaXMuZ2wuZHJhd2luZ0J1ZmZlckhlaWdodCAqIDQpO1xyXG4gICAgICAgIHRoaXMuZ3JheUJ1ZiA9IG5ldyBVaW50OEFycmF5KHRoaXMuZ2wuZHJhd2luZ0J1ZmZlcldpZHRoICogdGhpcy5nbC5kcmF3aW5nQnVmZmVySGVpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDb250ZXh0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEZyYW1lKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5nbFJlYWR5KSByZXR1cm4gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICB0aGlzLmdsLnVuaWZvcm0xZih0aGlzLmZsaXBMb2NhdGlvbiwgLTEpOyAvLyBmbGlwIGltYWdlXHJcbiAgICAgICAgdGhpcy5nbC50ZXhJbWFnZTJEKHRoaXMuZ2wuVEVYVFVSRV8yRCwgMCwgdGhpcy5nbC5SR0JBLCB0aGlzLmdsLlJHQkEsIHRoaXMuZ2wuVU5TSUdORURfQllURSwgdGhpcy5fc291cmNlKTtcclxuICAgICAgICB0aGlzLmdsLmRyYXdBcnJheXModGhpcy5nbC5UUklBTkdMRVMsIDAsIDYpO1xyXG5cclxuICAgICAgICB0aGlzLmdsLnJlYWRQaXhlbHMoMCwgMCwgdGhpcy5nbC5kcmF3aW5nQnVmZmVyV2lkdGgsIHRoaXMuZ2wuZHJhd2luZ0J1ZmZlckhlaWdodCwgdGhpcy5nbC5SR0JBLCB0aGlzLmdsLlVOU0lHTkVEX0JZVEUsIHRoaXMucGl4ZWxCdWYpO1xyXG5cclxuICAgICAgICBsZXQgaiA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBpeGVsQnVmLmxlbmd0aDsgaSArPSA0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JheUJ1ZltqXSA9IHRoaXMucGl4ZWxCdWZbaV07XHJcbiAgICAgICAgICAgIGorKztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JheUJ1ZjtcclxuICAgIH1cclxuXHJcbiAgICByZXF1ZXN0U3RyZWFtKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghbmF2aWdhdG9yLm1lZGlhRGV2aWNlcyB8fCAhbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KCk7XHJcblxyXG4gICAgICAgICAgICAvLyBIYWNrIGZvciBtb2JpbGUgYnJvd3NlcnM6IGFzcGVjdCByYXRpbyBpcyBmbGlwcGVkLlxyXG4gICAgICAgICAgICB2YXIgYXNwZWN0ID0gdGhpcy5fd2lkdGggLyB0aGlzLl9oZWlnaHQ7XHJcbiAgICAgICAgICAgIGlmIChpc01vYmlsZSgpKSB7XHJcbiAgICAgICAgICAgICAgICBhc3BlY3QgPSAxIC8gYXNwZWN0O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSh7XHJcbiAgICAgICAgICAgICAgICBhdWRpbzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB2aWRlbzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB7IGlkZWFsOiB0aGlzLl93aWR0aCB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogeyBpZGVhbDogdGhpcy5faGVpZ2h0IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgYXNwZWN0UmF0aW86IHsgaWRlYWw6IGFzcGVjdCB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGZhY2luZ01vZGU6IFwiZW52aXJvbm1lbnRcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oc3RyZWFtID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgeyB3aWR0aCwgaGVpZ2h0IH0gPSBzdHJlYW0uZ2V0VHJhY2tzKClbMF0uZ2V0U2V0dGluZ3MoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggYFZpZGVvIGRpbWVuc2lvbnMgZnJvbSBtZWRpYURldmljZXM6ICR7d2lkdGh9eCR7aGVpZ2h0fWApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NvdXJjZS5zcmNPYmplY3QgPSBzdHJlYW07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc291cmNlLm9ubG9hZGVkbWV0YWRhdGEgPSBlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc291cmNlLnBsYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLl9zb3VyY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iXSwibmFtZXMiOlsiaXNNb2JpbGUiLCJtb2JpbGUiLCJhIiwidGVzdCIsInN1YnN0ciIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsInZlbmRvciIsIndpbmRvdyIsIm9wZXJhIiwiR3JheVNjYWxlTWVkaWEiLCJzb3VyY2UiLCJ3aWR0aCIsImhlaWdodCIsImNhbnZhcyIsIl9jbGFzc0NhbGxDaGVjayIsIl9zb3VyY2UiLCJfd2lkdGgiLCJfaGVpZ2h0IiwiX2NhbnZhcyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsIl9mbGlwSW1hZ2VQcm9nIiwicmVxdWlyZSIsIl9ncmF5c2NhbGVQcm9nIiwiZ2xSZWFkeSIsImluaXRHTCIsIl9jcmVhdGVDbGFzcyIsImtleSIsInZhbHVlIiwidmVydFNoYWRlclNvdXJjZSIsImZyYWdTaGFkZXJTb3VyY2UiLCJnbCIsImdldENvbnRleHQiLCJ2aWV3cG9ydCIsImRyYXdpbmdCdWZmZXJXaWR0aCIsImRyYXdpbmdCdWZmZXJIZWlnaHQiLCJjbGVhckNvbG9yIiwiY2xlYXIiLCJDT0xPUl9CVUZGRVJfQklUIiwidmVydFNoYWRlciIsImNyZWF0ZVNoYWRlciIsIlZFUlRFWF9TSEFERVIiLCJmcmFnU2hhZGVyIiwiRlJBR01FTlRfU0hBREVSIiwic2hhZGVyU291cmNlIiwiY29tcGlsZVNoYWRlciIsInByb2dyYW0iLCJjcmVhdGVQcm9ncmFtIiwiYXR0YWNoU2hhZGVyIiwibGlua1Byb2dyYW0iLCJ1c2VQcm9ncmFtIiwidmVydGljZXMiLCJGbG9hdDMyQXJyYXkiLCJidWZmZXIiLCJjcmVhdGVCdWZmZXIiLCJiaW5kQnVmZmVyIiwiQVJSQVlfQlVGRkVSIiwiYnVmZmVyRGF0YSIsIlNUQVRJQ19EUkFXIiwicG9zaXRpb25Mb2NhdGlvbiIsImdldEF0dHJpYkxvY2F0aW9uIiwidmVydGV4QXR0cmliUG9pbnRlciIsIkZMT0FUIiwiZW5hYmxlVmVydGV4QXR0cmliQXJyYXkiLCJmbGlwTG9jYXRpb24iLCJnZXRVbmlmb3JtTG9jYXRpb24iLCJ0ZXh0dXJlIiwiY3JlYXRlVGV4dHVyZSIsImFjdGl2ZVRleHR1cmUiLCJURVhUVVJFMCIsImJpbmRUZXh0dXJlIiwiVEVYVFVSRV8yRCIsInRleFBhcmFtZXRlcmkiLCJURVhUVVJFX1dSQVBfUyIsIkNMQU1QX1RPX0VER0UiLCJURVhUVVJFX1dSQVBfVCIsIlRFWFRVUkVfTUlOX0ZJTFRFUiIsIkxJTkVBUiIsIlRFWFRVUkVfTUFHX0ZJTFRFUiIsInBpeGVsQnVmIiwiVWludDhBcnJheSIsImdyYXlCdWYiLCJnZXRGcmFtZSIsInVuZGVmaW5lZCIsInVuaWZvcm0xZiIsInRleEltYWdlMkQiLCJSR0JBIiwiVU5TSUdORURfQllURSIsImRyYXdBcnJheXMiLCJUUklBTkdMRVMiLCJyZWFkUGl4ZWxzIiwiaiIsImkiLCJsZW5ndGgiLCJyZXF1ZXN0U3RyZWFtIiwiX3RoaXMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIm1lZGlhRGV2aWNlcyIsImdldFVzZXJNZWRpYSIsImFzcGVjdCIsImF1ZGlvIiwidmlkZW8iLCJpZGVhbCIsImFzcGVjdFJhdGlvIiwiZmFjaW5nTW9kZSIsInRoZW4iLCJzdHJlYW0iLCJfc3RyZWFtJGdldFRyYWNrcyQwJGciLCJnZXRUcmFja3MiLCJnZXRTZXR0aW5ncyIsImNvbnNvbGUiLCJsb2ciLCJjb25jYXQiLCJzcmNPYmplY3QiLCJvbmxvYWRlZG1ldGFkYXRhIiwiZSIsInBsYXkiLCJlcnIiXSwic291cmNlUm9vdCI6IiJ9