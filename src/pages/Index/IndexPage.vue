<script setup lang="ts">
import router from '@/router';

const navigate = (destination: string) => router.push(destination);
</script>

<template>
  <div class="centered">
    <h1>
      Index page
    </h1>
    <button
      @click="navigate('sign-in')"
      type="button"
    >
      Sign in
    </button>

    <a href="/sign-up">
      Sign up
    </a>
  </div>
</template>

<style scoped>
.centered {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}
</style>
