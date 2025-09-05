import { Buffer } from 'node:buffer';

import { unpack, EOF_MARKER, type InitialDictionary } from './lzw';

describe('lzw', () => {
  describe('lsb', () => {
    describe('literalWidth=8', () => {
      it.each<[string, string]>([
        [
          'thequickbrownfoxjumpsoverthelazydog',
          `74d094895327cd983562e4bcb9e3c6cc1b3c6aeab48133e78d9d327204966113464f1e326fce0404`,
        ],
        [
          'the quick brown fox jumps over the lazy dog',
          `74d0940111a74e9a316b408891f3e68e1b1066dee001a1a64e1b387340bcb153460e088104d984d19307049937670202`,
        ],
        ['kaboom!', '6bc28879f3a64d8880'],
        ['kabooom!', '6bc2887953b04d8880'],
        ['kaboooom!', '6bc2887953f04d9b100101'],
        ['kabooooooom!', '6bc2887953d0e09b36210202'],
        [
          'TOBEORNOTTOBEORTOBEORNOT',
          '549e0829f2448a932754041234b8b0e0c1840101',
        ],
      ])(`should unpack "%s"`, (expected, encoded) => {
        const INPUT_DATA = Buffer.from(encoded, 'hex');
        const result = unpack(INPUT_DATA, { order: 'lsb' });
        expect(Buffer.from(result).toString('ascii')).toBe(expected);
      });
    });
  });

  describe('msb', () => {
    describe('custom-dictionary', () => {
      it('should unpack', () => {
        const dictionary: InitialDictionary = [
          EOF_MARKER,
          /* A-Z */
          ...Array(26)
            .fill(65)
            .map((it: number, i) => it + i),
        ];

        const INPUT_DATA = Uint8Array.of(
          0b1010_0011,
          0b1100_0100,
          0b0101_0111,
          0b1100_1000,
          0b1110_0011,
          0b1101_0100,
          0b0110_1101,
          0b1101_0111,
          0b1110_0100,
          0b0111_1010,
          0b0000_1000,
          0b1000_0000,
        );

        const result = unpack(INPUT_DATA, { order: 'msb', dictionary });
        expect(Buffer.from(result).toString('ascii')).toBe(
          'TOBEORNOTTOBEORTOBEORNOT',
        );
      });
    });
  });
});
