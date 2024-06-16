<script setup lang="ts">
import { mustInject } from '../data/mustInject.ts';
import { viewKey } from '../data/keys.ts';
import { computed, unref } from 'vue';
const { viewZoom: zoomRef, viewRotation: rotateRef } = mustInject(viewKey);

const formattedZoom = computed(() => {
  const zoom = unref(zoomRef);
  return (Math.floor(zoom * 100) / 100).toFixed(1);
});
</script>
<template>
  <div class="statusbar">
    <div class="zoom">{{ formattedZoom }}&times;</div>
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
