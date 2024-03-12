// prettier-ignore
export type S9 = [
  number, number, number,
  number, number, number,
  number, number, number,
];

export const s9 = (
  width: number,
  height: number,
  ix: number,
  iy: number,
  dest: S9 = [0, 0, 0, 0, 0, 0, 0, 0, 0],
): S9 => {
  const e = iy * width + ix;

  const [uOk, rOk, lOk, dOk] = [
    iy - 1 >= 0,
    ix + 1 < width,
    ix - 1 >= 0,
    iy + 1 < height,
  ];

  dest[4] = e;

  dest[1] = uOk ? (iy - 1) * width + ix : e;
  dest[3] = lOk ? iy * width + (ix - 1) : e;
  dest[5] = rOk ? iy * width + (ix + 1) : e;
  dest[7] = dOk ? (iy + 1) * width + ix : e;

  dest[0] = uOk && lOk ? (iy - 1) * width + (ix - 1) : e;
  dest[2] = uOk && rOk ? (iy - 1) * width + (ix + 1) : e;
  dest[6] = dOk && lOk ? (iy + 1) * width + (ix - 1) : e;
  dest[8] = dOk && rOk ? (iy + 1) * width + (ix + 1) : e;

  return dest;
};

// prettier-ignore
export type S13 = [
                  number,
          number, number, number,
  number, number, number, number, number,
          number, number, number,
                  number,
];

export const s13 = (
  width: number,
  height: number,
  ix: number,
  iy: number,
  dest: S13 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
) => {
  const e = iy * width + ix;

  const [uOk, rOk, lOk, dOk] = [
    iy - 1 >= 0,
    ix + 1 < width,
    ix - 1 >= 0,
    iy + 1 < height,
  ];

  dest[6] = e;

  dest[2] = uOk ? (iy - 1) * width + ix : e;
  dest[5] = lOk ? iy * width + (ix - 1) : e;
  dest[7] = rOk ? iy * width + (ix + 1) : e;
  dest[10] = dOk ? (iy + 1) * width + ix : e;

  dest[1] = uOk && lOk ? (iy - 1) * width + (ix - 1) : e;
  dest[3] = uOk && rOk ? (iy - 1) * width + (ix + 1) : e;
  dest[9] = dOk && lOk ? (iy + 1) * width + (ix - 1) : e;
  dest[11] = dOk && rOk ? (iy + 1) * width + (ix + 1) : e;

  const [uuOk, rrOk, llOk, ddOk] = [
    iy - 2 >= 0,
    ix + 2 < width,
    ix - 2 >= 0,
    iy + 2 < height,
  ];

  dest[0] = uuOk ? (iy - 2) * width + ix : dest[2];
  dest[4] = llOk ? iy * width + (ix - 2) : dest[5];
  dest[8] = rrOk ? iy * width + (ix + 2) : dest[7];
  dest[12] = ddOk ? (iy + 2) * width + ix : dest[10];

  return dest;
};
