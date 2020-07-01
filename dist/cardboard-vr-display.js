(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.CardboardVRDisplay = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var MIN_TIMESTEP = 0.001;
  var MAX_TIMESTEP = 1;
  var lerp = function lerp(a, b, t) {
    return a + (b - a) * t;
  };
  var isIOS = function () {
    var isIOS = /iP(hone|ad)/i.test(navigator.platform) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    return function () {
      return isIOS;
    };
  }();
  var supportsIOSFullscreen = function (element) {
    return function (element) {
      return !!element.webkitRequestFullscreen;
    };
  }();
  var isWebViewAndroid = function () {
    var isWebViewAndroid = navigator.userAgent.indexOf('Version') !== -1 && navigator.userAgent.indexOf('Android') !== -1 && navigator.userAgent.indexOf('Chrome') !== -1;
    return function () {
      return isWebViewAndroid;
    };
  }();
  var isSafari = function () {
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    return function () {
      return isSafari;
    };
  }();
  var isFirefoxAndroid = function () {
    var isFirefoxAndroid = navigator.userAgent.indexOf('Firefox') !== -1 && navigator.userAgent.indexOf('Android') !== -1;
    return function () {
      return isFirefoxAndroid;
    };
  }();
  var getChromeVersion = function () {
    var match = navigator.userAgent.match(/.*Chrome\/([0-9]+)/);
    var value = match ? parseInt(match[1], 10) : null;
    return function () {
      return value;
    };
  }();
  var isChromeWithoutDeviceMotion = function () {
    var value = false;
    if (getChromeVersion() === 65) {
      var match = navigator.userAgent.match(/.*Chrome\/([0-9\.]*)/);
      if (match) {
        var _match$1$split = match[1].split('.'),
            _match$1$split2 = _slicedToArray(_match$1$split, 4),
            major = _match$1$split2[0],
            minor = _match$1$split2[1],
            branch = _match$1$split2[2],
            build = _match$1$split2[3];
        value = parseInt(branch, 10) === 3325 && parseInt(build, 10) < 148;
      }
    }
    return function () {
      return value;
    };
  }();
  var isR7 = function () {
    var isR7 = navigator.userAgent.indexOf('R7 Build') !== -1;
    return function () {
      return isR7;
    };
  }();
  var isLandscapeMode = function isLandscapeMode() {
    var rtn = window.orientation == 90 || window.orientation == -90;
    return isR7() ? !rtn : rtn;
  };
  var isTimestampDeltaValid = function isTimestampDeltaValid(timestampDeltaS) {
    if (isNaN(timestampDeltaS)) {
      return false;
    }
    if (timestampDeltaS <= MIN_TIMESTEP) {
      return false;
    }
    if (timestampDeltaS > MAX_TIMESTEP) {
      return false;
    }
    return true;
  };
  var getScreenWidth = function getScreenWidth() {
    return Math.max(window.screen.width, window.screen.height) * window.devicePixelRatio;
  };
  var getScreenHeight = function getScreenHeight() {
    return Math.min(window.screen.width, window.screen.height) * window.devicePixelRatio;
  };
  var requestFullscreen = function requestFullscreen(element) {
    if (isWebViewAndroid()) {
      return false;
    }
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    } else {
      return false;
    }
    return true;
  };
  var exitFullscreen = function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else {
      return false;
    }
    return true;
  };
  var getFullscreenElement = function getFullscreenElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
  };
  var linkProgram = function linkProgram(gl, vertexSource, fragmentSource, attribLocationMap) {
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    for (var attribName in attribLocationMap) {
      gl.bindAttribLocation(program, attribLocationMap[attribName], attribName);
    }
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return program;
  };
  var getProgramUniforms = function getProgramUniforms(gl, program) {
    var uniforms = {};
    var uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    var uniformName = '';
    for (var i = 0; i < uniformCount; i++) {
      var uniformInfo = gl.getActiveUniform(program, i);
      uniformName = uniformInfo.name.replace('[0]', '');
      uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
    }
    return uniforms;
  };
  var orthoMatrix = function orthoMatrix(out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right),
        bt = 1 / (bottom - top),
        nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
  };
  var isMobile = function isMobile() {
    var check = false;
    (function (a) {
      if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  };
  var extend = function extend(dest, src) {
    for (var key in src) {
      if (src.hasOwnProperty(key)) {
        dest[key] = src[key];
      }
    }
    return dest;
  };
  var safariCssSizeWorkaround = function safariCssSizeWorkaround(canvas) {
    if (isIOS()) {
      var width = canvas.style.width;
      var height = canvas.style.height;
      canvas.style.width = parseInt(width) + 1 + 'px';
      canvas.style.height = parseInt(height) + 'px';
      setTimeout(function () {
        canvas.style.width = width;
        canvas.style.height = height;
      }, 100);
    }
    window.canvas = canvas;
  };
  var frameDataFromPose = function () {
    var piOver180 = Math.PI / 180.0;
    var rad45 = Math.PI * 0.25;
    function mat4_perspectiveFromFieldOfView(out, fov, near, far) {
      var upTan = Math.tan(fov ? fov.upDegrees * piOver180 : rad45),
          downTan = Math.tan(fov ? fov.downDegrees * piOver180 : rad45),
          leftTan = Math.tan(fov ? fov.leftDegrees * piOver180 : rad45),
          rightTan = Math.tan(fov ? fov.rightDegrees * piOver180 : rad45),
          xScale = 2.0 / (leftTan + rightTan),
          yScale = 2.0 / (upTan + downTan);
      out[0] = xScale;
      out[1] = 0.0;
      out[2] = 0.0;
      out[3] = 0.0;
      out[4] = 0.0;
      out[5] = yScale;
      out[6] = 0.0;
      out[7] = 0.0;
      out[8] = -((leftTan - rightTan) * xScale * 0.5);
      out[9] = (upTan - downTan) * yScale * 0.5;
      out[10] = far / (near - far);
      out[11] = -1.0;
      out[12] = 0.0;
      out[13] = 0.0;
      out[14] = far * near / (near - far);
      out[15] = 0.0;
      return out;
    }
    function mat4_fromRotationTranslation(out, q, v) {
      var x = q[0],
          y = q[1],
          z = q[2],
          w = q[3],
          x2 = x + x,
          y2 = y + y,
          z2 = z + z,
          xx = x * x2,
          xy = x * y2,
          xz = x * z2,
          yy = y * y2,
          yz = y * z2,
          zz = z * z2,
          wx = w * x2,
          wy = w * y2,
          wz = w * z2;
      out[0] = 1 - (yy + zz);
      out[1] = xy + wz;
      out[2] = xz - wy;
      out[3] = 0;
      out[4] = xy - wz;
      out[5] = 1 - (xx + zz);
      out[6] = yz + wx;
      out[7] = 0;
      out[8] = xz + wy;
      out[9] = yz - wx;
      out[10] = 1 - (xx + yy);
      out[11] = 0;
      out[12] = v[0];
      out[13] = v[1];
      out[14] = v[2];
      out[15] = 1;
      return out;
    }
    function mat4_translate(out, a, v) {
      var x = v[0],
          y = v[1],
          z = v[2],
          a00,
          a01,
          a02,
          a03,
          a10,
          a11,
          a12,
          a13,
          a20,
          a21,
          a22,
          a23;
      if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
      } else {
        a00 = a[0];
        a01 = a[1];
        a02 = a[2];
        a03 = a[3];
        a10 = a[4];
        a11 = a[5];
        a12 = a[6];
        a13 = a[7];
        a20 = a[8];
        a21 = a[9];
        a22 = a[10];
        a23 = a[11];
        out[0] = a00;
        out[1] = a01;
        out[2] = a02;
        out[3] = a03;
        out[4] = a10;
        out[5] = a11;
        out[6] = a12;
        out[7] = a13;
        out[8] = a20;
        out[9] = a21;
        out[10] = a22;
        out[11] = a23;
        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
      }
      return out;
    }
    function mat4_invert(out, a) {
      var a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a03 = a[3],
          a10 = a[4],
          a11 = a[5],
          a12 = a[6],
          a13 = a[7],
          a20 = a[8],
          a21 = a[9],
          a22 = a[10],
          a23 = a[11],
          a30 = a[12],
          a31 = a[13],
          a32 = a[14],
          a33 = a[15],
          b00 = a00 * a11 - a01 * a10,
          b01 = a00 * a12 - a02 * a10,
          b02 = a00 * a13 - a03 * a10,
          b03 = a01 * a12 - a02 * a11,
          b04 = a01 * a13 - a03 * a11,
          b05 = a02 * a13 - a03 * a12,
          b06 = a20 * a31 - a21 * a30,
          b07 = a20 * a32 - a22 * a30,
          b08 = a20 * a33 - a23 * a30,
          b09 = a21 * a32 - a22 * a31,
          b10 = a21 * a33 - a23 * a31,
          b11 = a22 * a33 - a23 * a32,
      det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
      if (!det) {
        return null;
      }
      det = 1.0 / det;
      out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
      out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
      out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
      out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
      out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
      out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
      out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
      out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
      out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
      out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
      out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
      out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
      out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
      out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
      out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
      out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
      return out;
    }
    var defaultOrientation = new Float32Array([0, 0, 0, 1]);
    var defaultPosition = new Float32Array([0, 0, 0]);
    function updateEyeMatrices(projection, view, pose, fov, offset, vrDisplay) {
      mat4_perspectiveFromFieldOfView(projection, fov || null, vrDisplay.depthNear, vrDisplay.depthFar);
      var orientation = pose.orientation || defaultOrientation;
      var position = pose.position || defaultPosition;
      mat4_fromRotationTranslation(view, orientation, position);
      if (offset) mat4_translate(view, view, offset);
      mat4_invert(view, view);
    }
    return function (frameData, pose, vrDisplay) {
      if (!frameData || !pose) return false;
      frameData.pose = pose;
      frameData.timestamp = pose.timestamp;
      updateEyeMatrices(frameData.leftProjectionMatrix, frameData.leftViewMatrix, pose, vrDisplay._getFieldOfView("left"), vrDisplay._getEyeOffset("left"), vrDisplay);
      updateEyeMatrices(frameData.rightProjectionMatrix, frameData.rightViewMatrix, pose, vrDisplay._getFieldOfView("right"), vrDisplay._getEyeOffset("right"), vrDisplay);
      return true;
    };
  }();
  var isInsideCrossOriginIFrame = function isInsideCrossOriginIFrame() {
    var isFramed = window.self !== window.top;
    var refOrigin = getOriginFromUrl(document.referrer);
    var thisOrigin = getOriginFromUrl(window.location.href);
    return isFramed && refOrigin !== thisOrigin;
  };
  var getOriginFromUrl = function getOriginFromUrl(url) {
    var domainIdx;
    var protoSepIdx = url.indexOf("://");
    if (protoSepIdx !== -1) {
      domainIdx = protoSepIdx + 3;
    } else {
      domainIdx = 0;
    }
    var domainEndIdx = url.indexOf('/', domainIdx);
    if (domainEndIdx === -1) {
      domainEndIdx = url.length;
    }
    return url.substring(0, domainEndIdx);
  };
  var getQuaternionAngle = function getQuaternionAngle(quat) {
    if (quat.w > 1) {
      console.warn('getQuaternionAngle: w > 1');
      return 0;
    }
    var angle = 2 * Math.acos(quat.w);
    return angle;
  };
  var warnOnce = function () {
    var observedWarnings = {};
    return function (key, message) {
      if (observedWarnings[key] === undefined) {
        console.warn('webvr-polyfill: ' + message);
        observedWarnings[key] = true;
      }
    };
  }();

  function WGLUPreserveGLState(gl, bindings, callback) {
    if (!bindings) {
      callback(gl);
      return;
    }
    var boundValues = [];
    var activeTexture = null;
    for (var i = 0; i < bindings.length; ++i) {
      var binding = bindings[i];
      switch (binding) {
        case gl.TEXTURE_BINDING_2D:
        case gl.TEXTURE_BINDING_CUBE_MAP:
          var textureUnit = bindings[++i];
          if (textureUnit < gl.TEXTURE0 || textureUnit > gl.TEXTURE31) {
            console.error("TEXTURE_BINDING_2D or TEXTURE_BINDING_CUBE_MAP must be followed by a valid texture unit");
            boundValues.push(null, null);
            break;
          }
          if (!activeTexture) {
            activeTexture = gl.getParameter(gl.ACTIVE_TEXTURE);
          }
          gl.activeTexture(textureUnit);
          boundValues.push(gl.getParameter(binding), null);
          break;
        case gl.ACTIVE_TEXTURE:
          activeTexture = gl.getParameter(gl.ACTIVE_TEXTURE);
          boundValues.push(null);
          break;
        default:
          boundValues.push(gl.getParameter(binding));
          break;
      }
    }
    callback(gl);
    for (var i = 0; i < bindings.length; ++i) {
      var binding = bindings[i];
      var boundValue = boundValues[i];
      switch (binding) {
        case gl.ACTIVE_TEXTURE:
          break;
        case gl.ARRAY_BUFFER_BINDING:
          gl.bindBuffer(gl.ARRAY_BUFFER, boundValue);
          break;
        case gl.COLOR_CLEAR_VALUE:
          gl.clearColor(boundValue[0], boundValue[1], boundValue[2], boundValue[3]);
          break;
        case gl.COLOR_WRITEMASK:
          gl.colorMask(boundValue[0], boundValue[1], boundValue[2], boundValue[3]);
          break;
        case gl.CURRENT_PROGRAM:
          gl.useProgram(boundValue);
          break;
        case gl.ELEMENT_ARRAY_BUFFER_BINDING:
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boundValue);
          break;
        case gl.FRAMEBUFFER_BINDING:
          gl.bindFramebuffer(gl.FRAMEBUFFER, boundValue);
          break;
        case gl.RENDERBUFFER_BINDING:
          gl.bindRenderbuffer(gl.RENDERBUFFER, boundValue);
          break;
        case gl.TEXTURE_BINDING_2D:
          var textureUnit = bindings[++i];
          if (textureUnit < gl.TEXTURE0 || textureUnit > gl.TEXTURE31)
            break;
          gl.activeTexture(textureUnit);
          gl.bindTexture(gl.TEXTURE_2D, boundValue);
          break;
        case gl.TEXTURE_BINDING_CUBE_MAP:
          var textureUnit = bindings[++i];
          if (textureUnit < gl.TEXTURE0 || textureUnit > gl.TEXTURE31)
            break;
          gl.activeTexture(textureUnit);
          gl.bindTexture(gl.TEXTURE_CUBE_MAP, boundValue);
          break;
        case gl.VIEWPORT:
          gl.viewport(boundValue[0], boundValue[1], boundValue[2], boundValue[3]);
          break;
        case gl.BLEND:
        case gl.CULL_FACE:
        case gl.DEPTH_TEST:
        case gl.SCISSOR_TEST:
        case gl.STENCIL_TEST:
          if (boundValue) {
            gl.enable(binding);
          } else {
            gl.disable(binding);
          }
          break;
        default:
          console.log("No GL restore behavior for 0x" + binding.toString(16));
          break;
      }
      if (activeTexture) {
        gl.activeTexture(activeTexture);
      }
    }
  }
  var glPreserveState = WGLUPreserveGLState;

  var distortionVS = ['attribute vec2 position;', 'attribute vec3 texCoord;', 'varying vec2 vTexCoord;', 'uniform vec4 viewportOffsetScale[2];', 'void main() {', '  vec4 viewport = viewportOffsetScale[int(texCoord.z)];', '  vTexCoord = (texCoord.xy * viewport.zw) + viewport.xy;', '  gl_Position = vec4( position, 1.0, 1.0 );', '}'].join('\n');
  var distortionFS = ['precision mediump float;', 'uniform sampler2D diffuse;', 'varying vec2 vTexCoord;', 'void main() {', '  gl_FragColor = texture2D(diffuse, vTexCoord);', '}'].join('\n');
  function CardboardDistorter(gl, cardboardUI, bufferScale, dirtySubmitFrameBindings) {
    this.gl = gl;
    this.cardboardUI = cardboardUI;
    this.bufferScale = bufferScale;
    this.dirtySubmitFrameBindings = dirtySubmitFrameBindings;
    this.ctxAttribs = gl.getContextAttributes();
    this.meshWidth = 20;
    this.meshHeight = 20;
    this.bufferWidth = gl.drawingBufferWidth;
    this.bufferHeight = gl.drawingBufferHeight;
    this.realBindFramebuffer = gl.bindFramebuffer;
    this.realEnable = gl.enable;
    this.realDisable = gl.disable;
    this.realColorMask = gl.colorMask;
    this.realClearColor = gl.clearColor;
    this.realViewport = gl.viewport;
    if (!isIOS()) {
      this.realCanvasWidth = Object.getOwnPropertyDescriptor(gl.canvas.__proto__, 'width');
      this.realCanvasHeight = Object.getOwnPropertyDescriptor(gl.canvas.__proto__, 'height');
    }
    this.isPatched = false;
    this.lastBoundFramebuffer = null;
    this.cullFace = false;
    this.depthTest = false;
    this.blend = false;
    this.scissorTest = false;
    this.stencilTest = false;
    this.viewport = [0, 0, 0, 0];
    this.colorMask = [true, true, true, true];
    this.clearColor = [0, 0, 0, 0];
    this.attribs = {
      position: 0,
      texCoord: 1
    };
    this.program = linkProgram(gl, distortionVS, distortionFS, this.attribs);
    this.uniforms = getProgramUniforms(gl, this.program);
    this.viewportOffsetScale = new Float32Array(8);
    this.setTextureBounds();
    this.vertexBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();
    this.indexCount = 0;
    this.renderTarget = gl.createTexture();
    this.framebuffer = gl.createFramebuffer();
    this.depthStencilBuffer = null;
    this.depthBuffer = null;
    this.stencilBuffer = null;
    if (this.ctxAttribs.depth && this.ctxAttribs.stencil) {
      this.depthStencilBuffer = gl.createRenderbuffer();
    } else if (this.ctxAttribs.depth) {
      this.depthBuffer = gl.createRenderbuffer();
    } else if (this.ctxAttribs.stencil) {
      this.stencilBuffer = gl.createRenderbuffer();
    }
    this.patch();
    this.onResize();
  }
  CardboardDistorter.prototype.destroy = function () {
    var gl = this.gl;
    this.unpatch();
    gl.deleteProgram(this.program);
    gl.deleteBuffer(this.vertexBuffer);
    gl.deleteBuffer(this.indexBuffer);
    gl.deleteTexture(this.renderTarget);
    gl.deleteFramebuffer(this.framebuffer);
    if (this.depthStencilBuffer) {
      gl.deleteRenderbuffer(this.depthStencilBuffer);
    }
    if (this.depthBuffer) {
      gl.deleteRenderbuffer(this.depthBuffer);
    }
    if (this.stencilBuffer) {
      gl.deleteRenderbuffer(this.stencilBuffer);
    }
    if (this.cardboardUI) {
      this.cardboardUI.destroy();
    }
  };
  CardboardDistorter.prototype.onResize = function () {
    var gl = this.gl;
    var self = this;
    var glState = [gl.RENDERBUFFER_BINDING, gl.TEXTURE_BINDING_2D, gl.TEXTURE0];
    glPreserveState(gl, glState, function (gl) {
      self.realBindFramebuffer.call(gl, gl.FRAMEBUFFER, null);
      if (self.scissorTest) {
        self.realDisable.call(gl, gl.SCISSOR_TEST);
      }
      self.realColorMask.call(gl, true, true, true, true);
      self.realViewport.call(gl, 0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      self.realClearColor.call(gl, 0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      self.realBindFramebuffer.call(gl, gl.FRAMEBUFFER, self.framebuffer);
      gl.bindTexture(gl.TEXTURE_2D, self.renderTarget);
      gl.texImage2D(gl.TEXTURE_2D, 0, self.ctxAttribs.alpha ? gl.RGBA : gl.RGB, self.bufferWidth, self.bufferHeight, 0, self.ctxAttribs.alpha ? gl.RGBA : gl.RGB, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, self.renderTarget, 0);
      if (self.ctxAttribs.depth && self.ctxAttribs.stencil) {
        gl.bindRenderbuffer(gl.RENDERBUFFER, self.depthStencilBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, self.bufferWidth, self.bufferHeight);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, self.depthStencilBuffer);
      } else if (self.ctxAttribs.depth) {
        gl.bindRenderbuffer(gl.RENDERBUFFER, self.depthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, self.bufferWidth, self.bufferHeight);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, self.depthBuffer);
      } else if (self.ctxAttribs.stencil) {
        gl.bindRenderbuffer(gl.RENDERBUFFER, self.stencilBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.STENCIL_INDEX8, self.bufferWidth, self.bufferHeight);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.STENCIL_ATTACHMENT, gl.RENDERBUFFER, self.stencilBuffer);
      }
      if (!gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
        console.error('Framebuffer incomplete!');
      }
      self.realBindFramebuffer.call(gl, gl.FRAMEBUFFER, self.lastBoundFramebuffer);
      if (self.scissorTest) {
        self.realEnable.call(gl, gl.SCISSOR_TEST);
      }
      self.realColorMask.apply(gl, self.colorMask);
      self.realViewport.apply(gl, self.viewport);
      self.realClearColor.apply(gl, self.clearColor);
    });
    if (this.cardboardUI) {
      this.cardboardUI.onResize();
    }
  };
  CardboardDistorter.prototype.patch = function () {
    if (this.isPatched) {
      return;
    }
    var self = this;
    var canvas = this.gl.canvas;
    var gl = this.gl;
    if (!isIOS()) {
      canvas.width = getScreenWidth() * this.bufferScale;
      canvas.height = getScreenHeight() * this.bufferScale;
      Object.defineProperty(canvas, 'width', {
        configurable: true,
        enumerable: true,
        get: function get() {
          return self.bufferWidth;
        },
        set: function set(value) {
          self.bufferWidth = value;
          self.realCanvasWidth.set.call(canvas, value);
          self.onResize();
        }
      });
      Object.defineProperty(canvas, 'height', {
        configurable: true,
        enumerable: true,
        get: function get() {
          return self.bufferHeight;
        },
        set: function set(value) {
          self.bufferHeight = value;
          self.realCanvasHeight.set.call(canvas, value);
          self.onResize();
        }
      });
    }
    this.lastBoundFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
    if (this.lastBoundFramebuffer == null) {
      this.lastBoundFramebuffer = this.framebuffer;
      this.gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    }
    this.gl.bindFramebuffer = function (target, framebuffer) {
      self.lastBoundFramebuffer = framebuffer ? framebuffer : self.framebuffer;
      self.realBindFramebuffer.call(gl, target, self.lastBoundFramebuffer);
    };
    this.cullFace = gl.getParameter(gl.CULL_FACE);
    this.depthTest = gl.getParameter(gl.DEPTH_TEST);
    this.blend = gl.getParameter(gl.BLEND);
    this.scissorTest = gl.getParameter(gl.SCISSOR_TEST);
    this.stencilTest = gl.getParameter(gl.STENCIL_TEST);
    gl.enable = function (pname) {
      switch (pname) {
        case gl.CULL_FACE:
          self.cullFace = true;
          break;
        case gl.DEPTH_TEST:
          self.depthTest = true;
          break;
        case gl.BLEND:
          self.blend = true;
          break;
        case gl.SCISSOR_TEST:
          self.scissorTest = true;
          break;
        case gl.STENCIL_TEST:
          self.stencilTest = true;
          break;
      }
      self.realEnable.call(gl, pname);
    };
    gl.disable = function (pname) {
      switch (pname) {
        case gl.CULL_FACE:
          self.cullFace = false;
          break;
        case gl.DEPTH_TEST:
          self.depthTest = false;
          break;
        case gl.BLEND:
          self.blend = false;
          break;
        case gl.SCISSOR_TEST:
          self.scissorTest = false;
          break;
        case gl.STENCIL_TEST:
          self.stencilTest = false;
          break;
      }
      self.realDisable.call(gl, pname);
    };
    this.colorMask = gl.getParameter(gl.COLOR_WRITEMASK);
    gl.colorMask = function (r, g, b, a) {
      self.colorMask[0] = r;
      self.colorMask[1] = g;
      self.colorMask[2] = b;
      self.colorMask[3] = a;
      self.realColorMask.call(gl, r, g, b, a);
    };
    this.clearColor = gl.getParameter(gl.COLOR_CLEAR_VALUE);
    gl.clearColor = function (r, g, b, a) {
      self.clearColor[0] = r;
      self.clearColor[1] = g;
      self.clearColor[2] = b;
      self.clearColor[3] = a;
      self.realClearColor.call(gl, r, g, b, a);
    };
    this.viewport = gl.getParameter(gl.VIEWPORT);
    gl.viewport = function (x, y, w, h) {
      self.viewport[0] = x;
      self.viewport[1] = y;
      self.viewport[2] = w;
      self.viewport[3] = h;
      self.realViewport.call(gl, x, y, w, h);
    };
    this.isPatched = true;
    safariCssSizeWorkaround(canvas);
  };
  CardboardDistorter.prototype.unpatch = function () {
    if (!this.isPatched) {
      return;
    }
    var gl = this.gl;
    var canvas = this.gl.canvas;
    if (!isIOS()) {
      Object.defineProperty(canvas, 'width', this.realCanvasWidth);
      Object.defineProperty(canvas, 'height', this.realCanvasHeight);
    }
    canvas.width = this.bufferWidth;
    canvas.height = this.bufferHeight;
    gl.bindFramebuffer = this.realBindFramebuffer;
    gl.enable = this.realEnable;
    gl.disable = this.realDisable;
    gl.colorMask = this.realColorMask;
    gl.clearColor = this.realClearColor;
    gl.viewport = this.realViewport;
    if (this.lastBoundFramebuffer == this.framebuffer) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    this.isPatched = false;
    setTimeout(function () {
      safariCssSizeWorkaround(canvas);
    }, 1);
  };
  CardboardDistorter.prototype.setTextureBounds = function (leftBounds, rightBounds) {
    if (!leftBounds) {
      leftBounds = [0, 0, 0.5, 1];
    }
    if (!rightBounds) {
      rightBounds = [0.5, 0, 0.5, 1];
    }
    this.viewportOffsetScale[0] = leftBounds[0];
    this.viewportOffsetScale[1] = leftBounds[1];
    this.viewportOffsetScale[2] = leftBounds[2];
    this.viewportOffsetScale[3] = leftBounds[3];
    this.viewportOffsetScale[4] = rightBounds[0];
    this.viewportOffsetScale[5] = rightBounds[1];
    this.viewportOffsetScale[6] = rightBounds[2];
    this.viewportOffsetScale[7] = rightBounds[3];
  };
  CardboardDistorter.prototype.submitFrame = function () {
    var gl = this.gl;
    var self = this;
    var glState = [];
    if (!this.dirtySubmitFrameBindings) {
      glState.push(gl.CURRENT_PROGRAM, gl.ARRAY_BUFFER_BINDING, gl.ELEMENT_ARRAY_BUFFER_BINDING, gl.TEXTURE_BINDING_2D, gl.TEXTURE0);
    }
    glPreserveState(gl, glState, function (gl) {
      self.realBindFramebuffer.call(gl, gl.FRAMEBUFFER, null);
      if (self.cullFace) {
        self.realDisable.call(gl, gl.CULL_FACE);
      }
      if (self.depthTest) {
        self.realDisable.call(gl, gl.DEPTH_TEST);
      }
      if (self.blend) {
        self.realDisable.call(gl, gl.BLEND);
      }
      if (self.scissorTest) {
        self.realDisable.call(gl, gl.SCISSOR_TEST);
      }
      if (self.stencilTest) {
        self.realDisable.call(gl, gl.STENCIL_TEST);
      }
      self.realColorMask.call(gl, true, true, true, true);
      self.realViewport.call(gl, 0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      if (self.ctxAttribs.alpha || isIOS()) {
        self.realClearColor.call(gl, 0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      gl.useProgram(self.program);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, self.indexBuffer);
      gl.bindBuffer(gl.ARRAY_BUFFER, self.vertexBuffer);
      gl.enableVertexAttribArray(self.attribs.position);
      gl.enableVertexAttribArray(self.attribs.texCoord);
      gl.vertexAttribPointer(self.attribs.position, 2, gl.FLOAT, false, 20, 0);
      gl.vertexAttribPointer(self.attribs.texCoord, 3, gl.FLOAT, false, 20, 8);
      gl.activeTexture(gl.TEXTURE0);
      gl.uniform1i(self.uniforms.diffuse, 0);
      gl.bindTexture(gl.TEXTURE_2D, self.renderTarget);
      gl.uniform4fv(self.uniforms.viewportOffsetScale, self.viewportOffsetScale);
      gl.drawElements(gl.TRIANGLES, self.indexCount, gl.UNSIGNED_SHORT, 0);
      if (self.cardboardUI) {
        self.cardboardUI.renderNoState();
      }
      self.realBindFramebuffer.call(self.gl, gl.FRAMEBUFFER, self.framebuffer);
      if (!self.ctxAttribs.preserveDrawingBuffer) {
        self.realClearColor.call(gl, 0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      if (!self.dirtySubmitFrameBindings) {
        self.realBindFramebuffer.call(gl, gl.FRAMEBUFFER, self.lastBoundFramebuffer);
      }
      if (self.cullFace) {
        self.realEnable.call(gl, gl.CULL_FACE);
      }
      if (self.depthTest) {
        self.realEnable.call(gl, gl.DEPTH_TEST);
      }
      if (self.blend) {
        self.realEnable.call(gl, gl.BLEND);
      }
      if (self.scissorTest) {
        self.realEnable.call(gl, gl.SCISSOR_TEST);
      }
      if (self.stencilTest) {
        self.realEnable.call(gl, gl.STENCIL_TEST);
      }
      self.realColorMask.apply(gl, self.colorMask);
      self.realViewport.apply(gl, self.viewport);
      if (self.ctxAttribs.alpha || !self.ctxAttribs.preserveDrawingBuffer) {
        self.realClearColor.apply(gl, self.clearColor);
      }
    });
    if (isIOS()) {
      var canvas = gl.canvas;
      if (canvas.width != self.bufferWidth || canvas.height != self.bufferHeight) {
        self.bufferWidth = canvas.width;
        self.bufferHeight = canvas.height;
        self.onResize();
      }
    }
  };
  CardboardDistorter.prototype.updateDeviceInfo = function (deviceInfo) {
    var gl = this.gl;
    var self = this;
    var glState = [gl.ARRAY_BUFFER_BINDING, gl.ELEMENT_ARRAY_BUFFER_BINDING];
    glPreserveState(gl, glState, function (gl) {
      var vertices = self.computeMeshVertices_(self.meshWidth, self.meshHeight, deviceInfo);
      gl.bindBuffer(gl.ARRAY_BUFFER, self.vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
      if (!self.indexCount) {
        var indices = self.computeMeshIndices_(self.meshWidth, self.meshHeight);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, self.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        self.indexCount = indices.length;
      }
    });
  };
  CardboardDistorter.prototype.computeMeshVertices_ = function (width, height, deviceInfo) {
    var vertices = new Float32Array(2 * width * height * 5);
    var lensFrustum = deviceInfo.getLeftEyeVisibleTanAngles();
    var noLensFrustum = deviceInfo.getLeftEyeNoLensTanAngles();
    var viewport = deviceInfo.getLeftEyeVisibleScreenRect(noLensFrustum);
    var vidx = 0;
    for (var e = 0; e < 2; e++) {
      for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++, vidx++) {
          var u = i / (width - 1);
          var v = j / (height - 1);
          var s = u;
          var t = v;
          var x = lerp(lensFrustum[0], lensFrustum[2], u);
          var y = lerp(lensFrustum[3], lensFrustum[1], v);
          var d = Math.sqrt(x * x + y * y);
          var r = deviceInfo.distortion.distortInverse(d);
          var p = x * r / d;
          var q = y * r / d;
          u = (p - noLensFrustum[0]) / (noLensFrustum[2] - noLensFrustum[0]);
          v = (q - noLensFrustum[3]) / (noLensFrustum[1] - noLensFrustum[3]);
          var aspect = deviceInfo.device.widthMeters / deviceInfo.device.heightMeters;
          u = (viewport.x + u * viewport.width - 0.5) * 2.0;
          v = (viewport.y + v * viewport.height - 0.5) * 2.0;
          vertices[vidx * 5 + 0] = u;
          vertices[vidx * 5 + 1] = v;
          vertices[vidx * 5 + 2] = s;
          vertices[vidx * 5 + 3] = t;
          vertices[vidx * 5 + 4] = e;
        }
      }
      var w = lensFrustum[2] - lensFrustum[0];
      lensFrustum[0] = -(w + lensFrustum[0]);
      lensFrustum[2] = w - lensFrustum[2];
      w = noLensFrustum[2] - noLensFrustum[0];
      noLensFrustum[0] = -(w + noLensFrustum[0]);
      noLensFrustum[2] = w - noLensFrustum[2];
      viewport.x = 1 - (viewport.x + viewport.width);
    }
    return vertices;
  };
  CardboardDistorter.prototype.computeMeshIndices_ = function (width, height) {
    var indices = new Uint16Array(2 * (width - 1) * (height - 1) * 6);
    var halfwidth = width / 2;
    var halfheight = height / 2;
    var vidx = 0;
    var iidx = 0;
    for (var e = 0; e < 2; e++) {
      for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++, vidx++) {
          if (i == 0 || j == 0) continue;
          if (i <= halfwidth == j <= halfheight) {
            indices[iidx++] = vidx;
            indices[iidx++] = vidx - width - 1;
            indices[iidx++] = vidx - width;
            indices[iidx++] = vidx - width - 1;
            indices[iidx++] = vidx;
            indices[iidx++] = vidx - 1;
          } else {
            indices[iidx++] = vidx - 1;
            indices[iidx++] = vidx - width;
            indices[iidx++] = vidx;
            indices[iidx++] = vidx - width;
            indices[iidx++] = vidx - 1;
            indices[iidx++] = vidx - width - 1;
          }
        }
      }
    }
    return indices;
  };
  CardboardDistorter.prototype.getOwnPropertyDescriptor_ = function (proto, attrName) {
    var descriptor = Object.getOwnPropertyDescriptor(proto, attrName);
    if (descriptor.get === undefined || descriptor.set === undefined) {
      descriptor.configurable = true;
      descriptor.enumerable = true;
      descriptor.get = function () {
        return this.getAttribute(attrName);
      };
      descriptor.set = function (val) {
        this.setAttribute(attrName, val);
      };
    }
    return descriptor;
  };

  var uiVS = ['attribute vec2 position;', 'uniform mat4 projectionMat;', 'void main() {', '  gl_Position = projectionMat * vec4( position, -1.0, 1.0 );', '}'].join('\n');
  var uiFS = ['precision mediump float;', 'uniform vec4 color;', 'void main() {', '  gl_FragColor = color;', '}'].join('\n');
  var DEG2RAD = Math.PI / 180.0;
  var kAnglePerGearSection = 60;
  var kOuterRimEndAngle = 12;
  var kInnerRimBeginAngle = 20;
  var kOuterRadius = 1;
  var kMiddleRadius = 0.75;
  var kInnerRadius = 0.3125;
  var kCenterLineThicknessDp = 4;
  var kButtonWidthDp = 28;
  var kTouchSlopFactor = 1.5;
  function CardboardUI(gl) {
    this.gl = gl;
    this.attribs = {
      position: 0
    };
    this.program = linkProgram(gl, uiVS, uiFS, this.attribs);
    this.uniforms = getProgramUniforms(gl, this.program);
    this.vertexBuffer = gl.createBuffer();
    this.gearOffset = 0;
    this.gearVertexCount = 0;
    this.arrowOffset = 0;
    this.arrowVertexCount = 0;
    this.projMat = new Float32Array(16);
    this.listener = null;
    this.onResize();
  }
  CardboardUI.prototype.destroy = function () {
    var gl = this.gl;
    if (this.listener) {
      gl.canvas.removeEventListener('click', this.listener, false);
    }
    gl.deleteProgram(this.program);
    gl.deleteBuffer(this.vertexBuffer);
  };
  CardboardUI.prototype.listen = function (optionsCallback, backCallback) {
    var canvas = this.gl.canvas;
    this.listener = function (event) {
      var midline = canvas.clientWidth / 2;
      var buttonSize = kButtonWidthDp * kTouchSlopFactor;
      if (event.clientX > midline - buttonSize && event.clientX < midline + buttonSize && event.clientY > canvas.clientHeight - buttonSize) {
        optionsCallback(event);
      }
      else if (event.clientX < buttonSize && event.clientY < buttonSize) {
          backCallback(event);
        }
    };
    canvas.addEventListener('click', this.listener, false);
  };
  CardboardUI.prototype.onResize = function () {
    var gl = this.gl;
    var self = this;
    var glState = [gl.ARRAY_BUFFER_BINDING];
    glPreserveState(gl, glState, function (gl) {
      var vertices = [];
      var midline = gl.drawingBufferWidth / 2;
      var physicalPixels = Math.max(screen.width, screen.height) * window.devicePixelRatio;
      var scalingRatio = gl.drawingBufferWidth / physicalPixels;
      var dps = scalingRatio * window.devicePixelRatio;
      var lineWidth = kCenterLineThicknessDp * dps / 2;
      var buttonSize = kButtonWidthDp * kTouchSlopFactor * dps;
      var buttonScale = kButtonWidthDp * dps / 2;
      var buttonBorder = (kButtonWidthDp * kTouchSlopFactor - kButtonWidthDp) * dps;
      vertices.push(midline - lineWidth, buttonSize);
      vertices.push(midline - lineWidth, gl.drawingBufferHeight);
      vertices.push(midline + lineWidth, buttonSize);
      vertices.push(midline + lineWidth, gl.drawingBufferHeight);
      self.gearOffset = vertices.length / 2;
      function addGearSegment(theta, r) {
        var angle = (90 - theta) * DEG2RAD;
        var x = Math.cos(angle);
        var y = Math.sin(angle);
        vertices.push(kInnerRadius * x * buttonScale + midline, kInnerRadius * y * buttonScale + buttonScale);
        vertices.push(r * x * buttonScale + midline, r * y * buttonScale + buttonScale);
      }
      for (var i = 0; i <= 6; i++) {
        var segmentTheta = i * kAnglePerGearSection;
        addGearSegment(segmentTheta, kOuterRadius);
        addGearSegment(segmentTheta + kOuterRimEndAngle, kOuterRadius);
        addGearSegment(segmentTheta + kInnerRimBeginAngle, kMiddleRadius);
        addGearSegment(segmentTheta + (kAnglePerGearSection - kInnerRimBeginAngle), kMiddleRadius);
        addGearSegment(segmentTheta + (kAnglePerGearSection - kOuterRimEndAngle), kOuterRadius);
      }
      self.gearVertexCount = vertices.length / 2 - self.gearOffset;
      self.arrowOffset = vertices.length / 2;
      function addArrowVertex(x, y) {
        vertices.push(buttonBorder + x, gl.drawingBufferHeight - buttonBorder - y);
      }
      var angledLineWidth = lineWidth / Math.sin(45 * DEG2RAD);
      addArrowVertex(0, buttonScale);
      addArrowVertex(buttonScale, 0);
      addArrowVertex(buttonScale + angledLineWidth, angledLineWidth);
      addArrowVertex(angledLineWidth, buttonScale + angledLineWidth);
      addArrowVertex(angledLineWidth, buttonScale - angledLineWidth);
      addArrowVertex(0, buttonScale);
      addArrowVertex(buttonScale, buttonScale * 2);
      addArrowVertex(buttonScale + angledLineWidth, buttonScale * 2 - angledLineWidth);
      addArrowVertex(angledLineWidth, buttonScale - angledLineWidth);
      addArrowVertex(0, buttonScale);
      addArrowVertex(angledLineWidth, buttonScale - lineWidth);
      addArrowVertex(kButtonWidthDp * dps, buttonScale - lineWidth);
      addArrowVertex(angledLineWidth, buttonScale + lineWidth);
      addArrowVertex(kButtonWidthDp * dps, buttonScale + lineWidth);
      self.arrowVertexCount = vertices.length / 2 - self.arrowOffset;
      gl.bindBuffer(gl.ARRAY_BUFFER, self.vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    });
  };
  CardboardUI.prototype.render = function () {
    var gl = this.gl;
    var self = this;
    var glState = [gl.CULL_FACE, gl.DEPTH_TEST, gl.BLEND, gl.SCISSOR_TEST, gl.STENCIL_TEST, gl.COLOR_WRITEMASK, gl.VIEWPORT, gl.CURRENT_PROGRAM, gl.ARRAY_BUFFER_BINDING];
    glPreserveState(gl, glState, function (gl) {
      gl.disable(gl.CULL_FACE);
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.BLEND);
      gl.disable(gl.SCISSOR_TEST);
      gl.disable(gl.STENCIL_TEST);
      gl.colorMask(true, true, true, true);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      self.renderNoState();
    });
  };
  CardboardUI.prototype.renderNoState = function () {
    var gl = this.gl;
    gl.useProgram(this.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.enableVertexAttribArray(this.attribs.position);
    gl.vertexAttribPointer(this.attribs.position, 2, gl.FLOAT, false, 8, 0);
    gl.uniform4f(this.uniforms.color, 1.0, 1.0, 1.0, 1.0);
    orthoMatrix(this.projMat, 0, gl.drawingBufferWidth, 0, gl.drawingBufferHeight, 0.1, 1024.0);
    gl.uniformMatrix4fv(this.uniforms.projectionMat, false, this.projMat);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, this.gearOffset, this.gearVertexCount);
    gl.drawArrays(gl.TRIANGLE_STRIP, this.arrowOffset, this.arrowVertexCount);
  };

  function Distortion(coefficients) {
    this.coefficients = coefficients;
  }
  Distortion.prototype.distortInverse = function (radius) {
    var r0 = 0;
    var r1 = 1;
    var dr0 = radius - this.distort(r0);
    while (Math.abs(r1 - r0) > 0.0001
    ) {
      var dr1 = radius - this.distort(r1);
      var r2 = r1 - dr1 * ((r1 - r0) / (dr1 - dr0));
      r0 = r1;
      r1 = r2;
      dr0 = dr1;
    }
    return r1;
  };
  Distortion.prototype.distort = function (radius) {
    var r2 = radius * radius;
    var ret = 0;
    for (var i = 0; i < this.coefficients.length; i++) {
      ret = r2 * (ret + this.coefficients[i]);
    }
    return (ret + 1) * radius;
  };

  var degToRad = Math.PI / 180;
  var radToDeg = 180 / Math.PI;
  var Vector3 = function Vector3(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  };
  Vector3.prototype = {
    constructor: Vector3,
    set: function set(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
      return this;
    },
    copy: function copy(v) {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
      return this;
    },
    length: function length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    },
    normalize: function normalize() {
      var scalar = this.length();
      if (scalar !== 0) {
        var invScalar = 1 / scalar;
        this.multiplyScalar(invScalar);
      } else {
        this.x = 0;
        this.y = 0;
        this.z = 0;
      }
      return this;
    },
    multiplyScalar: function multiplyScalar(scalar) {
      this.x *= scalar;
      this.y *= scalar;
      this.z *= scalar;
    },
    applyQuaternion: function applyQuaternion(q) {
      var x = this.x;
      var y = this.y;
      var z = this.z;
      var qx = q.x;
      var qy = q.y;
      var qz = q.z;
      var qw = q.w;
      var ix = qw * x + qy * z - qz * y;
      var iy = qw * y + qz * x - qx * z;
      var iz = qw * z + qx * y - qy * x;
      var iw = -qx * x - qy * y - qz * z;
      this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
      this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
      this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
      return this;
    },
    dot: function dot(v) {
      return this.x * v.x + this.y * v.y + this.z * v.z;
    },
    crossVectors: function crossVectors(a, b) {
      var ax = a.x,
          ay = a.y,
          az = a.z;
      var bx = b.x,
          by = b.y,
          bz = b.z;
      this.x = ay * bz - az * by;
      this.y = az * bx - ax * bz;
      this.z = ax * by - ay * bx;
      return this;
    }
  };
  var Quaternion = function Quaternion(x, y, z, w) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w !== undefined ? w : 1;
  };
  Quaternion.prototype = {
    constructor: Quaternion,
    set: function set(x, y, z, w) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
      return this;
    },
    copy: function copy(quaternion) {
      this.x = quaternion.x;
      this.y = quaternion.y;
      this.z = quaternion.z;
      this.w = quaternion.w;
      return this;
    },
    setFromEulerXYZ: function setFromEulerXYZ(x, y, z) {
      var c1 = Math.cos(x / 2);
      var c2 = Math.cos(y / 2);
      var c3 = Math.cos(z / 2);
      var s1 = Math.sin(x / 2);
      var s2 = Math.sin(y / 2);
      var s3 = Math.sin(z / 2);
      this.x = s1 * c2 * c3 + c1 * s2 * s3;
      this.y = c1 * s2 * c3 - s1 * c2 * s3;
      this.z = c1 * c2 * s3 + s1 * s2 * c3;
      this.w = c1 * c2 * c3 - s1 * s2 * s3;
      return this;
    },
    setFromEulerYXZ: function setFromEulerYXZ(x, y, z) {
      var c1 = Math.cos(x / 2);
      var c2 = Math.cos(y / 2);
      var c3 = Math.cos(z / 2);
      var s1 = Math.sin(x / 2);
      var s2 = Math.sin(y / 2);
      var s3 = Math.sin(z / 2);
      this.x = s1 * c2 * c3 + c1 * s2 * s3;
      this.y = c1 * s2 * c3 - s1 * c2 * s3;
      this.z = c1 * c2 * s3 - s1 * s2 * c3;
      this.w = c1 * c2 * c3 + s1 * s2 * s3;
      return this;
    },
    setFromAxisAngle: function setFromAxisAngle(axis, angle) {
      var halfAngle = angle / 2,
          s = Math.sin(halfAngle);
      this.x = axis.x * s;
      this.y = axis.y * s;
      this.z = axis.z * s;
      this.w = Math.cos(halfAngle);
      return this;
    },
    multiply: function multiply(q) {
      return this.multiplyQuaternions(this, q);
    },
    multiplyQuaternions: function multiplyQuaternions(a, b) {
      var qax = a.x,
          qay = a.y,
          qaz = a.z,
          qaw = a.w;
      var qbx = b.x,
          qby = b.y,
          qbz = b.z,
          qbw = b.w;
      this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
      this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
      this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
      this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
      return this;
    },
    inverse: function inverse() {
      this.x *= -1;
      this.y *= -1;
      this.z *= -1;
      this.normalize();
      return this;
    },
    normalize: function normalize() {
      var l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
      if (l === 0) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 1;
      } else {
        l = 1 / l;
        this.x = this.x * l;
        this.y = this.y * l;
        this.z = this.z * l;
        this.w = this.w * l;
      }
      return this;
    },
    slerp: function slerp(qb, t) {
      if (t === 0) return this;
      if (t === 1) return this.copy(qb);
      var x = this.x,
          y = this.y,
          z = this.z,
          w = this.w;
      var cosHalfTheta = w * qb.w + x * qb.x + y * qb.y + z * qb.z;
      if (cosHalfTheta < 0) {
        this.w = -qb.w;
        this.x = -qb.x;
        this.y = -qb.y;
        this.z = -qb.z;
        cosHalfTheta = -cosHalfTheta;
      } else {
        this.copy(qb);
      }
      if (cosHalfTheta >= 1.0) {
        this.w = w;
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
      }
      var halfTheta = Math.acos(cosHalfTheta);
      var sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
      if (Math.abs(sinHalfTheta) < 0.001) {
        this.w = 0.5 * (w + this.w);
        this.x = 0.5 * (x + this.x);
        this.y = 0.5 * (y + this.y);
        this.z = 0.5 * (z + this.z);
        return this;
      }
      var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
          ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
      this.w = w * ratioA + this.w * ratioB;
      this.x = x * ratioA + this.x * ratioB;
      this.y = y * ratioA + this.y * ratioB;
      this.z = z * ratioA + this.z * ratioB;
      return this;
    },
    setFromUnitVectors: function () {
      var v1, r;
      var EPS = 0.000001;
      return function (vFrom, vTo) {
        if (v1 === undefined) v1 = new Vector3();
        r = vFrom.dot(vTo) + 1;
        if (r < EPS) {
          r = 0;
          if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
            v1.set(-vFrom.y, vFrom.x, 0);
          } else {
            v1.set(0, -vFrom.z, vFrom.y);
          }
        } else {
          v1.crossVectors(vFrom, vTo);
        }
        this.x = v1.x;
        this.y = v1.y;
        this.z = v1.z;
        this.w = r;
        this.normalize();
        return this;
      };
    }()
  };

  function Device(params) {
    this.width = params.width || getScreenWidth();
    this.height = params.height || getScreenHeight();
    this.widthMeters = params.widthMeters;
    this.heightMeters = params.heightMeters;
    this.bevelMeters = params.bevelMeters;
  }
  var DEFAULT_ANDROID = new Device({
    widthMeters: 0.110,
    heightMeters: 0.062,
    bevelMeters: 0.004
  });
  var DEFAULT_IOS = new Device({
    widthMeters: 0.1038,
    heightMeters: 0.0584,
    bevelMeters: 0.004
  });
  var Viewers = {
    CardboardV1: new CardboardViewer({
      id: 'CardboardV1',
      label: 'Cardboard I/O 2014',
      fov: 40,
      interLensDistance: 0.060,
      baselineLensDistance: 0.035,
      screenLensDistance: 0.042,
      distortionCoefficients: [0.441, 0.156],
      inverseCoefficients: [-0.4410035, 0.42756155, -0.4804439, 0.5460139, -0.58821183, 0.5733938, -0.48303202, 0.33299083, -0.17573841, 0.0651772, -0.01488963, 0.001559834]
    }),
    CardboardV2: new CardboardViewer({
      id: 'CardboardV2',
      label: 'Cardboard I/O 2015',
      fov: 60,
      interLensDistance: 0.064,
      baselineLensDistance: 0.035,
      screenLensDistance: 0.039,
      distortionCoefficients: [0.34, 0.55],
      inverseCoefficients: [-0.33836704, -0.18162185, 0.862655, -1.2462051, 1.0560602, -0.58208317, 0.21609078, -0.05444823, 0.009177956, -9.904169E-4, 6.183535E-5, -1.6981803E-6]
    })
  };
  function DeviceInfo(deviceParams) {
    this.viewer = Viewers.CardboardV2;
    this.updateDeviceParams(deviceParams);
    this.distortion = new Distortion(this.viewer.distortionCoefficients);
  }
  DeviceInfo.prototype.updateDeviceParams = function (deviceParams) {
    this.device = this.determineDevice_(deviceParams) || this.device;
  };
  DeviceInfo.prototype.getDevice = function () {
    return this.device;
  };
  DeviceInfo.prototype.setViewer = function (viewer) {
    this.viewer = viewer;
    this.distortion = new Distortion(this.viewer.distortionCoefficients);
  };
  DeviceInfo.prototype.determineDevice_ = function (deviceParams) {
    if (!deviceParams) {
      if (isIOS()) {
        console.warn('Using fallback iOS device measurements.');
        return DEFAULT_IOS;
      } else {
        console.warn('Using fallback Android device measurements.');
        return DEFAULT_ANDROID;
      }
    }
    var METERS_PER_INCH = 0.0254;
    var metersPerPixelX = METERS_PER_INCH / deviceParams.xdpi;
    var metersPerPixelY = METERS_PER_INCH / deviceParams.ydpi;
    var width = getScreenWidth();
    var height = getScreenHeight();
    return new Device({
      widthMeters: metersPerPixelX * width,
      heightMeters: metersPerPixelY * height,
      bevelMeters: deviceParams.bevelMm * 0.001
    });
  };
  DeviceInfo.prototype.getDistortedFieldOfViewLeftEye = function () {
    var viewer = this.viewer;
    var device = this.device;
    var distortion = this.distortion;
    var eyeToScreenDistance = viewer.screenLensDistance;
    var outerDist = (device.widthMeters - viewer.interLensDistance) / 2;
    var innerDist = viewer.interLensDistance / 2;
    var bottomDist = viewer.baselineLensDistance - device.bevelMeters;
    var topDist = device.heightMeters - bottomDist;
    var outerAngle = radToDeg * Math.atan(distortion.distort(outerDist / eyeToScreenDistance));
    var innerAngle = radToDeg * Math.atan(distortion.distort(innerDist / eyeToScreenDistance));
    var bottomAngle = radToDeg * Math.atan(distortion.distort(bottomDist / eyeToScreenDistance));
    var topAngle = radToDeg * Math.atan(distortion.distort(topDist / eyeToScreenDistance));
    return {
      leftDegrees: Math.min(outerAngle, viewer.fov),
      rightDegrees: Math.min(innerAngle, viewer.fov),
      downDegrees: Math.min(bottomAngle, viewer.fov),
      upDegrees: Math.min(topAngle, viewer.fov)
    };
  };
  DeviceInfo.prototype.getLeftEyeVisibleTanAngles = function () {
    var viewer = this.viewer;
    var device = this.device;
    var distortion = this.distortion;
    var fovLeft = Math.tan(-degToRad * viewer.fov);
    var fovTop = Math.tan(degToRad * viewer.fov);
    var fovRight = Math.tan(degToRad * viewer.fov);
    var fovBottom = Math.tan(-degToRad * viewer.fov);
    var halfWidth = device.widthMeters / 4;
    var halfHeight = device.heightMeters / 2;
    var verticalLensOffset = viewer.baselineLensDistance - device.bevelMeters - halfHeight;
    var centerX = viewer.interLensDistance / 2 - halfWidth;
    var centerY = -verticalLensOffset;
    var centerZ = viewer.screenLensDistance;
    var screenLeft = distortion.distort((centerX - halfWidth) / centerZ);
    var screenTop = distortion.distort((centerY + halfHeight) / centerZ);
    var screenRight = distortion.distort((centerX + halfWidth) / centerZ);
    var screenBottom = distortion.distort((centerY - halfHeight) / centerZ);
    var result = new Float32Array(4);
    result[0] = Math.max(fovLeft, screenLeft);
    result[1] = Math.min(fovTop, screenTop);
    result[2] = Math.min(fovRight, screenRight);
    result[3] = Math.max(fovBottom, screenBottom);
    return result;
  };
  DeviceInfo.prototype.getLeftEyeNoLensTanAngles = function () {
    var viewer = this.viewer;
    var device = this.device;
    var distortion = this.distortion;
    var result = new Float32Array(4);
    var fovLeft = distortion.distortInverse(Math.tan(-degToRad * viewer.fov));
    var fovTop = distortion.distortInverse(Math.tan(degToRad * viewer.fov));
    var fovRight = distortion.distortInverse(Math.tan(degToRad * viewer.fov));
    var fovBottom = distortion.distortInverse(Math.tan(-degToRad * viewer.fov));
    var halfWidth = device.widthMeters / 4;
    var halfHeight = device.heightMeters / 2;
    var verticalLensOffset = viewer.baselineLensDistance - device.bevelMeters - halfHeight;
    var centerX = viewer.interLensDistance / 2 - halfWidth;
    var centerY = -verticalLensOffset;
    var centerZ = viewer.screenLensDistance;
    var screenLeft = (centerX - halfWidth) / centerZ;
    var screenTop = (centerY + halfHeight) / centerZ;
    var screenRight = (centerX + halfWidth) / centerZ;
    var screenBottom = (centerY - halfHeight) / centerZ;
    result[0] = Math.max(fovLeft, screenLeft);
    result[1] = Math.min(fovTop, screenTop);
    result[2] = Math.min(fovRight, screenRight);
    result[3] = Math.max(fovBottom, screenBottom);
    return result;
  };
  DeviceInfo.prototype.getLeftEyeVisibleScreenRect = function (undistortedFrustum) {
    var viewer = this.viewer;
    var device = this.device;
    var dist = viewer.screenLensDistance;
    var eyeX = (device.widthMeters - viewer.interLensDistance) / 2;
    var eyeY = viewer.baselineLensDistance - device.bevelMeters;
    var left = (undistortedFrustum[0] * dist + eyeX) / device.widthMeters;
    var top = (undistortedFrustum[1] * dist + eyeY) / device.heightMeters;
    var right = (undistortedFrustum[2] * dist + eyeX) / device.widthMeters;
    var bottom = (undistortedFrustum[3] * dist + eyeY) / device.heightMeters;
    return {
      x: left,
      y: bottom,
      width: right - left,
      height: top - bottom
    };
  };
  DeviceInfo.prototype.getFieldOfViewLeftEye = function (opt_isUndistorted) {
    return opt_isUndistorted ? this.getUndistortedFieldOfViewLeftEye() : this.getDistortedFieldOfViewLeftEye();
  };
  DeviceInfo.prototype.getFieldOfViewRightEye = function (opt_isUndistorted) {
    var fov = this.getFieldOfViewLeftEye(opt_isUndistorted);
    return {
      leftDegrees: fov.rightDegrees,
      rightDegrees: fov.leftDegrees,
      upDegrees: fov.upDegrees,
      downDegrees: fov.downDegrees
    };
  };
  DeviceInfo.prototype.getUndistortedFieldOfViewLeftEye = function () {
    var p = this.getUndistortedParams_();
    return {
      leftDegrees: radToDeg * Math.atan(p.outerDist),
      rightDegrees: radToDeg * Math.atan(p.innerDist),
      downDegrees: radToDeg * Math.atan(p.bottomDist),
      upDegrees: radToDeg * Math.atan(p.topDist)
    };
  };
  DeviceInfo.prototype.getUndistortedViewportLeftEye = function () {
    var p = this.getUndistortedParams_();
    var viewer = this.viewer;
    var device = this.device;
    var eyeToScreenDistance = viewer.screenLensDistance;
    var screenWidth = device.widthMeters / eyeToScreenDistance;
    var screenHeight = device.heightMeters / eyeToScreenDistance;
    var xPxPerTanAngle = device.width / screenWidth;
    var yPxPerTanAngle = device.height / screenHeight;
    var x = Math.round((p.eyePosX - p.outerDist) * xPxPerTanAngle);
    var y = Math.round((p.eyePosY - p.bottomDist) * yPxPerTanAngle);
    return {
      x: x,
      y: y,
      width: Math.round((p.eyePosX + p.innerDist) * xPxPerTanAngle) - x,
      height: Math.round((p.eyePosY + p.topDist) * yPxPerTanAngle) - y
    };
  };
  DeviceInfo.prototype.getUndistortedParams_ = function () {
    var viewer = this.viewer;
    var device = this.device;
    var distortion = this.distortion;
    var eyeToScreenDistance = viewer.screenLensDistance;
    var halfLensDistance = viewer.interLensDistance / 2 / eyeToScreenDistance;
    var screenWidth = device.widthMeters / eyeToScreenDistance;
    var screenHeight = device.heightMeters / eyeToScreenDistance;
    var eyePosX = screenWidth / 2 - halfLensDistance;
    var eyePosY = (viewer.baselineLensDistance - device.bevelMeters) / eyeToScreenDistance;
    var maxFov = viewer.fov;
    var viewerMax = distortion.distortInverse(Math.tan(degToRad * maxFov));
    var outerDist = Math.min(eyePosX, viewerMax);
    var innerDist = Math.min(halfLensDistance, viewerMax);
    var bottomDist = Math.min(eyePosY, viewerMax);
    var topDist = Math.min(screenHeight - eyePosY, viewerMax);
    return {
      outerDist: outerDist,
      innerDist: innerDist,
      topDist: topDist,
      bottomDist: bottomDist,
      eyePosX: eyePosX,
      eyePosY: eyePosY
    };
  };
  function CardboardViewer(params) {
    this.id = params.id;
    this.label = params.label;
    this.fov = params.fov;
    this.interLensDistance = params.interLensDistance;
    this.baselineLensDistance = params.baselineLensDistance;
    this.screenLensDistance = params.screenLensDistance;
    this.distortionCoefficients = params.distortionCoefficients;
    this.inverseCoefficients = params.inverseCoefficients;
  }
  DeviceInfo.Viewers = Viewers;

  var format = 1;
  var last_updated = "2019-11-09T17:36:14Z";
  var devices = [
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "asus/*/Nexus 7/*"
  			},
  			{
  				ua: "Nexus 7"
  			}
  		],
  		dpi: [
  			320.8,
  			323
  		],
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "asus/*/ASUS_X00PD/*"
  			},
  			{
  				ua: "ASUS_X00PD"
  			}
  		],
  		dpi: 245,
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "asus/*/ASUS_X008D/*"
  			},
  			{
  				ua: "ASUS_X008D"
  			}
  		],
  		dpi: 282,
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "asus/*/ASUS_Z00AD/*"
  			},
  			{
  				ua: "ASUS_Z00AD"
  			}
  		],
  		dpi: [
  			403,
  			404.6
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "Google/*/Pixel 2 XL/*"
  			},
  			{
  				ua: "Pixel 2 XL"
  			}
  		],
  		dpi: 537.9,
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "Google/*/Pixel 3 XL/*"
  			},
  			{
  				ua: "Pixel 3 XL"
  			}
  		],
  		dpi: [
  			558.5,
  			553.8
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "Google/*/Pixel XL/*"
  			},
  			{
  				ua: "Pixel XL"
  			}
  		],
  		dpi: [
  			537.9,
  			533
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "Google/*/Pixel 3/*"
  			},
  			{
  				ua: "Pixel 3"
  			}
  		],
  		dpi: 442.4,
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "Google/*/Pixel 2/*"
  			},
  			{
  				ua: "Pixel 2"
  			}
  		],
  		dpi: 441,
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "Google/*/Pixel/*"
  			},
  			{
  				ua: "Pixel"
  			}
  		],
  		dpi: [
  			432.6,
  			436.7
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "HTC/*/HTC6435LVW/*"
  			},
  			{
  				ua: "HTC6435LVW"
  			}
  		],
  		dpi: [
  			449.7,
  			443.3
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "HTC/*/HTC One XL/*"
  			},
  			{
  				ua: "HTC One XL"
  			}
  		],
  		dpi: [
  			315.3,
  			314.6
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "htc/*/Nexus 9/*"
  			},
  			{
  				ua: "Nexus 9"
  			}
  		],
  		dpi: 289,
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "HTC/*/HTC One M9/*"
  			},
  			{
  				ua: "HTC One M9"
  			}
  		],
  		dpi: [
  			442.5,
  			443.3
  		],
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "HTC/*/HTC One_M8/*"
  			},
  			{
  				ua: "HTC One_M8"
  			}
  		],
  		dpi: [
  			449.7,
  			447.4
  		],
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "HTC/*/HTC One/*"
  			},
  			{
  				ua: "HTC One"
  			}
  		],
  		dpi: 472.8,
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "Huawei/*/Nexus 6P/*"
  			},
  			{
  				ua: "Nexus 6P"
  			}
  		],
  		dpi: [
  			515.1,
  			518
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "Huawei/*/BLN-L24/*"
  			},
  			{
  				ua: "HONORBLN-L24"
  			}
  		],
  		dpi: 480,
  		bw: 4,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "Huawei/*/BKL-L09/*"
  			},
  			{
  				ua: "BKL-L09"
  			}
  		],
  		dpi: 403,
  		bw: 3.47,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "LENOVO/*/Lenovo PB2-690Y/*"
  			},
  			{
  				ua: "Lenovo PB2-690Y"
  			}
  		],
  		dpi: [
  			457.2,
  			454.713
  		],
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "LGE/*/Nexus 5X/*"
  			},
  			{
  				ua: "Nexus 5X"
  			}
  		],
  		dpi: [
  			422,
  			419.9
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "LGE/*/LGMS345/*"
  			},
  			{
  				ua: "LGMS345"
  			}
  		],
  		dpi: [
  			221.7,
  			219.1
  		],
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "LGE/*/LG-D800/*"
  			},
  			{
  				ua: "LG-D800"
  			}
  		],
  		dpi: [
  			422,
  			424.1
  		],
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "LGE/*/LG-D850/*"
  			},
  			{
  				ua: "LG-D850"
  			}
  		],
  		dpi: [
  			537.9,
  			541.9
  		],
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "LGE/*/VS985 4G/*"
  			},
  			{
  				ua: "VS985 4G"
  			}
  		],
  		dpi: [
  			537.9,
  			535.6
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "LGE/*/Nexus 5/*"
  			},
  			{
  				ua: "Nexus 5 B"
  			}
  		],
  		dpi: [
  			442.4,
  			444.8
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "LGE/*/Nexus 4/*"
  			},
  			{
  				ua: "Nexus 4"
  			}
  		],
  		dpi: [
  			319.8,
  			318.4
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "LGE/*/LG-P769/*"
  			},
  			{
  				ua: "LG-P769"
  			}
  		],
  		dpi: [
  			240.6,
  			247.5
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "LGE/*/LGMS323/*"
  			},
  			{
  				ua: "LGMS323"
  			}
  		],
  		dpi: [
  			206.6,
  			204.6
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "LGE/*/LGLS996/*"
  			},
  			{
  				ua: "LGLS996"
  			}
  		],
  		dpi: [
  			403.4,
  			401.5
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "Micromax/*/4560MMX/*"
  			},
  			{
  				ua: "4560MMX"
  			}
  		],
  		dpi: [
  			240,
  			219.4
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "Micromax/*/A250/*"
  			},
  			{
  				ua: "Micromax A250"
  			}
  		],
  		dpi: [
  			480,
  			446.4
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "Micromax/*/Micromax AQ4501/*"
  			},
  			{
  				ua: "Micromax AQ4501"
  			}
  		],
  		dpi: 240,
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "motorola/*/G5/*"
  			},
  			{
  				ua: "Moto G (5) Plus"
  			}
  		],
  		dpi: [
  			403.4,
  			403
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "motorola/*/DROID RAZR/*"
  			},
  			{
  				ua: "DROID RAZR"
  			}
  		],
  		dpi: [
  			368.1,
  			256.7
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "motorola/*/XT830C/*"
  			},
  			{
  				ua: "XT830C"
  			}
  		],
  		dpi: [
  			254,
  			255.9
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "motorola/*/XT1021/*"
  			},
  			{
  				ua: "XT1021"
  			}
  		],
  		dpi: [
  			254,
  			256.7
  		],
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "motorola/*/XT1023/*"
  			},
  			{
  				ua: "XT1023"
  			}
  		],
  		dpi: [
  			254,
  			256.7
  		],
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "motorola/*/XT1028/*"
  			},
  			{
  				ua: "XT1028"
  			}
  		],
  		dpi: [
  			326.6,
  			327.6
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "motorola/*/XT1034/*"
  			},
  			{
  				ua: "XT1034"
  			}
  		],
  		dpi: [
  			326.6,
  			328.4
  		],
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "motorola/*/XT1053/*"
  			},
  			{
  				ua: "XT1053"
  			}
  		],
  		dpi: [
  			315.3,
  			316.1
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "motorola/*/XT1562/*"
  			},
  			{
  				ua: "XT1562"
  			}
  		],
  		dpi: [
  			403.4,
  			402.7
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "motorola/*/Nexus 6/*"
  			},
  			{
  				ua: "Nexus 6 B"
  			}
  		],
  		dpi: [
  			494.3,
  			489.7
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "motorola/*/XT1063/*"
  			},
  			{
  				ua: "XT1063"
  			}
  		],
  		dpi: [
  			295,
  			296.6
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "motorola/*/XT1064/*"
  			},
  			{
  				ua: "XT1064"
  			}
  		],
  		dpi: [
  			295,
  			295.6
  		],
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "motorola/*/XT1092/*"
  			},
  			{
  				ua: "XT1092"
  			}
  		],
  		dpi: [
  			422,
  			424.1
  		],
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "motorola/*/XT1095/*"
  			},
  			{
  				ua: "XT1095"
  			}
  		],
  		dpi: [
  			422,
  			423.4
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "motorola/*/G4/*"
  			},
  			{
  				ua: "Moto G (4)"
  			}
  		],
  		dpi: 401,
  		bw: 4,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "OnePlus/*/A0001/*"
  			},
  			{
  				ua: "A0001"
  			}
  		],
  		dpi: [
  			403.4,
  			401
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "OnePlus/*/ONE E1001/*"
  			},
  			{
  				ua: "ONE E1001"
  			}
  		],
  		dpi: [
  			442.4,
  			441.4
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "OnePlus/*/ONE E1003/*"
  			},
  			{
  				ua: "ONE E1003"
  			}
  		],
  		dpi: [
  			442.4,
  			441.4
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "OnePlus/*/ONE E1005/*"
  			},
  			{
  				ua: "ONE E1005"
  			}
  		],
  		dpi: [
  			442.4,
  			441.4
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "OnePlus/*/ONE A2001/*"
  			},
  			{
  				ua: "ONE A2001"
  			}
  		],
  		dpi: [
  			391.9,
  			405.4
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "OnePlus/*/ONE A2003/*"
  			},
  			{
  				ua: "ONE A2003"
  			}
  		],
  		dpi: [
  			391.9,
  			405.4
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "OnePlus/*/ONE A2005/*"
  			},
  			{
  				ua: "ONE A2005"
  			}
  		],
  		dpi: [
  			391.9,
  			405.4
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "OnePlus/*/ONEPLUS A3000/*"
  			},
  			{
  				ua: "ONEPLUS A3000"
  			}
  		],
  		dpi: 401,
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "OnePlus/*/ONEPLUS A3003/*"
  			},
  			{
  				ua: "ONEPLUS A3003"
  			}
  		],
  		dpi: 401,
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "OnePlus/*/ONEPLUS A3010/*"
  			},
  			{
  				ua: "ONEPLUS A3010"
  			}
  		],
  		dpi: 401,
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "OnePlus/*/ONEPLUS A5000/*"
  			},
  			{
  				ua: "ONEPLUS A5000 "
  			}
  		],
  		dpi: [
  			403.411,
  			399.737
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "OnePlus/*/ONE A5010/*"
  			},
  			{
  				ua: "ONEPLUS A5010"
  			}
  		],
  		dpi: [
  			403,
  			400
  		],
  		bw: 2,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "OnePlus/*/ONEPLUS A6000/*"
  			},
  			{
  				ua: "ONEPLUS A6000"
  			}
  		],
  		dpi: 401,
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "OnePlus/*/ONEPLUS A6003/*"
  			},
  			{
  				ua: "ONEPLUS A6003"
  			}
  		],
  		dpi: 401,
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "OnePlus/*/ONEPLUS A6010/*"
  			},
  			{
  				ua: "ONEPLUS A6010"
  			}
  		],
  		dpi: 401,
  		bw: 2,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "OnePlus/*/ONEPLUS A6013/*"
  			},
  			{
  				ua: "ONEPLUS A6013"
  			}
  		],
  		dpi: 401,
  		bw: 2,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "OPPO/*/X909/*"
  			},
  			{
  				ua: "X909"
  			}
  		],
  		dpi: [
  			442.4,
  			444.1
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/GT-I9082/*"
  			},
  			{
  				ua: "GT-I9082"
  			}
  		],
  		dpi: [
  			184.7,
  			185.4
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G360P/*"
  			},
  			{
  				ua: "SM-G360P"
  			}
  		],
  		dpi: [
  			196.7,
  			205.4
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/Nexus S/*"
  			},
  			{
  				ua: "Nexus S"
  			}
  		],
  		dpi: [
  			234.5,
  			229.8
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/GT-I9300/*"
  			},
  			{
  				ua: "GT-I9300"
  			}
  		],
  		dpi: [
  			304.8,
  			303.9
  		],
  		bw: 5,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-T230NU/*"
  			},
  			{
  				ua: "SM-T230NU"
  			}
  		],
  		dpi: 216,
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SGH-T399/*"
  			},
  			{
  				ua: "SGH-T399"
  			}
  		],
  		dpi: [
  			217.7,
  			231.4
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SGH-M919/*"
  			},
  			{
  				ua: "SGH-M919"
  			}
  		],
  		dpi: [
  			440.8,
  			437.7
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-N9005/*"
  			},
  			{
  				ua: "SM-N9005"
  			}
  		],
  		dpi: [
  			386.4,
  			387
  		],
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SAMSUNG-SM-N900A/*"
  			},
  			{
  				ua: "SAMSUNG-SM-N900A"
  			}
  		],
  		dpi: [
  			386.4,
  			387.7
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/GT-I9500/*"
  			},
  			{
  				ua: "GT-I9500"
  			}
  		],
  		dpi: [
  			442.5,
  			443.3
  		],
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/GT-I9505/*"
  			},
  			{
  				ua: "GT-I9505"
  			}
  		],
  		dpi: 439.4,
  		bw: 4,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G900F/*"
  			},
  			{
  				ua: "SM-G900F"
  			}
  		],
  		dpi: [
  			415.6,
  			431.6
  		],
  		bw: 5,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G900M/*"
  			},
  			{
  				ua: "SM-G900M"
  			}
  		],
  		dpi: [
  			415.6,
  			431.6
  		],
  		bw: 5,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G800F/*"
  			},
  			{
  				ua: "SM-G800F"
  			}
  		],
  		dpi: 326.8,
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G906S/*"
  			},
  			{
  				ua: "SM-G906S"
  			}
  		],
  		dpi: [
  			562.7,
  			572.4
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/GT-I9300/*"
  			},
  			{
  				ua: "GT-I9300"
  			}
  		],
  		dpi: [
  			306.7,
  			304.8
  		],
  		bw: 5,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-T535/*"
  			},
  			{
  				ua: "SM-T535"
  			}
  		],
  		dpi: [
  			142.6,
  			136.4
  		],
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-N920C/*"
  			},
  			{
  				ua: "SM-N920C"
  			}
  		],
  		dpi: [
  			515.1,
  			518.4
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-N920P/*"
  			},
  			{
  				ua: "SM-N920P"
  			}
  		],
  		dpi: [
  			386.3655,
  			390.144
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-N920W8/*"
  			},
  			{
  				ua: "SM-N920W8"
  			}
  		],
  		dpi: [
  			515.1,
  			518.4
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/GT-I9300I/*"
  			},
  			{
  				ua: "GT-I9300I"
  			}
  		],
  		dpi: [
  			304.8,
  			305.8
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/GT-I9195/*"
  			},
  			{
  				ua: "GT-I9195"
  			}
  		],
  		dpi: [
  			249.4,
  			256.7
  		],
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SPH-L520/*"
  			},
  			{
  				ua: "SPH-L520"
  			}
  		],
  		dpi: [
  			249.4,
  			255.9
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SAMSUNG-SGH-I717/*"
  			},
  			{
  				ua: "SAMSUNG-SGH-I717"
  			}
  		],
  		dpi: 285.8,
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SPH-D710/*"
  			},
  			{
  				ua: "SPH-D710"
  			}
  		],
  		dpi: [
  			217.7,
  			204.2
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/GT-N7100/*"
  			},
  			{
  				ua: "GT-N7100"
  			}
  		],
  		dpi: 265.1,
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SCH-I605/*"
  			},
  			{
  				ua: "SCH-I605"
  			}
  		],
  		dpi: 265.1,
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/Galaxy Nexus/*"
  			},
  			{
  				ua: "Galaxy Nexus"
  			}
  		],
  		dpi: [
  			315.3,
  			314.2
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-N910H/*"
  			},
  			{
  				ua: "SM-N910H"
  			}
  		],
  		dpi: [
  			515.1,
  			518
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-N910C/*"
  			},
  			{
  				ua: "SM-N910C"
  			}
  		],
  		dpi: [
  			515.2,
  			520.2
  		],
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G130M/*"
  			},
  			{
  				ua: "SM-G130M"
  			}
  		],
  		dpi: [
  			165.9,
  			164.8
  		],
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G928I/*"
  			},
  			{
  				ua: "SM-G928I"
  			}
  		],
  		dpi: [
  			515.1,
  			518.4
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G920F/*"
  			},
  			{
  				ua: "SM-G920F"
  			}
  		],
  		dpi: 580.6,
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G920P/*"
  			},
  			{
  				ua: "SM-G920P"
  			}
  		],
  		dpi: [
  			522.5,
  			577
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G925F/*"
  			},
  			{
  				ua: "SM-G925F"
  			}
  		],
  		dpi: 580.6,
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G925V/*"
  			},
  			{
  				ua: "SM-G925V"
  			}
  		],
  		dpi: [
  			522.5,
  			576.6
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G930F/*"
  			},
  			{
  				ua: "SM-G930F"
  			}
  		],
  		dpi: 576.6,
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G935F/*"
  			},
  			{
  				ua: "SM-G935F"
  			}
  		],
  		dpi: 533,
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G950F/*"
  			},
  			{
  				ua: "SM-G950F"
  			}
  		],
  		dpi: [
  			562.707,
  			565.293
  		],
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G955U/*"
  			},
  			{
  				ua: "SM-G955U"
  			}
  		],
  		dpi: [
  			522.514,
  			525.762
  		],
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G955F/*"
  			},
  			{
  				ua: "SM-G955F"
  			}
  		],
  		dpi: [
  			522.514,
  			525.762
  		],
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G960F/*"
  			},
  			{
  				ua: "SM-G960F"
  			}
  		],
  		dpi: [
  			569.575,
  			571.5
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G9600/*"
  			},
  			{
  				ua: "SM-G9600"
  			}
  		],
  		dpi: [
  			569.575,
  			571.5
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G960T/*"
  			},
  			{
  				ua: "SM-G960T"
  			}
  		],
  		dpi: [
  			569.575,
  			571.5
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G960N/*"
  			},
  			{
  				ua: "SM-G960N"
  			}
  		],
  		dpi: [
  			569.575,
  			571.5
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G960U/*"
  			},
  			{
  				ua: "SM-G960U"
  			}
  		],
  		dpi: [
  			569.575,
  			571.5
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G9608/*"
  			},
  			{
  				ua: "SM-G9608"
  			}
  		],
  		dpi: [
  			569.575,
  			571.5
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G960FD/*"
  			},
  			{
  				ua: "SM-G960FD"
  			}
  		],
  		dpi: [
  			569.575,
  			571.5
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G960W/*"
  			},
  			{
  				ua: "SM-G960W"
  			}
  		],
  		dpi: [
  			569.575,
  			571.5
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G965F/*"
  			},
  			{
  				ua: "SM-G965F"
  			}
  		],
  		dpi: 529,
  		bw: 2,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "Sony/*/C6903/*"
  			},
  			{
  				ua: "C6903"
  			}
  		],
  		dpi: [
  			442.5,
  			443.3
  		],
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "Sony/*/D6653/*"
  			},
  			{
  				ua: "D6653"
  			}
  		],
  		dpi: [
  			428.6,
  			427.6
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "Sony/*/E6653/*"
  			},
  			{
  				ua: "E6653"
  			}
  		],
  		dpi: [
  			428.6,
  			425.7
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "Sony/*/E6853/*"
  			},
  			{
  				ua: "E6853"
  			}
  		],
  		dpi: [
  			403.4,
  			401.9
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "Sony/*/SGP321/*"
  			},
  			{
  				ua: "SGP321"
  			}
  		],
  		dpi: [
  			224.7,
  			224.1
  		],
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "TCT/*/ALCATEL ONE TOUCH Fierce/*"
  			},
  			{
  				ua: "ALCATEL ONE TOUCH Fierce"
  			}
  		],
  		dpi: [
  			240,
  			247.5
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "THL/*/thl 5000/*"
  			},
  			{
  				ua: "thl 5000"
  			}
  		],
  		dpi: [
  			480,
  			443.3
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "Fly/*/IQ4412/*"
  			},
  			{
  				ua: "IQ4412"
  			}
  		],
  		dpi: 307.9,
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "ZTE/*/ZTE Blade L2/*"
  			},
  			{
  				ua: "ZTE Blade L2"
  			}
  		],
  		dpi: 240,
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "BENEVE/*/VR518/*"
  			},
  			{
  				ua: "VR518"
  			}
  		],
  		dpi: 480,
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "ios",
  		rules: [
  			{
  				res: [
  					640,
  					960
  				]
  			}
  		],
  		dpi: [
  			325.1,
  			328.4
  		],
  		bw: 4,
  		ac: 1000
  	},
  	{
  		type: "ios",
  		rules: [
  			{
  				res: [
  					640,
  					1136
  				]
  			}
  		],
  		dpi: [
  			317.1,
  			320.2
  		],
  		bw: 3,
  		ac: 1000
  	},
  	{
  		type: "ios",
  		rules: [
  			{
  				res: [
  					750,
  					1334
  				]
  			}
  		],
  		dpi: 326.4,
  		bw: 4,
  		ac: 1000
  	},
  	{
  		type: "ios",
  		rules: [
  			{
  				res: [
  					1242,
  					2208
  				]
  			}
  		],
  		dpi: [
  			453.6,
  			458.4
  		],
  		bw: 4,
  		ac: 1000
  	},
  	{
  		type: "ios",
  		rules: [
  			{
  				res: [
  					1125,
  					2001
  				]
  			}
  		],
  		dpi: [
  			410.9,
  			415.4
  		],
  		bw: 4,
  		ac: 1000
  	},
  	{
  		type: "ios",
  		rules: [
  			{
  				res: [
  					1125,
  					2436
  				]
  			}
  		],
  		dpi: 458,
  		bw: 4,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "Huawei/*/EML-L29/*"
  			},
  			{
  				ua: "EML-L29"
  			}
  		],
  		dpi: 428,
  		bw: 3.45,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "Nokia/*/Nokia 7.1/*"
  			},
  			{
  				ua: "Nokia 7.1"
  			}
  		],
  		dpi: [
  			432,
  			431.9
  		],
  		bw: 3,
  		ac: 500
  	},
  	{
  		type: "ios",
  		rules: [
  			{
  				res: [
  					1242,
  					2688
  				]
  			}
  		],
  		dpi: 458,
  		bw: 4,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G570M/*"
  			},
  			{
  				ua: "SM-G570M"
  			}
  		],
  		dpi: 320,
  		bw: 3.684,
  		ac: 1000
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G970F/*"
  			},
  			{
  				ua: "SM-G970F"
  			}
  		],
  		dpi: 438,
  		bw: 2.281,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G973F/*"
  			},
  			{
  				ua: "SM-G973F"
  			}
  		],
  		dpi: 550,
  		bw: 2.002,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G975F/*"
  			},
  			{
  				ua: "SM-G975F"
  			}
  		],
  		dpi: 522,
  		bw: 2.054,
  		ac: 500
  	},
  	{
  		type: "android",
  		rules: [
  			{
  				mdmh: "samsung/*/SM-G977F/*"
  			},
  			{
  				ua: "SM-G977F"
  			}
  		],
  		dpi: 505,
  		bw: 2.334,
  		ac: 500
  	},
  	{
  		type: "ios",
  		rules: [
  			{
  				res: [
  					828,
  					1792
  				]
  			}
  		],
  		dpi: 326,
  		bw: 5,
  		ac: 500
  	}
  ];
  var DPDB_CACHE = {
  	format: format,
  	last_updated: last_updated,
  	devices: devices
  };

  function Dpdb(url, onDeviceParamsUpdated) {
    this.dpdb = DPDB_CACHE;
    this.recalculateDeviceParams_();
  }
  Dpdb.prototype.getDeviceParams = function () {
    return this.deviceParams;
  };
  Dpdb.prototype.recalculateDeviceParams_ = function () {
    var newDeviceParams = this.calcDeviceParams_();
    if (newDeviceParams) {
      this.deviceParams = newDeviceParams;
      if (this.onDeviceParamsUpdated) {
        this.onDeviceParamsUpdated(this.deviceParams);
      }
    } else {
      console.error('Failed to recalculate device parameters.');
    }
  };
  Dpdb.prototype.calcDeviceParams_ = function () {
    var db = this.dpdb;
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    var width = getScreenWidth();
    var height = getScreenHeight();
    for (var i = 0; i < db.devices.length; i++) {
      var device = db.devices[i];
      if (isIOS() != (device.type == 'ios')) continue;
      var matched = false;
      for (var j = 0; j < device.rules.length; j++) {
        var rule = device.rules[j];
        if (this.matchRule_(rule, userAgent, width, height)) {
          matched = true;
          break;
        }
      }
      if (!matched) continue;
      var xdpi = device.dpi[0] || device.dpi;
      var ydpi = device.dpi[1] || device.dpi;
      return new DeviceParams({
        xdpi: xdpi,
        ydpi: ydpi,
        bevelMm: device.bw
      });
    }
    console.warn('No DPDB device match.');
    return null;
  };
  Dpdb.prototype.matchRule_ = function (rule, ua, screenWidth, screenHeight) {
    if (!rule.ua && !rule.res) return false;
    if (rule.ua && ua.indexOf(rule.ua) < 0) return false;
    if (rule.res) {
      if (!rule.res[0] || !rule.res[1]) return false;
      var resX = rule.res[0];
      var resY = rule.res[1];
      if (Math.min(screenWidth, screenHeight) != Math.min(resX, resY) || Math.max(screenWidth, screenHeight) != Math.max(resX, resY)) {
        return false;
      }
    }
    return true;
  };
  function DeviceParams(params) {
    this.xdpi = params.xdpi;
    this.ydpi = params.ydpi;
    this.bevelMm = params.bevelMm;
  }

  function SensorSample(sample, timestampS) {
    this.set(sample, timestampS);
  }
  SensorSample.prototype.set = function (sample, timestampS) {
    this.sample = sample;
    this.timestampS = timestampS;
  };
  SensorSample.prototype.copy = function (sensorSample) {
    this.set(sensorSample.sample, sensorSample.timestampS);
  };

  function ComplementaryFilter(kFilter, isDebug) {
    this.kFilter = kFilter;
    this.isDebug = isDebug;
    this.currentAccelMeasurement = new SensorSample();
    this.currentGyroMeasurement = new SensorSample();
    this.previousGyroMeasurement = new SensorSample();
    if (isIOS()) {
      this.filterQ = new Quaternion(-1, 0, 0, 1);
    } else {
      this.filterQ = new Quaternion(1, 0, 0, 1);
    }
    this.previousFilterQ = new Quaternion();
    this.previousFilterQ.copy(this.filterQ);
    this.accelQ = new Quaternion();
    this.isOrientationInitialized = false;
    this.estimatedGravity = new Vector3();
    this.measuredGravity = new Vector3();
    this.gyroIntegralQ = new Quaternion();
  }
  ComplementaryFilter.prototype.addAccelMeasurement = function (vector, timestampS) {
    this.currentAccelMeasurement.set(vector, timestampS);
  };
  ComplementaryFilter.prototype.addGyroMeasurement = function (vector, timestampS) {
    this.currentGyroMeasurement.set(vector, timestampS);
    var deltaT = timestampS - this.previousGyroMeasurement.timestampS;
    if (isTimestampDeltaValid(deltaT)) {
      this.run_();
    }
    this.previousGyroMeasurement.copy(this.currentGyroMeasurement);
  };
  ComplementaryFilter.prototype.run_ = function () {
    if (!this.isOrientationInitialized) {
      this.accelQ = this.accelToQuaternion_(this.currentAccelMeasurement.sample);
      this.previousFilterQ.copy(this.accelQ);
      this.isOrientationInitialized = true;
      return;
    }
    var deltaT = this.currentGyroMeasurement.timestampS - this.previousGyroMeasurement.timestampS;
    var gyroDeltaQ = this.gyroToQuaternionDelta_(this.currentGyroMeasurement.sample, deltaT);
    this.gyroIntegralQ.multiply(gyroDeltaQ);
    this.filterQ.copy(this.previousFilterQ);
    this.filterQ.multiply(gyroDeltaQ);
    var invFilterQ = new Quaternion();
    invFilterQ.copy(this.filterQ);
    invFilterQ.inverse();
    this.estimatedGravity.set(0, 0, -1);
    this.estimatedGravity.applyQuaternion(invFilterQ);
    this.estimatedGravity.normalize();
    this.measuredGravity.copy(this.currentAccelMeasurement.sample);
    this.measuredGravity.normalize();
    var deltaQ = new Quaternion();
    deltaQ.setFromUnitVectors(this.estimatedGravity, this.measuredGravity);
    deltaQ.inverse();
    if (this.isDebug) {
      console.log('Delta: %d deg, G_est: (%s, %s, %s), G_meas: (%s, %s, %s)', radToDeg * getQuaternionAngle(deltaQ), this.estimatedGravity.x.toFixed(1), this.estimatedGravity.y.toFixed(1), this.estimatedGravity.z.toFixed(1), this.measuredGravity.x.toFixed(1), this.measuredGravity.y.toFixed(1), this.measuredGravity.z.toFixed(1));
    }
    var targetQ = new Quaternion();
    targetQ.copy(this.filterQ);
    targetQ.multiply(deltaQ);
    this.filterQ.slerp(targetQ, 1 - this.kFilter);
    this.previousFilterQ.copy(this.filterQ);
  };
  ComplementaryFilter.prototype.getOrientation = function () {
    return this.filterQ;
  };
  ComplementaryFilter.prototype.accelToQuaternion_ = function (accel) {
    var normAccel = new Vector3();
    normAccel.copy(accel);
    normAccel.normalize();
    var quat = new Quaternion();
    quat.setFromUnitVectors(new Vector3(0, 0, -1), normAccel);
    quat.inverse();
    return quat;
  };
  ComplementaryFilter.prototype.gyroToQuaternionDelta_ = function (gyro, dt) {
    var quat = new Quaternion();
    var axis = new Vector3();
    axis.copy(gyro);
    axis.normalize();
    quat.setFromAxisAngle(axis, gyro.length() * dt);
    return quat;
  };

  function PosePredictor(predictionTimeS, isDebug) {
    this.predictionTimeS = predictionTimeS;
    this.isDebug = isDebug;
    this.previousQ = new Quaternion();
    this.previousTimestampS = null;
    this.deltaQ = new Quaternion();
    this.outQ = new Quaternion();
  }
  PosePredictor.prototype.getPrediction = function (currentQ, gyro, timestampS) {
    if (!this.previousTimestampS) {
      this.previousQ.copy(currentQ);
      this.previousTimestampS = timestampS;
      return currentQ;
    }
    var axis = new Vector3();
    axis.copy(gyro);
    axis.normalize();
    var angularSpeed = gyro.length();
    if (angularSpeed < degToRad * 20) {
      if (this.isDebug) {
        console.log('Moving slowly, at %s deg/s: no prediction', (radToDeg * angularSpeed).toFixed(1));
      }
      this.outQ.copy(currentQ);
      this.previousQ.copy(currentQ);
      return this.outQ;
    }
    var deltaT = timestampS - this.previousTimestampS;
    var predictAngle = angularSpeed * this.predictionTimeS;
    this.deltaQ.setFromAxisAngle(axis, predictAngle);
    this.outQ.copy(this.previousQ);
    this.outQ.multiply(this.deltaQ);
    this.previousQ.copy(currentQ);
    this.previousTimestampS = timestampS;
    return this.outQ;
  };

  function FusionPoseSensor(kFilter, predictionTime, yawOnly, isDebug) {
    this.yawOnly = yawOnly;
    this.accelerometer = new Vector3();
    this.gyroscope = new Vector3();
    this.filter = new ComplementaryFilter(kFilter, isDebug);
    this.posePredictor = new PosePredictor(predictionTime, isDebug);
    this.isFirefoxAndroid = isFirefoxAndroid();
    this.isIOS = isIOS();
    var chromeVersion = getChromeVersion();
    this.isDeviceMotionInRadians = !this.isIOS && chromeVersion && chromeVersion < 66;
    this.isWithoutDeviceMotion = isChromeWithoutDeviceMotion();
    this.filterToWorldQ = new Quaternion();
    if (isIOS()) {
      this.filterToWorldQ.setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2);
    } else {
      this.filterToWorldQ.setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2);
    }
    this.inverseWorldToScreenQ = new Quaternion();
    this.worldToScreenQ = new Quaternion();
    this.originalPoseAdjustQ = new Quaternion();
    this.originalPoseAdjustQ.setFromAxisAngle(new Vector3(0, 0, 1), -window.orientation * Math.PI / 180);
    this.setScreenTransform_();
    if (isLandscapeMode()) {
      this.filterToWorldQ.multiply(this.inverseWorldToScreenQ);
    }
    this.resetQ = new Quaternion();
    this.orientationOut_ = new Float32Array(4);
    this.start();
  }
  FusionPoseSensor.prototype.getPosition = function () {
    return null;
  };
  FusionPoseSensor.prototype.getOrientation = function () {
    var orientation;
    if (this.isWithoutDeviceMotion && this._deviceOrientationQ) {
      this.deviceOrientationFixQ = this.deviceOrientationFixQ || function () {
        var z = new Quaternion().setFromAxisAngle(new Vector3(0, 0, -1), 0);
        var y = new Quaternion();
        if (window.orientation === -90) {
          y.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / -2);
        } else {
          y.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);
        }
        return z.multiply(y);
      }();
      this.deviceOrientationFilterToWorldQ = this.deviceOrientationFilterToWorldQ || function () {
        var q = new Quaternion();
        q.setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2);
        return q;
      }();
      orientation = this._deviceOrientationQ;
      var out = new Quaternion();
      out.copy(orientation);
      out.multiply(this.deviceOrientationFilterToWorldQ);
      out.multiply(this.resetQ);
      out.multiply(this.worldToScreenQ);
      out.multiplyQuaternions(this.deviceOrientationFixQ, out);
      if (this.yawOnly) {
        out.x = 0;
        out.z = 0;
        out.normalize();
      }
      this.orientationOut_[0] = out.x;
      this.orientationOut_[1] = out.y;
      this.orientationOut_[2] = out.z;
      this.orientationOut_[3] = out.w;
      return this.orientationOut_;
    } else {
      var filterOrientation = this.filter.getOrientation();
      orientation = this.posePredictor.getPrediction(filterOrientation, this.gyroscope, this.previousTimestampS);
    }
    var out = new Quaternion();
    out.copy(this.filterToWorldQ);
    out.multiply(this.resetQ);
    out.multiply(orientation);
    out.multiply(this.worldToScreenQ);
    if (this.yawOnly) {
      out.x = 0;
      out.z = 0;
      out.normalize();
    }
    this.orientationOut_[0] = out.x;
    this.orientationOut_[1] = out.y;
    this.orientationOut_[2] = out.z;
    this.orientationOut_[3] = out.w;
    return this.orientationOut_;
  };
  FusionPoseSensor.prototype.resetPose = function () {
    this.resetQ.copy(this.filter.getOrientation());
    this.resetQ.x = 0;
    this.resetQ.y = 0;
    this.resetQ.z *= -1;
    this.resetQ.normalize();
    if (isLandscapeMode()) {
      this.resetQ.multiply(this.inverseWorldToScreenQ);
    }
    this.resetQ.multiply(this.originalPoseAdjustQ);
  };
  FusionPoseSensor.prototype.onDeviceOrientation_ = function (e) {
    this._deviceOrientationQ = this._deviceOrientationQ || new Quaternion();
    var alpha = e.alpha,
        beta = e.beta,
        gamma = e.gamma;
    alpha = (alpha || 0) * Math.PI / 180;
    beta = (beta || 0) * Math.PI / 180;
    gamma = (gamma || 0) * Math.PI / 180;
    this._deviceOrientationQ.setFromEulerYXZ(beta, alpha, -gamma);
  };
  FusionPoseSensor.prototype.onDeviceMotion_ = function (deviceMotion) {
    this.updateDeviceMotion_(deviceMotion);
  };
  FusionPoseSensor.prototype.updateDeviceMotion_ = function (deviceMotion) {
    var accGravity = deviceMotion.accelerationIncludingGravity;
    var rotRate = deviceMotion.rotationRate;
    var timestampS = deviceMotion.timeStamp / 1000;
    var deltaS = timestampS - this.previousTimestampS;
    if (deltaS < 0) {
      warnOnce('fusion-pose-sensor:invalid:non-monotonic', 'Invalid timestamps detected: non-monotonic timestamp from devicemotion');
      this.previousTimestampS = timestampS;
      return;
    } else if (deltaS <= MIN_TIMESTEP || deltaS > MAX_TIMESTEP) {
      warnOnce('fusion-pose-sensor:invalid:outside-threshold', 'Invalid timestamps detected: Timestamp from devicemotion outside expected range.');
      this.previousTimestampS = timestampS;
      return;
    }
    this.accelerometer.set(-accGravity.x, -accGravity.y, -accGravity.z);
    if (isR7()) {
      this.gyroscope.set(-rotRate.beta, rotRate.alpha, rotRate.gamma);
    } else {
      this.gyroscope.set(rotRate.alpha, rotRate.beta, rotRate.gamma);
    }
    if (!this.isDeviceMotionInRadians) {
      this.gyroscope.multiplyScalar(Math.PI / 180);
    }
    this.filter.addAccelMeasurement(this.accelerometer, timestampS);
    this.filter.addGyroMeasurement(this.gyroscope, timestampS);
    this.previousTimestampS = timestampS;
  };
  FusionPoseSensor.prototype.onOrientationChange_ = function (screenOrientation) {
    this.setScreenTransform_();
  };
  FusionPoseSensor.prototype.onMessage_ = function (event) {
    var message = event.data;
    if (!message || !message.type) {
      return;
    }
    var type = message.type.toLowerCase();
    if (type !== 'devicemotion') {
      return;
    }
    this.updateDeviceMotion_(message.deviceMotionEvent);
  };
  FusionPoseSensor.prototype.setScreenTransform_ = function () {
    this.worldToScreenQ.set(0, 0, 0, 1);
    switch (window.orientation) {
      case 0:
        break;
      case 90:
        this.worldToScreenQ.setFromAxisAngle(new Vector3(0, 0, 1), -Math.PI / 2);
        break;
      case -90:
        this.worldToScreenQ.setFromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2);
        break;
    }
    this.inverseWorldToScreenQ.copy(this.worldToScreenQ);
    this.inverseWorldToScreenQ.inverse();
  };
  FusionPoseSensor.prototype.start = function () {
    this.onDeviceMotionCallback_ = this.onDeviceMotion_.bind(this);
    this.onOrientationChangeCallback_ = this.onOrientationChange_.bind(this);
    this.onMessageCallback_ = this.onMessage_.bind(this);
    this.onDeviceOrientationCallback_ = this.onDeviceOrientation_.bind(this);
    if (isIOS() && isInsideCrossOriginIFrame()) {
      window.addEventListener('message', this.onMessageCallback_);
    }
    window.addEventListener('orientationchange', this.onOrientationChangeCallback_);
    if (this.isWithoutDeviceMotion) {
      window.addEventListener('deviceorientation', this.onDeviceOrientationCallback_);
    } else {
      window.addEventListener('devicemotion', this.onDeviceMotionCallback_);
    }
  };
  FusionPoseSensor.prototype.stop = function () {
    window.removeEventListener('devicemotion', this.onDeviceMotionCallback_);
    window.removeEventListener('deviceorientation', this.onDeviceOrientationCallback_);
    window.removeEventListener('orientationchange', this.onOrientationChangeCallback_);
    window.removeEventListener('message', this.onMessageCallback_);
  };

  var SENSOR_FREQUENCY = 60;
  var X_AXIS = new Vector3(1, 0, 0);
  var Z_AXIS = new Vector3(0, 0, 1);
  var orientation = {};
  if (screen.orientation) {
    orientation = screen.orientation;
  } else if (screen.msOrientation) {
    orientation = screen.msOrientation;
  } else {
    Object.defineProperty(orientation, 'angle', {
      get: function get() {
        return window.orientation || 0;
      }
    });
  }
  var SENSOR_TO_VR = new Quaternion();
  SENSOR_TO_VR.setFromAxisAngle(X_AXIS, -Math.PI / 2);
  SENSOR_TO_VR.multiply(new Quaternion().setFromAxisAngle(Z_AXIS, Math.PI / 2));
  var PoseSensor = function () {
    function PoseSensor(config) {
      _classCallCheck(this, PoseSensor);
      this.config = config;
      this.sensor = null;
      this.fusionSensor = null;
      this._out = new Float32Array(4);
      this.api = null;
      this.errors = [];
      this._sensorQ = new Quaternion();
      this._worldToScreenQ = new Quaternion();
      this._outQ = new Quaternion();
      this._onSensorRead = this._onSensorRead.bind(this);
      this._onSensorError = this._onSensorError.bind(this);
      this._onOrientationChange = this._onOrientationChange.bind(this);
      this._onOrientationChange();
      this.init();
    }
    _createClass(PoseSensor, [{
      key: "init",
      value: function init() {
        var sensor = null;
        try {
          sensor = new RelativeOrientationSensor({
            frequency: SENSOR_FREQUENCY
          });
          sensor.addEventListener('error', this._onSensorError);
        } catch (error) {
          this.errors.push(error);
          if (error.name === 'SecurityError') {
            console.error('Cannot construct sensors due to the Feature Policy');
            console.warn('Attempting to fall back using "devicemotion"; however this will ' + 'fail in the future without correct permissions.');
            this.useDeviceMotion();
          } else if (error.name === 'ReferenceError') {
            this.useDeviceMotion();
          } else {
            console.error(error);
          }
        }
        if (sensor) {
          this.api = 'sensor';
          this.sensor = sensor;
          this.sensor.addEventListener('reading', this._onSensorRead);
          this.sensor.start();
        }
        window.addEventListener('orientationchange', this._onOrientationChange);
      }
    }, {
      key: "useDeviceMotion",
      value: function useDeviceMotion() {
        this.api = 'devicemotion';
        this.fusionSensor = new FusionPoseSensor(this.config.K_FILTER, this.config.PREDICTION_TIME_S, this.config.YAW_ONLY, this.config.DEBUG);
      }
    }, {
      key: "getOrientation",
      value: function getOrientation() {
        if (this.fusionSensor) {
          return this.fusionSensor.getOrientation();
        }
        if (!this.sensor || !this.sensor.quaternion) {
          this._out[0] = this._out[1] = this._out[2] = 0;
          this._out[3] = 1;
          return this._out;
        }
        var q = this.sensor.quaternion;
        this._sensorQ.set(q[0], q[1], q[2], q[3]);
        var out = this._outQ;
        out.copy(SENSOR_TO_VR);
        out.multiply(this._sensorQ);
        out.multiply(this._worldToScreenQ);
        if (this.config.YAW_ONLY) {
          out.x = out.z = 0;
          out.normalize();
        }
        this._out[0] = out.x;
        this._out[1] = out.y;
        this._out[2] = out.z;
        this._out[3] = out.w;
        return this._out;
      }
    }, {
      key: "_onSensorError",
      value: function _onSensorError(event) {
        this.errors.push(event.error);
        if (event.error.name === 'NotAllowedError') {
          console.error('Permission to access sensor was denied');
        } else if (event.error.name === 'NotReadableError') {
          console.error('Sensor could not be read');
        } else {
          console.error(event.error);
        }
      }
    }, {
      key: "_onSensorRead",
      value: function _onSensorRead() {}
    }, {
      key: "_onOrientationChange",
      value: function _onOrientationChange() {
        var angle = -orientation.angle * Math.PI / 180;
        this._worldToScreenQ.setFromAxisAngle(Z_AXIS, angle);
      }
    }]);
    return PoseSensor;
  }();

  var DEFAULT_VIEWER = 'CardboardV1';
  var VIEWER_KEY = 'WEBVR_CARDBOARD_VIEWER';
  var CLASS_NAME = 'webvr-polyfill-viewer-selector';
  function ViewerSelector() {
    try {
      this.selectedKey = localStorage.getItem(VIEWER_KEY);
    } catch (error) {
      console.error('Failed to load viewer profile: %s', error);
    }
    if (!this.selectedKey) {
      this.selectedKey = DEFAULT_VIEWER;
    }
    this.dialog = this.createDialog_(DeviceInfo.Viewers);
    this.root = null;
    this.onChangeCallbacks_ = [];
  }
  ViewerSelector.prototype.show = function (root) {
    this.root = root;
    root.appendChild(this.dialog);
    var selected = this.dialog.querySelector('#' + this.selectedKey);
    selected.checked = true;
    this.dialog.style.display = 'block';
  };
  ViewerSelector.prototype.hide = function () {
    if (this.root && this.root.contains(this.dialog)) {
      this.root.removeChild(this.dialog);
    }
    this.dialog.style.display = 'none';
  };
  ViewerSelector.prototype.getCurrentViewer = function () {
    return DeviceInfo.Viewers[this.selectedKey];
  };
  ViewerSelector.prototype.getSelectedKey_ = function () {
    var input = this.dialog.querySelector('input[name=field]:checked');
    if (input) {
      return input.id;
    }
    return null;
  };
  ViewerSelector.prototype.onChange = function (cb) {
    this.onChangeCallbacks_.push(cb);
  };
  ViewerSelector.prototype.fireOnChange_ = function (viewer) {
    for (var i = 0; i < this.onChangeCallbacks_.length; i++) {
      this.onChangeCallbacks_[i](viewer);
    }
  };
  ViewerSelector.prototype.onSave_ = function () {
    this.selectedKey = this.getSelectedKey_();
    if (!this.selectedKey || !DeviceInfo.Viewers[this.selectedKey]) {
      console.error('ViewerSelector.onSave_: this should never happen!');
      return;
    }
    this.fireOnChange_(DeviceInfo.Viewers[this.selectedKey]);
    try {
      localStorage.setItem(VIEWER_KEY, this.selectedKey);
    } catch (error) {
      console.error('Failed to save viewer profile: %s', error);
    }
    this.hide();
  };
  ViewerSelector.prototype.createDialog_ = function (options) {
    var container = document.createElement('div');
    container.classList.add(CLASS_NAME);
    container.style.display = 'none';
    var overlay = document.createElement('div');
    var s = overlay.style;
    s.position = 'fixed';
    s.left = 0;
    s.top = 0;
    s.width = '100%';
    s.height = '100%';
    s.background = 'rgba(0, 0, 0, 0.3)';
    overlay.addEventListener('click', this.hide.bind(this));
    var width = 280;
    var dialog = document.createElement('div');
    var s = dialog.style;
    s.boxSizing = 'border-box';
    s.position = 'fixed';
    s.top = '24px';
    s.left = '50%';
    s.marginLeft = -width / 2 + 'px';
    s.width = width + 'px';
    s.padding = '24px';
    s.overflow = 'hidden';
    s.background = '#fafafa';
    s.fontFamily = "'Roboto', sans-serif";
    s.boxShadow = '0px 5px 20px #666';
    dialog.appendChild(this.createH1_('Select your viewer'));
    for (var id in options) {
      dialog.appendChild(this.createChoice_(id, options[id].label));
    }
    dialog.appendChild(this.createButton_('Save', this.onSave_.bind(this)));
    container.appendChild(overlay);
    container.appendChild(dialog);
    return container;
  };
  ViewerSelector.prototype.createH1_ = function (name) {
    var h1 = document.createElement('h1');
    var s = h1.style;
    s.color = 'black';
    s.fontSize = '20px';
    s.fontWeight = 'bold';
    s.marginTop = 0;
    s.marginBottom = '24px';
    h1.innerHTML = name;
    return h1;
  };
  ViewerSelector.prototype.createChoice_ = function (id, name) {
    var div = document.createElement('div');
    div.style.marginTop = '8px';
    div.style.color = 'black';
    var input = document.createElement('input');
    input.style.fontSize = '30px';
    input.setAttribute('id', id);
    input.setAttribute('type', 'radio');
    input.setAttribute('value', id);
    input.setAttribute('name', 'field');
    var label = document.createElement('label');
    label.style.marginLeft = '4px';
    label.setAttribute('for', id);
    label.innerHTML = name;
    div.appendChild(input);
    div.appendChild(label);
    return div;
  };
  ViewerSelector.prototype.createButton_ = function (label, onclick) {
    var button = document.createElement('button');
    button.innerHTML = label;
    var s = button.style;
    s.float = 'right';
    s.textTransform = 'uppercase';
    s.color = '#1094f7';
    s.fontSize = '14px';
    s.letterSpacing = 0;
    s.border = 0;
    s.background = 'none';
    s.marginTop = '16px';
    button.addEventListener('click', onclick);
    return button;
  };

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var NoSleep = createCommonjsModule(function (module, exports) {
  /*! NoSleep.js v0.9.0 - git.io/vfn01 - Rich Tibbett - MIT license */
  (function webpackUniversalModuleDefinition(root, factory) {
  	module.exports = factory();
  })(typeof self !== 'undefined' ? self : commonjsGlobal, function() {
  return  (function(modules) {
   	var installedModules = {};
   	function __webpack_require__(moduleId) {
   		if(installedModules[moduleId]) {
   			return installedModules[moduleId].exports;
   		}
   		var module = installedModules[moduleId] = {
   			i: moduleId,
   			l: false,
   			exports: {}
   		};
   		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
   		module.l = true;
   		return module.exports;
   	}
   	__webpack_require__.m = modules;
   	__webpack_require__.c = installedModules;
   	__webpack_require__.d = function(exports, name, getter) {
   		if(!__webpack_require__.o(exports, name)) {
   			Object.defineProperty(exports, name, {
   				configurable: false,
   				enumerable: true,
   				get: getter
   			});
   		}
   	};
   	__webpack_require__.n = function(module) {
   		var getter = module && module.__esModule ?
   			function getDefault() { return module['default']; } :
   			function getModuleExports() { return module; };
   		__webpack_require__.d(getter, 'a', getter);
   		return getter;
   	};
   	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
   	__webpack_require__.p = "";
   	return __webpack_require__(__webpack_require__.s = 0);
   })
   ([
   (function(module, exports, __webpack_require__) {
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  var _require = __webpack_require__(1),
      webm = _require.webm,
      mp4 = _require.mp4;
  var oldIOS = typeof navigator !== 'undefined' && parseFloat(('' + (/CPU.*OS ([0-9_]{3,4})[0-9_]{0,1}|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ''])[1]).replace('undefined', '3_2').replace('_', '.').replace('_', '')) < 10 && !window.MSStream;
  var NoSleep = function () {
    function NoSleep() {
      var _this = this;
      _classCallCheck(this, NoSleep);
      this.enabled = false;
      if (oldIOS) {
        this.noSleepTimer = null;
      } else {
        this.noSleepVideo = document.createElement('video');
        this.noSleepVideo.setAttribute('muted', '');
        this.noSleepVideo.setAttribute('title', 'No Sleep');
        this.noSleepVideo.setAttribute('playsinline', '');
        this._addSourceToVideo(this.noSleepVideo, 'webm', webm);
        this._addSourceToVideo(this.noSleepVideo, 'mp4', mp4);
        this.noSleepVideo.addEventListener('loadedmetadata', function () {
          if (_this.noSleepVideo.duration <= 1) {
            _this.noSleepVideo.setAttribute('loop', '');
          } else {
            _this.noSleepVideo.addEventListener('timeupdate', function () {
              if (_this.noSleepVideo.currentTime > 0.5) {
                _this.noSleepVideo.currentTime = Math.random();
              }
              if (_this.noSleepVideo.paused && _this.enabled) {
                _this.noSleepVideo.play();
              }
            });
          }
        });
      }
    }
    _createClass(NoSleep, [{
      key: '_addSourceToVideo',
      value: function _addSourceToVideo(element, type, dataURI) {
        var source = document.createElement('source');
        source.src = dataURI;
        source.type = 'video/' + type;
        element.appendChild(source);
      }
    }, {
      key: 'enable',
      value: function enable() {
        this.enabled = true;
        if (oldIOS) {
          this.disable();
          console.warn('\n        NoSleep enabled for older iOS devices. This can interrupt\n        active or long-running network requests from completing successfully.\n        See https://github.com/richtr/NoSleep.js/issues/15 for more details.\n      ');
          this.noSleepTimer = window.setInterval(function () {
            if (!document.hidden) {
              window.location.href = window.location.href.split('#')[0];
              window.setTimeout(window.stop, 0);
            }
          }, 15000);
        } else {
          this.noSleepVideo.play();
        }
      }
    }, {
      key: 'disable',
      value: function disable() {
        this.enabled = false;
        if (oldIOS) {
          if (this.noSleepTimer) {
            console.warn('\n          NoSleep now disabled for older iOS devices.\n        ');
            window.clearInterval(this.noSleepTimer);
            this.noSleepTimer = null;
          }
        } else {
          this.noSleepVideo.pause();
        }
      }
    }]);
    return NoSleep;
  }();
  module.exports = NoSleep;
   }),
   (function(module, exports, __webpack_require__) {
  module.exports = {
    webm: 'data:video/webm;base64, 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',
    mp4: 'data:video/mp4;base64, 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'
  };
   })
   ]);
  });
  });
  var NoSleep$1 = unwrapExports(NoSleep);

  var nextDisplayId = 1000;
  var defaultLeftBounds = [0, 0, 0.5, 1];
  var defaultRightBounds = [0.5, 0, 0.5, 1];
  var raf = window.requestAnimationFrame;
  var caf = window.cancelAnimationFrame;
  function VRFrameData() {
    this.leftProjectionMatrix = new Float32Array(16);
    this.leftViewMatrix = new Float32Array(16);
    this.rightProjectionMatrix = new Float32Array(16);
    this.rightViewMatrix = new Float32Array(16);
    this.pose = null;
  }
  function VRDisplayCapabilities(config) {
    Object.defineProperties(this, {
      hasPosition: {
        writable: false,
        enumerable: true,
        value: config.hasPosition
      },
      hasExternalDisplay: {
        writable: false,
        enumerable: true,
        value: config.hasExternalDisplay
      },
      canPresent: {
        writable: false,
        enumerable: true,
        value: config.canPresent
      },
      maxLayers: {
        writable: false,
        enumerable: true,
        value: config.maxLayers
      }
    });
  }
  function VRDisplay(config) {
    config = config || {};
    var USE_WAKELOCK = 'wakelock' in config ? config.wakelock : true;
    this.isPolyfilled = true;
    this.displayId = nextDisplayId++;
    this.displayName = '';
    this.depthNear = 0.01;
    this.depthFar = 10000.0;
    this.isPresenting = false;
    this.capabilities = new VRDisplayCapabilities({
      hasPosition: false,
      hasOrientation: false,
      hasExternalDisplay: false,
      canPresent: false,
      maxLayers: 1
    });
    this.stageParameters = null;
    this.waitingForPresent_ = false;
    this.layer_ = null;
    this.originalParent_ = null;
    this.fullscreenElement_ = null;
    this.fullscreenWrapper_ = null;
    this.fullscreenElementCachedStyle_ = null;
    this.fullscreenEventTarget_ = null;
    this.fullscreenChangeHandler_ = null;
    this.fullscreenErrorHandler_ = null;
    if (USE_WAKELOCK && isMobile()) {
      this.wakelock_ = new NoSleep$1();
    }
  }
  VRDisplay.prototype.getFrameData = function (frameData) {
    return frameDataFromPose(frameData, this._getPose(), this);
  };
  VRDisplay.prototype.requestAnimationFrame = function (callback) {
    return raf(callback);
  };
  VRDisplay.prototype.cancelAnimationFrame = function (id) {
    return caf(id);
  };
  VRDisplay.prototype.wrapForFullscreen = function (element) {
    if (isIOS() && !supportsIOSFullscreen(element)) {
      return element;
    }
    if (!this.fullscreenWrapper_) {
      this.fullscreenWrapper_ = document.createElement('div');
      var cssProperties = ['height: ' + Math.min(screen.height, screen.width) + 'px !important', 'top: 0 !important', 'left: 0 !important', 'right: 0 !important', 'border: 0', 'margin: 0', 'padding: 0', 'z-index: 999999 !important', 'position: fixed'];
      this.fullscreenWrapper_.setAttribute('style', cssProperties.join('; ') + ';');
      this.fullscreenWrapper_.classList.add('webvr-polyfill-fullscreen-wrapper');
    }
    if (this.fullscreenElement_ == element) {
      return this.fullscreenWrapper_;
    }
    if (this.fullscreenElement_) {
      if (this.originalParent_) {
        this.originalParent_.appendChild(this.fullscreenElement_);
      } else {
        this.fullscreenElement_.parentElement.removeChild(this.fullscreenElement_);
      }
    }
    this.fullscreenElement_ = element;
    this.originalParent_ = element.parentElement;
    if (!this.originalParent_) {
      document.body.appendChild(element);
    }
    if (!this.fullscreenWrapper_.parentElement) {
      var parent = this.fullscreenElement_.parentElement;
      parent.insertBefore(this.fullscreenWrapper_, this.fullscreenElement_);
      parent.removeChild(this.fullscreenElement_);
    }
    this.fullscreenWrapper_.insertBefore(this.fullscreenElement_, this.fullscreenWrapper_.firstChild);
    this.fullscreenElementCachedStyle_ = this.fullscreenElement_.getAttribute('style');
    var self = this;
    function applyFullscreenElementStyle() {
      if (!self.fullscreenElement_) {
        return;
      }
      var cssProperties = ['position: absolute', 'top: 0', 'left: 0', 'width: ' + Math.max(screen.width, screen.height) + 'px', 'height: ' + Math.min(screen.height, screen.width) + 'px', 'border: 0', 'margin: 0', 'padding: 0'];
      self.fullscreenElement_.setAttribute('style', cssProperties.join('; ') + ';');
    }
    applyFullscreenElementStyle();
    return this.fullscreenWrapper_;
  };
  VRDisplay.prototype.removeFullscreenWrapper = function () {
    if (!this.fullscreenElement_) {
      return;
    }
    var element = this.fullscreenElement_;
    if (this.fullscreenElementCachedStyle_) {
      element.setAttribute('style', this.fullscreenElementCachedStyle_);
    } else {
      element.removeAttribute('style');
    }
    this.fullscreenElement_ = null;
    this.fullscreenElementCachedStyle_ = null;
    var parent = this.fullscreenWrapper_.parentElement;
    this.fullscreenWrapper_.removeChild(element);
    if (this.originalParent_ === parent) {
      parent.insertBefore(element, this.fullscreenWrapper_);
    }
    else if (this.originalParent_) {
        this.originalParent_.insertBefore(element, this.originalParent_.children[1]);
      }
    parent.removeChild(this.fullscreenWrapper_);
    return element;
  };
  VRDisplay.prototype.requestPresent = function (layers) {
    var wasPresenting = this.isPresenting;
    var self = this;
    return new Promise(function (resolve, reject) {
      if (!self.capabilities.canPresent) {
        reject(new Error('VRDisplay is not capable of presenting.'));
        return;
      }
      var incomingLayer = layers[0];
      if (!incomingLayer.source) {
        resolve();
        return;
      }
      var leftBounds = incomingLayer.leftBounds || defaultLeftBounds;
      var rightBounds = incomingLayer.rightBounds || defaultRightBounds;
      if (wasPresenting) {
        var layer = self.layer_;
        if (layer.source !== incomingLayer.source) {
          layer.source = incomingLayer.source;
        }
        for (var i = 0; i < 4; i++) {
          layer.leftBounds[i] = leftBounds[i];
          layer.rightBounds[i] = rightBounds[i];
        }
        self.wrapForFullscreen(self.layer_.source);
        self.updatePresent_();
        resolve();
        return;
      }
      self.layer_ = {
        predistorted: incomingLayer.predistorted,
        source: incomingLayer.source,
        leftBounds: leftBounds.slice(0),
        rightBounds: rightBounds.slice(0)
      };
      self.waitingForPresent_ = false;
      if (self.layer_ && self.layer_.source) {
        var fullscreenElement = self.wrapForFullscreen(self.layer_.source);
        var onFullscreenChange = function onFullscreenChange() {
          var actualFullscreenElement = getFullscreenElement();
          self.isPresenting = fullscreenElement === actualFullscreenElement;
          if (self.isPresenting) {
            if (screen.orientation && screen.orientation.lock) {
              screen.orientation.lock('landscape-primary').catch(function (error) {
              });
            }
            self.waitingForPresent_ = false;
            self.beginPresent_();
            resolve();
          } else {
            if (screen.orientation && screen.orientation.unlock) {
              screen.orientation.unlock();
            }
            self.removeFullscreenWrapper();
            self.disableWakeLock();
            self.endPresent_();
            self.removeFullscreenListeners_();
          }
          self.fireVRDisplayPresentChange_();
        };
        var onFullscreenError = function onFullscreenError() {
          if (!self.waitingForPresent_) {
            return;
          }
          self.removeFullscreenWrapper();
          self.removeFullscreenListeners_();
          self.disableWakeLock();
          self.waitingForPresent_ = false;
          self.isPresenting = false;
          reject(new Error('Unable to present.'));
        };
        self.addFullscreenListeners_(fullscreenElement, onFullscreenChange, onFullscreenError);
        if (requestFullscreen(fullscreenElement)) {
          self.enableWakeLock();
          self.waitingForPresent_ = true;
        } else if (isIOS() || isWebViewAndroid()) {
          self.enableWakeLock();
          self.isPresenting = true;
          self.beginPresent_();
          self.fireVRDisplayPresentChange_();
          resolve();
        }
      }
      if (!self.waitingForPresent_ && !isIOS()) {
        exitFullscreen();
        reject(new Error('Unable to present.'));
      }
    });
  };
  VRDisplay.prototype.exitPresent = function () {
    var wasPresenting = this.isPresenting;
    var self = this;
    this.isPresenting = false;
    this.layer_ = null;
    this.disableWakeLock();
    return new Promise(function (resolve, reject) {
      if (wasPresenting) {
        if (!exitFullscreen() && isIOS()) {
          self.endPresent_();
          self.fireVRDisplayPresentChange_();
        }
        if (isWebViewAndroid()) {
          self.removeFullscreenWrapper();
          self.removeFullscreenListeners_();
          self.endPresent_();
          self.fireVRDisplayPresentChange_();
        }
        resolve();
      } else {
        reject(new Error('Was not presenting to VRDisplay.'));
      }
    });
  };
  VRDisplay.prototype.getLayers = function () {
    if (this.layer_) {
      return [this.layer_];
    }
    return [];
  };
  VRDisplay.prototype.fireVRDisplayPresentChange_ = function () {
    var event = new CustomEvent('vrdisplaypresentchange', {
      detail: {
        display: this
      }
    });
    window.dispatchEvent(event);
  };
  VRDisplay.prototype.fireVRDisplayConnect_ = function () {
    var event = new CustomEvent('vrdisplayconnect', {
      detail: {
        display: this
      }
    });
    window.dispatchEvent(event);
  };
  VRDisplay.prototype.addFullscreenListeners_ = function (element, changeHandler, errorHandler) {
    this.removeFullscreenListeners_();
    this.fullscreenEventTarget_ = element;
    this.fullscreenChangeHandler_ = changeHandler;
    this.fullscreenErrorHandler_ = errorHandler;
    if (changeHandler) {
      if (document.fullscreenEnabled) {
        document.addEventListener('fullscreenchange', changeHandler, false);
      } else if (document.webkitFullscreenEnabled) {
        element.addEventListener('webkitfullscreenchange', changeHandler, false);
      } else if (document.mozFullScreenEnabled) {
        document.addEventListener('mozfullscreenchange', changeHandler, false);
      } else if (document.msFullscreenEnabled) {
        element.addEventListener('msfullscreenchange', changeHandler, false);
      }
    }
    if (errorHandler) {
      if (document.fullscreenEnabled) {
        document.addEventListener('fullscreenerror', errorHandler, false);
      } else if (document.webkitFullscreenEnabled) {
        element.addEventListener('webkitfullscreenerror', errorHandler, false);
      } else if (document.mozFullScreenEnabled) {
        document.addEventListener('mozfullscreenerror', errorHandler, false);
      } else if (document.msFullscreenEnabled) {
        element.addEventListener('msfullscreenerror', errorHandler, false);
      }
    }
  };
  VRDisplay.prototype.removeFullscreenListeners_ = function () {
    if (!this.fullscreenEventTarget_) return;
    var element = this.fullscreenEventTarget_;
    if (this.fullscreenChangeHandler_) {
      var changeHandler = this.fullscreenChangeHandler_;
      document.removeEventListener('fullscreenchange', changeHandler, false);
      element.removeEventListener('webkitfullscreenchange', changeHandler, false);
      document.removeEventListener('mozfullscreenchange', changeHandler, false);
      element.removeEventListener('msfullscreenchange', changeHandler, false);
    }
    if (this.fullscreenErrorHandler_) {
      var errorHandler = this.fullscreenErrorHandler_;
      document.removeEventListener('fullscreenerror', errorHandler, false);
      element.removeEventListener('webkitfullscreenerror', errorHandler, false);
      document.removeEventListener('mozfullscreenerror', errorHandler, false);
      element.removeEventListener('msfullscreenerror', errorHandler, false);
    }
    this.fullscreenEventTarget_ = null;
    this.fullscreenChangeHandler_ = null;
    this.fullscreenErrorHandler_ = null;
  };
  VRDisplay.prototype.enableWakeLock = function () {
    if (this.wakelock_) {
      this.wakelock_.enable();
    }
  };
  VRDisplay.prototype.disableWakeLock = function () {
    if (this.wakelock_) {
      this.wakelock_.disable();
    }
  };
  VRDisplay.prototype.beginPresent_ = function () {
  };
  VRDisplay.prototype.endPresent_ = function () {
  };
  VRDisplay.prototype.submitFrame = function (pose) {
  };
  VRDisplay.prototype.getEyeParameters = function (whichEye) {
    return null;
  };

  var config = {
    MOBILE_WAKE_LOCK: true,
    DEBUG: false,
    DPDB_URL: 'https://dpdb.webvr.rocks/dpdb.json',
    K_FILTER: 0.98,
    PREDICTION_TIME_S: 0.040,
    CARDBOARD_UI_DISABLED: false,
    ROTATE_INSTRUCTIONS_DISABLED: false,
    YAW_ONLY: false,
    BUFFER_SCALE: 0.5,
    DIRTY_SUBMIT_FRAME_BINDINGS: false
  };

  var Eye = {
    LEFT: 'left',
    RIGHT: 'right'
  };
  function CardboardVRDisplay(config$1) {
    var defaults = extend({}, config);
    config$1 = extend(defaults, config$1 || {});
    VRDisplay.call(this, {
      wakelock: config$1.MOBILE_WAKE_LOCK
    });
    this.config = config$1;
    this.displayName = 'Cardboard VRDisplay';
    this.capabilities = new VRDisplayCapabilities({
      hasPosition: false,
      hasOrientation: true,
      hasExternalDisplay: false,
      canPresent: true,
      maxLayers: 1
    });
    this.stageParameters = null;
    this.bufferScale_ = this.config.BUFFER_SCALE;
    this.poseSensor_ = new PoseSensor(this.config);
    this.distorter_ = null;
    this.cardboardUI_ = null;
    this.dpdb_ = new Dpdb(this.config.DPDB_URL, this.onDeviceParamsUpdated_.bind(this));
    this.deviceInfo_ = new DeviceInfo(this.dpdb_.getDeviceParams());
    this.viewerSelector_ = new ViewerSelector();
    this.viewerSelector_.onChange(this.onViewerChanged_.bind(this));
    this.deviceInfo_.setViewer(this.viewerSelector_.getCurrentViewer());
  }
  CardboardVRDisplay.prototype = Object.create(VRDisplay.prototype);
  CardboardVRDisplay.prototype._getPose = function () {
    return {
      position: null,
      orientation: this.poseSensor_.getOrientation(),
      linearVelocity: null,
      linearAcceleration: null,
      angularVelocity: null,
      angularAcceleration: null
    };
  };
  CardboardVRDisplay.prototype._resetPose = function () {
    if (this.poseSensor_.resetPose) {
      this.poseSensor_.resetPose();
    }
  };
  CardboardVRDisplay.prototype._getFieldOfView = function (whichEye) {
    var fieldOfView;
    if (whichEye == Eye.LEFT) {
      fieldOfView = this.deviceInfo_.getFieldOfViewLeftEye();
    } else if (whichEye == Eye.RIGHT) {
      fieldOfView = this.deviceInfo_.getFieldOfViewRightEye();
    } else {
      console.error('Invalid eye provided: %s', whichEye);
      return null;
    }
    return fieldOfView;
  };
  CardboardVRDisplay.prototype._getEyeOffset = function (whichEye) {
    var offset;
    if (whichEye == Eye.LEFT) {
      offset = [-this.deviceInfo_.viewer.interLensDistance * 0.5, 0.0, 0.0];
    } else if (whichEye == Eye.RIGHT) {
      offset = [this.deviceInfo_.viewer.interLensDistance * 0.5, 0.0, 0.0];
    } else {
      console.error('Invalid eye provided: %s', whichEye);
      return null;
    }
    return offset;
  };
  CardboardVRDisplay.prototype.getEyeParameters = function (whichEye) {
    var offset = this._getEyeOffset(whichEye);
    var fieldOfView = this._getFieldOfView(whichEye);
    var eyeParams = {
      offset: offset,
      renderWidth: this.deviceInfo_.device.width * 0.5 * this.bufferScale_,
      renderHeight: this.deviceInfo_.device.height * this.bufferScale_
    };
    return eyeParams;
  };
  CardboardVRDisplay.prototype.onDeviceParamsUpdated_ = function (newParams) {
    if (this.config.DEBUG) {
      console.log('DPDB reported that device params were updated.');
    }
    this.deviceInfo_.updateDeviceParams(newParams);
    if (this.distorter_) {
      this.distorter_.updateDeviceInfo(this.deviceInfo_);
    }
  };
  CardboardVRDisplay.prototype.updateBounds_ = function () {
    if (this.layer_ && this.distorter_ && (this.layer_.leftBounds || this.layer_.rightBounds)) {
      this.distorter_.setTextureBounds(this.layer_.leftBounds, this.layer_.rightBounds);
    }
  };
  CardboardVRDisplay.prototype.beginPresent_ = function () {
    var gl = this.layer_.source.getContext('webgl');
    if (!gl) gl = this.layer_.source.getContext('experimental-webgl');
    if (!gl) gl = this.layer_.source.getContext('webgl2');
    if (!gl) return;
    if (this.layer_.predistorted) {
      if (!this.config.CARDBOARD_UI_DISABLED) {
        gl.canvas.width = getScreenWidth() * this.bufferScale_;
        gl.canvas.height = getScreenHeight() * this.bufferScale_;
        this.cardboardUI_ = new CardboardUI(gl);
      }
    } else {
      if (!this.config.CARDBOARD_UI_DISABLED) {
        this.cardboardUI_ = new CardboardUI(gl);
      }
      this.distorter_ = new CardboardDistorter(gl, this.cardboardUI_, this.config.BUFFER_SCALE, this.config.DIRTY_SUBMIT_FRAME_BINDINGS);
      this.distorter_.updateDeviceInfo(this.deviceInfo_);
    }
    if (this.cardboardUI_) {
      this.cardboardUI_.listen(function (e) {
        this.viewerSelector_.show(this.layer_.source.parentElement);
        e.stopPropagation();
        e.preventDefault();
      }.bind(this), function (e) {
        this.exitPresent();
        e.stopPropagation();
        e.preventDefault();
      }.bind(this));
    }
    this.orientationHandler = this.onOrientationChange_.bind(this);
    window.addEventListener('orientationchange', this.orientationHandler);
    this.vrdisplaypresentchangeHandler = this.updateBounds_.bind(this);
    window.addEventListener('vrdisplaypresentchange', this.vrdisplaypresentchangeHandler);
    this.fireVRDisplayDeviceParamsChange_();
  };
  CardboardVRDisplay.prototype.endPresent_ = function () {
    if (this.distorter_) {
      this.distorter_.destroy();
      this.distorter_ = null;
    }
    if (this.cardboardUI_) {
      this.cardboardUI_.destroy();
      this.cardboardUI_ = null;
    }
    this.viewerSelector_.hide();
    window.removeEventListener('orientationchange', this.orientationHandler);
    window.removeEventListener('vrdisplaypresentchange', this.vrdisplaypresentchangeHandler);
  };
  CardboardVRDisplay.prototype.updatePresent_ = function () {
    this.endPresent_();
    this.beginPresent_();
  };
  CardboardVRDisplay.prototype.submitFrame = function (pose) {
    if (this.distorter_) {
      this.updateBounds_();
      this.distorter_.submitFrame();
    } else if (this.cardboardUI_ && this.layer_) {
      var canvas = this.layer_.source.getContext('webgl').canvas;
      if (canvas.width != this.lastWidth || canvas.height != this.lastHeight) {
        this.cardboardUI_.onResize();
      }
      this.lastWidth = canvas.width;
      this.lastHeight = canvas.height;
      this.cardboardUI_.render();
    }
  };
  CardboardVRDisplay.prototype.onOrientationChange_ = function (e) {
    this.viewerSelector_.hide();
    this.onResize_();
  };
  CardboardVRDisplay.prototype.onResize_ = function (e) {
    if (this.layer_) {
      var gl = this.layer_.source.getContext('webgl');
      var cssProperties = ['position: absolute', 'top: 0', 'left: 0',
      'width: 100vw', 'height: 100vh', 'border: 0', 'margin: 0',
      'padding: 0px', 'box-sizing: content-box'];
      gl.canvas.setAttribute('style', cssProperties.join('; ') + ';');
    }
  };
  CardboardVRDisplay.prototype.onViewerChanged_ = function (viewer) {
    this.deviceInfo_.setViewer(viewer);
    if (this.distorter_) {
      this.distorter_.updateDeviceInfo(this.deviceInfo_);
    }
    this.fireVRDisplayDeviceParamsChange_();
  };
  CardboardVRDisplay.prototype.fireVRDisplayDeviceParamsChange_ = function () {
    var event = new CustomEvent('vrdisplaydeviceparamschange', {
      detail: {
        vrdisplay: this,
        deviceInfo: this.deviceInfo_
      }
    });
    window.dispatchEvent(event);
  };
  CardboardVRDisplay.VRFrameData = VRFrameData;
  CardboardVRDisplay.VRDisplay = VRDisplay;

  return CardboardVRDisplay;

})));
