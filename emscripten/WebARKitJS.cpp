#include <AR/ar.h>
#include <AR2/config.h>
#include <AR2/imageFormat.h>
#include <AR2/util.h>
#include <WebARKitTrackers/WebARKitOpticalTracking/WebARKitOrbTracker.h>
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

struct webARKitController {
  int id;
  int videoWidth;
  int videoHeight;
  std::unique_ptr<WebARKitOrbTracker> m_tracker;
};

std::unordered_map<int, webARKitController> webARKitControllers;

static int gwebARKitControllerID = 0;

extern "C" {

int setup(int videoWidth, int videoHeight) {
  int id = gwebARKitControllerID++;

  webARKitController *warc = &(webARKitControllers[id]);
  warc->id = id;

  warc->videoWidth = videoWidth;
  warc->videoHeight = videoHeight;

  if (!warc->m_tracker) {
    warc->m_tracker =
        std::make_unique<WebARKitOrbTracker>(WebARKitOrbTracker());
  } else {
    EM_ASM({console.log("Failed to init WebARKitOrbTracker!")});
    return 0;
  }

  return warc->id;
}

int initTracking(int id, const char *filename) {
  if (webARKitControllers.find(id) == webARKitControllers.end()) {
    return 0;
  }
  webARKitController *warc = &(webARKitControllers[id]);

  EM_ASM(console.log('Start WebARKitOrbTracker tracker...'););

  char *ext;
  char buf1[512], buf2[512];
  size_t refCols;
  size_t refRows;

  AR2JpegImageT *jpegImage;
  if (!filename) {
    return 0;
  }
  ext = arUtilGetFileExtensionFromPath(filename, 1);
  EM_ASM(
      {
        var message = UTF8ToString($0);
        console.log("ext: ", message)
      },
      ext);
  if (!ext) {
    ARLOGe("Error: unable to determine extension of file '%s'. Exiting.\n",
           filename);
    return -1;
  }
  if (strcmp(ext, "jpeg") == 0 || strcmp(ext, "jpg") == 0 ||
      strcmp(ext, "jpe") == 0) {
    ARLOGi("Reading JPEG file...\n");
    ar2UtilDivideExt(filename, buf1, buf2);
    jpegImage = ar2ReadJpegImage(buf1, buf2);
    if (jpegImage == NULL) {
      ARLOGe("Error: unable to read JPEG image from file '%s'. Exiting.\n",
             filename);
      return -1;
    }
    ARLOGi("   Done.\n");

    refCols = jpegImage->xsize;
    refRows = jpegImage->ysize;

    ARLOGi("Number of channels: %d\n", jpegImage->nc);

    EM_ASM(console.log('Start to initialize tracker...'););

    warc->m_tracker->initialize((unsigned char *)jpegImage->image, refCols,
                                refRows);

    free(jpegImage);
    free(ext);
  }
  return 0;
}

int readJpeg(int id, std::string filename) {
  ARLOGi("Filename is: '%s'\n", filename.c_str());
  if (initTracking(id, filename.c_str()) < 0) {
    ARLOGe("Error loading tracker image!");
  };
  return 0;
}

int processFrame(int id, val data_buffer) {
  if (webARKitControllers.find(id) == webARKitControllers.end()) {
    return 0;
  }
  webARKitController *warc = &(webARKitControllers[id]);

  std::vector<uint8_t> u8 =
      emscripten::convertJSArrayToNumberVector<uint8_t>(data_buffer);

  warc->m_tracker->processFrameData(u8.data(), warc->videoWidth,
                                    warc->videoHeight);
  return 1;
}

emscripten::val getHomography(int id) {
  if (webARKitControllers.find(id) == webARKitControllers.end()) {
    return emscripten::val::null();
  }
  webARKitController *warc = &(webARKitControllers[id]);

  double *output = warc->m_tracker->getOutputData();
  emscripten::val homography = emscripten::val::array();
  for (auto i = 0; i < 9; i++) {
    homography.call<void>("push", output[i]);
  }
  return homography;
}

emscripten::val getCorners(int id) {
  if (webARKitControllers.find(id) == webARKitControllers.end()) {
    return emscripten::val::null();
  }
  webARKitController *warc = &(webARKitControllers[id]);

  double *output = warc->m_tracker->getOutputData();
  emscripten::val corners = emscripten::val::array();
  for (auto i = 9; i < 17; i++) {
    corners.call<void>("push", output[i]);
  }
  return corners;
}
}

#include "bindings.cpp"
