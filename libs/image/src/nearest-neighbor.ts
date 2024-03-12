import { ImageDataLike } from './image-data-like';

export const nearestNeighbor = (ratio: [number, number]) => {
  const [sx, sy] = ratio;

  return function nearestNeighborScaler(it: ImageDataLike): ImageDataLike {
    const { width: iWidth, height: iHeight, data: iData } = it;
    const width = iWidth * sx;
    const height = iHeight * sy;

    const data = new Uint8ClampedArray(width * height * 4);

    const inP = new Uint32Array(
      iData.buffer,
      iData.byteOffset,
      iData.byteLength / 4,
    );
    const outP = new Uint32Array(
      data.buffer,
      data.byteOffset,
      data.byteLength / 4,
    );

    for (let y = 0; y < height; y++) {
      const iy = (y / sy) >>> 0;
      for (let x = 0; x < width; x++) {
        const ix = (x / sx) >>> 0;
        outP[x + y * width] = inP[ix + iy * iWidth];
      }
    }

    return { data, width, height, colorSpace: it.colorSpace };
  };
};
