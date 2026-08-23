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
} from '../opt-parsers.js';
import { loadSource } from './load-source.js';
import { guessBaseline } from '../utils/measure.js';

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
    chamfer: string;
  },
): Promise<[opentype.Font, [number, number], Map<number, opentype.Glyph>]> {
  const aspectRatio = parseAspectRatio(
    opts['aspect-ratio'] ?? payload.aspectRatio,
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
  const ligatures: [type: 'rlig' | 'liga' | 'dlig', number, number[]][] = [];

  const addLigature = (
    type: 'rlig' | 'liga' | 'dlig',
    unicode: number,
    def: string[] | undefined,
  ) => {
    if (!def || def.length <= 1) return;
    ligatures.push([type, unicode, def.map((it) => parseInt(it, 16))]);
  };

  const alternates: [type: string, number, number][] = [];
  const addAlternate = (
    type: opentype.FeatureAlternates,
    target: number,
    other: string,
  ) => {
    alternates.push([type, target, parseInt(other, 16)]);
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

    const chMat2d = m.compose(mat2d, glyMat);
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

  for (const [type, byChar, subChars] of ligatures) {
    const [subA, subB, ...subRest] = subChars.map((it) =>
      sciOTF.charToGlyphIndex(String.fromCodePoint(it)),
    );

    sciOTF.substitution.addLigature(type, {
      sub: [subA, subB, ...subRest],
      by: sciOTF.charToGlyphIndex(String.fromCodePoint(byChar)),
    });
  }

  for (const [type, target, other] of alternates) {
    sciOTF.substitution.addSingle(type, {
      sub: sciOTF.charToGlyphIndex(String.fromCodePoint(other)),
      by: sciOTF.charToGlyphIndex(String.fromCodePoint(target)),
    });
  }

  return [sciOTF, aspectRatio, glyphMap];
}
