import { DrawCommand } from '@4bitlabs/sci0';

// prettier-ignore
export const DEFAULT_PALETTE: number[] = [
  0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99,
  0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0x88, 0x88, 0x01, 0x02, 0x03,
  0x04, 0x05, 0x06, 0x88, 0x88, 0xf9, 0xfa, 0xfb, 0xfc, 0xfd,
  0xfe, 0xff, 0x08, 0x91, 0x2a, 0x3b, 0x4c, 0x5d, 0x6e, 0x88,
] as const;

export type PaletteSet = [number[], number[], number[], number[]];

export type IndexedPaletteSet = [number, PaletteSet];

export function reduceMutations(
  mutations: [number, DrawCommand][],
): IndexedPaletteSet[] {
  let prevSet: PaletteSet = [
    DEFAULT_PALETTE,
    DEFAULT_PALETTE,
    DEFAULT_PALETTE,
    DEFAULT_PALETTE,
  ];

  const sets: [number, PaletteSet][] = [];
  for (const [idx, cmd] of mutations) {
    const [type] = cmd;
    switch (type) {
      case 'SET_PALETTE': {
        const [, [palIdx], ...colors] = cmd;
        const nextSet: PaletteSet = [...prevSet];
        nextSet[palIdx] = [...colors];
        sets.push([idx, nextSet]);
        prevSet = nextSet;
        break;
      }
      case 'UPDATE_PALETTE': {
        const [, , ...entries] = cmd;
        const next = entries.reduce((prevSet_, [palIdx, clrIdx, color]) => {
          const nextSet: PaletteSet = [...prevSet_];
          const nextPal = [...nextSet[palIdx]];
          nextPal[clrIdx] = color;
          nextSet[palIdx] = nextPal;
          return nextSet;
        }, prevSet);
        sets.push([idx, next]);
        prevSet = next;
        break;
      }
    }
  }
  return sets;
}
