import type { Vec2 } from '@4bitlabs/vec2';
import type { Pic } from '@4bitlabs/sci0';
import { createScreenBuffer } from './screen-buffer';
import type { RenderResult } from './render-result';
import type { RenderPicOptions } from './render-pic-options';
import { picStep } from './pic-step';
import { defaultPalettes } from './default-palettes';

/**
 * Render a {@link Pic} resource into its composite layers.
 *
 * @param pic The picture data to render.
 * @param options
 *
 * @see {@link RenderResult}
 *
 * @example
 * ```ts
 * import { parsePic } from '@4bitlabs/sci0';
 * import { renderPic } from '@4bitlabs/sci0-renderer';
 * import { CGA } from '@4bitlabs/color/dithers';
 * import { createDitherFilter, renderPixelData } from '@4bitlabs/image';
 *
 * const picData = parsePic(data);
 * const { visible, priority, control } = renderPic(picData);
 * const image = renderPixelData(visible, {
 *   render: createDitherFilter(CGA),
 * });
 * ```
 */
export const renderPic = (
  pic: Pic,
  options: RenderPicOptions = {},
): RenderResult => {
  const { forcePal, width = 320, height = 190 } = options;
  const size: Vec2 = [width, height];

  const palettes = defaultPalettes();
  const [result, screen, tick] = createScreenBuffer(forcePal, palettes, size);

  let step = 0;
  for (const cmd of pic) {
    tick(step);
    picStep(cmd, screen, palettes);
    step += 1;
  }

  return result;
};
