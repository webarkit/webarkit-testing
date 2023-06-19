#include <emscripten/bind.h>

using namespace emscripten;

EMSCRIPTEN_BINDINGS(constant_bindings) {
  enum_<webarkit::TRACKER_TYPE>("TRACKER_TYPE")
      .value("TRACKER_AKAZE", webarkit::AKAZE_TRACKER)
      .value("TRACKER_FREAK", webarkit::FREAK_TRACKER)
      .value("TRACKER_TEBLID", webarkit::TEBLID_TRACKER)
      .value("TRACKER_ORB", webarkit::ORB_TRACKER);

  enum_<webarkit::ColorSpace>("ColorSpace")
      .value("RGBA", webarkit::RGBA)
      .value("RGB", webarkit::RGB)
      .value("GRAY", webarkit::GRAY);

  constant("WEBARKIT_LOG_LEVEL_DEBUG", WEBARKIT_LOG_LEVEL_DEBUG + 0);
  constant("WEBARKIT_LOG_LEVEL_INFO", WEBARKIT_LOG_LEVEL_INFO + 0);
  constant("WEBARKIT_LOG_LEVEL_WARN", WEBARKIT_LOG_LEVEL_WARN + 0);
  constant("WEBARKIT_LOG_LEVEL_ERROR", WEBARKIT_LOG_LEVEL_ERROR + 0);
  constant("WEBARKIT_LOG_LEVEL_REL_INFO", WEBARKIT_LOG_LEVEL_REL_INFO + 0);

  class_<WebARKit>("WebARKit")
      .constructor<>()
      .constructor<int, int, webarkit::TRACKER_TYPE>()
      .function("initTrackerGray", &WebARKit::initTrackerGray)
      .function("processFrame", &WebARKit::processFrame)
      .function("setLogLevel", &WebARKit::setLogLevel)
      .function("getHomography", &WebARKit::getHomography)
      .function("getCorners", &WebARKit::getCorners)
      .function("isValid", &WebARKit::isValid);
};
