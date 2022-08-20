<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

import CloseButton from '../MenuButtonComponent/MenuButtonComponent.vue';
import LogoButton from '../LogoButtonComponent/LogoButtonComponent.vue';
import { useAppStore } from '@/stores/app.store';

interface SuspendedModalState {
  isClosing: boolean;
}

const appStore = useAppStore();
const router = useRouter();
const state = reactive<SuspendedModalState>({
  isClosing: false,
});

const handleTransition = async (destination: string): Promise<void> => {
  state.isClosing = true;
  await new Promise((resolve): number => setTimeout(resolve, 200));
  state.isClosing = false;
  router.push(destination);
  return appStore.toggleSuspendedModal(!appStore.showSuspendedModal);
};
</script>

<template>
  <div
    v-if="appStore.showSuspendedModal"
    :class="['wrap', state.isClosing ? 'closing' : '']"
  >
    <div class="modal-header">
      <div
        class="flex align-items-center justify-space-between header-width header-content noselect"
      >
        <LogoButton @click="handleTransition('/')" />
        <CloseButton
          @click="handleTransition('/sign-in')"
          :menu-shown="true"
        />
      </div>
    </div>
    <div class="modal-content">
      <div 
        :class="[
          'flex align-items-center justify-center error-title width noselect',
          state.isClosing ? 'hide' : ''
        ]"
      >
        Account suspended!
      </div>
      <div :class="['error-text mt-2 noselect', state.isClosing ? 'hide' : '']">
        You had too many failed sign in attempts and now your account is suspended!
      </div>
      <div :class="['error-text mt-2 noselect', state.isClosing ? 'hide' : '']">
        You can unblock your account by going through Account Recovery!
      </div>
      <button
        @click="handleTransition('/recovery')"
        :class="['menu-button mt-3', state.isClosing ? 'hide' : '']"
        type="button"
      >
        Go to Account Recovery
      </button>
    </div>
    <div class="footer"></div>
  </div>
</template>

<style scoped src="./styles.css" />
