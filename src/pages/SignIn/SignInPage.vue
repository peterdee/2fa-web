<script setup lang="ts">
import {
  computed,
  onMounted,
  reactive,
} from 'vue';
import { useRouter } from 'vue-router';

import {
  CLIENT_TYPE,
  COLORS,
  ERROR_MESSAGES,
  RESPONSE_MESSAGES,
  SPACER,
} from '@/constants';
import InputComponent from '@/components/InputComponent/InputComponent.vue';
import LinkButton from '@/components/LinkButtonComponent/LinkButtonComponent.vue';
import type { Navigation } from '@/types/navigation';
import request, { ENDPOINTS, type ResponseError } from '@/utilities/api';
import { useStore } from '@/stores/auth.store';
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

const router = useRouter();
const state = reactive<ComponentState>({
  formError: '',
  loading: false,
  login: '',
  password: '',
});
const store = useStore();

onMounted((): void | Promise<Navigation> => {
  const { login, token, userId } = store;
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

const handleSubmit = async (): Promise<Navigation | null | string> => {
  const { login, password } = state;
  const trimmedLogin = login.trim();
  const trimmedPassword = password.trim();
  if (!(trimmedLogin && trimmedPassword)) {
    state.formError = ERROR_MESSAGES.pleaseProvideRequiredData;
    return null;
  }

  state.loading = true;

  try {
    const {
      data: {
        data: {
          token = '',
          user = null,
        } = {},
      } = {},
    } = await request<SignInPayload>({
      ...ENDPOINTS.signIn,
      data: {
        clientType: CLIENT_TYPE,
        login: trimmedLogin,
        password: trimmedPassword,
      },
    });

    state.loading = false;

    if (!(token && user)) {
      state.formError = ERROR_MESSAGES.generic;
    }
    store.setAuth({
      login: user?.login as string,
      token,
      userId: user?.id as number,
    });
    return router.replace('/home');
  } catch (error) {
    state.loading = false;
    const typedError = error as ResponseError;
    if (typedError.response && typedError.response.data) {
      const response = typedError.response.data;
      if (response.status === 400) {
        if (response.info === RESPONSE_MESSAGES.invalidData) {
          return state.formError = ERROR_MESSAGES.invalidData;
        }
        if (response.info === RESPONSE_MESSAGES.missingData) {
          return state.formError = ERROR_MESSAGES.missingData;
        }
      }
      if (response.status === 401) {
        return state.formError = ERROR_MESSAGES.accessDenied;
      }
    }
    return state.formError = ERROR_MESSAGES.generic;
  }
};
</script>

<template>
  <div class="wrap width">
    <div class="auth-title noselect">
      SIGN IN
    </div>
    <form
      @submit.prevent="handleSubmit"
      class="form mt-3"
    >
      <InputComponent
        @input="handleInput"
        :disabled="state.loading"
        :name="'login'"
        :placeholder="'Login'"
        :type="'text'"
        :value="state.login"
      />
      <InputComponent
        @input="handleInput"
        :custom-styles="{ marginTop: `${SPACER}px` }"
        :disabled="state.loading"
        :name="'password'"
        :placeholder="'Password'"
        :type="'password'"
        :value="state.password"
      />
      <div class="error-block">
        <div
          v-if="state.formError"
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
        }"
        :disabled="disableSubmit"
        :is-submit="true"
        :loading="state.loading"
      >
        SIGN IN
      </WideButton>
    </form>
    <LinkButton
      @click="() => router.push('/recovery')"
      :custom-button-styles="{
        marginTop: `${SPACER}px`,
      }"
      :disabled="state.loading"
    >
      Forgot password
    </LinkButton>
    <LinkButton
      @click="() => router.push('/sign-up')"
      :custom-button-styles="{
        marginTop: `${SPACER}px`,
      }"
      :disabled="state.loading"
    >
      Create account
    </LinkButton>
    <LinkButton
      @click="() => router.push('/')"
      :custom-button-styles="{
        marginTop: `${SPACER}px`,
      }"
      :disabled="state.loading"
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
  display: flex;
  height: calc(100vh - (var(--footer-height) + var(--header-height)));
  justify-content: center;
  margin: 0 auto;
  padding: 0 var(--spacer);
}
</style>
