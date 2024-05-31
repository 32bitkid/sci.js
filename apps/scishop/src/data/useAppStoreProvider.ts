import { computed, provide, ref, shallowRef, unref } from 'vue';
import { decomposeTSR, identity, scale } from 'transformation-matrix';

import { vec2 } from '@4bitlabs/vec2';
import * as Keys from './keys.ts';
import data from './initial-pic-data.ts';
import { Tool } from '../models/tool.ts';
import { useDrawStateProvider } from './useDrawStateProvider.ts';
import { usePaletteProvider } from './usePaletteProvider.ts';
import { EditorCommand } from '../models/EditorCommand.ts';

export function useAppStoreProvider() {
  // Layers
  const layersRef = shallowRef(data);
  const topIdxRef = ref(data.length);
  const selectedIdxRef = ref(data.length);

  provide(Keys.layersKey, layersRef);
  provide(Keys.pointersKey, {
    topIdx: topIdxRef,
    selectedIdx: selectedIdxRef,
  });

  // Current
  const currentRef = shallowRef<EditorCommand | null>(null);
  provide(Keys.currentKey, currentRef);

  // Stage
  const stageSize = ref(vec2(320, 190));
  const aspectRatio = ref(vec2(5, 6));
  const aspectRatioScaleComponent = computed(() => {
    const [width, height] = unref(aspectRatio);
    return scale(1, 1 / (width / height));
  });

  provide(Keys.stageOptionsKey, {
    canvasSize: stageSize,
    aspectRatio,
    aspectRatioScaleComponent,
  });

  // Toolbar
  const toolRef = ref<Tool>('pan');

  provide(Keys.toolKey, toolRef);

  // View
  const viewMatrixRef = shallowRef(identity());
  const viewTransformsRef = computed(() => decomposeTSR(unref(viewMatrixRef)));
  const viewZoom = computed(() => {
    const { sx, sy } = unref(viewTransformsRef).scale;
    return (sx + sy) / 2;
  });
  const viewRotation = computed(() => unref(viewTransformsRef).rotation.angle);
  provide(Keys.viewKey, { matrix: viewMatrixRef, viewZoom, viewRotation });

  // DrawState
  useDrawStateProvider();
  // Palette
  usePaletteProvider({ layersRef, topIdxRef });
}
