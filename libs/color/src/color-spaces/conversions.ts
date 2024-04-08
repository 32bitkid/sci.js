import { LabColor, okLabColor, XYZColor } from './types';
import * as XYZ from './xyz';
import * as sRGB from './srgb';
import * as Lab from './lab';
import * as okLab from './oklab';

export const uint32_to_XYZ = (c: number): XYZColor =>
  sRGB.toXYZ(sRGB.fromUint32(c));

export const XYZ_to_uint32 = (c: XYZColor): number =>
  sRGB.toUint32(XYZ.toSRGB(c));

export const uint32_to_Lab = (c: number): LabColor =>
  XYZ.toLab(uint32_to_XYZ(c));

export const Lab_to_uint32 = (c: LabColor): number =>
  XYZ_to_uint32(Lab.toXYZ(c));

export const uint32_to_okLab = (c: number): okLabColor =>
  XYZ.toOkLab(uint32_to_XYZ(c));

export const okLab_to_uint32 = (c: okLabColor): number =>
  XYZ_to_uint32(okLab.toXYZ(c));
