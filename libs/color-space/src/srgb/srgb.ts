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
  fromUint32,
  fromHex,
  mix,
  redMeanDiff,
} from './srgb-fns';

export type { ToUint32Options, FromUint32Options } from './uint32-options';
