<script setup lang="ts">
import type { StyleValue } from 'vue';

interface InputComponentProps {
  customStyles?: StyleValue;
  disabled?: boolean;
  handleInput: (event: Event) => void;
  name: string;
  placeholder?: string;
  type: string;
  value: string;
}

defineProps<InputComponentProps>();
</script>

<template>
  <input
    @input="handleInput"
    :disabled="disabled"
    :name="name"
    :placeholder="placeholder ?? ''"
    :style="{
      ...((typeof customStyles === 'object' && customStyles) || {}),
    }"
    :type="type"
    :value="value"
  />
</template>

<style scoped>
input {
  background-color: var(--background);
  border: 1px solid var(--accent);
  color: var(--text);
  font-size: var(--spacer);
  outline: none;
  padding: var(--spacer);
  transition: border 200ms ease-out;
}
input:hover {
  border: 1px solid var(--accent-light);
  transition: border 200ms ease-in;
}
input:disabled {
  border: 1px solid var(--muted);
  transition: border 200ms ease-in;
}
</style>