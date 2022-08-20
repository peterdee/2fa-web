<script setup lang="ts">
import close from '@/assets/close.svg';
import menu from '@/assets/menu.svg';

interface ComponentProps {
  menuShown: boolean;
}

defineProps<ComponentProps>();
const emit = defineEmits(['click']);
</script>

<template>
  <button
    @click="emit('click')"
    class="flex align-items-center justify-center menu"
    type="button"
  >
    <img
      :src="menuShown ? close : menu"
      alt="Menu"
      class="menu-image"
    />
  </button>
</template>

<style scoped>
.menu, .menu-image {
  height: calc(var(--spacer) * 2);
  width: calc(var(--spacer) * 2);
}
.menu {
  cursor: pointer;
}
</style>
