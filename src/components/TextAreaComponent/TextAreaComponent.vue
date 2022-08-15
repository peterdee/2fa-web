<script setup lang="ts">
import type { StyleValue } from 'vue';

interface TextAreaComponentProps {
  customStyles?: StyleValue;
  disabled?: boolean;
  name: string;
  placeholder?: string;
  value: string;
}

defineProps<TextAreaComponentProps>();
const emit = defineEmits(['input']);
</script>

<template>
  <textarea
    @input="emit('input', $event)"
    :disabled="disabled"
    :name="name"
    :placeholder="placeholder ?? ''"
    :style="{
      ...((typeof customStyles === 'object' && customStyles) || {}),
    }"
    :value="value"
  ></textarea>
</template>

<style scoped>
textarea {
  background-color: var(--background);
  border: 1px solid var(--accent);
  color: var(--text);
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: var(--spacer);
  height: calc(var(--spacer) * 5);
  outline: none;
  padding: var(--spacer);
  resize: none;
  transition: border 200ms ease-out;
}
textarea:hover {
  border: 1px solid var(--accent-light);
  transition: border 200ms ease-in;
}
textarea:disabled {
  border: 1px solid var(--muted);
  transition: border 200ms ease-in;
}
textarea:focus {
  border: 1px solid var(--accent-light);
  transition: border 200ms ease-in;
}
textarea::placeholder {
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}
</style>