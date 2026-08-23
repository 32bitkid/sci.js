import * as z from 'zod';

export const MappingSchema_v0 = () =>
  z
    .array(
      z.union([
        z.literal('ascii'),
        z.literal('ascii-symbols'),
        z.literal('ascii-digits'),
        z.literal('ascii-uppercase'),
        z.literal('ascii-lowercase'),
        z.tuple([
          z.hex(),
          z.hex(),
          z.string(),
          z
            .object({
              force: z.boolean().optional(),
              trim: z
                .object({
                  top: z.int().positive().optional(),
                  right: z.int().positive().optional(),
                  bottom: z.int().positive().optional(),
                  left: z.int().positive().optional(),
                })
                .optional(),
              pad: z
                .object({
                  top: z.int().positive().optional(),
                  right: z.int().positive().optional(),
                  bottom: z.int().positive().optional(),
                  left: z.int().positive().optional(),
                })
                .optional(),
              shift: z
                .object({
                  dx: z.int().optional(),
                  dy: z.int().optional(),
                })
                .optional(),
              xor: z.array(z.string()).optional(),
              rlig: z.array(z.string()).min(2).optional(),
              liga: z.array(z.string()).min(2).optional(),
              dlig: z.array(z.string()).min(2).optional(),
            })
            .optional(),
        ]),
      ]),
    )
    .min(1);

export const MappingSchema_v1 = () =>
  z
    .array(
      z.union([
        z.literal('ascii'),
        z.literal('ascii-symbols'),
        z.literal('ascii-digits'),
        z.literal('ascii-uppercase'),
        z.literal('ascii-lowercase'),
        z.tuple([
          z.hex(),
          z.hex(),
          z
            .strictObject({
              name: z.string().optional(),
              overwrite: z.boolean().optional(),
              advanceWidth: z.int().positive().optional(),
              actions: z
                .array(
                  z.union([
                    z.strictObject({
                      trim: z.strictObject({
                        top: z.int().positive().optional(),
                        right: z.int().positive().optional(),
                        bottom: z.int().positive().optional(),
                        left: z.int().positive().optional(),
                      }),
                    }),
                    z.strictObject({
                      pad: z.strictObject({
                        top: z.int().positive().optional(),
                        right: z.int().positive().optional(),
                        bottom: z.int().positive().optional(),
                        left: z.int().positive().optional(),
                      }),
                    }),
                    z.strictObject({
                      shift: z.strictObject({
                        dx: z.int().optional(),
                        dy: z.int().optional(),
                      }),
                    }),
                    z.strictObject({ xor: z.array(z.string()).min(1) }),
                    z.strictObject({ rlig: z.array(z.string()).min(2) }),
                    z.strictObject({ liga: z.array(z.string()).min(2) }),
                    z.strictObject({ dlig: z.array(z.string()).min(2) }),
                    z.strictObject({
                      alt: z.tuple([z.string().length(4), z.hex()]),
                    }),
                    z.strictObject({
                      comp: z.tuple([
                        z.hex(),
                        z.tuple([z.int(), z.int()]).optional(),
                      ]),
                    }),
                    z.strictObject({
                      base: z.int(),
                    }),
                  ]),
                )
                .optional(),
            })
            .optional(),
        ]),
      ]),
    )
    .min(1);

export const ResourceSchema = <T extends z.ZodType>(mappingSchema: () => T) =>
  z.object({
    type: z.literal('resource'),
    root: z.string(),
    engine: z.enum(['sci0', 'sci01']).optional(),
    id: z.int().gte(0),
    shift: z
      .object({
        dx: z.int().optional(),
        dy: z.int().optional(),
      })
      .optional(),
    mappings: mappingSchema(),
  });

export const PatchSchema = <T extends z.ZodType>(mappingSchema: () => T) =>
  z.object({
    type: z.literal('patch'),
    path: z.string(),
    shift: z
      .object({
        dx: z.int().optional(),
        dy: z.int().optional(),
      })
      .optional(),
    mappings: mappingSchema(),
  });

export const SourceSchema = <T extends z.ZodType>(mappingSchema: () => T) =>
  z.discriminatedUnion('type', [
    ResourceSchema(mappingSchema),
    PatchSchema(mappingSchema),
  ]);

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
      id: z.int().gte(0),
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
      id: z.int().gte(0),
    }),
    z.object({
      type: z.literal('patch'),
      path: z.string(),
      char: z.string().length(1).optional(),
    }),
  ]);

export type SourceSchemaType = z.TypeOf<
  ReturnType<typeof SourceSchema<z.ZodUnknown>>
>;
export type BaselineSchemaType = z.TypeOf<ReturnType<typeof BaselineSchema>>;
export type LineHeightSchemaType = z.TypeOf<
  ReturnType<typeof LineHeightSchema>
>;

export const RootSchema = <
  TVersion extends z.ZodType,
  TSource extends z.ZodType,
>(
  versionSchema: TVersion,
  sourceSchema: TSource,
) =>
  z.object({
    $schemaVersion: versionSchema,
    name: z.string(),
    aspectRatio: z.enum(['1:1', '5:6']).optional(),
    version: z.string().optional(),
    baseline: BaselineSchema().optional(),
    lineHeight: LineHeightSchema().optional(),
    sources: z.array(sourceSchema),
    chamfer: z
      .enum(['both', 'inside', 'outside', 'none'])
      .optional()
      .default('both'),
    pad: z
      .object({
        top: z.int().positive().optional(),
        right: z.int().positive().optional(),
        bottom: z.int().positive().optional(),
        left: z.int().positive().optional(),
      })
      .optional(),
  });

const Root_V0 = RootSchema(
  z.undefined().optional(),
  SourceSchema(MappingSchema_v0),
);
const Root_V1 = RootSchema(z.literal('v1'), SourceSchema(MappingSchema_v1));

const BatchShema = z.discriminatedUnion('$schemaVersion', [Root_V0, Root_V1]);

export type RootSchemaType_v0 = z.TypeOf<typeof Root_V0>;
export type RootSchemaType_v1 = z.TypeOf<typeof Root_V1>;

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
