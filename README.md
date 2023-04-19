# webarkit-testing

This is a repository testing for [**WebARKit**](https://github.com/webarkit). This will not became the official repository, it's only a test.

## Features to add

- [x] Tracking inside a WebWorker to improve performances
- [x] Refactor the example and avoid Grayscale class to be used directly in WebARKitController
- [x] Fix jittering in detection phase.
- [ ] Reduce code size of the final bundled library file.
- [ ] Improve stability and tracker detection.

## Building

### Pre-requisites

You need emscripten `3.1.26` because openCV may be built with this version.

### Instructions

Before all, you need to clone this repository with the WebARKitLib submodule:

```
git clone --recursive https://github.com/kalwalt/webarkit-testing.git
```

then if you plan to modify the C++ source code run `./build.sh` , the script will download the opencv pre-built.

You are ready to modify the code and remember to re-build the project every time with: `npm run build` and  re-build js code with `npm run dev-es6`

## Examples

Go in examples folder try one of the examples... point the camera to the pinball.jpg image and you will see some messages.
At the moment it support Akaze or Orb, when the pinball image is detected and tracked it should display a colored image and blue rect border around.

Try the live examples at https://kalwalt.github.io/webarkit-testing/
