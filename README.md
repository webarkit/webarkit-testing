# webarkit-testing

This is a repository testing for [**WebARKit**](https://github.com/webarkit). This will not became the official repository, it's only a testing repository to test the code and the features of WebARKit. When it will be ready and mature, the code wiil be hosted in a new repository.

## Features to add / issues to solve

- [x] Tracking inside a WebWorker to improve performances
- [x] Refactor the example and avoid Grayscale class to be used directly in WebARKitController
- [x] Fix jittering in detection phase.
- [x] Solve issue: Uncaught exception in processFrame https://github.com/kalwalt/webarkit-testing/issues/11.
- [x] Reduce code size of the final bundled library file.
- [ ] Improve stability and tracker detection.

## Building

### Pre-requisites

You need emscripten `3.1.26` because OpenCV may be built with this version. We are using our OpenCV (4.7.0) forked version.

### Instructions

Before all, you need to clone this repository with the WebARKitLib and opencv submodules:

```
git clone --recursive https://github.com/kalwalt/webarkit-testing.git
```

then if you plan to modify the C++ source code, you need to build opencv, run `./build_cv_w_docker.sh`, the script will build OpenCV with docker.

You are ready to modify the code and remember to re-build the project every time with: `npm run build` and  re-build js code with `npm run build-es6` if you want a dev build use  `npm run dev-es6`.
It is possible to build a debug version of the library with `npm run build-debug` and then run `npm run dev-es6` to update the dist library.

## Examples

Go in examples folder try one of the examples... point the camera to the pinball.jpg image and you will see some messages.
At the moment it support Akaze, Orb, Freak and Teblid. When the pinball image is detected and tracked it should display a colored image with a blue rect border around. Consider that the examples are not optimized for Mobile devices yet, best to try on desktop PC.

Try the live examples at [www.webarkit.org/examples/webarkit-testing](https://www.webarkit.org/examples/webarkit-testing)
