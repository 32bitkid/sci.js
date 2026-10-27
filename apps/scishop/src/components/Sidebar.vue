<script setup lang="ts">
import LayerNavigator from './LayerNavigator.vue';
import PalettePicker from './PalettePicker';
</script>

<template>
  <div :class="$style.sidebar">
    <PalettePicker :class="$style.panel" />
    <LayerNavigator :class="$style.panel" />
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
  padding-left: 0.25lh;
}

.panel {
  border-top-left-radius: 0.25lh;
  border-bottom-left-radius: 0.25lh;
  box-shadow: 0 0.125lh 0.125lh rgba(0 0 0 /15%);
}
</style>
