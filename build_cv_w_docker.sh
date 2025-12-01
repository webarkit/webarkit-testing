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
    # No sudo needed here, the user running the script owns the new directory.
    # On Linux, Docker permissions are handled by the -u flag later.
    chmod -R 777 opencv_js
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

# Add user flag for Linux to avoid root-owned files, but not for Windows (Git Bash).
USER_FLAG=""
if [[ "$(uname -s)" == "Linux" ]]; then
    USER_FLAG="-u $(id -u):$(id -g)"
fi

# The fix is to call python3 directly. The build_js.py script will invoke emcmake itself.
# Using --workdir=//src prevents Git Bash on Windows from mangling the path.
docker run --rm -v "$(pwd)":/src --workdir=//src ${USER_FLAG} -e "EMSCRIPTEN=/emsdk/upstream/emscripten"  emscripten/emsdk:3.1.26 python3 ./opencv/platforms/js/build_js.py opencv_js --config="./opencv.webarkit_config.py" $SIMD --build_wasm --cmake_option="-DBUILD_opencv_dnn=OFF"  --cmake_option="-DBUILD_opencv_objdetect=OFF" --cmake_option="-DBUILD_opencv_photo=OFF" --cmake_option="-DBUILD_opencv_imgcodecs=ON" --cmake_option="-DBUILD_opencv_xfeatures2d=ON"  --cmake_option="-DOPENCV_EXTRA_MODULES_PATH=../opencv_contrib/modules/" --build_flags=" -fwasm-exceptions -mbulk-memory -mnontrapping-fptoint -sWASM_BIGINT -sSUPPORT_LONGJMP=wasm "

# copy the output to the build folder
#cp -r opencv_js/bin/opencv_js.js build