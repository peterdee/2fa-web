<script setup lang="ts">
import {
  computed,
  onMounted,
  reactive,
} from 'vue';
import type { NavigationFailure } from 'vue-router';

import {
  CLIENT_TYPE,
  COLORS,
  ERROR_MESSAGES,
  SPACER,
} from '@/constants';
import { getValue } from '@/utilities/storage';
import InputComponent from '@/components/InputComponent/InputComponent.vue';
import LinkButton from '@/components/LinkButtonComponent/LinkButtonComponent.vue';
import request, { ENDPOINTS } from '@/utilities/api';
import type { ResponseError } from '@/utilities/api';
import router from '@/router';
import WideButton from '@/components/WideButtonComponent/WideButtonComponent.vue';

interface ComponentState {
  formError: string;
  loading: boolean;
  login: string;
  password: string;
}

enum InputNames {
  login = 'login',
  passowrd = 'password',
}

interface SignInPayload {
  token: string;
  user: {
    id: number;
    login: string;
  };
}

const state = reactive<ComponentState>({
  formError: '',
  loading: false,
  login: '',
  password: '',
});

onMounted((): void | Promise<void | NavigationFailure | undefined> => {
  const login = getValue<string>('login');
  const token = getValue<string>('token');
  const userId = getValue<string>('userId');

  if (!!login && !!token && !!userId) {
    return router.replace('/home');
  }
});

const disableSubmit = computed((): boolean => {
  if (state.loading) {
    return true;
  }
  const trimmedLogin = state.login.trim();
  const trimmedPassword = state.password.trim();
  return !(trimmedLogin && trimmedPassword);
});

const handleInput = (event: Event): void => {
  const { name = '', value = '' } = event.target as HTMLInputElement;
  const typedName = name as InputNames;
  state[typedName] = value;
  state.formError = '';
};

const handleSubmit = async (): Promise<null | void> => {
  const { login, password } = state;
  const trimmedLogin = login.trim();
  const trimmedPassword = password.trim();
  if (!(trimmedLogin && trimmedPassword)) {
    state.formError = ERROR_MESSAGES.pleaseProvideRequiredData;
    return null;
  }

  state.loading = true;

  try {
    const { data: { data } = {} } = await request<SignInPayload>({
      ...ENDPOINTS.signIn,
      data: {
        clientType: CLIENT_TYPE,
        login: trimmedLogin,
        password: trimmedPassword,
      },
    });
    console.log(data);

    state.loading = false;
  } catch (error) {
    state.loading = false;
    const typedError = error as ResponseError;
    const response = typedError.response?.data;
    console.log(response);
    state.formError = 'error';
    // TODO: handle errors
  }
};
</script>

<template>
  <div class="wrap">
    <div class="auth-title">
      SIGN IN
    </div>
    <form
      @submit.prevent="handleSubmit"
      class="form mt-1"
    >
      <InputComponent
        :custom-styles="{ marginTop: `${SPACER}px` }"
        :disabled="state.loading"
        :handleInput="handleInput"
        :name="'login'"
        :placeholder="'Login'"
        :type="'text'"
        :value="state.login"
      />
      <InputComponent
        :custom-styles="{ marginTop: `${SPACER}px` }"
        :disabled="state.loading"
        :handleInput="handleInput"
        :name="'password'"
        :placeholder="'Password'"
        :type="'password'"
        :value="state.password"
      />
      <div class="error-block mt-1">
        <div
          v-if="! state.formError"
          class="error-content"
        >
          {{ state.formError }}
        </div>
      </div>
      <WideButton
        :custom-button-styles="{
          backgroundColor: disableSubmit
            ? COLORS.muted
            : COLORS.accent,
          marginTop: `${SPACER}px`,
        }"
        :disabled="disableSubmit"
        :is-submit="true"
      >
        SIGN IN
      </WideButton>
    </form>
    <LinkButton
      :custom-button-styles="{
        marginTop: `${SPACER}px`,
      }"
      :disabled="state.loading"
      :on-click="() => router.push('/recovery')"
    >
      Forgot password
    </LinkButton>
    <LinkButton
      :custom-button-styles="{
        marginTop: `${SPACER}px`,
      }"
      :disabled="state.loading"
      :on-click="() => router.push('/sign-up')"
    >
      Create account
    </LinkButton>
    <LinkButton
      :custom-button-styles="{
        marginTop: `${SPACER}px`,
      }"
      :disabled="state.loading"
      :on-click="() => router.push('/')"
    >
      Back
    </LinkButton>
  </div>
</template>

<style scoped>
.form, .wrap {
  display: flex;
  flex-direction: column;
}
.wrap {
  max-width: calc(var(--spacer) * 20);
}
</style>
