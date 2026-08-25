import m from 'transformation-matrix';
import opentype from 'opentype.js';
import type { Glyph } from '@4bitlabs/sci0';

import type {
  BaselineSchemaType,
  BatchSchemaType,
  LineHeightSchemaType,
  SourceSchemaType,
} from './schema.js';
import { charToGlyph } from './pixel-to-glyph.js';
import { handleSources_v0, handleSources_v1 } from './handle-sources.js';
import {
  getAspectRatioString,
  parseAspectRatio,
  parseChamfer,
  parseSideBearing,
} from '../actions/opt-parsers.js';
import { loadSource } from './load-source.js';
import { guessBaseline } from '../utils/measure.js';

const isAlt = (
  feat: string,
): feat is
  | 'salt'
  | 'ss01'
  | 'ss02'
  | 'ss03'
  | 'ss04'
  | 'ss05'
  | 'ss06'
  | 'ss07'
  | 'ss08'
  | 'ss09'
  | 'ss10'
  | 'ss11'
  | 'ss12'
  | 'ss13'
  | 'ss14'
  | 'ss15'
  | 'ss16'
  | 'ss17'
  | 'ss18'
  | 'ss19'
  | 'ss20' => {
  if (feat === 'salt') return true;
  return /^ss\d{2}$/.test(feat);
};

async function getBaseline(
  defaultSource: SourceSchemaType,
  option?: BaselineSchemaType,
) {
  if (option === undefined) {
    const font = await loadSource(defaultSource);
    return guessBaseline(font);
  }

  switch (option.type) {
    case 'constant':
      return option.value;
    case 'patch':
    case 'resource': {
      const font = await loadSource(defaultSource);
      return guessBaseline(font, option.char);
    }
  }
}

async function getLineHeight(
  defaultSource: SourceSchemaType,
  option?: LineHeightSchemaType,
) {
  if (option === undefined) {
    const font = await loadSource(defaultSource);
    return font.lineHeight;
  }

  switch (option.type) {
    case 'constant':
      return option.value;
    case 'patch':
    case 'resource': {
      const font = await loadSource(defaultSource);
      return font.lineHeight;
    }
  }
}

export async function processFont(
  payload: BatchSchemaType,
  opts: {
    'aspect-ratio': string;
    'side-bearing'?: 'lsb' | 'rsb' | 'none';
    chamfer: string;
  },
): Promise<[opentype.Font, [number, number], Map<number, opentype.Glyph>]> {
  const aspectRatio = parseAspectRatio(
    opts['aspect-ratio'] ?? payload.aspectRatio,
  );

  const sideBearing = parseSideBearing(
    opts['side-bearing'],
    payload.adjustSideBearing,
  );

  const defaultSource = payload.sources[0];
  const baseline =
    (await getBaseline(defaultSource, payload.baseline)) +
    (payload.pad?.top ?? 0);
  const lineHeight =
    (await getLineHeight(defaultSource, payload.lineHeight)) +
    (payload.pad?.top ?? 0) +
    (payload.pad?.bottom ?? 0);
  const chamferMode = parseChamfer(opts.chamfer, payload.chamfer);

  const unitsPerEm = 1024;
  const screenScale = m.compose(m.scale(...aspectRatio), m.scale(64, 64));
  const mat2d = m.compose(
    screenScale,
    m.scale(1, -1),
    m.translate(0, -baseline),
  );

  // Gather glyphs
  const features: [type: string, number[], number[]][] = [];

  const addLigature = (
    type: 'rlig' | 'liga' | 'dlig',
    unicode: number,
    def: string[] | undefined,
  ) => {
    if (!def || def.length <= 1) return;
    features.push([type, [unicode], def.map((it) => parseInt(it, 16))]);
  };

  const addAlternate = (
    type: opentype.FeatureAlternates,
    target: number,
    other: string,
  ) => {
    features.push([type, [target], [parseInt(other, 16)]]);
  };

  const glyphMap: Map<number, opentype.Glyph> = new Map();
  const addGlyph = (
    unicode: number,
    name: string,
    char: Glyph,
    glyMat: m.Matrix = m.identity(),
    overwrite: boolean = false,
    advanceWidth?: number,
  ): opentype.Glyph => {
    if (glyphMap.has(unicode) && !overwrite) {
      console.error(
        `warning: U+${unicode.toString(16).padStart(4, '0')} has been mapped multiple times`,
      );
    } else if (!glyphMap.has(unicode) && overwrite) {
      console.error(
        `warning: U+${unicode.toString(16).padStart(4, '0')} overwriting, but not previously set`,
      );
    }

    const sbAdjust =
      sideBearing !== 'none'
        ? m.translate(sideBearing === 'rsb' ? 0.5 : -0.5, 0)
        : m.identity();

    const chMat2d = m.compose(mat2d, glyMat, sbAdjust);
    const glyph = charToGlyph(
      unicode,
      name,
      char,
      chMat2d,
      screenScale.a,
      chamferMode,
      advanceWidth,
    );

    glyphMap.set(unicode, glyph);
    return glyph;
  };

  switch (payload.$schemaVersion) {
    case 'v1': {
      await handleSources_v1(payload, {
        addGlyph,
        addLigature,
        addAlternate,
      });
      break;
    }
    default:
      await handleSources_v0(payload, {
        addGlyph,
        addLigature,
        addAlternate,
      });
  }

  const glyphs = [
    new opentype.Glyph({
      name: '.notdef',
      advanceWidth: 8 * screenScale.a,
      path: new opentype.Path(),
    }),
    ...[...glyphMap.values()].sort(
      (a, b) => (a.unicode ?? 0) - (b.unicode ?? 0),
    ),
  ];

  const arStr = getAspectRatioString(aspectRatio);
  const familyName = `Sci${arStr} ${payload.name}`;

  const sciOTF = new opentype.Font({
    familyName: familyName,
    fullName: `Sci${arStr} ${payload.name} Regular`,
    styleName: `Regular`,
    weightClass: '400',
    widthClass: '5',
    unitsPerEm: unitsPerEm,
    license: 'CC0 1.0 Universal',
    licenseURL:
      'https://creativecommons.org/publicdomain/zero/1.0/legalcode.txt',
    ascender: baseline * screenScale.d,
    descender: (baseline - lineHeight) * screenScale.d,
    glyphs: glyphs,
    version: payload.version ?? '1.0.0',
  });

  features.sort(([featureA], [featureB]) => featureA.localeCompare(featureB));

  for (const [feat, ...rest] of features) {
    switch (feat) {
      case 'rlig':
      case 'liga':
      case 'dlig': {
        const [[byChar], subChars] = rest;
        const [subA, subB, ...subRest] = subChars.map((it) =>
          sciOTF.charToGlyphIndex(String.fromCodePoint(it)),
        );

        sciOTF.substitution.addLigature(feat, {
          sub: [subA, subB, ...subRest],
          by: sciOTF.charToGlyphIndex(String.fromCodePoint(byChar)),
        });
        continue;
      }
    }

    if (isAlt(feat) || feat === 'smcp') {
      const [[target], [other]] = rest;
      sciOTF.substitution.addSingle(feat, {
        sub: sciOTF.charToGlyphIndex(String.fromCodePoint(other)),
        by: sciOTF.charToGlyphIndex(String.fromCodePoint(target)),
      });
      continue;
    }

    console.error(`warning: feature not implemented ${feat}`);
  }

  return [sciOTF, aspectRatio, glyphMap];
}
