#include <emscripten/bind.h>

using namespace emscripten;

EMSCRIPTEN_BINDINGS(constant_bindings) {
    function("test", &test);
    function("setup", &setup);
    function("imageSetup", &imageSetup);
    function("readJpeg", &readJpeg);
    function("resetTracking", &resetTracking);
    function("track", &track);
}
