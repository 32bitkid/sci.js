import { unpack } from './comp3';

const zip = <T, U>(a: readonly T[], b: readonly U[]): (T | U)[] => {
  const max = Math.max(a.length, b.length);
  const result = [];
  for (let i = 0; i < max; i++) {
    if (i < a.length) result.push(a[i]);
    if (i < b.length) result.push(b[i]);
  }
  return result;
};

const T = {
  utf8: (strings: TemplateStringsArray, ...args: unknown[]) =>
    new TextEncoder().encode(
      zip(
        strings,
        args.map((it) => String(it)),
      ).join(''),
    ),
  pack: (...values: (number | [number, number?])[]) => {
    const bitString = values
      .map((it) => {
        const [val, width = 9] = Array.isArray(it) ? it : [it];
        return val.toString(2).padStart(width, '0');
      })
      .join('');

    return Uint8Array.from(
      (bitString.match(/[01]{1,8}/g) ?? []).map((it) =>
        parseInt(it.padEnd(8, '0'), 2),
      ),
    );
  },
};

describe('comp3', () => {
  it('should unpack a single token', () => {
    const source = T.pack(0x61, 0x101);
    const data = unpack(source);
    expect(data).toStrictEqual(T.utf8`a`);
  });

  it('should unpack two encoded character', () => {
    const source = T.pack(0x61, 0x62, 0x101);
    const data = unpack(source);
    expect(data).toStrictEqual(T.utf8`ab`);
  });

  it('should unpack repeated characters', () => {
    const source = T.pack(0x61, 0x62, 0x102, 0x101);
    const data = unpack(source);
    expect(data).toStrictEqual(T.utf8`abab`);
  });

  it('should unpack multiple repeated characters', () => {
    const source = T.pack(0x61, 0x62, 0x102, 0x103, 0x104, 0x101);
    const data = unpack(source);
    expect(data).toStrictEqual(new TextEncoder().encode('ababbaabb'));
  });

  it('should handle reset', () => {
    const source = T.pack(
      0x61,
      0x62,
      0x102,
      0x103,
      0x104,
      0x100,
      0x64,
      0x63,
      0x102,
      0x101,
    );
    const data = unpack(source);
    expect(data).toStrictEqual(new TextEncoder().encode('ababbaabbdcdc'));
  });
});
