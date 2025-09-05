import type { IndexedPixelData } from '@4bitlabs/image';

export interface Cel extends IndexedPixelData {
  dx: number;
  dy: number;
}
