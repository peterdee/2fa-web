<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, type RouteRecordName } from 'vue-router';

import close from '@/assets/close.svg';
import loader from '@/assets/loader.svg';
import menu from '@/assets/menu.svg';
import { useAppStore } from '@/stores/app.store';
import { useStore } from '@/stores/auth.store';

const HEADER_HIDDEN = [
  'recovery',
  'signIn',
  'signUp',
];

const router = useRouter();
const appStore = useAppStore();
const authStore = useStore();

const currentRoute = computed(
  (): RouteRecordName | null | undefined => router.currentRoute.value.name,
);

const isLoggedIn = computed((): boolean => {
  const { login, token, userId } = authStore;
  return !!login && !!token && !!userId;
});

const menuShown = computed((): boolean => {
  const { showMenu } = appStore;
  return showMenu;
});

const handleMenu = (): void => appStore.toggleMenu(!appStore.showMenu);
</script>

<template>
  <header v-if="!HEADER_HIDDEN.includes(String(currentRoute))">
    <div class="flex align-items-center justify-space-between header-width content noselect">
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
      <div
        v-if="!isLoggedIn"
        class="flex"
      >
        <button
          @click="router.push('/sign-in')"
          class="auth-button"
          type="button"
        >
          SIGN IN
        </button>
        <button
          @click="router.push('/sign-up')"
          class="auth-button ml-1"
          type="button"
        >
          SIGN UP
        </button>
      </div>
      <div v-if="isLoggedIn">
        <button
          @click="handleMenu"
          class="flex align-items-center justify-center menu"
          type="button"
        >
          <img
            :src="menuShown ? close : menu"
            alt="2FA"
            class="menu-image"
          />
        </button>
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
  padding: 0 calc(var(--spacer) * 2);
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
.auth-button {
  background-color: transparent;
  border-radius: calc(var(--spacer-half) / 2);
  color: var(--text-inverted);
  cursor: pointer;
  font-size: calc(var(--spacer) - (var(--spacer-half) / 2));
  font-weight: 300;
  padding: var(--spacer-half) var(--spacer);
  transition: background-color 160ms ease-out, color 160ms ease-out;
}
.auth-button:hover {
  background-color: var(--background);
  color: var(--accent);
  transition: background-color 160ms ease-in, color 160ms ease-in;
}
</style>
