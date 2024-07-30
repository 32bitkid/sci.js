import { writeFile } from 'node:fs/promises';
import path from 'node:path';

import { type Command } from 'commander';
import { Presets, SingleBar } from 'cli-progress';

import { decompress, parseFont, parsePic } from '@4bitlabs/sci0';
import { generatePic } from '@4bitlabs/sci0-renderer';
import { createIndexedPixelData, IndexedPixelData } from '@4bitlabs/image';
import { picMatcher, fontMatcher } from '../helpers/resource-matchers';
import {
  loadContentFromMap,
  ResourceMapPredicate,
} from './load-content-from-map';
import {
  RenderPicOptions,
  RenderPipelineOptions,
} from '../models/render-pic-options';
import { pickRenderOptions } from './pick-render-options';
import { getRootOptions } from './get-root-options';
import workers from '../workers';
import { formatGraph } from './filter-graph';
import { crtFilterGraph } from './crt-filter-graph';

interface PicVideoActionOptions {
  readonly output: string;
  readonly title: string;
  readonly fps: number;
}

const clone = ({
  width,
  height,
  keyColor,
  pixels,
}: IndexedPixelData): IndexedPixelData => {
  const dupe = createIndexedPixelData(width, height, { keyColor });
  dupe.pixels.set(pixels);
  return dupe;
};

const mustParse = async <T>(
  root: string,
  engine: 'sci0' | 'sci01',
  matcher: ResourceMapPredicate,
  parser: (data: Uint8Array) => T,
) => {
  const [picHeader, picRaw] = await loadContentFromMap(root, matcher);
  return parser(decompress(engine, picHeader.compression, picRaw));
};

export async function picVideoAction(
  id: number,
  options: PicVideoActionOptions & RenderPicOptions & RenderPipelineOptions,
  cmd: Command,
) {
  const progress = new SingleBar(Presets.shades_grey);

  const { root, engine } = getRootOptions(cmd);
  const [picOptions, renderOptions] = pickRenderOptions(options);
  const {
    title,
    format,
    fps,
    forcePal,
    output = `pic.%num.%d.${format}`,
  } = picOptions;

  const pic = await mustParse(root, engine, picMatcher(id), (d) => parsePic(d));
  const font = await mustParse(root, engine, fontMatcher(0), parseFont);

  const total = pic.length;
  const padLength = Math.ceil(Math.log10(total));

  const { dir, name, ext } = path.parse(output);

  const frames = Array(total)
    .fill(null)
    .map((_, idx) =>
      path.format({
        dir,
        name: name
          .replace(/%num/, id.toString(10).padStart(3, '0'))
          .replace(/%d/, idx.toString(10).padStart(padLength, '0')),
        ext,
      }),
    );

  progress.start(total, 0);

  const done: PromiseLike<void>[] = [];

  for (const [idx, , layers] of generatePic(pic, { forcePal })) {
    const outfile = frames[idx];
    const message = {
      font,
      left: [title, `PIC.${id.toString(10).padStart(3, '0')}`]
        .filter((it) => it.length > 0)
        .join(': '),
      right:
        idx === frames.length - 1
          ? ''
          : `${((idx / frames.length) * 100).toFixed(0)}%`,
    };

    done.push(
      workers
        .exec('renderPic', [
          outfile,
          clone(layers[picOptions.layer]),
          picOptions.layer,
          format,
          renderOptions,
          message,
        ])
        .then(() => progress.increment()),
    );
  }

  await Promise.all(done).finally(() => {
    progress.stop();
    return workers.terminate();
  });

  const seqFn = path.format({
    dir,
    name: name
      .replace(/%num/, id.toString(10).padStart(3, '0'))
      .replace(/%d/, 'seq'),
    ext: '.txt',
  });

  await writeFile(
    seqFn,
    [
      `ffconcat version 1.0`,
      ``,
      `file '${path.relative(dir, frames[frames.length - 1])}'`,
      `duration ${3.0 * (fps / 25)}`,
      ...frames.flatMap((fn) => [
        `file '${path.relative(dir, fn)}'`,
        `duration ${1 / 25}`,
      ]),
    ].join('\n'),
  );

  const mp4Fn = path.format({
    dir,
    name: name
      .replace(/%num/, id.toString(10).padStart(3, '0'))
      .replace(/%d/, 'result'),
    ext: '.mp4',
  });

  console.log(
    `\nRender Video:\n  ffmpeg -f concat -i ${seqFn} -vf "${formatGraph(crtFilterGraph({ desiredFps: fps }))}" -movflags +faststart ${mp4Fn}\n`,
  );

  const finalFn = path.format({
    dir,
    name: name
      .replace(/%num/, id.toString(10).padStart(3, '0'))
      .replace(/%d/, 'final'),
    ext: '.png',
  });

  console.log(
    `\nRender Image:\n  ffmpeg -i ${frames[frames.length - 1]} -vf "${formatGraph(crtFilterGraph({ image: true, resolution: [-2, 1080] }))}" ${finalFn}\n`,
  );
}
