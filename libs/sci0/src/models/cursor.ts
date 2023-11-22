import type { ImageDataLike } from '@4bitlabs/image';

export interface Cursor extends ImageDataLike {
  readonly width: 16;
  readonly height: 16;
  readonly hotspot: readonly [number, number];
}
