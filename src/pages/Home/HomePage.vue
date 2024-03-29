<script setup lang="ts">
import {
  onMounted,
  reactive,
} from 'vue';
import { useRouter } from 'vue-router';

import AuthError from '@/components/AuthErrorComponent/AuthErrorComponent.vue';
import { ERROR_MESSAGES } from '@/constants';
import type { Navigation } from '@/types/navigation';
import LoadingComponent from './components/LoadingComponent.vue';
import NothingToDisplay from './components/NothingToDisplayComponent.vue';
import request, { ENDPOINTS, type ResponseError } from '@/utilities/api';
import type { StoredSecretEntry } from '@/types/models';
import TokenComponent from './components/TokenComponent.vue';
import { useAppStore } from '@/stores/app.store';
import { useStore } from '@/stores/auth.store';

interface GetSecretsPayload {
  secrets: StoredSecretEntry[],
}

interface ComponentState extends GetSecretsPayload {
  actionError: string;
  loading: boolean;
}

const appStore = useAppStore();
const router = useRouter();
const state = reactive<ComponentState>({
  actionError: '',
  loading: true,
  secrets: [],
});
const store = useStore();

const loadData = async (): Promise<StoredSecretEntry[] | string | void> => {
  state.actionError = '';

  try {
    const {
      data: {
        data: {
          secrets = [],
        } = {},
      } = {},
    } = await request<GetSecretsPayload>({
      ...ENDPOINTS.getSecrets,
      token: store.token,
    });
    state.loading = false;
    return state.secrets = secrets;
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

onMounted((): void | Promise<Navigation> => {
  const { login, token, userId } = store;
  if (!(!!login && !!token && !!userId)) {
    return router.replace('/sign-in');
  }
  loadData();
});
</script>

<template>
  <div class="flex direction-column page-wrap header-width">
    <div class="page-title noselect">
      Home
    </div>
    <template v-if="state.loading">
      <LoadingComponent />
    </template>
    <template v-if="!state.loading && state.secrets.length === 0">
      <NothingToDisplay />
    </template>
    <template v-if="!state.loading && state.secrets.length > 0">
      <template
        v-for="secret, index of state.secrets"
        :key="secret.id"
      >
        <TokenComponent
          :entry="secret"
          :with-border="index < state.secrets.length - 1"
        />
      </template>
    </template>
    <AuthError :message="state.actionError" />
  </div>
</template>
