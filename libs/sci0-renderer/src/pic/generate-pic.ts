import {
  type DrawCommand,
  type DrawMode,
  type Pic,
  picStateWatcher,
} from '@4bitlabs/sci0';
import type { Vec2 } from '@4bitlabs/vec2';
import type { RenderPicOptions } from './render-pic-options.js';
import type { RenderResult } from './render-result.js';
import { createScreenBuffer } from './screen-buffer.js';
import { picStep } from './pic-step.js';

export type IntermediatePicState = [
  idx: number,
  command: DrawCommand,
  layers: RenderResult,
  meta: {
    readonly drawMode: DrawMode;
    readonly visual: [number, number];
    readonly priority: number;
    readonly control: number;
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

  const { state, observe } = picStateWatcher();
  const [result, screen, tick] = createScreenBuffer(size, forcePal);

  let step = 0;
  for (const cmd of observe(pic)) {
    tick(step);
    picStep(cmd, screen, state);

    yield [
      step,
      cmd,
      result,
      {
        drawMode: state.drawMode,
        visual: screen.resolveDither(state.drawCodes),
        priority: state.drawCodes[1],
        control: state.drawCodes[2],
      },
    ];
    step += 1;
  }
}
