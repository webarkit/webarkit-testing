export class WebARKitWorker {
    constructor(trackerGrayImage, videoWidth, videoHeight, imgWidth, imgHeight, trackerType) {
        this.worker;
        this.trackerGrayImage = trackerGrayImage;
        this.videoWidth = videoWidth;
        this.videoHeight = videoHeight;
        this.imgWidth = imgWidth;
        this.imgHeight = imgHeight;
        this.trackerType = trackerType;
    }

    async initialize() {
        console.log("WebARKitWorker initialized");
        this.worker = new Worker(new URL("./Worker", import.meta.url));
        return await this.loadTracker()
    }

    async loadTracker(){
        this.worker.postMessage({
            type: "loadTracker",
            imgData: this.trackerGrayImage,
            videoWidth: this.videoWidth,
            videoHeight: this.videoHeight,
            imgWidth: this.imgWidth,
            imgHeight: this.imgHeight,
            trackerType: this.trackerType,
          });
          return Promise.resolve(true);
    }
}