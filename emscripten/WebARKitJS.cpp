#include <stdio.h>
#include <emscripten.h>
#include <string>
#include <vector>
#include <unordered_map>
#include <iostream>
#include <WebARKitTrackers/WebARKitOpticalTracking/WebARKitOrbTracker.h>

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
   void test() {
     EM_ASM(
       console.log("This is a test from WebARKitJS.cpp!")
     );
   }

   int setup(int width, int height, int videoWidth, int videoHeight) {
 		int id = gwebARKitControllerID++;
 		webARKitController *warc = &(webARKitControllers[id]);
 		warc->id = id;

    warc->videoWidth = videoWidth;
 		warc->videoHeight = videoHeight;

 		warc->videoSize = videoWidth * videoHeight * 4 * sizeof(unsigned char);
 		warc->videoFrame = (unsigned char*) malloc(warc->videoSize);

 		warc->width = width;
 		warc->height = height;

 		warc->image2DSize = width * height * 4 * sizeof(unsigned char);
 		warc->image2DFrame = (unsigned char*) malloc(warc->image2DSize);

    EM_ASM({
      console.log("Allocated videoSize: %d\n", $0);
      console.log("Allocated videoFrame, pointer is: %d\n", $1);
      console.log("Allocated image2DSize: %d\n", $2);
      console.log("Allocated image2DFrame, pointer is: %d\n", $3);
    },
      warc->videoSize,
      warc->videoFrame,
      warc->image2DSize,
      warc->image2DFrame
    );


 		EM_ASM_({
 			if (!webarkit["frameMalloc"]) {
 				webarkit["frameMalloc"] = ({});
 			}
 			var frameMalloc = webarkit["frameMalloc"];
 			frameMalloc["framevideopointer"] = $1;
 			frameMalloc["framevideosize"] = $2;
      frameMalloc["frame2Dpointer"] = $3;
 			frameMalloc["frame2Dsize"] = $4;
 		},
 			warc->id,
      warc->videoSize,
      warc->videoFrame,
 			warc->image2DFrame,
 			warc->image2DSize
 		);

 		return warc->id;
 	}


    int initTracking(int id, size_t refCols, size_t refRows) {
      if (webARKitControllers.find(id) == webARKitControllers.end()) { return 0; }
      webARKitController *warc = &(webARKitControllers[id]);
      WebARKitOrbTracker tracker;
      unsigned char *data;
      data = warc->image2DFrame;

      EM_ASM(
        console.log('Start to initialize tracker...');
      );
      tracker.initialize(data, refCols, refRows);
      return 0;
    }

    int track(int id, size_t refCols, size_t refRows) {
      if (webARKitControllers.find(id) == webARKitControllers.end()) { return 0; }
      webARKitController *warc = &(webARKitControllers[id]);
      WebARKitOrbTracker tracker;
      unsigned char *data;
      data = warc->videoFrame;

      EM_ASM(
        console.log('Start to initialize tracking...');
      );
      tracker.track(data, refCols, refRows);
      return 0;
    }


}

#include "bindings.cpp"
