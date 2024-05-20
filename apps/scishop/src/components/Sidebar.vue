<script setup lang="ts">
import LayerNavigator from './LayerNavigator.vue';
</script>

<template>
  <div :class="$style.panel">
    <LayerNavigator />
  </div>
</template>

<style module>
.panel {
  font-size: 0.9rem;
  background-color: var(--clr-surface--default);
  color: var(--clr-ink);
  grid-area: sidebar;
  border-radius: var(--radius);
  align-self: start;
  padding: 0;
  box-shadow: var(--shadow);

  display: flex;
  flex-direction: column;

  max-height: 100%;
  box-sizing: border-box;
  overflow: clip;
}
</style>
