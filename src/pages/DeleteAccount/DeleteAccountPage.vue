<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { useStore } from '@/stores/auth.store';

const router = useRouter();
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
    Delete account
  </h1>
</template>
