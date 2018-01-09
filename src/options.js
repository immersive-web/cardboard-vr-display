/*
 * Copyright 2015 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const config = {
  // By default, on mobile, a wakelock is necessary to prevent the device's screen
  // from turning off without user input. Disable if you're keeping the screen awake through
  // other means on mobile. A wakelock is never used on desktop.
  // Added in 1.0.3.
  MOBILE_WAKE_LOCK: true,

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

export default config;
