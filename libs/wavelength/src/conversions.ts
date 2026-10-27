import { wavelength as xyz, wavelengthI as xyzi } from './wavelength.js';
import { toSRGB, toCSS } from '@4bitlabs/color-space/xyz';
import { toHex } from '@4bitlabs/color-space/srgb';

export const wavelengthToCSS = (
  format: 'xyz' | 'xyz-d50' | 'hex',
  nm: number,
  intensity?: number,
): string => {
  const color = typeof intensity === 'number' ? xyzi(nm, intensity) : xyz(nm);
  switch (format) {
    case 'hex':
      return toHex(toSRGB(color));
    case 'xyz':
    case 'xyz-d50':
      return toCSS(color);
  }
};
