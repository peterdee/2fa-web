<script setup lang="ts">
import type { StyleValue } from 'vue';

import loader from '@/assets/loader.svg';

interface WideButtonComponentProps {
  customButtonStyles?: StyleValue;
  disabled?: boolean;
  isSubmit?: boolean;
  loading?: boolean;
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
    class="flex align-items-center justify-center noselect"
  >
    <div
      v-if="loading"
      class="spinner"
    >
      <img
        :src="loader"
        alt="Loading..."
        class="spinner-image"
      />
    </div>
    <div v-if="!loading">
      <slot></slot>
    </div>
  </button>
</template>

<style scoped>
button {
  background-color: var(--accent);
  border-radius: calc(var(--spacer-half) / 2);
  color: var(--text-inverted);
  font-size: calc(var(--spacer) - var(--spacer) / 4);
  height: calc((var(--spacer) * 3) + var(--spacer-half));
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

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }           
}
.spinner {
  animation: rotate 1.5s linear infinite;
  height: calc(var(--spacer) * 2);
  user-select: none;
  width: calc(var(--spacer) * 2);
}
.spinner-image {
  height: calc(var(--spacer) * 2);
  user-select: none;
  width: calc(var(--spacer) * 2);
}
</style>
