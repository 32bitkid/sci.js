const BYTE = Array(8)
  .fill(0)
  .map((_, i) => i);

export const NOISE: boolean[] = [
  0x20, 0x94, 0x02, 0x24, 0x90, 0x82, 0xa4, 0xa2, 0x82, 0x09, 0x0a, 0x22, 0x12,
  0x10, 0x42, 0x14, 0x91, 0x4a, 0x91, 0x11, 0x08, 0x12, 0x25, 0x10, 0x22, 0xa8,
  0x14, 0x24, 0x00, 0x50, 0x24, 0x04,
].flatMap((it) => BYTE.map((idx) => ((it >>> (7 - idx)) & 0b1) === 0b1));

export const NOISE_OFFSETS: number[] = [
  0x00, 0x18, 0x30, 0xc4, 0xdc, 0x65, 0xeb, 0x48, 0x60, 0xbd, 0x89, 0x04, 0x0a,
  0xf4, 0x7d, 0x6d, 0x85, 0xb0, 0x8e, 0x95, 0x1f, 0x22, 0x0d, 0xdf, 0x2a, 0x78,
  0xd5, 0x73, 0x1c, 0xb4, 0x40, 0xa1, 0xb9, 0x3c, 0xca, 0x58, 0x92, 0x34, 0xcc,
  0xce, 0xd7, 0x42, 0x90, 0x0f, 0x8b, 0x7f, 0x32, 0xed, 0x5c, 0x9d, 0xc8, 0x99,
  0xad, 0x4e, 0x56, 0xa6, 0xf7, 0x68, 0xb7, 0x25, 0x82, 0x37, 0x3a, 0x51, 0x69,
  0x26, 0x38, 0x52, 0x9e, 0x9a, 0x4f, 0xa7, 0x43, 0x10, 0x80, 0xee, 0x3d, 0x59,
  0x35, 0xcf, 0x79, 0x74, 0xb5, 0xa2, 0xb1, 0x96, 0x23, 0xe0, 0xbe, 0x05, 0xf5,
  0x6e, 0x19, 0xc5, 0x66, 0x49, 0xf0, 0xd1, 0x54, 0xa9, 0x70, 0x4b, 0xa4, 0xe2,
  0xe6, 0xe5, 0xab, 0xe4, 0xd2, 0xaa, 0x4c, 0xe3, 0x06, 0x6f, 0xc6, 0x4a, 0x75,
  0xa3, 0x97, 0xe1,
];
