import { toUint32 } from '@4bitlabs/color-space/srgb';
import { toSRGB, type XYZTuple, create, mix } from '@4bitlabs/color-space/xyz';
import { wavelengthI } from '@4bitlabs/wavelength/xyz';

export const lerp = (a: number, b: number, t: number): number =>
  a * (1 - t) + b * t;

const loplerp = (mid: number, [min, max]: [number, number], value: number) => {
  return value >= 0 ? lerp(mid, max, value) : lerp(mid, min, -value);
};

const gaussian = (x: number, w: number = 1 / 2) => Math.exp(-((x / w) ** 2));

const phosphorSample = (
  mid: number,
  range: [number, number],
  intensity = 1,
): XYZTuple => {
  const steps = 32;
  const color = create(0, 0, 0);
  const tmp = create(0, 0, 0);

  for (let i = -steps; i <= steps; i++) {
    const x = i / steps;
    const v = loplerp(mid, range, x);
    wavelengthI(v, intensity * gaussian(x), tmp);
    color[1] += tmp[1];
    color[2] += tmp[2];
    color[3] += tmp[3];
  }

  color[1] /= steps;
  color[2] /= steps;
  color[3] /= steps;

  return color;
};

/**
 * The supported standard phosphor types for monochrome CRT rendering.
 *
 * - `"P1"` - 525nm, green phosphor. A common phosphor type found in computer monitors of the era.
 * - `"P2"` - 543nm, blue-green phosphor. Mostly used in oscilloscopes.
 * - `"P3"` - 602nm, amber phosphor. A common phosphor type found in computer monitors of the era.
 * - `"P4"` - 565, 540nm, "white" phosphor. A common phosphor type found in computer monitors and TV CRTs.
 * - `"P6"` - 565, 460nm, "white" phosphor. A common phosphor type found in computer monitors and TV CRTs.
 *
 * @see {@link https://en.wikipedia.org/wiki/Phosphor}
 * @see {@link https://www.labguysworld.com/crt_phosphor_research.pdf}
 */
export type PhosphorTypes = 'P1' | 'P2' | 'P3' | 'P4' | 'P6';
export type PhosphorColors = [on: number, glow: number, off: number];

export const Phosphors: { [key in PhosphorTypes]: PhosphorColors } = {
  P1: [
    toUint32(toSRGB(phosphorSample(525, [490, 580]))),
    toUint32(toSRGB(wavelengthI(525, 0.25))),
    0xff000000,
  ],
  P2: [
    toUint32(toSRGB(phosphorSample(534, [450, 640]))),
    toUint32(toSRGB(wavelengthI(534, 0.125))),
    0xff000000,
  ],
  P3: [
    toUint32(toSRGB(phosphorSample(602, [504, 700]))),
    toUint32(toSRGB(wavelengthI(602, 0.25))),
    0xff000000,
  ],
  P4: [
    toUint32(
      toSRGB(
        mix(
          phosphorSample(565, [390, 663], 1),
          phosphorSample(435, [390, 663], 1),
          1 / 2,
        ),
      ),
    ),
    toUint32(
      toSRGB(
        mix(
          phosphorSample(565, [390, 663], 1 / 2),
          phosphorSample(435, [390, 663], 1 / 2),
          2 / 3,
        ),
      ),
    ),
    0xff000000,
  ],
  P6: [
    toUint32(
      toSRGB(
        mix(
          phosphorSample(563, [416, 695], 1),
          phosphorSample(460, [416, 695], 1),
          1 / 3,
        ),
      ),
    ),
    toUint32(
      toSRGB(
        mix(
          phosphorSample(563, [416, 695], 1),
          phosphorSample(460, [416, 695], 1),
          0.5,
        ),
      ),
    ),
    0xff000000,
  ],
};
