import { readFile, writeFile } from 'node:fs/promises';
import { join as pathJoin } from 'node:path';
import type { Sade } from 'sade';
import wawoff from 'wawoff2';

import { tryParse } from '../process/schema.js';
import { processFont } from '../process/process-font.js';
import { getAspectRatioString } from '../opt-parsers.js';

const isUnicodePUA = (unicode: number) =>
  (unicode >= 0xe000 && unicode <= 0xf8ff) ||
  (unicode >= 0xf_0000 && unicode <= 0xf_ffffd) ||
  (unicode >= 0x10_0000 && unicode <= 0x10_fffd);

function advancedAction(prog: Sade) {
  prog
    .command('advanced <file>')
    .alias('adv')
    .describe(
      'Uses a font definition JSON file to compile and modify glyphs from multiple sources',
    )
    .option(
      '--format, -f',
      'output format from "otf" or "woff2". can be used multiple times (default: "otf")',
      'otf',
    )
    .option(
      '--aspect-ratio, -a',
      'set pixel aspect-ratio to "1:1", "1:1.2", or "5:6"',
      '1:1.2',
    )
    .option(
      '--chamfer, -c',
      'set corner chamfer mode from "none", "inside", "outside", "both"',
      'both',
    )
    .option('--output, -o', 'output folder', '.')
    .option('--verbose, -v', 'verbose output', false)
    .action(
      async (
        file: string,
        opts: {
          'aspect-ratio': string;
          chamfer: string;
          output: string;
          verbose: boolean;
          format: string | string[];
        },
      ) => {
        const json = await readFile(file);
        const payload = tryParse(JSON.parse(new TextDecoder().decode(json)));

        const [sciOTF, aspectRatio, glyphMap] = await processFont(
          payload,
          opts,
        );

        if (opts.verbose) console.log(`# \`${sciOTF}\`\n`);
        if (opts.verbose)
          console.log(
            `Type: ${file.endsWith('.free.json') ? 'Free' : file.endsWith('.free.json') ? 'Free + Retail' : 'Free + Retail + Custom Glyphs'}<br>`,
          );

        const outputPath = opts.output ?? '.';
        const formats = Array.isArray(opts.format)
          ? opts.format.map((it) => it.toLowerCase())
          : typeof opts.format === 'string'
            ? [opts.format.toLowerCase()]
            : 'otf';

        const arStr = getAspectRatioString(aspectRatio);
        const otfBytes = Buffer.from(sciOTF.toArrayBuffer());
        if (formats.includes('otf')) {
          const fileName = `sci${arStr}-${payload.name.replace(/[^A-Za-z0-9]+/g, '-').toLowerCase()}.otf`;
          const fn = pathJoin(outputPath, fileName);
          await writeFile(fn, otfBytes);
          console.log(opts.verbose ? `OTF file: \`${fileName}\`<br>` : fn);
        }

        if (formats.includes('woff2')) {
          const fileName = `sci${arStr}-${payload.name.replace(/[^A-Za-z0-9]+/g, '-').toLowerCase()}.woff2`;
          const fn = pathJoin(outputPath, fileName);
          await writeFile(fn, await wawoff.compress(otfBytes));
          console.log(opts.verbose ? `WOFF2 file: \`${fileName}\`<br>` : fn);
        }

        if (opts.verbose) {
          const charSet = [...glyphMap.entries()]
            .sort(([a], [b]) => a - b)
            .reduce<string>((prev, [codepoint]) => {
              if (isUnicodePUA(codepoint)) return prev;
              if (/^\s+$/.test(String.fromCodePoint(codepoint))) return prev;
              return `${prev}${String.fromCodePoint(codepoint)}`;
            }, '');

          const customGlyphs = [...glyphMap.entries()]
            .sort(([a], [b]) => a - b)
            .flatMap(([codepoint, glyph]) => {
              if (!isUnicodePUA(codepoint)) return [];
              return [
                `| U+${codepoint.toString(16).padStart(4, '0').toUpperCase()} | ${glyph.name} |`,
              ];
            });

          const customGlyphsMd = customGlyphs.length
            ? `### Custom Glyphs

| Unicode | Name |
|---------|------|
${customGlyphs.join('\n')}
`
            : '';

          console.log(`Pixel Aspect-Ratio: ${aspectRatio[0]}&ratio;${aspectRatio[1]}<br>
Recommended Size: 16px/12pt. _${aspectRatio[1] === aspectRatio[0] ? 'Enable' : 'Disable'} anti-aliasing_.<br>
Total Glyphs: ${glyphMap.size}


### Full Character Set
<code style="word-break: break-all;">
${charSet}
</code>

${customGlyphsMd}
_Built ${new Intl.DateTimeFormat('en-US').format(new Date())}_
`);
        }
      },
    );
}

export default advancedAction;
