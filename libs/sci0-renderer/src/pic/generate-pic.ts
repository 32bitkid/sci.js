import type { DrawCommand, Pic } from '@4bitlabs/sci0';
import type { Vec2 } from '@4bitlabs/vec2';
import { RenderPicOptions } from './render-pic-options';
import { RenderResult } from './render-result';
import { defaultPalettes } from './default-palettes';
import { createScreenBuffer } from './screen-buffer';
import { picStep } from './pic-step';

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
): Generator<[idx: number, command: DrawCommand, layers: RenderResult]> {
  const { forcePal, width = 320, height = 190 } = options;
  const size: Vec2 = [width, height];

  const palettes = defaultPalettes();
  const [result, screen, tick] = createScreenBuffer(forcePal, palettes, size);

  let step = 0;
  for (const cmd of pic) {
    tick(step);
    picStep(cmd, screen, palettes);
    yield [step, cmd, result];
    step += 1;
  }
}
