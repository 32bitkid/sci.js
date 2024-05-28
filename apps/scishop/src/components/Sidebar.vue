<script setup lang="ts">
import LayerNavigator from './LayerNavigator.vue';
import PalettePicker from './PalettePicker';
</script>

<template>
  <div :class="$style.sidebar">
    <PalettePicker />
    <LayerNavigator />
  </div>
</template>

<style module>
.sidebar {
  grid-area: sidebar;
  display: flex;
  flex-direction: column;
  color: var(--clr-ink);
  background-color: var(--clr-surface-200);
  gap: 0.25lh;
  padding-block: 0.2lh;
  padding-left: 0.2lh;
}
</style>
