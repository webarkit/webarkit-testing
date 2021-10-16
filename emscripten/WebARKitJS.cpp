#include <iostream>
#include <stdio.h>
#include <string>
#include <sys/types.h>
#include <unordered_map>
#include <vector>
#include <AR/ar.h>
#include <AR2/config.h>
#include <AR2/imageFormat.h>
#include <AR2/util.h>
#include <WebARKitTrackers/WebARKitOpticalTracking/WebARKitOrbTracker.h>
#include <emscripten.h>

struct webARKitController {
  int id;
  int videoWidth;
  int videoHeight;
  int videoSize;
  unsigned char *videoFrame;
  int width;
  int height;
  int image2DSize;
  unsigned char *image2DFrame;
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

  warc->videoSize = videoWidth * videoHeight * 4 * sizeof(unsigned char);
  warc->videoFrame = (unsigned char *)malloc(warc->videoSize);

  EM_ASM(
      {
        console.log("Allocated videoSize: %d\n", $0);
        console.log("Allocated videoFrame, pointer is: %d\n", $1);
      },
      warc->videoSize, warc->videoFrame);

  EM_ASM_(
      {
        if (!webarkit["frameMalloc"]) {
          webarkit["frameMalloc"] = ({});
        }
        var frameMalloc = webarkit["frameMalloc"];
        frameMalloc["framevideopointer"] = $1;
        frameMalloc["framevideosize"] = $2;
      },
      warc->id, warc->videoFrame, warc->videoSize);

  return warc->id;
}

int initTracking(int id, const char* filename) {
  if (webARKitControllers.find(id) == webARKitControllers.end()) {
    return 0;
  }
  webARKitController *warc = &(webARKitControllers[id]);
  WebARKitOrbTracker tracker;
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
  EM_ASM( {console.log("ext: ", $0)}, ext);
  if (!ext) {
    ARLOGe("Error: unable to determine extension of file '%s'. Exiting.\n",
           filename);
    //EXIT(E_INPUT_DATA_ERROR);
  }
  if (strcmp(ext, "jpeg") == 0 || strcmp(ext, "jpg") == 0 ||
      strcmp(ext, "jpe") == 0) {
    ARLOGi("Reading JPEG file...\n");
    ar2UtilDivideExt(filename, buf1, buf2);
    jpegImage = ar2ReadJpegImage(buf1, buf2);
    if (jpegImage == NULL) {
      ARLOGe("Error: unable to read JPEG image from file '%s'. Exiting.\n",
             filename);
      //EXIT(E_INPUT_DATA_ERROR);
    }
    ARLOGi("   Done.\n");

    refCols = jpegImage->xsize;
    refRows = jpegImage->ysize;

    EM_ASM(console.log('Start to initialize tracker...'););
    tracker.initialize((unsigned char *)jpegImage, refCols, refRows);
    }
    return 0;
  }

  int readJpeg(int id, std::string filename) {
    ARLOGi("Filename is: '%s'\n", filename.c_str());
    initTracking(id, filename.c_str());
    return 0;
  }

  int resetTracking(int id, size_t refCols, size_t refRows) {
    if (webARKitControllers.find(id) == webARKitControllers.end()) {
      return 0;
    }
    webARKitController *warc = &(webARKitControllers[id]);
    WebARKitOrbTracker tracker;
    unsigned char *data;
    data = warc->videoFrame;

    EM_ASM(console.log('Reset tracking...'););

    double *out = tracker.resetTracking(data, refCols, refRows);
    EM_ASM(console.log('Reset done.'););
    return 0;
  }

  int track(int id, size_t refCols, size_t refRows) {
    if (webARKitControllers.find(id) == webARKitControllers.end()) {
      return 0;
    }
    webARKitController *warc = &(webARKitControllers[id]);
    WebARKitOrbTracker tracker;
    unsigned char *data;
    data = warc->videoFrame;

    EM_ASM(console.log('Start to initialize tracking...'););
    double *out = tracker.track(data, refCols, refRows);

    EM_ASM({ console.log("Output from tracker: %d\n", $0); }, &out);
    return 0;
  }
}

#include "bindings.cpp"
