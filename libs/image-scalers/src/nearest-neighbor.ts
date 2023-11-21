import { ImageLike } from './image-like';

export const nearestNeighbor =
  (ratio: [number, number]) =>
  (it: ImageLike): ImageLike => {
    const { width: iWidth, height: iHeight, data: iData } = it;
    const width = iWidth * ratio[0];
    const height = iHeight * ratio[1];

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
      const iy = Math.floor(y / ratio[1]);
      for (let x = 0; x < width; x++) {
        const ix = Math.floor(x / ratio[0]);
        outP[x + y * width] = inP[ix + iy * iWidth];
      }
    }

    return { data, width, height };
  };
