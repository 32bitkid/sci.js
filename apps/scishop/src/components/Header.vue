<script setup lang="ts"></script>

<template>
  <div :class="$style.header"></div>
</template>

<style module>
.header {
  background-color: var(--clr-surface--default);
  color: var(--clr-ink);
  grid-area: header;
  border-bottom: 1px solid black;
}
</style>
