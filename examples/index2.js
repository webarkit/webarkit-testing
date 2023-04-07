var oWidth = window.innerWidth;
var oHeight = window.innerHeight;

var videoEl;
var grayScaleVideo;
var grayScaleImage;

window.onload = function () {   
    console.log(WebARKit);
    videoEl = createVideo();

    const refIm = document.getElementById("refIm");
    graysScaleImage = new WebARKit.GrayScaleMedia(refIm, refIm.width, refIm.height);
    const grayImageData = graysScaleImage.getFrame();

    //grayscaleVideo = new WebARKit.GrayScaleMedia(videoEl, oWidth, oHeight)
    //console.log(grayscaleVideo);


    WebARKit.WebARKitController.init2(videoEl, grayImageData, 640, 480, refIm.width, refIm.height, 'akaze').then(wark => {
       
    })
}

function createVideo() {
    var video = document.createElement("video");
    video.id = "video";
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    return video;
}