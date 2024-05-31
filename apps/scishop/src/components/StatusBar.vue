<script setup lang="ts">
import { rotateRef, zoomRef } from '../data/viewStore';
</script>
<template>
  <div class="statusbar">
    <div class="zoom">{{ zoomRef.toFixed(1) }}&times;</div>
    <div class="rotate">
      {{ (rotateRef * (180 / Math.PI)).toFixed(0) }}&deg;
    </div>
  </div>
</template>
<style scoped>
.statusbar {
  grid-area: status;
  padding-inline: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5ch;
  background-color: var(--clr-surface--default);
  color: var(--clr-ink);
}

.zoom,
.rotate {
  padding: 0.25ch 1ch;
  border: 1px solid var(--clr-ink-A20);
  font-size: 0.75rem;
  min-width: 4ch;
  text-align: center;
}
</style>
