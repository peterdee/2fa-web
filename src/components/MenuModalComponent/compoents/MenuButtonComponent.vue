<script setup lang="ts">
interface MenuButtonProps {
  isClosing: boolean;
  isHighlighted?: boolean;
  withDanger?: boolean;
}

defineProps<MenuButtonProps>();
const emit = defineEmits(['click']);
</script>

<template>
  <button
    @click="emit('click')"
    :class="[
      'menu-button',
      isHighlighted ? 'highlight-button' : '',
      isHighlighted && withDanger ? 'highlight-danger-button' : '',
      withDanger ? 'danger-button' : '',
      isClosing ? 'hide' : '',
    ]"
    type="button"
  >
    <slot></slot>
  </button>
</template>

<style scoped src="../styles.css" />
