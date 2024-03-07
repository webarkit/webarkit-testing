async function loadSpeedyImage(id) {
    // Load an image
    const img = document.getElementById(id);
    const media = await Speedy.load(img);

    // Setup the pipeline
    const pipeline = Speedy.Pipeline(); // create the pipeline and the nodes
    const source = Speedy.Image.Source();
    const sink = Speedy.Image.Sink();

    const greyscale = Speedy.Filter.Greyscale();

    source.media = media; // set the media source

    source.output().connectTo(greyscale.input()); // connect the nodes
    greyscale.output().connectTo(sink.input());

    pipeline.init(source, sink, greyscale); // add the nodes to the pipeline

    const { image } = await pipeline.run(); // image is a SpeedyMedia

    return getImgData(image);
}

async function loadSpeedyVideo(id) {

    // Load a video
    const video = document.getElementById(id);
    const media = await Speedy.load(video);

    // Setup the pipeline
    const pipeline = Speedy.Pipeline(); // create the pipeline and the nodes
    const source = Speedy.Image.Source();
    const sink = Speedy.Image.Sink();
    const greyscale = Speedy.Filter.Greyscale();

    source.media = media; // set the media source

    source.output().connectTo(greyscale.input()); // connect the nodes
    greyscale.output().connectTo(sink.input());

    pipeline.init(source, sink, greyscale); // add the nodes to the pipeline

    var data;

    (function () {

        const off = new OffscreenCanvas(1280, 720)
        const ctx = off.getContext('2d')
        var image = null, frameReady = false;

        async function update() {
            const result = await pipeline.run(); // image is a SpeedyMedia
            image = result.image;
            //console.log(image);
            ctx.drawImage(image.source, 0, 0);

            data = ctx.getImageData(0, 0, 1280, 720);

            frameReady = true;
            setTimeout(update, 1000 / 60);
            return data;
        }

        data = update();
    })()
    return data;
}

function getImgData(img) {


    const ctx = document.createElement('canvas').getContext('2d')

    ctx.drawImage(img.source, 0, 0);
    let data = ctx.getImageData(0, 0, 1637, 2048);

    return data.data;
}

async function getVideoData() {
    //const off = new OffscreenCanvas(1280, 720)
    //const ctx = off.getContext('2d')
    //const {image}  = await pipeline.run(); // image is a SpeedyMedia

    ctx.drawImage(image.source, 0, 0);

    let data = ctx.getImageData(0, 0, 1280, 720);

    requestAnimationFrame(getVideoData);

    return data;
}


