<script setup lang="ts">
import { computed, reactive } from 'vue';
import { type RouteRecordName, useRouter } from 'vue-router';

import close from '@/assets/close.svg';
import loader from '@/assets/loader.svg';
import MenuButton from './compoents/MenuButtonComponent.vue';
import request, { ENDPOINTS } from '@/utilities/api';
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

const currentRoute = computed(
  (): RouteRecordName | null | undefined => router.currentRoute.value.name,
);

const delay = async (duration = 200): Promise<boolean> => {
  state.isClosing = true;
  await new Promise((resolve): number => setTimeout(resolve, duration));
  return state.isClosing = false;
};

const handleMenu = async (): Promise<void> => {
  await delay();
  return appStore.toggleMenu(!appStore.showMenu);
};

const handleTransition = async (destination: string): Promise<void> => {
  let actualDestination = destination;
  if (destination === 'complete-logout') {
    actualDestination = '/';
    request({
      ...ENDPOINTS.logout,
      token: authStore.token,
    });
    authStore.clearAuth();
  }
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
          @click="handleTransition('/')"
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
      <MenuButton
        @click="handleTransition('/home')"
        :is-highlighted="currentRoute === 'home'"
        :is-closing="state.isClosing"
      >
        Home
      </MenuButton>
      <MenuButton
        @click="handleTransition('/change-password')"
        :is-highlighted="currentRoute === 'changePassword'"
        :is-closing="state.isClosing"
      >
        Change password
      </MenuButton>
      <MenuButton
        @click="handleTransition('/update-recovery')"
        :is-highlighted="currentRoute === 'updateRecovery'"
        :is-closing="state.isClosing"
      >
        Update recovery data
      </MenuButton>
      <MenuButton
        @click="handleTransition('/mobile-sign-in')"
        :is-highlighted="currentRoute === 'mobileSignIn'"
        :is-closing="state.isClosing"
      >
        Sign in on mobile
      </MenuButton>
      <MenuButton
        @click="handleTransition('logout')"
        :is-closing="state.isClosing"
        :with-danger="true"
      >
        Logout
      </MenuButton>
      <MenuButton
        @click="handleTransition('complete-logout')"
        :is-closing="state.isClosing"
        :with-danger="true"
      >
        Logout on all devices
      </MenuButton>
      <div :class="['splitter', state.isClosing ? 'hide' : '']"></div>
      <MenuButton
        @click="handleTransition('/delete-account')"
        :is-closing="state.isClosing"
        :is-highlighted="currentRoute === 'deleteAccount'"
        :with-danger="true"
      >
        Delete account
      </MenuButton>
    </div>
    <div class="footer"></div>
  </div>
</template>

<style scoped src="./styles.css" />
