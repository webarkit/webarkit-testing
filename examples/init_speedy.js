async function loadSpeedyImage(id) {
    // Load an image
    console.warn('Loading speedy-media for the image tracker...');
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

async function loadSpeedyVideo(id, callback) {
    console.warn('Loading speedy-media for video...');

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

    var oWidth = window.innerWidth;
    var oHeight = window.innerHeight;

    var data;

    (async function () {
        const off = new OffscreenCanvas(oWidth, oHeight)
        const ctx = off.getContext('2d', { willReadFrequently: true })
        let image = null, frameReady = false;

        async function update() {
            const result = await pipeline.run(); // image is a SpeedyMedia
            image = result.image;
            frameReady = true;
            setTimeout(update, 1000 / 60);
        }

        await update();

        async function process() {
            if (frameReady) {
                console.log('Processing frame...');
                ctx.drawImage(image.source, 0, 0);
                data = ctx.getImageData(0, 0, oWidth, oHeight);
                //console.log(data);
                callback(data);
            }
            frameReady = false;
            requestAnimationFrame(update);
        }

        await process()
        setInterval(renderStatus, 200);
    })();

    //console.log(data);
    //callback(data)
    //requestAnimationFrame(update);

    return true;
}

function getImgData(img) {

    const ctx = document.createElement('canvas').getContext('2d')

    ctx.drawImage(img.source, 0, 0);
    let data = ctx.getImageData(0, 0, 1637, 2048);

    return data.data;
}

function renderStatus(arr = null, label = 'Keypoints') {
    const status = document.getElementById('status');

    if (Array.isArray(arr))
        status.innerText = `FPS: ${Speedy.fps} | ${label}: ${arr.length}`;
    else
        status.innerText = `FPS: ${Speedy.fps}`;
}


