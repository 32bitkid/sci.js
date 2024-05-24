<script setup lang="ts">
import LayerNavigator from './LayerNavigator.vue';
// import PalettePicker from './PalettePicker.vue';
</script>

<template>
  <div :class="$style.sidebar">
    <!--    <PalettePicker :class="$style.panel" />-->
    <LayerNavigator :class="$style.panel" />
  </div>
</template>

<style module>
.sidebar {
  grid-area: sidebar;
  display: flex;
  flex-direction: column;
  color: var(--clr-ink);
  background-color: var(--clr-surface--default);
  gap: 3px;
  border-left: 3px solid var(--clr-surface--default);
}

.panel {
}
</style>
