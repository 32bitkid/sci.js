<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  selected: boolean;
  color: string | [string, string];
}>();
const emit = defineEmits<{
  (e: 'update:select'): void;
  (e: 'update:enabled', value: boolean): void;
}>();
const enabled = defineModel<boolean>('enabled');

const ditherStyles = computed(() => {
  if (!enabled.value) return {};

  if (Array.isArray(props.color)) {
    const [left, right] = props.color;
    return { '--dither-left': left, '--dither-right': right };
  }

  return { background: props.color };
});
</script>
<template>
  <input type="checkbox" v-model="enabled" />
  <button
    :title="props.title"
    @click="emit('update:select')"
    :class="[
      $style.swatch,
      selected && $style.selected,
      enabled && color.length === 2 && $style.dithered,
    ]"
    :style="ditherStyles"
  >
    Visual
  </button>
</template>

<style module>
.swatch {
  flex-grow: 1;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 0.125ch;
  user-select: none;
  background-image: var(--transparent-img);
  border-radius: 15%;
  border: 1px solid var(--clr-surface-200);
  outline: 2px solid var(--clr-surface-200);
  aspect-ratio: 1 / 1.1;
  margin: 1px;
  font-size: 0;
}

.dithered {
  background-repeat: repeat;
  background-size: 2px 2px;
  background-position: top left;
  background-image: conic-gradient(
    var(--dither-left, black) 0turn 0.25turn,
    var(--dither-right, white) 0.25turn 0.5turn,
    var(--dither-left, black) 0.5turn 0.75turn,
    var(--dither-right, white) 0.75turn 1turn
  );
}

.selected {
  border-color: var(--clr-primary-900);
  outline-color: var(--clr-primary);
}
</style>
