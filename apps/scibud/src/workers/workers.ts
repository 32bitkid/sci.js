import { worker } from 'workerpool';

import { renderPicWorker } from './render-pic-worker';

worker({
  renderPic: renderPicWorker,
});
