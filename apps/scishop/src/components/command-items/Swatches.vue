<script setup lang="ts">
import { computed } from 'vue';
import {
  DrawCodes,
  DrawMode,
  isControlMode,
  isPriorityMode,
  isVisualMode,
} from '@4bitlabs/sci0';
import { Palettes } from '@4bitlabs/color';
import { fromUint32, toHex } from '@4bitlabs/color-space/srgb';

const { drawCode, drawMode, pals } = defineProps<{
  drawMode: DrawMode;
  drawCode: DrawCodes;
  pals: [number[], number[], number[], number[]];
}>();

const getVisualPair = computed(() => {
  const pal = (drawCode[0] / 40) >>> 0;
  const idx = drawCode[0] % 40;
  const pair = pals[pal][idx];

  const [aClr, bClr] = [
    Palettes.TRUE_CGA_PALETTE[pair >>> 4],
    Palettes.TRUE_CGA_PALETTE[pair & 0b1111],
  ];

  return {
    '--dither-left': toHex(fromUint32(aClr)),
    '--dither-right': toHex(fromUint32(bClr)),
  };
});

const getPriorityColor = computed(() => ({
  background: toHex(fromUint32(Palettes.CGA_PALETTE[drawCode[1]])),
  color: drawCode[1] > 8 ? '#000' : '#fff',
}));

const getControlColor = computed(() => ({
  background: toHex(fromUint32(Palettes.CGA_PALETTE[drawCode[1]])),
  color: drawCode[1] > 8 ? '#000' : '#fff',
}));
</script>

<template>
  <div
    :class="[$style.swatch, isVisualMode(drawMode) && $style.pair]"
    :style="[getVisualPair]"
  ></div>
  <div
    :class="[$style.swatch, isPriorityMode(drawMode) && $style.single]"
    :style="[isPriorityMode(drawMode) && getPriorityColor]"
  >
    <template v-if="isPriorityMode(drawMode)">{{
      drawCode[1].toString(16)
    }}</template>
  </div>
  <div
    :class="[$style.swatch, isControlMode(drawMode) && $style.single]"
    :style="[isControlMode(drawMode) && getControlColor]"
  >
    <template v-if="isControlMode(drawMode)">{{
      drawCode[2].toString(16)
    }}</template>
  </div>
</template>

<style module>
.swatch {
  text-align: center;
  font-weight: bold;
  border: 1px dotted var(--clr-ink-A10);
  background-clip: padding-box;
  background-image: repeating-linear-gradient(
    -45deg,
    var(--clr-ink-A10) 0em,
    var(--clr-ink-A10) 0.5em,
    transparent 0.5em,
    transparent 1em
  );
}

.pair {
  --dither-left: white;
  --dither-right: black;

  border: 1px solid var(--clr-ink);
  background: linear-gradient(
    90deg,
    var(--dither-left) 50%,
    var(--dither-right) 50%
  );
}
</style>
