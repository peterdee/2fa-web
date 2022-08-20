<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, type RouteRecordName } from 'vue-router';

import LogoButton from '../LogoButtonComponent/LogoButtonComponent.vue';
import MenuButton from '../MenuButtonComponent/MenuButtonComponent.vue';
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
      <LogoButton @click="router.push('/')" />
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
        <MenuButton
          @click="handleMenu"
          :menu-shown="menuShown"
        />
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
