#include "WebARKitJS.h"

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

void WebARKit::loadARParam(std::string paramName, webarkit::TRACKER_TYPE trackerType) {
    m_tracker->loadARParam(paramName, trackerType);
}

void WebARKit::addMarker(emscripten::val data_buffer, std::string filename, int width, int height, int markerID,
                         float scale) {
    auto u8 = emscripten::convertJSArrayToNumberVector<uint8_t>(data_buffer);
    m_tracker->AddMarker(u8.data(), filename, width, height, markerID, scale);
}

bool WebARKit::GetTrackablePose(int trackableId, float transMat[3][4]){
    return m_tracker->GetTrackablePose(trackableId, transMat);
};

bool WebARKit::IsTrackableVisible(int trackableId) {
    return m_tracker->IsTrackableVisible(trackableId);
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