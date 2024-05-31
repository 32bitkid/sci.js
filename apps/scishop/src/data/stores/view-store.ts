import type { ComputedRef, ShallowRef } from 'vue';
import type { Matrix } from 'transformation-matrix';

export interface ViewStore {
  readonly matrix: ShallowRef<Matrix>;
  readonly viewZoom: ComputedRef<number>;
  readonly viewRotation: ComputedRef<number>;
}