<script setup lang="ts">
import loaderBlue from '@/assets/loader-blue.svg';
</script>

<template>
  <div class="flex justify-center mt-3 noselect">
    <div class="spinner">
      <img
        :src="loaderBlue"
        alt="Loading..."
        class="spinner-image"
      />
    </div>
  </div>
</template>

<style scoped>
@keyframes rotate {
  to {
    transform: rotate(360deg);
  }           
}
.spinner {
  animation: rotate 1.5s linear infinite;
  height: calc(var(--spacer) * 3);
  user-select: none;
  width: calc(var(--spacer) * 3);
}
.spinner-image {
  height: calc(var(--spacer) * 3);
  user-select: none;
  width: calc(var(--spacer) * 3);
}
</style>
