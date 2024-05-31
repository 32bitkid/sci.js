import { Ref, WritableComputedRef } from 'vue';

import { DrawCodes, DrawMode } from '@4bitlabs/sci0';

export interface DrawStateStore {
  readonly raw: Ref<[DrawMode, ...DrawCodes]>;
  readonly visualEnabled: WritableComputedRef<boolean>;
  readonly priorityEnabled: WritableComputedRef<boolean>;
  readonly controlEnabled: WritableComputedRef<boolean>;
  readonly visualCode: WritableComputedRef<number>;
  readonly priorityCode: WritableComputedRef<number>;
  readonly controlCode: WritableComputedRef<number>;
}
