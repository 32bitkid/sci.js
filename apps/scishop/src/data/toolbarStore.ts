import { ref } from 'vue';

export type Tool =
  | 'select'
  | 'pan'
  | 'line'
  | 'bezier'
  | 'rect'
  | 'oval'
  | 'brush'
  | 'fill';

export const toolRef = ref<Tool>('pan');
