<script setup lang="ts">
import loader from '@/assets/loader.svg';

const emit = defineEmits(['click']);
</script>

<template>
  <button
    @click="emit('click')"
    class="flex align-items-center justify-center logo"
    type="button"
  >
    <img
      :src="loader"
      alt="2FA"
      class="logo-image"
    />
  </button>
</template>

<style scoped>
.logo, .logo-image {
  height: calc(var(--spacer) * 2 + var(--spacer-half));
  width: calc(var(--spacer) * 2 + var(--spacer-half));
}
.logo {
  cursor: pointer;
}
</style>
