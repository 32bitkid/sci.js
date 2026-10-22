import z from 'zod';

export const ZodCel = z.object({
  dx: z.int().min(-128).max(127),
  dy: z.int().min(-128).max(127),
  keyColor: z.int().min(0).max(255).optional(),
  pixels: z.codec(
    z.base64(),
    z.instanceof(Uint8ClampedArray<ArrayBufferLike>),
    {
      decode: (str) => Uint8ClampedArray.from(z.util.base64ToUint8Array(str)),
      encode: (bytes) => z.util.uint8ArrayToBase64(Uint8Array.from(bytes)),
    },
  ),
  width: z.int().positive(),
  height: z.int().positive(),
});

export const CelSchema = z.compile(ZodCel);
export type CelSchemaType = z.infer<typeof CelSchema>;
