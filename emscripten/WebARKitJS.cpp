#include "WebARKitJS.h"

void WebARKit::initTracker(emscripten::val data_buffer, int width, int height) {
  std::vector<uint8_t> u8 =
      emscripten::convertJSArrayToNumberVector<uint8_t>(data_buffer);
  if (this->m_trackerType == TRACKER_TYPE::AKAZE_TRACKER) {
    m_akaze_tracker->initialize_raw(u8.data(), width, height);
  } else if (this->m_trackerType == TRACKER_TYPE::ORB_TRACKER) {
    m_orb_tracker->initialize_raw(u8.data(), width, height);
  } else {
    throw std::invalid_argument("Invalid tracker type");
  }
}

void WebARKit::initTrackerGray(emscripten::val data_buffer, int width, int height) {
  std::vector<uint8_t> u8 =
      emscripten::convertJSArrayToNumberVector<uint8_t>(data_buffer);
  if (this->m_trackerType == TRACKER_TYPE::AKAZE_TRACKER) {
    m_akaze_tracker->initialize_raw(u8.data(), width, height);
  } else if (this->m_trackerType == TRACKER_TYPE::ORB_TRACKER) {
    m_orb_tracker->initialize_gray_raw(u8.data(), width, height);
  } else {
    throw std::invalid_argument("Invalid tracker type");
  }
}

void WebARKit::processFrame(emscripten::val data_buffer) {
  std::vector<uint8_t> u8 =
      emscripten::convertJSArrayToNumberVector<uint8_t>(data_buffer);
  if (this->m_trackerType == TRACKER_TYPE::AKAZE_TRACKER) {
    m_akaze_tracker->processFrameData(u8.data(), this->videoWidth,
                                      this->videoHeight);
  } else if (this->m_trackerType == TRACKER_TYPE::ORB_TRACKER) {
    m_orb_tracker->processFrameData(u8.data(), this->videoWidth,
                                    this->videoHeight);
  } else {
    throw std::invalid_argument("Invalid tracker type");
  }
}

emscripten::val WebARKit::getHomography() {
  //double *output;
  std::vector<double> output;
  if (this->m_trackerType == TRACKER_TYPE::AKAZE_TRACKER) {
   // output = m_akaze_tracker->getOutputData();
  } else if (this->m_trackerType == TRACKER_TYPE::ORB_TRACKER) {
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
  //double *output;
  std::vector<double> output;
  if (this->m_trackerType == TRACKER_TYPE::AKAZE_TRACKER) {
    //output = m_akaze_tracker->getOutputData();
  } else if (this->m_trackerType == TRACKER_TYPE::ORB_TRACKER) {
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

emscripten::val WebARKit::getCorners2() {
   emscripten::val corners = emscripten::val::array();
  if (this->m_trackerType == TRACKER_TYPE::AKAZE_TRACKER) {
    corners = m_akaze_tracker->getCorners();
  } else if (this->m_trackerType == TRACKER_TYPE::ORB_TRACKER) {
    corners = m_orb_tracker->getCorners();
  } else {
    throw std::invalid_argument("Invalid tracker type");
  }
  return corners;
}

#include "bindings.cpp"