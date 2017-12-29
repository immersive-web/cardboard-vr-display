# cardboard-vr-display

[![Build Status](http://img.shields.io/travis/googlevr/cardboard-vr-display.svg?style=flat-square)](https://travis-ci.org/googlevr/cardboard-vr-display)
[![Build Status](http://img.shields.io/npm/v/cardboard-vr-display.svg?style=flat-square)](https://www.npmjs.org/package/cardboard-vr-display)

A JavaScript implementation of a [WebVR 1.1 VRDisplay][VRDisplay]. This is the magic
behind rendering distorted stereoscopic views for browsers that do not support the [WebVR API]
with the [webvr-polyfill].

Unless you're building a WebVR wrapper, you probably want to use [webvr-polyfill] directly
rather than this. This component **does not** polyfill interfaces like `VRFrameData` and
`navigator.getVRDisplays`, and up to the consumer, although trivial (see examples).

## How It Works

`CardboardVRDisplay` uses DeviceMotionEvents to implement a complementary
filter which does [sensor fusion and pose prediction][fusion] to provide
orientation tracking. It can also render in stereo mode, and includes mesh-based
lens distortion. This display also includes user interface elements in VR mode
to make the VR experience more intuitive, including:

- A gear icon to select your VR viewer.
- A back button to exit VR mode.
- An interstitial which only appears in portrait orientation, requesting you switch
  into landscape orientation (if [orientation lock][ol] is not available).

[fusion]: http://smus.com/sensor-fusion-prediction-webvr/
[ol]: https://www.w3.org/TR/screen-orientation/

### I-Frames

On iOS, cross-origin iframes do not have access to the `devicemotion` events. The CardboardVRDisplay however
does respond to events passed in from a parent frame via `postMessage`. See the [iframe example][iframe-example] to see how the events must be formatted.

## Installation

```
$ npm install --save cardboard-vr-display
```

## Usage

`cardboard-vr-display` exposes a constructor for a `CardboardVRDisplay` that takes
a single options configuration, detailed below. Check out [running the demo](#running-the-demo)
to try the different options.

```js
import CardboardVRDisplay from 'cardboard-vr-display';

// Default options
const options = {
  // Whether or not CardboardVRDisplay is in debug mode. Logs extra
  // messages. Added in 1.0.2.
  DEBUG: false,

  // The URL to JSON of DPDB information. By default, uses the data
  // from https://github.com/WebVRRocks/webvr-polyfill-dpdb; if left
  // falsy, then no attempt is made.
  // Added in 1.0.1
  DPDB_URL: 'https://dpdb.webvr.rocks/dpdb.json',

  // Complementary filter coefficient. 0 for accelerometer, 1 for gyro.
  K_FILTER: 0.98,

  // How far into the future to predict during fast motion (in seconds).
  PREDICTION_TIME_S: 0.040,

  // Flag to enable touch panner. In case you have your own touch controls.
  TOUCH_PANNER_DISABLED: true,

  // Flag to disabled the UI in VR Mode.
  CARDBOARD_UI_DISABLED: false,

  // Flag to disable the instructions to rotate your device.
  ROTATE_INSTRUCTIONS_DISABLED: false,

  // Enable yaw panning only, disabling roll and pitch. This can be useful
  // for panoramas with nothing interesting above or below.
  YAW_ONLY: false,

  // Scales the recommended buffer size reported by WebVR, which can improve
  // performance.
  // UPDATE(2016-05-03): Setting this to 0.5 by default since 1.0 does not
  // perform well on many mobile devices.
  BUFFER_SCALE: 0.5,

  // Allow VRDisplay.submitFrame to change gl bindings, which is more
  // efficient if the application code will re-bind its resources on the
  // next frame anyway. This has been seen to cause rendering glitches with
  // THREE.js.
  // Dirty bindings include: gl.FRAMEBUFFER_BINDING, gl.CURRENT_PROGRAM,
  // gl.ARRAY_BUFFER_BINDING, gl.ELEMENT_ARRAY_BUFFER_BINDING,
  // and gl.TEXTURE_BINDING_2D for texture unit 0.
  DIRTY_SUBMIT_FRAME_BINDINGS: false,
};

const display = new CardboardVRDisplay(options);

function MockVRFrameData () {
  this.leftViewMatrix = new Float32Array(16);
  this.rightViewMatrix = new Float32Array(16);
  this.leftProjectionMatrix = new Float32Array(16);
  this.rightProjectionMatrix = new Float32Array(16);
  this.pose = null;
};

const frame = new (window.VRFrameData || MockVRFrameData)();

display.isConnected; // true
display.getFrameData(frame);

frame.rightViewMatrix; // Float32Array
frame.pose; // { orientation, position }
```

## Development

* `npm install`: installs the dependencies.
* `npm run build`: builds the distributable.

## Running The Demo

View the [example] to see a demo running the CardboardVRDisplay. This executes
a minimal WebVR 1.1 polyfill and parses query params to inject configuration parameters.
View some premade links at [index.html]. For example, to set the buffer scale to 1.0
and limit rotation to yaw, go to [https://googlevr.github.io/cardboard-vr-display/examples/index.html?YAW_ONLY=true&BUFFER_SCALE=1.0].
View all config options at `src/options.js`.

## License

This program is free software for both commercial and non-commercial use,
distributed under the [Apache 2.0 License](LICENSE).

[VRDisplay]: https://w3c.github.io/webvr/spec/1.1/#interface-vrdisplay
[WebVR API 1.1]: https://w3c.github.io/webvr/spec/1.1
[WebVR API]: https://w3c.github.io/webvr/spec/latest
[webvr-polyfill]: https://github.com/googlevr/webvr-polyfill
[example]: https://googlevr.github.io/cardboard-vr-display/examples
[iframe-example]: examples/iframe.html
[index.html]: https://googlevr.github.io/cardboard-vr-display
