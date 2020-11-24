#include <emscripten/bind.h>

using namespace emscripten;

EMSCRIPTEN_BINDINGS(constant_bindings) {
    function("test", &test);
    //function("initTracking", &initTracking);
}
