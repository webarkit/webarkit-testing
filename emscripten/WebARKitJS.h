#include <AR/ar.h>
#include <AR2/config.h>
#include <AR2/imageFormat.h>
#include <AR2/util.h>
#include <WebARKitManager.h>
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

    WebARKit(int videoWidth, int videoHeight, webarkit::TRACKER_TYPE trackerType) {
        this->videoWidth = videoWidth;
        this->videoHeight = videoHeight;
        this->m_trackerType = trackerType;

        manager.initialiseBase(m_trackerType, this->videoWidth, this->videoHeight);
    }

    void initTrackerGray(emscripten::val data_buffer, int width, int height);
    void processFrame(emscripten::val data_buffer, webarkit::ColorSpace colorSpace);
    void setLogLevel(int logLevel);
    emscripten::val getHomography();
    emscripten::val getPoseMatrix();
    emscripten::val getCameraProjectionMatrix();
    emscripten::val getCorners();
    bool isValid();

  private:
    int videoWidth;
    int videoHeight;
    webarkit::TRACKER_TYPE m_trackerType;
    webarkit::WebARKitManager manager;
};