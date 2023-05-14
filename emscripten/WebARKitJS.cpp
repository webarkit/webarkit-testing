#include "WebARKitJS.h"

bool WebARKit::updateWithTwoDResults(float trackingTrans[3][4]) {

    bool visible = false;
    float m_twoDScale = 1.0f;

    if (trackingTrans) {
        visible = true;
        for (int j = 0; j < 3; j++) {
            trans[j][0] = (ARdouble)trackingTrans[j][0];
            trans[j][1] = -(ARdouble)trackingTrans[j][1];
            trans[j][2] = -(ARdouble)trackingTrans[j][2];
            trans[j][3] = (ARdouble)(trackingTrans[j][3] * m_twoDScale * 0.001f * 1.64f);
        }
    } else
        visible = false;

    return visible;
}

void WebARKit::initialize_w(int videoWidth, int videoHeight, webarkit::TRACKER_TYPE trackerType) {
    this->videoWidth = videoWidth;
    this->videoHeight = videoHeight;
    this->m_trackerType = trackerType;
    m_tracker = std::make_shared<webarkit::WebARKitTracker>(webarkit::WebARKitTracker());
    if (this->m_trackerType == webarkit::TRACKER_TYPE::AKAZE_TRACKER || webarkit::TRACKER_TYPE::ORB_TRACKER) {
        m_tracker->initialize_w(trackerType, videoWidth, videoHeight);
    } else {
        throw std::invalid_argument("Invalid tracker type");
    }
}

void WebARKit::loadARParam(std::string paramName, webarkit::TRACKER_TYPE trackerType, size_t xsize, size_t ysize) {
    m_tracker->loadARParam(paramName, trackerType, xsize, ysize);
}

void WebARKit::addMarker(emscripten::val data_buffer, std::string filename, int width, int height, int markerID,
                         float scale) {
    auto u8 = emscripten::convertJSArrayToNumberVector<uint8_t>(data_buffer);
    m_tracker->AddMarker(u8.data(), filename, width, height, markerID, scale);
}

bool WebARKit::GetTrackablePose(int trackableId, float transMat[3][4]) {
    return m_tracker->GetTrackablePose(trackableId, transMat);
};

bool WebARKit::IsTrackableVisible(int trackableId) { return m_tracker->IsTrackableVisible(trackableId); }

emscripten::val WebARKit::getPoseMatrix(int trackableId) {
    emscripten::val res = emscripten::val::array();
    if (IsTrackableVisible(trackableId)) {
        float* ptr = m_tracker->GetTrackablePosePtr(trackableId);
        for (auto i = 0; i < 9; i++) {
            res.call<void>("push", ptr[i]);
        }
    }
    return res;
}

emscripten::val WebARKit::updatePose(int trackableId) {

    if (IsTrackableVisible(trackableId)) {
        std::cout << "Trackable is visible" << std::endl;
        float transMat[3][4];
        if (GetTrackablePose(trackableId, transMat)) {
            bool success = updateWithTwoDResults(transMat);
        } else {
            updateWithTwoDResults(NULL);
        }
    } else {
        updateWithTwoDResults(NULL);
    }

    return emscripten::val(emscripten::typed_memory_view(3 * 4, (ARdouble*)trans));
}

void WebARKit::initTrackerGray(emscripten::val data_buffer, int width, int height) {
    auto u8 = emscripten::convertJSArrayToNumberVector<uint8_t>(data_buffer);
    m_tracker->initTracker(u8.data(), width, height);
}

void WebARKit::processFrame(emscripten::val data_buffer, webarkit::ColorSpace colorSpace) {
    auto u8 = emscripten::convertJSArrayToNumberVector<uint8_t>(data_buffer);
    m_tracker->processFrameData(u8.data(), this->videoWidth, this->videoHeight, colorSpace);
}

void WebARKit::processFrame_w(emscripten::val data_buffer) {
    auto u8 = emscripten::convertJSArrayToNumberVector<uint8_t>(data_buffer);
    m_tracker->ProcessFrameData_w(u8.data());
}

emscripten::val WebARKit::getHomography() {
    std::vector<double> output;
    output = m_tracker->getOutputData();
    emscripten::val homography = emscripten::val::array();
    for (auto i = 0; i < 9; i++) {
        homography.call<void>("push", output[i]);
    }
    return homography;
}

emscripten::val WebARKit::getCorners() {
    std::vector<double> output;
    output = m_tracker->getOutputData();
    emscripten::val corners = emscripten::val::array();
    for (auto i = 9; i < 17; i++) {
        corners.call<void>("push", output[i]);
    }
    return corners;
}

bool WebARKit::isValid() { return m_tracker->isValid(); }

#include "bindings.cpp"