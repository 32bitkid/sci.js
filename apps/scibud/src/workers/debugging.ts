import { ImageDataLike, ImageFilter } from '@4bitlabs/image';

export const addTiming =
  (fn: ImageFilter, label = 'filter'): ImageFilter =>
  (img: ImageDataLike): ImageDataLike => {
    console.time(label);
    const result = fn(img);
    console.timeEnd(label);
    return result;
  };
