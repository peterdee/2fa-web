<script setup lang="ts">
import {
  computed,
  onMounted,
  reactive,
} from 'vue';
import { useRouter } from 'vue-router';

import ActionSuccess from '@/components/ActionSuccessComponent/ActionSuccessComponent.vue';
import AuthError from '@/components/AuthErrorComponent/AuthErrorComponent.vue';
import {
  COLORS,
  ERROR_MESSAGES,
  PASSWORD_MIN_LENGTH,
  RESPONSE_MESSAGES,
  SPACER,
} from '@/constants';
import InputComponent from '@/components/InputComponent/InputComponent.vue';
import type { Navigation } from '@/types/navigation';
import request, { ENDPOINTS, type ResponseError } from '@/utilities/api';
import { useAppStore } from '@/stores/app.store';
import { useStore } from '@/stores/auth.store';
import WideButton from '@/components/WideButtonComponent/WideButtonComponent.vue';

interface ComponentState {
  formError: string;
  loading: boolean;
  newPassword: string;
  oldPassword: string;
  passwordChanged: boolean;
}

interface ChangePasswordPayload {
  token: string;
}

enum InputNames {
  newPassowrd = 'newPassword',
  oldPassowrd = 'oldPassword',
}

const appStore = useAppStore();
const router = useRouter();
const state = reactive<ComponentState>({
  formError: '',
  loading: false,
  newPassword: '',
  oldPassword: '',
  passwordChanged: false,
});
const store = useStore();

onMounted((): void | Promise<Navigation> => {
  const { login, token, userId } = store;
  if (!(!!login && !!token && !!userId)) {
    return router.replace('/sign-in');
  }
});

const disableSubmit = computed((): boolean => {
  const { loading, newPassword, oldPassword } = state;
  if (loading) {
    return true;
  }
  return !(
    newPassword
      && newPassword.trim()
      && newPassword.trim().length >= PASSWORD_MIN_LENGTH
      && oldPassword
      && oldPassword.trim()
  );
});

const handleInput = (event: Event): void => {
  const { name = '', value = '' } = event.target as HTMLInputElement;
  const typedName = name as InputNames;
  state[typedName] = value;
  state.formError = '';
  state.passwordChanged = false;
};

const handleSubmit = async (): Promise<Navigation | boolean | string> => {
  state.formError = '';
  state.passwordChanged = false;

  const { newPassword, oldPassword } = state;

  if (newPassword.includes(' ')) {
    return state.formError = ERROR_MESSAGES.passwordContainsSpaces;
  }

  const trimmedNewPassword = newPassword.trim();
  const trimmedOldPassword = oldPassword.trim();
  if (!(trimmedNewPassword && trimmedOldPassword)) {
    return state.formError = ERROR_MESSAGES.pleaseProvideRequiredData;
  }

  if (trimmedNewPassword.length < PASSWORD_MIN_LENGTH) {
    return state.formError = ERROR_MESSAGES.passwordIsTooShort;
  }
  state.loading = true;

  try {
    const { data: { data } = {} } = await request<ChangePasswordPayload>({
      ...ENDPOINTS.changePassword,
      data: {
        newPassword: trimmedNewPassword,
        oldPassword: trimmedOldPassword,
      },
      token: store.token,
    });

    state.loading = false;
    if (!(data && data.token)) {
      return state.formError = ERROR_MESSAGES.generic;
    }

    store.setToken(data.token);
    return state.passwordChanged = true;
  } catch (error) {
    state.loading = false;
    const typedError = error as ResponseError;
    if (typedError.response && typedError.response.data) {
      const response = typedError.response.data;
      if (response.status === 400) {
        if (response.info === RESPONSE_MESSAGES.missingData) {
          return state.formError = ERROR_MESSAGES.missingData;
        }
        if (response.info === RESPONSE_MESSAGES.oldPasswordIsInvalid) {
          return state.formError = ERROR_MESSAGES.currentPasswordIsInvalid;
        }
        if (response.info === RESPONSE_MESSAGES.passwordContainsSpaces) {
          return state.formError = ERROR_MESSAGES.passwordContainsSpaces;
        }
        if (response.info === RESPONSE_MESSAGES.passwordIsTooShort) {
          return state.formError = ERROR_MESSAGES.passwordIsTooShort;
        }
      }
      if (response.status === 401) {
        return appStore.toggleErrorModal(true);
      }
    }
    return state.formError = ERROR_MESSAGES.generic;
  }
};
</script>

<template>
  <div class="flex direction-column page-wrap header-width">
    <div class="page-title noselect">
      Change password
    </div>
    <form
      @submit.prevent="handleSubmit"
      class="flex direction-column mt-1"
    >
      <InputComponent
        @input="handleInput"
        :disabled="state.loading"
        :name="'oldPassword'"
        :placeholder="'Current password'"
        :type="'password'"
        :value="state.oldPassword"
      />
      <InputComponent
        @input="handleInput"
        :custom-styles="{ marginTop: `${SPACER}px` }"
        :disabled="state.loading"
        :name="'newPassword'"
        :placeholder="'New password'"
        :type="'password'"
        :value="state.newPassword"
      />
      <ActionSuccess
        v-if="!state.formError && state.passwordChanged"
        message="Password updated!"
      />
      <AuthError
        v-if="!!state.formError || !state.passwordChanged"
        :message="state.formError"
      />
      <WideButton
        :custom-button-styles="{
          backgroundColor: disableSubmit
            ? COLORS.muted
            : COLORS.accent,
        }"
        :disabled="disableSubmit"
        :is-submit="true"
        :loading="state.loading"
      >
        UPDATE
      </WideButton>
    </form>
  </div>
</template>
