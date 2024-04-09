import {
  type LabTuple,
  type XYZTuple,
  type okLabTuple,
  Lab,
  XYZ,
  okLab,
  sRGB,
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
