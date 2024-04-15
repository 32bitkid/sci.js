import { createFloodFill } from './sci0-screen-impl';

const toBuffer = ([width, height]: [number, number], ...rows: string[]) => {
  const pixels = new Uint8ClampedArray(width * height);
  rows.forEach((row, y) => {
    row.split('').forEach((ch, x) => {
      const idx = y * width + x;
      pixels[idx] = ch.match(/\s/) ? 0 : 255;
    });
  });
  return pixels;
};

const createScreen = (dimensions: [number, number], ...rows: string[]) => {
  const [width] = dimensions;
  const screen = toBuffer(dimensions, ...rows);

  const plot = (x: number, y: number) => {
    screen[y * width + x] = 255;
  };

  const isLegal = (x: number, y: number) => {
    return screen[y * width + x] === 0;
  };

  return { screen, plot, isLegal };
};

describe('flood fill', () => {
  it('should fill the entire screen', () => {
    const dimensions: [number, number] = [5, 5];

    const { screen, plot, isLegal } = createScreen(
      dimensions,
      '     ',
      '     ',
      '     ',
      '     ',
      '     ',
    );
    const fill = createFloodFill(plot, isLegal, dimensions);
    fill(2, 2, 1, [1, 0, 0]);

    const expected = toBuffer(
      dimensions,
      'XXXXX',
      'XXXXX',
      'XXXXX',
      'XXXXX',
      'XXXXX',
    );

    expect(screen).toStrictEqual(expected);
  });

  it('should fill bottom-half', () => {
    const dimensions: [number, number] = [5, 5];

    const { screen, plot, isLegal } = createScreen(
      dimensions,
      '     ',
      '     ',
      'XXXXX',
      '     ',
      '     ',
    );
    const fill = createFloodFill(plot, isLegal, dimensions);
    fill(2, 3, 1, [1, 0, 0]);

    const expected = toBuffer(
      dimensions,
      '      ',
      '      ',
      'XXXXX',
      'XXXXX',
      'XXXXX',
    );

    expect(screen).toStrictEqual(expected);
  });

  it('should fill top-half', () => {
    const dimensions: [number, number] = [5, 5];

    const { screen, plot, isLegal } = createScreen(
      dimensions,
      '     ',
      '     ',
      'XXXXX',
      '     ',
      '     ',
    );
    const fill = createFloodFill(plot, isLegal, dimensions);
    fill(2, 1, 1, [1, 0, 0]);

    const expected = toBuffer(
      dimensions,
      'XXXXX',
      'XXXXX',
      'XXXXX',
      '     ',
      '     ',
    );

    expect(screen).toStrictEqual(expected);
  });

  it('should fill a box', () => {
    const dimensions: [number, number] = [7, 7];

    const { screen, plot, isLegal } = createScreen(
      dimensions,
      '       ',
      ' XXXXX ',
      ' X   X ',
      ' X   X ',
      ' X   X ',
      ' XXXXX ',
      '       ',
    );
    const fill = createFloodFill(plot, isLegal, dimensions);
    fill(3, 3, 1, [1, 0, 0]);

    const expected = toBuffer(
      dimensions,
      '       ',
      ' XXXXX ',
      ' XXXXX ',
      ' XXXXX ',
      ' XXXXX ',
      ' XXXXX ',
      '       ',
    );

    expect(screen).toStrictEqual(expected);
  });

  it('should not escape rounded edges', () => {
    const dimensions: [number, number] = [7, 7];

    const { screen, plot, isLegal } = createScreen(
      dimensions,
      '       ',
      '  XXX  ',
      ' X   X ',
      ' X   X ',
      ' X   X ',
      '  XXX  ',
      '       ',
    );
    const fill = createFloodFill(plot, isLegal, dimensions);
    fill(3, 3, 1, [1, 0, 0]);

    const expected = toBuffer(
      dimensions,
      '       ',
      '  XXX  ',
      ' XXXXX ',
      ' XXXXX ',
      ' XXXXX ',
      '  XXX  ',
      '       ',
    );

    expect(screen).toStrictEqual(expected);
  });

  it('should fill weird shapes', () => {
    const dimensions: [number, number] = [19, 7];

    const { screen, plot, isLegal } = createScreen(
      dimensions,
      ' ┌───┐             ',
      ' │   │             ',
      ' │   └───────────┐ ',
      ' │               │ ',
      ' └───────────┐   │ ',
      '             │   │ ',
      '             └───┘ ',
    );
    const fill = createFloodFill(plot, isLegal, dimensions);
    fill(3, 3, 1, [1, 0, 0]);

    const expected = toBuffer(
      dimensions,
      ' ┌───┐             ',
      ' │XXX│             ',
      ' │XXX└───────────┐ ',
      ' │XXXXXXXXXXXXXXX│ ',
      ' └───────────┐XXX│ ',
      '             │XXX│ ',
      '             └───┘ ',
    );

    expect(screen).toStrictEqual(expected);
  });

  it('should fill weird shapes', () => {
    const dimensions: [number, number] = [19, 7];

    const { screen, plot, isLegal } = createScreen(
      dimensions,
      ' ┌───┐             ',
      ' │   │             ',
      ' │   └───────────┐ ',
      ' │               │ ',
      ' └───────────┐   │ ',
      '             │   │ ',
      '             └───┘ ',
    );
    const fill = createFloodFill(plot, isLegal, dimensions);
    fill(3, 3, 1, [1, 0, 0]);

    const expected = toBuffer(
      dimensions,
      ' ┌───┐             ',
      ' │XXX│             ',
      ' │XXX└───────────┐ ',
      ' │XXXXXXXXXXXXXXX│ ',
      ' └───────────┐XXX│ ',
      '             │XXX│ ',
      '             └───┘ ',
    );

    expect(screen).toStrictEqual(expected);
  });

  it('should fill alternating', () => {
    const dimensions: [number, number] = [33, 7];

    const { screen, plot, isLegal } = createScreen(
      dimensions,
      '┌───┐   ┌───┐   ┌───┐   ┌───┐    ',
      '│   │   │   │   │   │   │   │    ',
      '│   └───┘   └───┘   └───┘   └───┐',
      '│                               │',
      '└───┐   ┌───┐   ┌───┐   ┌───┐   │',
      '    │   │   │   │   │   │   │   │',
      '    └───┘   └───┘   └───┘   └───┘',
    );
    const fill = createFloodFill(plot, isLegal, dimensions);
    fill(3, 3, 1, [1, 0, 0]);

    const expected = toBuffer(
      dimensions,
      '┌───┐   ┌───┐   ┌───┐   ┌───┐    ',
      '│xxx│   │xxx│   │xxx│   │xxx│    ',
      '│xxx└───┘xxx└───┘xxx└───┘xxx└───┐',
      '│xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx│',
      '└───┐xxx┌───┐xxx┌───┐xxx┌───┐xxx│',
      '    │xxx│   │xxx│   │xxx│   │xxx│',
      '    └───┘   └───┘   └───┘   └───┘',
    );

    expect(screen).toStrictEqual(expected);
  });
});
