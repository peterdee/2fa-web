<script setup lang="ts">
import { useRouter } from 'vue-router';

import LinkButton from '@/components/LinkButtonComponent/LinkButtonComponent.vue';
import { SPACER } from '@/constants';

const router = useRouter();
</script>

<template>
  <div class="wrap width">
    <div class="auth-title noselect">
      Page not found!
    </div>
    <LinkButton
      @click="() => router.back()"
      :custom-button-styles="{
        marginTop: `${SPACER}px`,
      }"
    >
      Back
    </LinkButton>
  </div>
</template>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  height: calc(100vh - (var(--footer-height) + var(--header-height)));
  justify-content: center;
  margin: 0 auto;
  padding: 0 var(--spacer);
}
</style>
