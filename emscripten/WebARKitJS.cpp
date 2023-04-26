#include "WebARKitJS.h"

void WebARKit::initTrackerGray(emscripten::val data_buffer, int width, int height) {
  auto u8 =
      emscripten::convertJSArrayToNumberVector<uint8_t>(data_buffer);
  if (this->m_trackerType == webarkit::TRACKER_TYPE::AKAZE_TRACKER) {
    m_akaze_tracker->initialize_gray_raw(u8.data(), width, height);
  } else if (this->m_trackerType == webarkit::TRACKER_TYPE::ORB_TRACKER) {
    m_orb_tracker->initialize_gray_raw(u8.data(), width, height);
  } else {
    throw std::invalid_argument("Invalid tracker type");
  }
}

void WebARKit::processFrame(emscripten::val data_buffer, webarkit::ColorSpace colorSpace) {
  auto u8 =
      emscripten::convertJSArrayToNumberVector<uint8_t>(data_buffer);
  if (this->m_trackerType == webarkit::TRACKER_TYPE::AKAZE_TRACKER) {
    m_akaze_tracker->processFrameData(u8.data(), this->videoWidth,
                                      this->videoHeight, colorSpace);
  } else if (this->m_trackerType == webarkit::TRACKER_TYPE::ORB_TRACKER) {
    m_orb_tracker->processFrameData(u8.data(), this->videoWidth,
                                    this->videoHeight, colorSpace);
  } else {
    throw std::invalid_argument("Invalid tracker type");
  }
}

emscripten::val WebARKit::getHomography() {
  std::vector<double> output;
  if (this->m_trackerType == webarkit::TRACKER_TYPE::AKAZE_TRACKER) {
    output = m_akaze_tracker->getOutputData();
  } else if (this->m_trackerType == webarkit::TRACKER_TYPE::ORB_TRACKER) {
    output = m_orb_tracker->getOutputData();
  } else {
    throw std::invalid_argument("Invalid tracker type");
  }
  emscripten::val homography = emscripten::val::array();
  for (auto i = 0; i < 9; i++) {
    homography.call<void>("push", output[i]);
  }
  return homography;
}


emscripten::val WebARKit::getCorners() {
   std::vector<double> output;
  if (this->m_trackerType == webarkit::TRACKER_TYPE::AKAZE_TRACKER) {
    output = m_akaze_tracker->getOutputData();
  } else if (this->m_trackerType == webarkit::TRACKER_TYPE::ORB_TRACKER) {
    output = m_orb_tracker->getOutputData();
  } else {
    throw std::invalid_argument("Invalid tracker type");
  }
  emscripten::val corners = emscripten::val::array();
  for (auto i = 9; i < 17; i++) {
    corners.call<void>("push", output[i]);
  }
  return corners;
}

bool WebARKit::isValid() {
  auto valid = false;
  if (this->m_trackerType == webarkit::TRACKER_TYPE::AKAZE_TRACKER) {
    valid = m_akaze_tracker->isValid();
  } else if (this->m_trackerType == webarkit::TRACKER_TYPE::ORB_TRACKER) {
    valid = m_orb_tracker->isValid();
  } else {
    throw std::invalid_argument("Invalid tracker type");
  }
  return valid;
}

#include "bindings.cpp"