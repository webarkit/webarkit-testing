#include <emscripten/bind.h>

using namespace emscripten;

EMSCRIPTEN_BINDINGS(constant_bindings) {
  enum_<webarkit::TRACKER_TYPE>("TRACKER_TYPE")
      .value("TRACKER_AKAZE", webarkit::AKAZE_TRACKER)
      .value("TRACKER_ORB", webarkit::ORB_TRACKER);

  enum_<webarkit::ColorSpace>("ColorSpace")
      .value("RGBA", webarkit::RGBA)
      .value("RGB", webarkit::RGB)
      .value("GRAY", webarkit::GRAY);

  class_<WebARKit>("WebARKit")
      .constructor<>()
      .constructor<int, int, webarkit::TRACKER_TYPE>()
      .function("initialize_w", &WebARKit::initialize_w)
      .function("loadARParam", &WebARKit::loadARParam)
      .function("addMarker", &WebARKit::addMarker)
      .function("GetTrackablePose", &WebARKit::GetTrackablePose, allow_raw_pointers())
      .function("getPoseMatrix", &WebARKit::getPoseMatrix)
      .function("IsTrackableVisible", &WebARKit::IsTrackableVisible)
      .function("updatePose", &WebARKit::updatePose)
      .function("initTrackerGray", &WebARKit::initTrackerGray)
      .function("processFrame", &WebARKit::processFrame)
      .function("processFrame_w", &WebARKit::processFrame_w)
      .function("getHomography", &WebARKit::getHomography)
      .function("getCorners", &WebARKit::getCorners)
      .function("isValid", &WebARKit::isValid);
};
