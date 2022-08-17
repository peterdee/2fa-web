<script setup lang="ts">
import { useRouter } from 'vue-router';

import LinkButton from '@/components/LinkButtonComponent/LinkButtonComponent.vue';
import { SPACER } from '@/constants';

const router = useRouter();
</script>

<template>
  <div class="flex direction-column centered-wrap width">
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
