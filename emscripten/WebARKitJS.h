#include <AR/ar.h>
#include <AR2/config.h>
#include <AR2/imageFormat.h>
#include <AR2/util.h>
#include <WebARKitManager.h>
#include <WebARKitTrackers/WebARKitOpticalTracking/WebARKitEnums.h>
#include <WebARKitTrackers/WebARKitOpticalTracking/WebARKitTracker.h>
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

    WebARKit(int videoWidth, int videoHeight, webarkit::TRACKER_TYPE trackerType) {
        this->videoWidth = videoWidth;
        this->videoHeight = videoHeight;
        this->m_trackerType = trackerType;

        manager.initialiseBase(m_trackerType);

        /*m_tracker = std::make_shared<webarkit::WebARKitTracker>(webarkit::WebARKitTracker());
        if(this->m_trackerType == webarkit::TRACKER_TYPE::AKAZE_TRACKER || webarkit::TRACKER_TYPE::ORB_TRACKER) {
          m_tracker->initialize(trackerType);
        } else {
          throw std::invalid_argument("Invalid tracker type");
        }*/
    }

    void initTrackerGray(emscripten::val data_buffer, int width, int height);
    void processFrame(emscripten::val data_buffer, webarkit::ColorSpace colorSpace);
    emscripten::val getHomography();
    emscripten::val getCorners();
    bool isValid();

  private:
    int videoWidth;
    int videoHeight;
    webarkit::TRACKER_TYPE m_trackerType;
    webarkit::WebARKitManager manager;
    std::shared_ptr<webarkit::WebARKitTracker> m_tracker;
};