<script setup lang="ts">
import { onUpdated, reactive } from 'vue';
import { useRouter } from 'vue-router';

import LogoButton from '../LogoButtonComponent/LogoButtonComponent.vue';
import { useAppStore } from '@/stores/app.store';
import { useStore } from '@/stores/auth.store';

interface ErrorModalState {
  isClosing: boolean;
}

const appStore = useAppStore();
const authStore = useStore();
const router = useRouter();
const state = reactive<ErrorModalState>({
  isClosing: false,
});

onUpdated((): void => {
  if (appStore.showErrorModal) {
    authStore.clearAuth();
  }
});

const handleAction = async (): Promise<void> => {
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
        <LogoButton @click="handleAction" />
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
        Logged out due to authorization error!
      </div>
      <button
        @click="handleAction"
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
