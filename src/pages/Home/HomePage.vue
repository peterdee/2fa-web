<script setup lang="ts">
import type { NavigationFailure } from 'vue-router';
import { onMounted, reactive } from 'vue';

import { getValue } from '@/utilities/storage';
import router from '@/router';

interface ComponentState {
  login: string;
  token: string;
  userId: number | null;
}

const state = reactive<ComponentState>({
  login: '',
  token: '',
  userId: null,
});

onMounted((): void | Promise<void | undefined | NavigationFailure> => {
  const login = getValue<string>('login');
  const token = getValue<string>('token');
  const userId = getValue<number>('userId');
  if (!(!!login && !!token && !!userId)) {
    return router.replace('/sign-in');
  }

  state.login = login;
  state.token = token;
  state.userId = userId;
});

</script>

<template>
  <h1>
    Home page
  </h1>
</template>
