import { it, expect } from 'vitest';
import { wavelength, wavelengthI } from './wavelength';
import { toHex } from '@4bitlabs/color-space/srgb';
import { toSRGB } from '@4bitlabs/color-space/xyz';
import { wavelengthToCSS } from './conversions';

it.each<[number, `#${string}`, number?]>([
  [430, '#7500ff'],
  [440, '#8d00ff'],
  [460, '#0000ff'],
  [505, '#00e367'],
  [525, '#00ff00'],
  [530, '#00ff00'],
  [540, '#00ff00'],
  [543, '#00ff00'],
  [565, '#deff00'],
  [595, '#ff9400'],
  [602, '#ff6100'],
  [611, '#ff0000'],
  [640, '#ff0000'],
])('should convert wavelength color', (wave, hex) => {
  const result = toHex(toSRGB(wavelength(wave)));
  expect(result).toStrictEqual(hex);
});

it.each<[number, `#${string}`, number?]>([
  [430, '#5400df'],
  [440, '#6600f6'],
  [460, '#0000f2'],
  [505, '#00a74a'],
  [525, '#00d900'],
  [530, '#00df00'],
  [540, '#00e200'],
  [543, '#00e100'],
  [565, '#a3c800'],
  [595, '#ff6c00'],
  [602, '#ff4500'],
  [611, '#ff0000'],
  [640, '#cc0000'],
])('should convert wavelength color with intensity', (wave, hex) => {
  const result = toHex(toSRGB(wavelengthI(wave, 0.5)));
  expect(result).toStrictEqual(hex);
});

it('should convert to color codes', () => {
  expect(wavelengthToCSS('hex', 460)).toEqual('#0000ff');
  expect(wavelengthToCSS('hex', 530)).toEqual('#00ff00');
  expect(wavelengthToCSS('hex', 630)).toEqual('#ff0000');
  expect(wavelengthToCSS('xyz', 460)).toEqual(
    'color(xyz-d50 0.2812098264694214 0.0560174398124218 1.6712173223495483)',
  );
  expect(wavelengthToCSS('xyz', 530)).toEqual(
    'color(xyz-d50 0.15960659086704254 0.8690517544746399 0.04303550347685814)',
  );
  expect(wavelengthToCSS('xyz', 630)).toEqual(
    'color(xyz-d50 0.6562106013298035 0.26366743445396423 6.825911214036751e-7)',
  );
});
