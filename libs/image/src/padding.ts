export type Padding =
  | number
  | [all: number]
  | [vertical: number, horizontal: number]
  | [top: number, horizontal: number, bottom: number]
  | [top: number, right: number, bottom: number, left: number];

export type Padding4 = [
  top: number,
  right: number,
  bottom: number,
  left: number,
];

export const toPadding4 = (pad: Padding): Padding4 => {
  if (typeof pad === 'number') return [pad, pad, pad, pad];
  const [a] = pad;
  if (pad.length === 1) return [a, a, a, a];
  const [, b] = pad;
  if (pad.length === 2) return [a, b, a, b];
  const [, , c] = pad;
  if (pad.length === 3) return [a, b, c, b];
  return pad;
};
