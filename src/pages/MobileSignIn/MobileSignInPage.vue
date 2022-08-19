<script setup lang="ts">
import {
  onMounted,
  reactive,
} from 'vue';
import QR from 'qrcode.vue';
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
  authCode: string;
  loading: boolean;
}

interface GetAuthCodePayload {
  authCode: string;
}

const appStore = useAppStore();
const router = useRouter();
const state = reactive<ComponentState>({
  actionError: '',
  authCode: '',
  loading: false,
});
const store = useStore();

onMounted((): void | Promise<Navigation> => {
  const { login, token, userId } = store;
  if (!(!!login && !!token && !!userId)) {
    return router.replace('/sign-in');
  }
  handleRefresh();
});

const handleRefresh = async (): Promise<boolean | string | void> => {
  state.actionError = '';
  state.loading = true;

  try {
    const {
      data: {
        data: {
          authCode = '',
        } = {},
      } = {},
    } = await request<GetAuthCodePayload>({
      ...ENDPOINTS.getAuthCode,
      token: store.token,
    });

    state.loading = false;
    return state.authCode = authCode;
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
      Sign in on mobile
    </div>
    <div class="disclaimer mt-1 noselect">
      Scan the following code in your 2FA Mobile application to sign into your account
    </div>
    <div class="qr-centered">
      <QR v-if="!state.loading"
        :foreground="COLORS.accent"
        :size="SPACER * 15"
        :value="state.authCode"
        level="M"
      />
    </div>
    <WideButton
      @click="handleRefresh"
      :disabled="state.loading"
      :loading="state.loading"
    >
      REFRESH
    </WideButton>
    <AuthError :message="state.actionError" />
  </div>
</template>

<style scoped>
.disclaimer {
  color: var(--text);
  font-size: var(--spacer);
}
.qr-centered {
  height: calc(var(--spacer) * 15);
  margin: var(--spacer) auto;
}
</style>
