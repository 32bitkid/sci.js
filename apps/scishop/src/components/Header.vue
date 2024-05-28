<script setup lang="ts"></script>

<template>
  <div :class="$style.header">
    <hr :class="$style.spacer" />
    <div :class="$style.pal">
      Pal
      <button type="button">1</button>
      <button type="button">2</button>
      <button type="button">3</button>
      <button type="button">4</button>
    </div>
  </div>

  <Teleport to="body"> </Teleport>
</template>

<style module>
.header {
  background-color: var(--clr-surface--default);
  color: var(--clr-ink);
  grid-area: header;
  display: flex;
  border-bottom: 1px solid var(--clr-surface-200);
  align-items: center;
  gap: 1ch;
  padding-inline: 1ch;
}

.spacer {
  flex-grow: 1;
  width: auto;
  border: 0;
}

.pal {
  align-self: center;
  height: 75%;
}

.pal button {
  aspect-ratio: 9 / 11;
  height: 90%;
  text-align: center;

  border-top: 1px solid var(--clr-surface-200);
  border-bottom: 1px solid var(--clr-surface-200);
  border-right: 1px solid var(--clr-surface-200);
  &:first-of-type {
    border-left: 1px solid var(--clr-surface-200);
    border-top-left-radius: 0.25lh;
    border-bottom-left-radius: 0.25lh;
  }

  &:last-of-type {
    border-top-right-radius: 0.25lh;
    border-bottom-right-radius: 0.25lh;
  }
}
</style>
