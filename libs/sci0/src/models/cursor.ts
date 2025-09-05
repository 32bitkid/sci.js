import type { IndexedPixelData } from '@4bitlabs/image';

export interface Cursor extends IndexedPixelData {
  readonly hotspot: readonly [number, number];
}
