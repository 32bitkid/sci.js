import * as z from 'zod';

export const ResourceSchema = () =>
  z.object({
    type: z.literal('resource'),
    root: z.string(),
    engine: z.enum(['sci0', 'sci01']).optional(),
    id: z.number().int().gte(0),
    shift: z
      .object({
        dx: z.number().int().optional(),
        dy: z.number().int().optional(),
      })
      .optional(),
    mappings: MappingSchema(),
  });

export const PatchSchema = () =>
  z.object({
    type: z.literal('patch'),
    path: z.string(),
    shift: z
      .object({
        dx: z.number().int().optional(),
        dy: z.number().int().optional(),
      })
      .optional(),
    mappings: MappingSchema(),
  });

export const SourceSchema = () =>
  z.discriminatedUnion('type', [ResourceSchema(), PatchSchema()]);

export const BaselineSchema = () =>
  z.discriminatedUnion('type', [
    z.object({
      type: z.literal('constant'),
      value: z.number().gt(0),
    }),
    z.object({
      type: z.literal('resource'),
      root: z.string(),
      engine: z.enum(['sci0', 'sci01']).optional(),
      id: z.number().int().gte(0),
      char: z.string().length(1).optional(),
    }),
    z.object({
      type: z.literal('patch'),
      path: z.string(),
      char: z.string().length(1).optional(),
    }),
  ]);

export const LineHeightSchema = () =>
  z.discriminatedUnion('type', [
    z.object({
      type: z.literal('constant'),
      value: z.number().gt(0),
    }),
    z.object({
      type: z.literal('resource'),
      root: z.string(),
      engine: z.enum(['sci0', 'sci01']).optional(),
      id: z.number().int().gte(0),
    }),
    z.object({
      type: z.literal('patch'),
      path: z.string(),
      char: z.string().length(1).optional(),
    }),
  ]);

export const CustomMappingSchema = () =>
  z.tuple([
    z.hex(),
    z.hex(),
    z.string(),
    z
      .object({
        force: z.boolean().optional(),
        trim: z
          .object({
            top: z.number().int().positive().optional(),
            right: z.number().int().positive().optional(),
            bottom: z.number().int().positive().optional(),
            left: z.number().int().positive().optional(),
          })
          .optional(),
        pad: z
          .object({
            top: z.number().int().positive().optional(),
            right: z.number().int().positive().optional(),
            bottom: z.number().int().positive().optional(),
            left: z.number().int().positive().optional(),
          })
          .optional(),
        shift: z
          .object({
            dx: z.number().int().optional(),
            dy: z.number().int().optional(),
          })
          .optional(),
        xor: z.array(z.string()).optional(),
      })
      .optional(),
  ]);

export const MappingSchema = () =>
  z
    .array(
      z.union([
        z.literal('ascii'),
        z.literal('ascii-symbols'),
        z.literal('ascii-digits'),
        z.literal('ascii-uppercase'),
        z.literal('ascii-lowercase'),
        CustomMappingSchema(),
      ]),
    )
    .min(1);

export const BatchShema = z.object({
  name: z.string(),
  aspectRatio: z.enum(['1:1', '5:6']).optional(),
  version: z.string().optional(),
  baseline: BaselineSchema().optional(),
  lineHeight: LineHeightSchema().optional(),
  sources: z.array(SourceSchema()),
  chamfer: z
    .enum(['both', 'inside', 'outside', 'none'])
    .optional()
    .default('both'),
  pad: z
    .object({
      top: z.number().int().positive().optional(),
      right: z.number().int().positive().optional(),
      bottom: z.number().int().positive().optional(),
      left: z.number().int().positive().optional(),
    })
    .optional(),
});

export function tryParse(json: unknown) {
  try {
    return BatchShema.parse(json);
  } catch (ex: unknown) {
    if (ex instanceof z.ZodError) {
      console.error(z.prettifyError(ex));
    } else {
      console.error('Something went wrong');
    }
    process.exit(-1);
  }
}

export type SourceSchemaType = z.TypeOf<ReturnType<typeof SourceSchema>>;
export type BaselineSchemaType = z.TypeOf<ReturnType<typeof BaselineSchema>>;
export type LineHeightSchemaType = z.TypeOf<
  ReturnType<typeof LineHeightSchema>
>;
