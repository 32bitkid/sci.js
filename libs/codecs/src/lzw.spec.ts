import { Buffer } from 'buffer';

import { decode } from './lzw';

describe('lzw', () => {
  describe('lsb/8', () => {
    it.each<[string, string]>([
      ['test', '74cacca11310'],
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
      ['TOBEORNOTTOBEORTOBEORNOT', '549e0829f2448a932754041234b8b0e0c1840101'],
    ])(`should decode "%s"`, (expected, encoded) => {
      const INPUT_DATA = Buffer.from(encoded, 'hex');
      const result = decode(INPUT_DATA, { order: 'lsb' });
      expect(Buffer.from(result).toString('ascii')).toBe(expected);
    });
  });
});
