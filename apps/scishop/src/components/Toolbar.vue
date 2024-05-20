<script setup lang="ts">
import store from '../data/store.ts';
</script>

<template>
  <ul :class="$style.toolbar">
    <li
      :class="[$style.tool, store.selectedTool === 'line' && $style.selected]"
    >
      <button :class="$style.button" @click="store.selectedTool = 'line'">
        line
      </button>
    </li>
    <li
      :class="[$style.tool, store.selectedTool === 'bezier' && $style.selected]"
    >
      <button
        :class="$style.button"
        @click="store.selectedTool = 'bezier'"
        disabled
      >
        bezier
      </button>
    </li>
    <li
      :class="[$style.tool, store.selectedTool === 'rect' && $style.selected]"
    >
      <button
        :class="$style.button"
        @click="store.selectedTool = 'rect'"
        disabled
      >
        rect
      </button>
    </li>
    <li
      :class="[$style.tool, store.selectedTool === 'oval' && $style.selected]"
    >
      <button
        :class="$style.button"
        @click="store.selectedTool = 'oval'"
        disabled
      >
        oval
      </button>
    </li>
    <li
      :class="[$style.tool, store.selectedTool === 'brush' && $style.selected]"
    >
      <button
        :class="$style.button"
        @click="store.selectedTool = 'brush'"
        disabled
      >
        brush
      </button>
    </li>
    <li
      :class="[$style.tool, store.selectedTool === 'fill' && $style.selected]"
    >
      <button :class="$style.button" @click="store.selectedTool = 'fill'">
        fill
      </button>
    </li>
    <li :class="[$style.tool, store.selectedTool === 'pan' && $style.selected]">
      <button :class="$style.button" @click="store.selectedTool = 'pan'">
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
    z-index: 1;
  }
}

.button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  cursor: pointer;
  user-select: none;

  &:disabled {
    color: var(--clr-ink-A10);
    cursor: not-allowed;
  }
}
</style>
