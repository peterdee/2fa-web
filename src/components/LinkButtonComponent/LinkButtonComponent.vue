<script setup lang="ts">
import type { StyleValue } from 'vue';

interface LinkButtonComponentProps {
  customButtonStyles?: StyleValue;
  disabled?: boolean;
  onClick: () => void;
}

defineProps<LinkButtonComponentProps>();
</script>

<template>
  <div class="flex justify-center">
    <button
      @click="onClick"
      :disabled="disabled"
      :style="{
        ...((typeof customButtonStyles === 'object' && customButtonStyles) || {}),
      }"
      type="button"
    >
      <slot></slot>
    </button>
  </div>
</template>

<style scoped>
button {
  color: var(--accent);
  font-size: var(--spacer);
  transition: background-color 200ms ease-out;
}
button:hover {
  color: var(--accent-light);
  cursor: pointer;
  transition: color 200ms ease-in;
}
button:disabled {
  color: var(--muted);
  cursor: not-allowed;
  transition: color 200ms ease-in;
}
</style>
