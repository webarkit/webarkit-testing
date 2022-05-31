# webarkit-testing

This is a repository testing for WebARKit. This will not became the official repository, it's only a test.

## Building

### Pre-requisites

You need emscripten `3.1.7` because openCV may be built with this version.

### Instructions

Before all, you need to clone this repository with the WebARKitLib submodule:

```
git clone --recursive https://github.com/kalwalt/webarkit-testing.git
```

then run `./build.sh` , the script will download the opencv pre-built.

You are ready to modify the code and remember to re-build the project every time with: `npm run build` and  re-build js code with `npm run dev-es6`

## Example

Go in examples folder try the example... point the pinball.jpg image and you will see some messages.
