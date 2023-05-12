#include <AR/ar.h>
#include <AR2/config.h>
#include <AR2/imageFormat.h>
#include <AR2/util.h>
/*#include <WebARKitTrackers/WebARKitOpticalTracking/WebARKitAkazeTracker.h>
#include <WebARKitTrackers/WebARKitOpticalTracking/WebARKitEnums.h>
#include <WebARKitTrackers/WebARKitOpticalTracking/WebARKitOrbTracker.h>*/
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
        m_tracker = std::make_shared<webarkit::WebARKitTracker>(webarkit::WebARKitTracker());
        if (this->m_trackerType == webarkit::TRACKER_TYPE::AKAZE_TRACKER || webarkit::TRACKER_TYPE::ORB_TRACKER) {
            m_tracker->initialize(trackerType);
        } else {
            throw std::invalid_argument("Invalid tracker type");
        }
    }

    void initialize_w(int videoWidth, int videoHeight, webarkit::TRACKER_TYPE trackerType);

    void loadARParam(std::string paramName, webarkit::TRACKER_TYPE trackerType);

    void addMarker(emscripten::val data_buffer, std::string filename, int width, int height, int markerID, float scale);

    bool GetTrackablePose(int trackableId, float transMat[3][4]);

    bool IsTrackableVisible(int trackableId);

    emscripten::val updatePose(int trackableId);

    bool updateWithTwoDResults(float trackingTrans[3][4]);

    void initTrackerGray(emscripten::val data_buffer, int width, int height);
    void processFrame(emscripten::val data_buffer, webarkit::ColorSpace colorSpace);
    void processFrame_w(emscripten::val data_buffer);
    emscripten::val getHomography();
    emscripten::val getCorners();
    bool isValid();

  private:
    ARdouble trans[3][4]; 
    int videoWidth;
    int videoHeight;
    int m_trackerType;
    std::shared_ptr<webarkit::WebARKitTracker> m_tracker;
};