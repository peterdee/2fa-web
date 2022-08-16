<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import loader from '@/assets/loader.svg';

const HEADER_HIDDEN = [
  'recovery',
  'signIn',
  'signUp',
];

const router = useRouter();
const currentRoute = computed(() => router.currentRoute.value.name);
</script>

<template>
  <header v-if="!HEADER_HIDDEN.includes(String(currentRoute))">
    <div class="flex align-items-center justify-space-between content noselect">
      <button
        @click="router.push('/')"
        class="flex align-items-center justify-center logo"
        type="button"
      >
        <img
          :src="loader"
          alt="2FA"
          class="logo-image"
        />
      </button>
      <div class="flex">
        Sign in
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  background-color: var(--accent);
  height: calc(var(--spacer) * 4);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
}
.content {
  height: calc(var(--spacer) * 4);
  margin: 0 auto;
  max-width: calc(var(--spacer) * 40);
  min-width: calc(var(--spacer) * 20);
  padding: 0 calc(var(--spacer) * 2);
  width: 100%;
}
.logo, .logo-image {
  height: calc(var(--spacer) * 3);
  width: calc(var(--spacer) * 3);
}
.logo {
  cursor: pointer;
}
</style>
