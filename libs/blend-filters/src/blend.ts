import { type ImageDataLike, createImageData, asRGBA } from '@4bitlabs/image';

export const blend = (
  a: ImageDataLike,
  b: ImageDataLike,
  blendFn: (a: number, b: number) => number,
): ImageDataLike => {
  if (a.width !== b.width || a.height !== b.height)
    throw new Error('images must be the same size');

  const aRGBA = asRGBA(a);
  const bRGBA = asRGBA(b);

  const blendImg = createImageData(a.width, b.height);
  const blendRGBA = asRGBA(blendImg);

  for (let i = 0; i < a.width * a.height; i++)
    blendRGBA[i] = blendFn(aRGBA[i], bRGBA[i]);

  return blendImg;
};
