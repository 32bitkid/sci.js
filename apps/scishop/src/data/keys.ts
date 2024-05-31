import { InjectionKey, Ref, ShallowRef } from 'vue';

import type { EditorCommand } from '../models/EditorCommand.ts';
import type { DrawStateStore } from './stores/draw-state-store.ts';
import type { Tool } from '../models/tool.ts';
import { LayerPointerStore } from './stores/layer-pointer-store.ts';
import { ViewStore } from './stores/view-store.ts';
import { PaletteStore } from './stores/palette-store.ts';
import { StageOptionStore } from './stores/stage-option-store.ts';

const keyOf = <T>(name: string = '') => Symbol(name) as InjectionKey<T>;

export const layersKey = keyOf<ShallowRef<EditorCommand[]>>('layers');
export const pointersKey = keyOf<LayerPointerStore>('pointers');
export const stageOptionsKey = keyOf<StageOptionStore>('stageOptions');
export const currentKey = keyOf<ShallowRef<EditorCommand | null>>('current');
export const viewKey = keyOf<ViewStore>('viewKey');
export const toolKey = keyOf<Ref<Tool>>('currentTool');
export const drawStateKey = keyOf<DrawStateStore>('drawState');
export const paletteKey = keyOf<PaletteStore>('palette');
