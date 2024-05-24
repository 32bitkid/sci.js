<script setup lang="ts">
import { decomposeTSR } from 'transformation-matrix';

import { computed, unref } from 'vue';
import store from '../data/store';

const transformRef = computed(() => decomposeTSR(unref(store.viewMatrix)));

const zoom = computed(() => {
  const { sx, sy } = unref(transformRef).scale;
  return sx * sy;
});

const rotate = computed(() => unref(transformRef).rotation.angle);
</script>
<template>
  <div class="foo">
    <div class="zoom">{{ zoom.toFixed(1) }}x</div>
    <div class="rotate">{{ (rotate * (180 / Math.PI)).toFixed(0) }}&deg;</div>
  </div>
</template>
<style scoped>
.foo {
  grid-area: status;
  padding-inline: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5ch;
}

.zoom,
.rotate {
  padding: 0.25ch 1ch;
  border: 1px solid var(--clr-ink-A20);
  font-size: 0.75rem;
  min-width: 5ch;
  text-align: center;
}
</style>
