import * as z from 'zod';
import { ZodCel } from './cel-schema.js';

const ZodPoint = z.tuple([z.int(), z.int()]).readonly();

const ZodPolylineCommand = z.tuple([z.literal('PLINE')]).rest(ZodPoint);
const ZodFillCommand = z.tuple([z.literal('FILL'), ZodPoint]);
const ZodSetPaletteCommand = z
  .tuple([z.literal('SET_PALETTE'), z.number().min(0).max(3)])
  .rest(z.int().min(0).max(255));

const ZodSetMonoPaletteCommand = z
  .tuple([z.literal('SET_MONO_PALETTE'), z.number().min(0).max(3)])
  .rest(z.int().min(0).max(255));

const ZodUpdatePaletteCommand = z
  .tuple([z.literal('UPDATE_PALETTE')])
  .rest(
    z.tuple([
      z.number().min(0).max(3),
      z.int().min(0).max(39),
      z.int().min(0).max(255),
    ]),
  );

const ZodSetPatternCommand = z.tuple([
  z.literal('SET_PATTERN'),
  z.int().min(0).max(7),
  z.boolean(),
  z.boolean(),
]);

const ZodBrushCommand = z.tuple([
  z.literal('BRUSH'),
  z.int().min(0).max(127),
  ZodPoint,
]);

const ZodCelCommand = z.tuple([z.literal('CEL'), ZodPoint, ZodCel]);

const ZodSetPriorityBandsCommand = z
  .tuple([z.literal('SET_PRIORITY_BANDS')])
  .rest(z.int().positive());

const ZodDrawCommands = z.union([
  ZodBrushCommand,
  ZodFillCommand,
  ZodPolylineCommand,
  ZodSetMonoPaletteCommand,
  ZodSetPaletteCommand,
  ZodSetPatternCommand,
  ZodUpdatePaletteCommand,
  ZodCelCommand,
  ZodSetPriorityBandsCommand,
  z.tuple([z.literal('SET_VISUAL'), z.int().min(0).max(255)]),
  z.tuple([z.literal('SET_PRIORITY'), z.int().min(0).max(255)]),
  z.tuple([z.literal('SET_CONTROL'), z.int().min(0).max(255)]),
  z.tuple([z.literal('SET_MONO'), z.int().min(0).max(255)]),
  z.tuple([z.literal('SET_MONO_DIRECT'), z.int().min(0).max(255)]),
  z.tuple([z.literal('CLEAR_VISUAL')]),
  z.tuple([z.literal('CLEAR_PRIORITY')]),
  z.tuple([z.literal('CLEAR_CONTROL')]),
  z.tuple([z.literal('CLEAR_MONO')]),
  z.tuple([z.literal('CLEAR_MONO_DIRECT')]),
]);

export const ZodPic = z.array(ZodDrawCommands);
export const PicSchema = z.compile(ZodPic);
export type PicSchemaType = z.infer<typeof PicSchema>;
