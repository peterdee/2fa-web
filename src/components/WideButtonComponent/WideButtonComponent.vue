<script setup lang="ts">
import type { StyleValue } from 'vue';

interface WideButtonComponentProps {
  customButtonStyles?: StyleValue;
  disabled?: boolean;
  isSubmit?: boolean;
  onClick?: () => void;
}

defineProps<WideButtonComponentProps>();
</script>

<template>
  <button
    @click="!isSubmit ? onClick : (() => null)"
    :disabled="disabled"
    :style="{
      ...((typeof customButtonStyles === 'object' && customButtonStyles) || {}),
    }"
    :type="isSubmit ? 'submit' : 'button'"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
button {
  background-color: var(--accent);
  border-radius: calc(var(--spacer-half) / 2);
  color: var(--text-inverted);
  font-size: calc(var(--spacer) - var(--spacer) / 4);
  padding: var(--spacer);
  transition: background-color 200ms ease-out;
  width: 100%;
}
button:hover {
  background-color: var(--accent-light);
  cursor: pointer;
  transition: background-color 200ms ease-in;
}
button:disabled {
  background-color: var(--muted);
  cursor: not-allowed;
  transition: background-color 200ms ease-in;
}
</style>
