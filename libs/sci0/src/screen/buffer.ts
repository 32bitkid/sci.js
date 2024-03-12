import { ImageDataLike } from '@4bitlabs/image';

import { IsFillable, Plotter, Screen } from './screen';
import { createBrush, createFloodFill, createLine } from './sci0-screen-impl';

export interface Buffer extends Screen {
  image: ImageDataLike;
}

export const createBuffer = (empty: number, bitsPerPixel: 8 | 32): Buffer => {
  const bbp = bitsPerPixel / 8;
  const buffer = new ArrayBuffer(320 * 190 * bbp);

  const pixels =
    bitsPerPixel === 32
      ? new Uint32Array(buffer, 0, 320 * 190)
      : new Uint8ClampedArray(buffer, 0, 320 * 190);

  for (let i = 0; i < pixels.length; i++) pixels[i] = empty;

  const plot: Plotter = (x: number, y: number, color: number) => {
    pixels[320 * y + x] = 0xff000000 | color;
  };

  const isFillable: IsFillable = (x, y) => pixels[x + y * 320] === empty;

  return {
    plot,
    brush: createBrush(plot, [320, 190]),
    fill: createFloodFill(plot, isFillable, [320, 190]),
    line: createLine(plot),
    image: {
      data: new Uint8ClampedArray(buffer),
      width: 320,
      height: 190,
    },
  };
};
