<script setup lang="ts">
import { onMounted } from 'vue';

import { getValue } from '@/utilities/storage';
import router from '@/router';

onMounted(() => {
  const login = getValue<string>('login');
  const token = getValue<string>('token');
  const userId = getValue<string>('userId');

  if (!!login && !!token && !!userId) {
    return router.replace('/home');
  }
});
</script>

<template>
  <div class="centered">
    <h1>
      Index page
    </h1>
    <button
      @click="router.push('sign-in')"
      type="button"
    >
      Sign in
    </button>
    <button
      @click="router.push('sign-up')"
      type="button"
    >
      Sign up
    </button>
  </div>
</template>

<style scoped>
.centered {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}
</style>
