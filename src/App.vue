<script setup lang="ts">
import { RouterView } from 'vue-router';

import FooterComponent from './components/FooterComponent/FooterComponent.vue';
import HeaderComponent from './components/HeaderComponent/HeaderComponent.vue';
import MenuModalComponent from './components/MenuModalComponent/MenuModalComponent.vue';
</script>

<template>
  <HeaderComponent />
  <MenuModalComponent />
  <main>
    <RouterView />
  </main>
  <FooterComponent />
</template>

<style scoped>
main {
  margin-top: var(--header-height);
  min-height: calc(100vh - (var(--footer-height) + var(--header-height)));
}
</style>
