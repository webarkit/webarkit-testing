#include <emscripten/bind.h>

using namespace emscripten;

EMSCRIPTEN_BINDINGS(constant_bindings) {
    function("test", &test);
    function("setup", &setup);
    function("initTracking", &initTracking, allow_raw_pointers());
}
