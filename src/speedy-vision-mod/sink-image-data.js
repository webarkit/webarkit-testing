import { SpeedyPipelineNode, SpeedyPipelineSinkNode } from 'speedy-vision/src/core/pipeline/pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithImage } from 'speedy-vision/src/core/pipeline/pipeline-message';
import { InputPort, OutputPort } from 'speedy-vision/src/core/pipeline/pipeline-portbuilder';
import { SpeedyGPU } from 'speedy-vision/src/gpu/speedy-gpu';
import { SpeedyTexture } from 'speedy-vision/src/gpu/speedy-texture';
import { SpeedyMedia } from 'speedy-vision/src/core/speedy-media';
import { SpeedyMediaSource } from 'speedy-vision/src/core/speedy-media-source';
import { Utils } from 'speedy-vision/src/utils/utils';
import { ImageFormat } from 'speedy-vision/src/utils/types';
import { SpeedyPromise } from 'speedy-vision/src/core/speedy-promise';
import { SpeedyTextureReader } from "speedy-vision/src/gpu/speedy-texture-reader";


export  class TextureReader extends SpeedyTextureReader {
    constructor() {
        super();
    }
    readPixels(gpu, texture) {
       return gpu.readPixelsAsync(texture)
    };
};
export default class SpeedyPipelineNodeImageSinkImageData extends SpeedyPipelineSinkNode {

    //#_imageData = null;

    constructor(name = 'image')
    {
        super(name, 0, [
            InputPort().expects(SpeedyPipelineMessageType.Image)
        ]);

        /** @type {ImageBitmap} output bitmap */
        this._bitmap = null;

        //this.imageData = null;

        /** @type {ImageFormat} output format */
        this._format = ImageFormat.RGBA;
    }

   /**
     * Export data from this node to the user
     * @returns {SpeedyPromise<SpeedyMedia>}
     */
   export()
   {
       const { image, format } = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input().read() );
       return new SpeedyPromise(resolve => {
        const canvas = gpu.renderToCanvas(image);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image.source, 0, 0);
        ctx.getImageData(0, 0, image.width, image.height).data.then(data => {
            //this._imageData = data;
            this._bitmap = data;
            this._format = format;
            resolve();});
    });
   }

   /**
    * Run the specific task of this node
    * @param {SpeedyGPU} gpu
    * @returns {void|SpeedyPromise<void>}
    */
   _run(gpu)
   {
       const { image, format } = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input().read() );

       return new SpeedyPromise(resolve => {
           const canvas = gpu.renderToCanvas(image);
           createImageBitmap(canvas, 0, canvas.height - image.height, image.width, image.height).then(bitmap => {
               this._bitmap = bitmap;
               this._format = format;
               resolve();
           });
       });
   }
}
