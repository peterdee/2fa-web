<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

import close from '@/assets/close.svg';
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

const delay = async (duration = 200): Promise<boolean> => {
  state.isClosing = true;
  await new Promise((resolve): number => setTimeout(resolve, duration));
  return state.isClosing = false;
};

const handleCompleteLogout = async (): Promise<void> => {
  console.log('Comeplete logout');
  await delay();
  return appStore.toggleMenu(!appStore.showMenu);
};

const handleMenu = async (): Promise<void> => {
  await delay();
  return appStore.toggleMenu(!appStore.showMenu);
};

const handleTransition = async (destination: string): Promise<void> => {
  let actualDestination = destination;
  if (destination === 'logout') {
    actualDestination = '/';
    authStore.clearAuth();
  }
  await delay();
  router.push(actualDestination);
  return appStore.toggleMenu(!appStore.showMenu);
};
</script>

<template>
  <div
    v-if="appStore.showMenu"
    :class="['wrap', state.isClosing ? 'closing' : '']"
  >
    <div class="modal-header">
      <div class="flex align-items-center justify-space-between header-content noselect">
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
        <button
          @click="handleMenu"
          class="flex align-items-center justify-center menu"
          type="button"
        >
          <img
            :src="close"
            alt="2FA"
            class="menu-image"
          />
        </button>
      </div>
    </div>
    <div class="modal-content">
      <button
        @click="handleTransition('/change-password')"
        :class="['menu-button', state.isClosing ? 'button-hide' : '']"
        type="button"
      >
        Change password
      </button>
      <button
        @click="handleTransition('logout')"
        :class="['menu-button danger-button', state.isClosing ? 'hide' : '']"
        type="button"
      >
        Logout
      </button>
      <button
        @click="handleCompleteLogout"
        :class="['menu-button danger-button', state.isClosing ? 'hide' : '']"
        type="button"
      >
        Logout on all devices
      </button>
      <div :class="['splitter mb-1 mt-1', state.isClosing ? 'hide' : '']"></div>
      <button
        @click="handleTransition('/delete-account')"
        :class="['menu-button danger-button', state.isClosing ? 'hide' : '']"
        type="button"
      >
        Delete account
      </button>
    </div>
    <div class="footer"></div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  0% {
    backdrop-filter: brightness(100%);
  }
  100% {
    backdrop-filter: brightness(15%);
  }
}
@keyframes fade-out {
  0% {
    backdrop-filter: brightness(15%);
  }
  100% {
    backdrop-filter: brightness(100%);
  }
}
@keyframes button-appear {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes button-disappear {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.wrap {
  animation: fade-in 200ms ease;
  backdrop-filter: brightness(15%);
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: space-between;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 11;
}
.closing {
  animation: fade-out 200ms ease;
}
.modal-header {
  background-color: transparent;
  height: calc(var(--spacer) * 4);
  width: 100%;
}
.header-content {
  height: calc(var(--spacer) * 4);
  margin: 0 auto;
  max-width: calc(var(--spacer) * 40);
  min-width: calc(var(--spacer) * 20);
  padding: 0 calc(var(--spacer) * 2);
  width: 100%;
}
.logo, .logo-image {
  height: calc(var(--spacer) * 2 + var(--spacer-half));
  width: calc(var(--spacer) * 2 + var(--spacer-half));
}
.logo, .menu {
  cursor: pointer;
}
.menu, .menu-image {
  height: calc(var(--spacer) * 2);
  width: calc(var(--spacer) * 2);
}
.modal-content {
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}
.splitter {
  background-color: var(--negative);
  height: 1px;
  width: calc(var(--spacer) * 15);
}
.menu-button {
  animation: button-appear 200ms ease;
  background-color: transparent;
  border-radius: calc(var(--spacer-half) / 2);
  color: var(--text-inverted);
  font-size: var(--spacer);
  font-weight: 300;
  height: calc(var(--spacer) * 3);
  opacity: 1;
  transition: background-color 200ms ease-out, color 200ms ease-out;
  width: calc(var(--spacer) * 15);
}
.hide {
  animation: button-disappear 200ms ease;
}
.danger-button {
  color: var(--negative);
}
.menu-button:hover {
  background-color: var(--background);
  color: var(--text);
  transition: background-color 200ms ease-in, color 200ms ease-in;
}
.danger-button:hover {
  background-color: var(--negative);
}
.footer {
  background-color: transparent;
  height: 1px;
}
</style>
