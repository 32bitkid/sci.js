import { ref, unref } from 'vue';

export type Tool =
  | 'select'
  | 'pan'
  | 'line'
  | 'bezier'
  | 'rect'
  | 'oval'
  | 'brush'
  | 'fill';

const selectedToolRef = ref<Tool>('pan');

export default {
  get selectedTool() {
    return unref(selectedToolRef);
  },
  set selectedTool(next: Tool) {
    selectedToolRef.value = next;
  },
};
