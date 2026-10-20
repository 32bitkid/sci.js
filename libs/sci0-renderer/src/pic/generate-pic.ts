import type { DrawCommand, Pic } from '@4bitlabs/sci0';
import type { Vec2 } from '@4bitlabs/vec2';
import type { RenderPicOptions } from './render-pic-options.js';
import type { RenderResult } from './render-result.js';
import type { PaletteSet } from './default-palettes.js';
import { createScreenBuffer } from './screen-buffer.js';
import { picStep } from './pic-step.js';
import type { Screen } from './tools/screen.js';

export type IntermediatePicState = [
  idx: number,
  command: DrawCommand,
  layers: RenderResult,
  meta: {
    visualPair: [number, number] | undefined;
    priority: number | undefined;
    control: number | undefined;

    /** @deprecated use visualPair instead. will be removed in the next major version */
    palettes: PaletteSet;
    /** @deprecated do not use. will be removed in the next major version */
    screen: Screen;
  },
];

/**
 * Generate a {@link Pic} iterator that will emit after processing each {@link DrawCommand} is processed.
 *
 * @param pic Picture data.
 * @param options
 *
 * @example
 * ```ts
 * import { parsePic } from '@4bitlabs/sci0';
 * import { generatePic } from '@4bitlabs/sci0-renderer';
 * import { CGA } from '@4bitlabs/color/dithers';
 * import { createDitherFilter, renderPixelData } from '@4bitlabs/image';
 *
 * const classicPipeline = { render: createDitherFilter(CGA) };
 *
 * const picData = parsePic(data, { defer: true });
 * for (const [idx, cmd, layers] of generatePic(visible) {
 *   const { visible } = layers;
 *   const image = renderPixelData(visible, classicPipeline);
 *   saveImage(`frame${idx}.png`, image);
 * }
 * ```
 */
export function* generatePic(
  pic: Pic,
  options: RenderPicOptions = {},
): Generator<IntermediatePicState> {
  const { forcePal, width = 320, height = 190 } = options;
  const size: Vec2 = [width, height];

  const [result, screen, tick] = createScreenBuffer(size, forcePal);

  let step = 0;
  for (const cmd of pic) {
    tick(step);
    picStep(cmd, screen);

    yield [
      step,
      cmd,
      result,
      {
        ...screen.resolveColor(cmd, forcePal),
        palettes: screen.palettes,
        screen,
      },
    ];
    step += 1;
  }
}
