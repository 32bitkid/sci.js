import {
  type LabTuple,
  type XYZTuple,
  type okLabTuple,
  type linearRGBTuple,
  Lab,
  XYZ,
  okLab,
  sRGB,
  linearRGB,
} from '@4bitlabs/color-space';

export const uint32_to_XYZ = (c: number): XYZTuple =>
  sRGB.toXYZ(sRGB.fromUint32(c));

export const XYZ_to_uint32 = (c: XYZTuple): number =>
  sRGB.toUint32(XYZ.toSRGB(c));

export const uint32_to_Lab = (c: number): LabTuple =>
  XYZ.toLab(uint32_to_XYZ(c));

export const Lab_to_uint32 = (c: LabTuple): number =>
  XYZ_to_uint32(Lab.toXYZ(c));

export const uint32_to_okLab = (c: number): okLabTuple =>
  XYZ.toOkLab(uint32_to_XYZ(c));

export const okLab_to_uint32 = (c: okLabTuple): number =>
  XYZ_to_uint32(okLab.toXYZ(c));

export const uint32_to_linearRGB = (c: number): linearRGBTuple =>
  sRGB.toLinearRGB(sRGB.fromUint32(c));

export const linearRGB_to_uint32 = (c: linearRGBTuple): number =>
  sRGB.toUint32(linearRGB.toSRGB(c));
