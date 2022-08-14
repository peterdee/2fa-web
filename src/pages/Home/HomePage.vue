<script setup lang="ts">
import { onMounted } from 'vue';

import router from '@/router';
import { useStore } from '@/stores/auth.store';

const store = useStore();

onMounted(() => {
  const { login, token, userId } = store;
  if (!(!!login && !!token && !!userId)) {
    return router.replace('/sign-in');
  }
});
</script>

<template>
  <h1>
    Home page
  </h1>
</template>
