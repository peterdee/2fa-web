<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<template>
  <footer class="flex align-items-center justify-center noselect">
    <a href="https://github.com/peterdee">Peter Dyumin</a>,
    {{ year }}
  </footer>
</template>

<style scoped>
footer {
  font-size: calc(var(--spacer) - (var(--spacer-half) / 2));
  height: var(--footer-height);
}
</style>
