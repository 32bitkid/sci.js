<script setup lang="ts">
import { mustInject } from '../data/mustInject.ts';
import { toolKey } from '../data/keys.ts';

const toolRef = mustInject(toolKey);
</script>

<template>
  <ul :class="$style.toolbar">
    <li :class="[$style.tool, toolRef === 'select' && $style.selected]">
      <button type="button" :class="$style.button" @click="toolRef = 'select'">
        select
      </button>
    </li>
    <li :class="[$style.tool, toolRef === 'line' && $style.selected]">
      <button type="button" :class="$style.button" @click="toolRef = 'line'">
        line
      </button>
    </li>
    <li :class="[$style.tool, toolRef === 'bezier' && $style.selected]">
      <button
        type="button"
        :class="$style.button"
        @click="toolRef = 'bezier'"
        disabled
      >
        bezier
      </button>
    </li>
    <li :class="[$style.tool, toolRef === 'rect' && $style.selected]">
      <button
        type="button"
        :class="$style.button"
        @click="toolRef = 'rect'"
        disabled
      >
        rect
      </button>
    </li>
    <li :class="[$style.tool, toolRef === 'oval' && $style.selected]">
      <button
        type="button"
        :class="$style.button"
        @click="toolRef = 'oval'"
        disabled
      >
        oval
      </button>
    </li>
    <li :class="[$style.tool, toolRef === 'brush' && $style.selected]">
      <button
        type="button"
        :class="$style.button"
        @click="toolRef = 'brush'"
        disabled
      >
        brush
      </button>
    </li>
    <li :class="[$style.tool, toolRef === 'fill' && $style.selected]">
      <button type="button" :class="$style.button" @click="toolRef = 'fill'">
        fill
      </button>
    </li>
    <li :class="[$style.tool, toolRef === 'pan' && $style.selected]">
      <button type="button" :class="$style.button" @click="toolRef = 'pan'">
        pan
      </button>
    </li>
  </ul>
</template>

<style module>
.toolbar {
  grid-area: toolbar;
  display: flex;
  flex-direction: column;
  align-self: start;
  box-shadow: var(--shadow);
  border-radius: var(--radius);
}

.tool {
  color: var(--clr-ink-A70);
  background-color: var(--clr-surface--default);
  font-size: 0.7em;
  background-clip: padding-box;
  letter-spacing: -0.03ex;
  transition: box-shadow 500ms;
  z-index: 1;

  &:first-child {
    border-top-left-radius: var(--radius);
    border-top-right-radius: var(--radius);
  }

  &:last-child {
    border-bottom-left-radius: var(--radius);
    border-bottom-right-radius: var(--radius);
  }

  &.selected {
    background-color: var(--clr-primary);
    color: var(--clr-surface--default);
    font-weight: 700;
    box-shadow: 0 0 4rem -0.25rem var(--clr-primary-A90);
    z-index: 2;
  }
}

.button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  user-select: none;

  &:disabled {
    color: var(--clr-ink-A10);
    cursor: not-allowed;
  }
}
</style>
