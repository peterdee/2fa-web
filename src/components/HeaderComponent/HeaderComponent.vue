<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const HEADER_HIDDEN = [
  'signIn',
  'signUp',
];

const router = useRouter();
const currentRoute = computed(() => router.currentRoute.value.name);
</script>

<template>
<div
  v-if="!HEADER_HIDDEN.includes(String(currentRoute))"
  class="flex align-items-center justify-space-between width header"
>
  Header
</div>
</template>

<style scoped>
.header {
  background-color: var(--background);
  height: calc(var(--spacer) * 4);
  position: fixed;
}
</style>
