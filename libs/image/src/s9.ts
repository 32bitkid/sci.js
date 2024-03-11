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
  p9: S9 = [0, 0, 0, 0, 0, 0, 0, 0, 0],
): S9 => {
  const e = iy * width + ix;

  const [uOk, rOk, lOk, dOk] = [
    iy - 1 >= 0,
    ix + 1 < width,
    ix - 1 >= 0,
    iy + 1 < height,
  ];

  p9[4] = e;

  p9[1] = uOk ? (iy - 1) * width + ix : e;
  p9[3] = lOk ? iy * width + (ix - 1) : e;
  p9[5] = rOk ? iy * width + (ix + 1) : e;
  p9[7] = dOk ? (iy + 1) * width + ix : e;

  p9[0] = uOk && lOk ? (iy - 1) * width + (ix - 1) : e;
  p9[2] = uOk && rOk ? (iy - 1) * width + (ix + 1) : e;
  p9[6] = dOk && lOk ? (iy + 1) * width + (ix - 1) : e;
  p9[8] = dOk && rOk ? (iy + 1) * width + (ix + 1) : e;

  return p9;
};
