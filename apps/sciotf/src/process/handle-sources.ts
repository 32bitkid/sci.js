import type { Glyph } from '@4bitlabs/sci0';
import type { RootSchemaType_v0, RootSchemaType_v1 } from './schema.js';
import m from 'transformation-matrix';
import { range } from '../utils/range.js';
import {
  padGlyph,
  shiftGlyph,
  sumPadding,
  sumShifts,
  trimGlyph,
} from './pad-glyph.js';
import { compositeGlyph, xorPixels } from './xor-pixels.js';
import { getUnicodeName } from '../utils/unicode-names.js';
import { loadSource } from './load-source.js';

export type HandleSourcesActions = {
  addGlyph(
    unicode: number,
    name: string,
    char: Glyph,
    matrix?: m.Matrix,
    overwrite?: boolean,
    advanceWidth?: number,
  ): void;

  addLigature(
    type: 'rlig' | 'liga' | 'dlig',
    unicode: number,
    def: string[] | undefined,
  ): void;

  addAlternate(type: string, target: number, source: string): void;
};

export async function handleSources_v0(
  payload: RootSchemaType_v0,
  { addGlyph, addLigature }: HandleSourcesActions,
) {
  for (const source of payload.sources) {
    const font = await loadSource(source);
    for (const mapping of source.mappings) {
      if (mapping === 'ascii' || mapping === 'ascii-symbols') {
        for (const i of range(0x20, 0x2f)) {
          let char = font.characters[i];
          if (char.width <= 1 && char.height <= 1) continue;
          const name = getUnicodeName(i);
          char = padGlyph(char, payload.pad);
          char = shiftGlyph(char, source.shift);
          addGlyph(i, name, char);
        }
      }
      if (mapping === 'ascii' || mapping === 'ascii-digits') {
        for (const i of range(0x30, 0x3f)) {
          let char = font.characters[i];
          if (char.width <= 1 && char.height <= 1) continue;
          const name = getUnicodeName(i);
          char = padGlyph(char, payload.pad);
          char = shiftGlyph(char, source.shift);
          addGlyph(i, name, char);
        }
      }
      if (mapping === 'ascii' || mapping === 'ascii-uppercase') {
        for (const i of range(0x40, 0x5f)) {
          let char = font.characters[i];
          if (char.width <= 1 && char.height <= 1) continue;
          const name = getUnicodeName(i);
          char = padGlyph(char, payload.pad);
          char = shiftGlyph(char, source.shift);
          addGlyph(i, name, char);
        }
      }
      if (mapping === 'ascii' || mapping === 'ascii-lowercase') {
        for (const i of range(0x60, 0x7d)) {
          let char = font.characters[i];
          if (char.width <= 1 && char.height <= 1) continue;
          const name = getUnicodeName(i);
          char = padGlyph(char, payload.pad);
          char = shiftGlyph(char, source.shift);
          addGlyph(i, name, char);
        }
      }

      if (Array.isArray(mapping)) {
        const [inputChar, unicodeStr, name, options] = mapping;
        const unicode = Number.parseInt(unicodeStr, 16);
        let char = font.characters[Number.parseInt(inputChar, 16)];
        char = trimGlyph(char, options?.trim);
        char = padGlyph(char, sumPadding(payload.pad, options?.pad));
        char = shiftGlyph(char, sumShifts(options?.shift, source.shift));
        if (options?.xor) {
          char = xorPixels(char, options.xor);
        }

        const chMat2d = options?.pad?.top
          ? m.translate(0, -options.pad.top)
          : m.identity();

        addGlyph(
          unicode,
          name.trim() ? name.trim().toUpperCase() : getUnicodeName(unicode),
          char,
          chMat2d,
          options?.force,
        );

        addLigature('rlig', unicode, options?.rlig);
        addLigature('liga', unicode, options?.liga);
        addLigature('dlig', unicode, options?.dlig);
      }
    }
  }
}

export async function handleSources_v1(
  payload: RootSchemaType_v1,
  { addGlyph, addLigature, addAlternate }: HandleSourcesActions,
) {
  for (const source of payload.sources) {
    const font = await loadSource(source);
    for (const mapping of source.mappings) {
      if (mapping === 'ascii' || mapping === 'ascii-symbols') {
        for (const i of range(0x20, 0x2f)) {
          let char = font.characters[i];
          if (char.width <= 1 && char.height <= 1) continue;
          const name = getUnicodeName(i);
          char = padGlyph(char, payload.pad);
          char = shiftGlyph(char, source.shift);
          addGlyph(i, name, char);
        }
      }
      if (mapping === 'ascii' || mapping === 'ascii-digits') {
        for (const i of range(0x30, 0x3f)) {
          let char = font.characters[i];
          if (char.width <= 1 && char.height <= 1) continue;
          const name = getUnicodeName(i);
          char = padGlyph(char, payload.pad);
          char = shiftGlyph(char, source.shift);
          addGlyph(i, name, char);
        }
      }
      if (mapping === 'ascii' || mapping === 'ascii-uppercase') {
        for (const i of range(0x40, 0x5f)) {
          let char = font.characters[i];
          if (char.width <= 1 && char.height <= 1) continue;
          const name = getUnicodeName(i);
          char = padGlyph(char, payload.pad);
          char = shiftGlyph(char, source.shift);
          addGlyph(i, name, char);
        }
      }
      if (mapping === 'ascii' || mapping === 'ascii-lowercase') {
        for (const i of range(0x60, 0x7e)) {
          let char = font.characters[i];
          if (char.width <= 1 && char.height <= 1) continue;
          const name = getUnicodeName(i);
          char = padGlyph(char, payload.pad);
          char = shiftGlyph(char, source.shift);
          addGlyph(i, name, char);
        }
      }

      if (Array.isArray(mapping)) {
        const [inputChar, unicodeStr, options] = mapping;
        const unicode = Number.parseInt(unicodeStr, 16);
        const name =
          options?.name?.trim()?.toUpperCase() || getUnicodeName(unicode);

        let chMat2d = m.identity();
        let char = font.characters[Number.parseInt(inputChar, 16)];

        char = padGlyph(char, payload.pad);

        // Process action stack
        for (const action of options?.actions ?? []) {
          if ('trim' in action) char = trimGlyph(char, action.trim);
          else if ('shift' in action) char = shiftGlyph(char, action.shift);
          else if ('xor' in action) char = xorPixels(char, action.xor);
          else if ('rlig' in action) addLigature('rlig', unicode, action.rlig);
          else if ('liga' in action) addLigature('liga', unicode, action.liga);
          else if ('dlig' in action) addLigature('dlig', unicode, action.dlig);
          else if ('alt' in action) {
            const [type, other] = action.alt;
            addAlternate(type, unicode, other);
          } else if ('comp' in action)
            char = compositeGlyph(
              char,
              padGlyph(
                font.characters[parseInt(action.comp[0], 16)],
                payload.pad,
              ),
              action.comp[1],
            );
          else if ('pad' in action) {
            char = padGlyph(char, action.pad);
            chMat2d = m.compose(
              chMat2d,
              m.translate(0, -(action.pad.top ?? 0)),
            );
          } else if ('base' in action) {
            chMat2d = m.compose(chMat2d, m.translate(0, action.base));
          }
        }

        addGlyph(
          unicode,
          name,
          char,
          chMat2d,
          options?.overwrite,
          options?.advanceWidth,
        );
      }
    }
  }
}
