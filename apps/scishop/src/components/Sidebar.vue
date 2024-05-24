<script setup lang="ts">
import LayerNavigator from './LayerNavigator.vue';
import PaletteNavigator from './PaletteNavigator.vue';
</script>

<template>
  <div :class="$style.sidebar">
    <PaletteNavigator :class="$style.panel" />
    <LayerNavigator :class="$style.panel" />
  </div>
</template>

<style module>
.sidebar {
  grid-area: sidebar;
  display: grid;
  grid-template-rows: auto 1fr;
  color: var(--clr-ink);
  background-color: #666;
  gap: 3px;
}

.panel {
  background-color: var(--clr-surface--default);
  border-top-left-radius: 0.5ch;
  border-bottom-left-radius: 0.5ch;
}

.panel:first-child {
  border-top-left-radius: 0;
}
.panel:last-child {
  border-bottom-left-radius: 0;
}
</style>
