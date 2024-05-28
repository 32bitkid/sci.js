export {
  type sRGBTuple,
  create,
  toString,
  isSRGBTuple,
} from '../tuples/srgb-tuple';
export {
  toLinearRGB,
  toXYZ,
  toUint32,
  toHex,
  fromUint24,
  fromUint32,
  fromHex,
  mix,
  redMeanDiff,
} from './srgb-fns';