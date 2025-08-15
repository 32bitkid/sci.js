import { inflateSync } from 'node:zlib';

import { createFloodFill } from './create-flood-fill';

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
    fill(14, 3, 1, [1, 0, 0]);

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

  it('should fill complex shape', () => {
    const load = ([content]: TemplateStringsArray) =>
      Uint8ClampedArray.from(inflateSync(Buffer.from(content, 'base64')));

    const dim: [number, number] = [128, 128];
    const screen = load`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`;
    const expected = load`eJztmtuS4zAIRPn/n/bWbhIH6G5AsmdSWxW9jIUQp0G3PMxxfNu3fdu72aN9kv0pCYbto/BNBTuiFV0KKCA7khOw5Vd1Wa8ZxRV8Z0aHjTUT2Sq+Rb7JwYt8DN7ztzatXGyN93zLY9v8Be/QE2PLAhZ8KX8v/Ut82A2/zT9u4C9MRE/gr+Mv803wx2J+hL99qC7xs+vCttrhv7p2SP487hSP/IfJD9kSf1gAiGgT/n0CIGLgk5HFFVjln52niAv8NQGEb/g0HeONtciP3YPuNnvvibmAHb6zX+Z3jiJ9dto9f4Ln22eb//yep8+rmeciI1z+1/nnPuYSCD8VgPBneOQOBTD+63sj/1qAKkDJH6rYFmCcDyGX+MkSvfIMdjPykGMBPGMhQPAtt7kAsMY+lWyi/F7oUACx0gLwCkeqSKPSQFVxjzF/9sQoRXIFxOMTfpK4S+IWvhKg+Ws/Bij/7El+tLx1mvuzwYe1bR9Lzl96DRTe1TI6wJQDxncKQNc28ElQVh7hOqTnQ5T4bNoNfCv55g2S7+cv8hneX+0qpt3DT3hXw5ofJNsd/KQG+GJe+q73Pw5KfLraxKzUyvRTqaMRo2Y+mbTN59caxPLnQP8cQDzlY/QS7zaA0oz+cz75vSKz4W6P74wc8yGuW7lzgPjlWUdccok/z1CP51JjGpBYl/5hPDroq/mAD8MFXvCxPnv4ER+PUAqk8YKfHYb8p4UOP6NRvk5fXtTJVQy+hcs66K2f6lMiiuI0/IyKsl2/5leXQxLZ45f4bNeBMsKv5iZbUeEDNwvTFYdxq/GQpQ9XIEpbRSD2nFDD7wTwFGpNWIGC3yggAdV1vVmAWoDKqFCwXIDqoffDWi4NF3qNALy36Ouv+FRA6LV88Y6ThJKVCdgpQC/t7KBoLsBX7DZ8+mcTLoAs5VV+La7kX16Aer7kh94AId2a+TgTD8Aqf/6IKr5SM4iRJxiJV9YX/QmQCKj4eAFJfioI41eaoZ7GG6eBhZa/3DKWQ/Z8DM7ubpouui3xz+90LYtQFb/r1/jwWMtUfEiRPhGg6B5vwW/Cr5zotBTcTxT69OnvRBZ81lcFkgKQjyswwucYvEgzfnVr8MQYJjrS6sb4SnbJZ91CGStmFR/nzOo69RQmCwt6D59uwRGfPgNFUKGNSVV74mWGDUGvVsHP0Wd8o3yyTWNS0TTSky3k3Jhv2QQOf024YhFHko1fms9KYqqJ9BmfZSQclPtIwIyf3Lb5aedxviyw1jjmw8kf8utXl8s943vPXPk+btTbSYjms8zykaJRdUgUkPyD5d9XdhrwkwRn4vwDC0wCRw+M32VV8g+fcxNQFLiYMuL3zXgbzDm/fkDAaM4t/B38W8A2X5R9iOdX1TzKVTrlj2OV9Gk1YcY04EWuEFDnVD7Tq+A2k3nbRnfZ/AKcYXp5d9ITY6TwVviJGGu8nz5qH8Y7GZ+D/4/tDx0vKiU=`;

    const fill = createFloodFill(
      (x: number, y: number) => {
        screen[y * dim[0] + x] = 0x00;
      },
      (x: number, y: number) => screen[y * dim[0] + x] === 0xff,
      dim,
    );

    fill(64, 64, 1, [1, 0, 0]);

    expect(screen).toStrictEqual(expected);
  });
});
