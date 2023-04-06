# webarkit-testing

This is a repository testing for WebARKit. This will not became the official repository, it's only a test.

## Features to add

- [ ] Tracking inside a WebWorker to improve performances
- [ ] Refactor the example and avoid Grayscale class to be used directly in WebARKitController

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

## Example

Go in examples folder try the example... point the pinball.jpg image and you will see some messages.
At the moment it support Akaze or Orb, when the pinball image is detected and tracked it should display a Wikipedia web page and blue rect border around.
