import { createIndexedPixelData, type IndexedPixelData } from '@4bitlabs/image';
import { createBrush, createFloodFill, createLine } from './sci0-screen-impl';
import { IsFillable, type Plotter, type Screen } from './screen';

export type ScreenBuffer = Screen & IndexedPixelData;

const bufferWidth = 320;
const bufferHeight = 190;

export const createScreenBuffer = (empty: number): ScreenBuffer => {
  const data = createIndexedPixelData(bufferWidth, bufferHeight);
  const { pixels } = data;
  for (let i = 0; i < pixels.length; i++) pixels[i] = empty;

  const plot: Plotter = (x: number, y: number, color: number) => {
    const idx = bufferWidth * y + x;
    pixels[idx] = color;
  };

  const isFillable: IsFillable = (x, y) =>
    pixels[x + y * bufferWidth] === empty;

  return {
    plot,
    brush: createBrush(plot, [bufferWidth, bufferHeight]),
    fill: createFloodFill(plot, isFillable, [bufferWidth, bufferHeight]),
    line: createLine(plot),
    ...data,
  };
};
