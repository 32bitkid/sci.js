import { DrawCommand } from '@4bitlabs/sci0';

// prettier-ignore
const DEFAULT_PALETTE: number[] = [
  0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99,
  0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0x88, 0x88, 0x01, 0x02, 0x03,
  0x04, 0x05, 0x06, 0x88, 0x88, 0xf9, 0xfa, 0xfb, 0xfc, 0xfd,
  0xfe, 0xff, 0x08, 0x91, 0x2a, 0x3b, 0x4c, 0x5d, 0x6e, 0x88,
] as const;

type PaletteSet = [number[], number[], number[], number[]];

export const mapToPals = (commands: DrawCommand[]) => {
  return commands.reduce<PaletteSet[]>(
    (stack: PaletteSet[], cmd: DrawCommand) => {
      const prevSet = stack[stack.length - 1] ?? [
        DEFAULT_PALETTE,
        DEFAULT_PALETTE,
        DEFAULT_PALETTE,
        DEFAULT_PALETTE,
      ];

      const [type] = cmd;
      switch (type) {
        case 'SET_PALETTE': {
          const [, palIdx, colors] = cmd;
          const next: PaletteSet = [...prevSet];
          next[palIdx] = [...colors];
          return [...stack, next];
        }
        case 'UPDATE_PALETTE': {
          const [, entries] = cmd;
          const next = entries.reduce((pals, [palIdx, idx, color]) => {
            const nextSet: PaletteSet = [...prevSet];
            const nextPal = [...nextSet[palIdx]];
            nextPal[idx] = color;
            nextSet[palIdx] = nextPal;
            return pals;
          }, prevSet);
          return [...stack, next];
        }
        default:
          return [...stack, prevSet];
      }
    },
    [],
  );
};
