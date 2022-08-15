<script setup lang="ts">
import type { StyleValue } from 'vue';

interface WideButtonComponentProps {
  customButtonStyles?: StyleValue;
  disabled?: boolean;
  isSubmit?: boolean;
}

const props = defineProps<WideButtonComponentProps>();
const emit = defineEmits(['click']);

const handleClick = (): null | void => {
  if (props.isSubmit) {
    return null;
  }
  return emit('click');
};
</script>

<template>
  <button
    @click="handleClick"
    :disabled="disabled"
    :style="{
      ...((typeof customButtonStyles === 'object' && customButtonStyles) || {}),
    }"
    :type="isSubmit ? 'submit' : 'button'"
    class="noselect"
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
