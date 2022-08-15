<script setup lang="ts">
import { onMounted } from 'vue';

import type { Navigation } from '@/types/navigation';
import router from '@/router';
import { SPACER } from '@/constants';
import { useStore } from '@/stores/auth.store';
import WideButton from '@/components/WideButtonComponent/WideButtonComponent.vue';

const store = useStore();

onMounted(() => {
  const { login, token, userId } = store;
  if (!(!!login && !!token && !!userId)) {
    return router.replace('/sign-in');
  }
});

const handleLogout = (): Promise<Navigation> => {
  store.clearAuth();
  return router.push('/');
};
</script>

<template>
  <h1>
    Home page
  </h1>
  <WideButton
    @click="handleLogout"
    :custom-button-styles="{
      marginTop: `${SPACER * 3}px`,
    }"
  >
    LOGOUT
  </WideButton>
</template>


