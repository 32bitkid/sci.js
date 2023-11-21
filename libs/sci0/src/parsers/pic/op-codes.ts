export enum OpCode {
  // Layer Control
  SetVisual = 0xf0,
  ClearVisual = 0xf1,
  SetPriority = 0xf2,
  ClearPriority = 0xf3,
  SetControl = 0xfb,
  ClearControl = 0xfc,

  // Lines
  ShortLines = 0xf7,
  MediumLines = 0xf5,
  LongLines = 0xf6,

  // Patterns
  SetPattern = 0xf9,
  ShortBrushes = 0xf4,
  MediumBrushes = 0xfd,
  LongBrushes = 0xfa,

  // Fills
  Fills = 0xf8,

  // Extensions
  XOp = 0xfe,
  Done = 0xff,
}

export const isOpCode = (it: any): it is OpCode =>
  Object.values(OpCode).includes(it);

export enum ExtendedOpCode {
  UpdatePalette = 0x00,
  SetPalette = 0x01,
  x02 = 0x02,
  x03 = 0x03,
  x04 = 0x04,
  x05 = 0x05,
  x06 = 0x06,
  x07 = 0x07,
  x08 = 0x08,
}

export const isExtendedOpCode = (it: any): it is ExtendedOpCode =>
  Object.values(ExtendedOpCode).includes(it);
