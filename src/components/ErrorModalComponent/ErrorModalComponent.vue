<script setup lang="ts">
import { onUpdated, reactive } from 'vue';
import { useRouter } from 'vue-router';

import loader from '@/assets/loader.svg';
import { useAppStore } from '@/stores/app.store';
import { useStore } from '@/stores/auth.store';

interface MenuModalState {
  isClosing: boolean;
}

const appStore = useAppStore();
const authStore = useStore();
const router = useRouter();
const state = reactive<MenuModalState>({
  isClosing: false,
});

onUpdated((): void => {
  if (appStore.showErrorModal) {
    authStore.clearAuth();
  }
});

const handleMenu = async (): Promise<void> => {
  state.isClosing = true;
  await new Promise((resolve): number => setTimeout(resolve, 200));
  state.isClosing = false;
  router.push('/');
  return appStore.toggleErrorModal(!appStore.showErrorModal);
};
</script>

<template>
  <div
    v-if="appStore.showErrorModal"
    :class="['wrap', state.isClosing ? 'closing' : '']"
  >
    <div class="modal-header">
      <div
        class="flex align-items-center justify-space-between header-width header-content noselect"
      >
        <button
          @click="handleMenu"
          class="flex align-items-center justify-center logo"
          type="button"
        >
          <img
            :src="loader"
            alt="2FA"
            class="logo-image"
          />
        </button>
      </div>
    </div>
    <div class="modal-content">
      <div 
        :class="[
          'flex align-items-center justify-center error-title width noselect',
          state.isClosing ? 'hide' : ''
        ]"
      >
        You have been logged out!
      </div>
      <div :class="['error-text mt-2 noselect', state.isClosing ? 'hide' : '']">
        Logged out due to the authorization error!
      </div>
      <button
        @click="handleMenu"
        :class="['menu-button mt-3', state.isClosing ? 'hide' : '']"
        type="button"
      >
        OK
      </button>
    </div>
    <div class="footer"></div>
  </div>
</template>

<style scoped src="./styles.css" />
