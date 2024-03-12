import { worker } from 'workerpool';
import { renderPicWorker } from './render-pic-worker';

worker({
  renderPic: renderPicWorker,
});

/*
ffmpeg -r 60 -f image2 -s 1920x1080 -i ./out/test.%04d.png -vcodec libx264 -crf 25  -pix_fmt yuv420p ./out/test.mp4
 */
