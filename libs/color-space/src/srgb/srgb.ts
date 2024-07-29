export {
  type sRGBTuple,
  create,
  toString,
  isSRGBTuple,
} from '../tuples/srgb-tuple';
export {
  type FromUint32Options,
  toLinearRGB,
  toXYZ,
  toUint32,
  toHex,
  fromUint32,
  fromHex,
  mix,
  redMeanDiff,
} from './srgb-fns';
