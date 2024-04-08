import { LabColor } from './types';
import * as XYZ from './xyz';
import * as sRGB from './srgb';
import * as LAB from './lab';

export const uint32_to_Lab = (c: number): LabColor =>
  XYZ.toLab(sRGB.toXYZ(sRGB.fromUint32(c)));

export const Lab_to_uint32 = (c: LabColor): number =>
  sRGB.toUint32(XYZ.toSRGB(LAB.toXYZ(c)));
