import type { ComputedRef, Ref } from 'vue';
import type { Matrix } from 'transformation-matrix';

import type { Vec2 } from '@4bitlabs/vec2';

export interface StageOptionStore {
  canvasSize: Ref<Vec2>;
  aspectRatio: Ref<Vec2>;
  aspectRatioScaleComponent: ComputedRef<Matrix>;
}
