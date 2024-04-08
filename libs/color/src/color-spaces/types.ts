import { sRGB, Lab, XYZ } from './color-space';

export type sRGBColor = [
  typeof sRGB,
  r: number,
  g: number,
  b: number,
  a?: number,
];

export type XYZColor = [
  typeof XYZ,
  x: number,
  y: number,
  z: number,
  a?: number,
];

export type LabColor = [
  typeof Lab,
  L: number,
  a: number,
  b: number,
  a?: number,
];
