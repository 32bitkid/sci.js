import type { Ref } from 'vue';

export interface LayerPointerStore {
  topIdx: Ref<number>;
  selectedIdx: Ref<number | null>;
}
