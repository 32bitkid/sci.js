import { unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

import sharp, { type Sharp } from 'sharp';
import type { Command } from 'commander';
import { Presets, SingleBar } from 'cli-progress';

import { decompress, parseFont, parsePic } from '@4bitlabs/sci0';
import { generatePic, menuTextFilter } from '@4bitlabs/sci0-renderer';
import { renderPixelData } from '@4bitlabs/image';
import { picMatcher, fontMatcher } from '../helpers/resource-matchers';
import {
  loadContentFromMap,
  type ResourceMapPredicate,
} from './load-content-from-map';
import type {
  RenderPicOptions,
  RenderPipelineOptions,
} from '../models/render-pic-options';
import { pickRenderOptions } from './pick-render-options';
import { getRootOptions } from './get-root-options';
import { formatGraph } from './filter-graph';
import { crtFilterGraph, simpleFilterGraph } from './crt-filter-graph';
import { createPicPipeline } from '../helpers/create-pic-pipeline';
import { optionalDeferredCrtFilter } from '../helpers/apply-crt-filter';

interface PicVideoActionOptions {
  readonly output: string;
  readonly title: string;
  readonly fps: number;
}

const FORMAT_MAPPING = {
  png: (source: Sharp) => source.png().toBuffer(),
  jpg: (source: Sharp) => source.jpeg().toBuffer(),
  webp: (source: Sharp) => source.webp().toBuffer(),
  raw: (source: Sharp) => source.raw().toBuffer(),
};

function ffmpeg(args: string[]): Promise<void> {
  console.log(`ffmpeg ${args.join(' ')}\n`);

  return new Promise((resolve, reject) => {
    const proc = spawn('ffmpeg', args, { stdio: 'inherit' });
    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });
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
  const pipeline = createPicPipeline(picOptions.layer, renderOptions);

  const pic = await mustParse(root, engine, picMatcher(id), (d) => parsePic(d));
  const font = await mustParse(root, engine, fontMatcher(0), parseFont);

  const total = pic.length;
  const padLength = Math.ceil(Math.log10(total));

  const { dir, name, ext } = path.parse(output);
  const crtFilter = optionalDeferredCrtFilter(options.crt);

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
          : `${idx} : ${((idx / frames.length) * 100).toFixed(0)}%`,
    };

    const { data, width, height } = renderPixelData(layers[picOptions.layer], {
      pre: [message && menuTextFilter(1, 1, message), ...(pipeline.pre ?? [])],
      render: pipeline.render,
      post: [...(pipeline.post ?? []), crtFilter],
    });

    const image = sharp(data, { raw: { width, height, channels: 4 } });
    if (outfile === '-') {
      process.stdout.write(await FORMAT_MAPPING[format](image));
    } else {
      await image.toFile(outfile);
    }

    progress.increment();
  }

  progress.stop();

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

  const finalFn = path.format({
    dir,
    name: name
      .replace(/%num/, id.toString(10).padStart(3, '0'))
      .replace(/%d/, 'final'),
    ext: '.png',
  });

  const graphFn = options.crt ? simpleFilterGraph : crtFilterGraph;

  await ffmpeg([
    '-f',
    'concat',
    '-i',
    seqFn,
    '-vf',
    formatGraph(graphFn({ desiredFps: fps })),
    '-movflags',
    '+faststart',
    mp4Fn,
  ]);

  await ffmpeg([
    '-i',
    frames[frames.length - 1],
    '-vf',
    formatGraph(graphFn({ image: true, resolution: [-2, 1080] })),
    finalFn,
  ]);

  await Promise.all([...frames, seqFn].map((fn) => unlink(fn)));
}
