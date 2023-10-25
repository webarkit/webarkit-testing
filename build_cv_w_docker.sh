#!/usr/bin/env bash

# Get our location.
OURDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

function usage () {
    echo "Usage: $(basename $0) (emscripten | emscripten-simd)"
    exit 1
}

if [ $# -eq 0 ]; then
    usage
fi

if [ ! -d "opencv_js" ] ; then
    mkdir opencv_js
    sudo chmod -R 777 opencv_js
    echo "mkdir opencv_js"
fi

# -e = exit on errors
set -e

while test $# -gt 0
do
    case "$1" in
        emscripten) BUILD=1
            ;;
        emscripten-simd) BUILD_SIMD=1
            ;;
        --*) echo "bad option $1"
            usage
            ;;
        *) echo "bad argument $1"
            usage
            ;;
    esac
    shift
done

SIMD=" "

if [ $BUILD_SIMD ] ; then
    SIMD=" --simd "
fi

docker run --rm -v $(pwd):/src -u $(id -u):$(id -g) -e "EMSCRIPTEN=/emsdk/upstream/emscripten"  emscripten/emsdk:3.1.26 emcmake python3 ./opencv/platforms/js/build_js.py opencv_js --config="./opencv.webarkit_config.py" $SIMD --build_wasm --cmake_option="-DBUILD_opencv_dnn=OFF"  --cmake_option="-DBUILD_opencv_objdetect=OFF" --cmake_option="-DBUILD_opencv_photo=OFF" --cmake_option="-DBUILD_opencv_imgcodecs=ON" --cmake_option="-DBUILD_opencv_xfeatures2d=ON"  --cmake_option="-DOPENCV_EXTRA_MODULES_PATH=../opencv_contrib/modules/" --build_flags="-Oz -s EXPORT_ES6=1 -s USE_ES6_IMPORT_META=0"

# copy the output to the build folder
#cp -r opencv_js/bin/opencv_js.js build