import type { IndexedPixelData } from '@4bitlabs/image';

export interface RenderResult {
  visible: IndexedPixelData;
  priority: IndexedPixelData;
  control: IndexedPixelData;
  alpha: IndexedPixelData;
}
