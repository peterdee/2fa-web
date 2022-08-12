<script setup lang="ts">
import type { StyleValue } from 'vue';

interface InputComponentProps {
  customStyles?: StyleValue;
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
}
</style>