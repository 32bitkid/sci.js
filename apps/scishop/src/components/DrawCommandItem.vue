<script setup lang="ts">
import { DrawCommand } from '@4bitlabs/sci0';
defineProps<{ command: DrawCommand }>();
</script>

<template>
  <li>{{ command[0] }}</li>
</template>
