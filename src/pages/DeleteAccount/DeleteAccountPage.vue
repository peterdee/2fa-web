<script setup lang="ts">
import {
  onMounted,
  reactive,
} from 'vue';
import { useRouter } from 'vue-router';

import AuthError from '@/components/AuthErrorComponent/AuthErrorComponent.vue';
import {
  COLORS,
  ERROR_MESSAGES,
  SPACER,
} from '@/constants';
import type { Navigation } from '@/types/navigation';
import request, { ENDPOINTS, type ResponseError } from '@/utilities/api';
import { useAppStore } from '@/stores/app.store';
import { useStore } from '@/stores/auth.store';
import WideButton from '@/components/WideButtonComponent/WideButtonComponent.vue';

interface ComponentState {
  actionError: string;
  loading: boolean;
}

const appStore = useAppStore();
const router = useRouter();
const state = reactive<ComponentState>({
  actionError: '',
  loading: false,
});
const store = useStore();

onMounted((): void | Promise<Navigation> => {
  const { login, token, userId } = store;
  if (!(!!login && !!token && !!userId)) {
    return router.replace('/sign-in');
  }
});

const handleDelete = async (): Promise<Navigation | boolean | string | void> => {
  state.actionError = '';
  state.loading = true;

  try {
    await request({
      ...ENDPOINTS.deleteAccount,
      token: store.token,
    });

    state.loading = false;
    store.clearAuth();
    return router.push('/');
  } catch (error) {
    state.loading = false;
    const typedError = error as ResponseError;
    if (typedError.response && typedError.response.data) {
      const response = typedError.response.data;
      if (response.status === 401) {
        return appStore.toggleErrorModal(true);
      }
    }
    return state.actionError = ERROR_MESSAGES.generic;
  }
};
</script>

<template>
  <div class="flex direction-column page-wrap header-width">
    <div class="page-title noselect">
      Delete account
    </div>
    <div class="disclaimer mt-1 noselect">
      All of the account-related data that is stored in the database will be deleted!
    </div>
    <div class="disclaimer mt-1 noselect">
      You will not be able to restore deleted data!
    </div>
    <div class="disclaimer mt-1 noselect">
      Synchronized data on your mobile devices is going to be deleted
      automatically once the 2FA Mobile application is opened!
    </div>
    <WideButton
      @click="handleDelete"
      :custom-button-styles="{
        backgroundColor: COLORS.negative,
        marginTop: `${SPACER * 2}px`,
      }"
      :disabled="state.loading"
      :loading="state.loading"
    >
      I UNDERSTAND, DELETE MY ACCOUNT
    </WideButton>
    <AuthError :message="state.actionError" />
  </div>
</template>

<style scoped>
.disclaimer {
  color: var(--text);
  font-size: calc(var(--spacer) + var(--spacer-half) / 2);
  font-weight: 400;
}
</style>
