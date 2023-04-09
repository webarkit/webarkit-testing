var oWidth = window.innerWidth;
var oHeight = window.innerHeight;

var videoEl;
var grayScaleVideo;
var grayScaleImage;

window.onload = function () {
    console.log(WebARKit);
    videoEl = createVideo();
    createVideoCanvas();
    createOverlayCanvas();

    const refIm = document.getElementById("refIm");
    graysScaleImage = new WebARKit.GrayScaleMedia(refIm, refIm.width, refIm.height);
    const grayImageData = graysScaleImage.getFrame();

    WebARKit.WebARKitController.init2(videoEl, grayImageData, oWidth, oHeight, refIm.width, refIm.height, 'akaze').then(wark => {
        grayscaleVideo = new WebARKit.GrayScaleMedia(videoEl, oWidth, oHeight)

        grayscaleVideo
            .requestStream()
            .then((videoSource) => {

                const update = () => {
                    var grayVideoData = grayscaleVideo.getFrame();
                    wark.process2(grayVideoData);
                    wark.found();
                    const videoCanvasCtx = videoCanvas.getContext("2d");
                    videoCanvasCtx.drawImage(
                        videoSource, 0, 0, oWidth, oHeight
                    );
                    document.addEventListener("cornerEvent", function (e) {
                        console.log(e.detail);
                    });
                    requestAnimationFrame(update);
                };
                update();
            })
            .catch((err) => {
                console.warn("ERROR: " + err);
            });
    })
}

function setVideoStyle(elem) {
    elem.style.position = "absolute";
    elem.style.top = 0;
    elem.style.left = 0;
}

function createVideo() {
    var video = document.createElement("video");
    video.id = "video";
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    return video;
}

function createVideoCanvas() {
    videoCanvas = document.createElement("canvas");
    setVideoStyle(videoCanvas);
    videoCanvas.id = "video-canvas";
    videoCanvas.width = oWidth;
    videoCanvas.height = oHeight;
    document.body.appendChild(videoCanvas);
}

function createOverlayCanvas() {
    overlayCanvas = document.createElement("canvas");
    setVideoStyle(overlayCanvas);
    overlayCanvas.id = "overlay";
    overlayCanvas.width = oWidth;
    overlayCanvas.height = oHeight;
    overlayCanvas.style.zIndex = 1;
    document.body.appendChild(overlayCanvas);
}