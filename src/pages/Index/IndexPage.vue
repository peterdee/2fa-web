<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { useStore } from '@/stores/auth.store';

const router = useRouter();
const store = useStore();

onMounted(() => {
  const { login, token, userId } = store;
  if (!!login && !!token && !!userId) {
    return router.replace('/home');
  }
});
</script>

<template>
  <div class="wrap width">
    <div class="auth-title noselect mb-1">
      2FA PROJECT
    </div>
  </div>
</template>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  min-height: calc(100vh - (var(--footer-height) + var(--header-height)));
}
</style>
