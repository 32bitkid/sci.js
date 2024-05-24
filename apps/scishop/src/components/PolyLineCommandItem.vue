<script setup lang="ts">
import {
  PolylineCommand,
  isVisualMode,
  isPriorityMode,
  isControlMode,
  BrushCommand,
  FillCommand,
} from '@4bitlabs/sci0';
import { computed } from 'vue';
import { Palettes } from '@4bitlabs/color';
import { fromUint32, toHex } from '@4bitlabs/color-space/srgb';

const { command, pals } = defineProps<{
  command: PolylineCommand | BrushCommand | FillCommand;
  pals: [number[], number[], number[], number[]];
}>();

const [name, drawMode, code] = command;

const getVisualPair = computed(() => {
  const pal = (code[0] / 40) >>> 0;
  const idx = code[0] % 40;
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
  background: toHex(fromUint32(Palettes.CGA_PALETTE[code[1]])),
  color: code[1] > 8 ? '#000' : '#fff',
}));

const getControlColor = computed(() => ({
  background: toHex(fromUint32(Palettes.CGA_PALETTE[code[1]])),
  color: code[1] > 8 ? '#000' : '#fff',
}));
</script>

<template>
  <li>
    <div>{{ name }}</div>
    <div
      :class="[$style.swatch, isVisualMode(drawMode) && $style.pair]"
      :style="[getVisualPair]"
    ></div>
    <div
      :class="[$style.swatch, isPriorityMode(drawMode) && $style.single]"
      :style="[isPriorityMode(drawMode) && getPriorityColor]"
    >
      <template v-if="isPriorityMode(drawMode)">{{
        code[1].toString(16)
      }}</template>
    </div>
    <div
      :class="[$style.swatch, isControlMode(drawMode) && $style.single]"
      :style="[isControlMode(drawMode) && getControlColor]"
    >
      <template v-if="isControlMode(drawMode)">{{
        code[2].toString(16)
      }}</template>
    </div>
  </li>
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
  border: 1px solid var(--clr-ink);
  background: linear-gradient(
    90deg,
    var(--dither-left, white) 50%,
    var(--dither-right, black) 50%
  );
}
</style>
