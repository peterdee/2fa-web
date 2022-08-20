<script setup lang="ts">
import { RouterView } from 'vue-router';

import ErrorModal from './components/ErrorModalComponent/ErrorModalComponent.vue';
import FooterComponent from './components/FooterComponent/FooterComponent.vue';
import HeaderComponent from './components/HeaderComponent/HeaderComponent.vue';
import MenuModal from './components/MenuModalComponent/MenuModalComponent.vue';
import SuspendedModal from './components/SuspendedModalComponent/SuspendedModalComponent.vue';
</script>

<template>
  <ErrorModal />
  <HeaderComponent />
  <MenuModal />
  <SuspendedModal />
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
