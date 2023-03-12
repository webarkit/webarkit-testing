#include <AR/ar.h>
#include <AR2/config.h>
#include <AR2/imageFormat.h>
#include <AR2/util.h>
#include <WebARKitTrackers/WebARKitOpticalTracking/WebARKitAkazeTracker.h>
#include <WebARKitTrackers/WebARKitOpticalTracking/WebARKitOrbTracker.h>
#include <WebARKitTrackers/WebARKitOpticalTracking/WebARKitEnums.h>
#include <emscripten.h>
#include <emscripten/val.h>
#include <iostream>
#include <opencv2/core.hpp>
#include <opencv2/core/types_c.h>
#include <opencv2/opencv.hpp>
#include <stdio.h>
#include <string>
#include <sys/types.h>
#include <unordered_map>
#include <vector>

using namespace emscripten;

class WebARKit {
public:
  WebARKit() = default;
  WebARKit(int videoWidth, int videoHeight, TRACKER_TYPE trackerType) {
    this->videoWidth = videoWidth;
    this->videoHeight = videoHeight;
    this->m_trackerType = trackerType;
    if(this->m_trackerType == TRACKER_TYPE::AKAZE_TRACKER) {
      m_akaze_tracker = std::make_unique<WebARKitAkazeTracker>(WebARKitAkazeTracker());
    } else if(this->m_trackerType == TRACKER_TYPE::ORB_TRACKER) {
      m_orb_tracker = std::make_unique<WebARKitOrbTracker>(WebARKitOrbTracker());
    } else {
      throw std::invalid_argument("Invalid tracker type");
    }
  }

  void initTracker(emscripten::val data_buffer, int width, int height);
  void processFrame(emscripten::val data_buffer);
  emscripten::val getHomography();
  emscripten::val getCorners();
  emscripten::val getCorners2();

private:
  int videoWidth;
  int videoHeight;
  int m_trackerType;
  std::unique_ptr<WebARKitAkazeTracker> m_akaze_tracker;
  std::unique_ptr<WebARKitOrbTracker> m_orb_tracker;
};