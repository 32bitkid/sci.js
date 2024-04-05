export type PadSingle = number | [number];
export type PadDouble = [vertical: number, horizontal: number];
export type PadTriple = [top: number, h: number, bottom: number];
export type PadQuad = [
  top: number,
  right: number,
  bottom: number,
  left: number,
];

export type Padding = PadSingle | PadDouble | PadTriple | PadQuad;

export const toPadding4 = (pad: Padding): PadQuad => {
  if (typeof pad === 'number') return [pad, pad, pad, pad];
  const [a] = pad;
  if (pad.length === 1) return [a, a, a, a];
  const [, b] = pad;
  if (pad.length === 2) return [a, b, a, b];
  const [, , c] = pad;
  if (pad.length === 3) return [a, b, c, b];
  return pad;
};
