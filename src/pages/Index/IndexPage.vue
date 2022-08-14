<script setup lang="ts">
import { onMounted } from 'vue';

import router from '@/router';
import { useStore } from '@/stores/auth.store';

const store = useStore();

onMounted(() => {
  const { login, token, userId } = store;
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
