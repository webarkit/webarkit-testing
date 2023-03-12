#include <emscripten/bind.h>

using namespace emscripten;

EMSCRIPTEN_BINDINGS(constant_bindings) {
    enum_<TRACKER_TYPE>("TRACKER_TYPE")
        .value("TRACKER_AKAZE", AKAZE_TRACKER)
        .value("TRACKER_ORB", ORB_TRACKER);

    class_<WebARKit>("WebARKit")
        .constructor<>()
        .constructor<int,int,TRACKER_TYPE>()
        .function("initTracker", &WebARKit::initTracker)
        .function("processFrame", &WebARKit::processFrame)
        .function("getHomography", &WebARKit::getHomography)
        .function("getCorners", &WebARKit::getCorners)
        .function("getCorners2", &WebARKit::getCorners2);
};
