import { writeFile } from 'node:fs/promises';
import path from 'node:path';

import { type Command } from 'commander';
import { Presets, SingleBar } from 'cli-progress';

import { decompress, parseFont, parsePic } from '@4bitlabs/sci0';
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

interface PicRenderActionOptions {
  readonly output: string;
  readonly title: string;
}

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
  options: PicRenderActionOptions & RenderPicOptions & RenderPipelineOptions,
  cmd: Command,
) {
  const progress = new SingleBar(Presets.shades_grey);

  const { root, engine } = getRootOptions(cmd);
  const [picOptions, renderOptions] = pickRenderOptions(options);
  const {
    title,
    format,
    forcePal,
    output = `pic.${id.toString(10).padStart(3, '0')}.%d.${format}`,
  } = picOptions;

  const pic = await mustParse(root, engine, picMatcher(id), parsePic);
  const font = await mustParse(root, engine, fontMatcher(0), parseFont);

  const total = pic.length;
  const padLength = Math.ceil(Math.log10(total));

  const { dir, name, ext } = path.parse(output);

  const frames = Array(total)
    .fill(null)
    .map((_, idx) =>
      path.format({
        dir,
        name: name.replace(/%d/, idx.toString(10).padStart(padLength, '0')),
        ext,
      }),
    );

  progress.start(total, 0);
  const done = frames.map((fn, idx) =>
    workers
      .exec('renderPic', [
        fn,
        pic.slice(0, idx + 1),
        picOptions.layer,
        forcePal,
        format,
        renderOptions,
        {
          font,
          left: [title, id.toString(10).padStart(3, '0')]
            .filter((it) => it.length > 0)
            .join(': '),
          right:
            idx === frames.length - 1
              ? ''
              : `${((idx / frames.length) * 100).toFixed(0)}%`,
        },
      ])
      .then(() => progress.increment()),
  );

  await Promise.all(done).finally(() => progress.stop());

  const seqFn = path.format({
    dir,
    name: name.replace(/%d/, 'seq'),
    ext: '.txt',
  });

  await writeFile(
    seqFn,
    [
      `ffconcat version 1.0`,
      ``,
      `file '${path.relative(dir, frames[frames.length - 1])}'`,
      `duration ${3.0 * (60 / 25)}`,
      ...frames.flatMap((fn) => [
        `file '${path.relative(dir, fn)}'`,
        `duration ${1 / 25}`,
      ]),
    ].join('\n'),
  );

  const mp4Fn = path.format({
    dir,
    name: name.replace(/%d/, 'result'),
    ext: '.mp4',
  });

  const filters = [
    'settb=expr=AVTB',
    `setpts=${25 / 60}*(PTS-STARTPTS)`,
    'fps=60',
    'gblur=sigma=2.5:sigmaV=0.0:steps=3',
    'vignette=PI/7.5',
    'pad=iw+8:ih+8:4:4:black',
    'lenscorrection=k1=0.02:k2=0.02:i=bilinear',
    'crop=iw-8:ih-8',
    'format=yuv420p',
    'scale=-2:720:flags=lanczos',
  ];

  console.log(
    `\n\nffmpeg -f concat -i ${seqFn} -vf "${filters.join(', ')}" -movflags +faststart ${mp4Fn}\n`,
  );
}
