#!/usr/bin/env bash

docker run --rm -v $(pwd):/src -u $(id -u):$(id -g) -e "EMSCRIPTEN=/emsdk/upstream/emscripten"  emscripten/emsdk:3.1.26 emcmake python3 ./opencv/platforms/js/build_js.py opencv_js --config="./opencv.webarkit_config.py" --build_wasm --simd --cmake_option="-DBUILD_opencv_dnn=OFF"  --cmake_option="-DBUILD_opencv_objdetect=OFF" --cmake_option="-DBUILD_opencv_photo=OFF" --cmake_option="-DBUILD_opencv_imgcodecs=ON" --cmake_option="-DBUILD_opencv_xfeatures2d=ON"  --cmake_option="-DOPENCV_EXTRA_MODULES_PATH=../opencv_contrib/modules/" --build_flags=" -D__EMSCRIPTEN_major__=3 -D__EMSCRIPTEN_minor__=1 -D__EMSCRIPTEN_tiny__=26 -Oz -s EXPORT_ES6=1 -s USE_ES6_IMPORT_META=0"

# copy the output to the build folder
#cp -r opencv_js/bin/opencv_js.js build