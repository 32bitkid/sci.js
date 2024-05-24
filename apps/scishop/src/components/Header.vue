<script setup lang="ts"></script>

<template>
  <div :class="$style.header"></div>
</template>

<style module>
.header {
  background-color: var(--clr-surface--glass);
  border-bottom: 3px solid var(--clr-surface--glass);
  color: var(--clr-ink);
  grid-area: header;
}
</style>
