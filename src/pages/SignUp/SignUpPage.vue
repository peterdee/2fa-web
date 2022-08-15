<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

import type { Navigation } from '@/types/navigation';
import { useStore } from '@/stores/auth.store';

const router = useRouter();
const store = useStore();

onMounted((): void | Promise<Navigation> => {
  const { login, token, userId } = store;
  if (!!login && !!token && !!userId) {
    return router.replace('/home');
  }
});
</script>

<template>
  <div class="auth-title">
    Sign up page
  </div>
</template>
