import { computed, provide, Ref, ref, unref } from 'vue';

import { DrawCodes, DrawMode } from '@4bitlabs/sci0';
import * as Keys from './keys.ts';

const changeDrawMode = (mode: DrawMode, flag: DrawMode, enabled: boolean) =>
  enabled ? mode | flag : mode & ~flag;

const ModePosition: Record<
  DrawMode.Visual | DrawMode.Priority | DrawMode.Control,
  1 | 2 | 3
> = {
  [DrawMode.Visual]: 1,
  [DrawMode.Priority]: 2,
  [DrawMode.Control]: 3,
};

const codeComputed = (
  source: Ref<[DrawMode, ...DrawCodes]>,
  mode: DrawMode.Visual | DrawMode.Priority | DrawMode.Control,
) =>
  computed<number>({
    get: () => unref(source)[ModePosition[mode]],
    set(next) {
      source.value[0] |= DrawMode.Visual;
      source.value[ModePosition[mode]] = next;
    },
  });

const enabledComputed = (
  source: Ref<[DrawMode, ...DrawCodes]>,
  mode: DrawMode.Visual | DrawMode.Priority | DrawMode.Control,
) =>
  computed<boolean>({
    get: () => (unref(source)[0] & mode) !== 0,
    set(next) {
      const prev = unref(source)[0];
      source.value[0] = changeDrawMode(prev, mode, next);
    },
  });

export function useDrawStateProvider() {
  const drawState = ref<[DrawMode, ...DrawCodes]>([
    DrawMode.Visual | DrawMode.Priority,
    0,
    0,
    0,
  ]);

  provide(Keys.drawStateKey, {
    raw: drawState,
    visualEnabled: enabledComputed(drawState, DrawMode.Visual),
    priorityEnabled: enabledComputed(drawState, DrawMode.Priority),
    controlEnabled: enabledComputed(drawState, DrawMode.Control),
    visualCode: codeComputed(drawState, DrawMode.Visual),
    priorityCode: codeComputed(drawState, DrawMode.Priority),
    controlCode: codeComputed(drawState, DrawMode.Control),
  });
}
