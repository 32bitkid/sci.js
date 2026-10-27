import type { InjectionKey, Ref, ShallowRef } from 'vue';

import type { EditorCommand } from '../models/EditorCommand.js';
import type { DrawStateStore } from './stores/draw-state-store.js';
import type { Tool } from '../models/tool.js';
import type { LayerPointerStore } from './stores/layer-pointer-store.js';
import type { ViewStore } from './stores/view-store.js';
import type { PaletteStore } from './stores/palette-store.js';
import type { StageOptionStore } from './stores/stage-option-store.js';

const keyOf = <T>(name: string = '') => Symbol(name) as InjectionKey<T>;

export const layersKey = keyOf<ShallowRef<EditorCommand[]>>('layers');
export const pointersKey = keyOf<LayerPointerStore>('pointers');
export const stageOptionsKey = keyOf<StageOptionStore>('stageOptions');
export const currentKey = keyOf<ShallowRef<EditorCommand | null>>('current');
export const viewKey = keyOf<ViewStore>('viewKey');
export const toolKey = keyOf<Ref<Tool>>('currentTool');
export const drawStateKey = keyOf<DrawStateStore>('drawState');
export const paletteKey = keyOf<PaletteStore>('palette');
