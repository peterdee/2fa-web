<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { useStore } from '@/stores/auth.store';
import type { Navigation } from '@/types/navigation';

const router = useRouter();
const store = useStore();

onMounted((): Promise<Navigation> | void => {
  const { login, token, userId } = store;
  if (!!login && !!token && !!userId) {
    return router.replace('/home');
  }
});

const handleTransition = (destination: string): Promise<Navigation> => router.push(destination);
</script>

<template>
  <div class="wrap width noselect">
    <div class="auth-title mb-1">
      2FA PROJECT
    </div>
    <div class="sub-title text-center">
      2FA project allows users to generate OTPs for the 2FA-enabled services
    </div>
    <div class="flex justify-space-around mt-2">
      <button
        @click="handleTransition('sign-in')"
        class="auth-button"
        type="button"
      >
        SIGN IN
      </button>
      <button
        @click="handleTransition('sign-up')"
        class="auth-button"
        type="button"
      >
        SIGN UP
      </button>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  min-height: calc(100vh - (var(--footer-height) + var(--header-height)));
}
.sub-title {
  color: var(--accent);
  font-size: var(--spacer);
  font-weight: 300;
}
.auth-button {
  background-color: var(--accent);
  border-radius: calc(var(--spacer) / 4);
  color: var(--background);
  font-size: calc(var(--spacer) - (var(--spacer-half) / 2));
  padding: var(--spacer);
  transition: background-color 200ms ease-out, color 200ms ease-out;
  width: calc(var(--spacer) * 10);
}
.auth-button:hover {
  background-color: var(--accent-light);
  color: var(--background);
  transition: background-color 200ms ease-in, color 200ms ease-in;
}
</style>
