#include <emscripten/bind.h>

using namespace emscripten;

EMSCRIPTEN_BINDINGS(constant_bindings) {
    function("setup", &setup);
    function("readJpeg", &readJpeg);
    function("processFrame", &processFrame);
    function("getVideo", &getVideo);
};
