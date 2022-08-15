<script setup lang="ts">
import {
  computed,
  onMounted,
  reactive,
} from 'vue';
import { useRouter } from 'vue-router';

import isAlphanumeric from '@/utilities/alphanumeric';
import {
  CLIENT_TYPE,
  COLORS,
  ERROR_MESSAGES,
  LOGIN_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  RESPONSE_MESSAGES,
  SPACER,
} from '@/constants';
import InputComponent from '@/components/InputComponent/InputComponent.vue';
import LinkButton from '@/components/LinkButtonComponent/LinkButtonComponent.vue';
import type { Navigation } from '@/types/navigation';
import request, { ENDPOINTS, type ResponseError } from '@/utilities/api';
import TextAreaComponent from '@/components/TextAreaComponent/TextAreaComponent.vue';
import { useStore } from '@/stores/auth.store';
import WideButton from '@/components/WideButtonComponent/WideButtonComponent.vue';

interface ComponentState {
  formError: string;
  loading: boolean;
  login: string;
  password: string;
  recoveryAnswer: string;
  recoveryQuestion: string;
}

enum InputNames {
  login = 'login',
  passowrd = 'password',
  recoveryAnswer = 'recoveryAnswer',
  recoveryQuestion = 'recoveryQuestion',
}

interface SignUpPayload {
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
  recoveryAnswer: '',
  recoveryQuestion: '',
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
  const trimmedRecoveryAnswer = state.recoveryAnswer.trim();
  const trimmedRecoveryQuestion = state.recoveryQuestion.trim();
  return !(trimmedLogin && trimmedPassword
    && trimmedRecoveryAnswer && trimmedRecoveryQuestion);
});

const handleInput = (event: Event): void => {
  const { name = '', value = '' } = event.target as HTMLInputElement;
  const typedName = name as InputNames;
  state[typedName] = value;
  state.formError = '';
};

const handleSubmit = async (): Promise<Navigation | null | string> => {
  const {
    login,
    password,
    recoveryAnswer,
    recoveryQuestion,
  } = state;

  if (password && password.includes(' ')) {
    return state.formError = ERROR_MESSAGES.passwordContainsSpaces;
  }

  const trimmedLogin = login.trim();
  const trimmedPassword = password.trim();
  const trimmedRecoveryAnswer = recoveryAnswer.trim();
  const trimmedRecoveryQuestion = recoveryQuestion.trim();
  if (!(trimmedLogin && trimmedPassword
    && trimmedRecoveryAnswer && trimmedRecoveryQuestion)) {
    state.formError = ERROR_MESSAGES.pleaseProvideRequiredData;
    return null;
  }

  if (trimmedLogin.length > LOGIN_MAX_LENGTH) {
    return state.formError = ERROR_MESSAGES.loginIsTooLong;
  }
  if (!isAlphanumeric(trimmedLogin)) {
    return state.formError = ERROR_MESSAGES.loginShouldBeAlphanumeric;
  }
  if (trimmedPassword.length < PASSWORD_MIN_LENGTH) {
    return state.formError = ERROR_MESSAGES.passwordIsTooShort;
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
    } = await request<SignUpPayload>({
      ...ENDPOINTS.signUp,
      data: {
        clientType: CLIENT_TYPE,
        login: trimmedLogin,
        password: trimmedPassword,
        recoveryAnswer: trimmedRecoveryAnswer,
        recoveryQuestion: trimmedRecoveryQuestion,
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
        if (response.info === RESPONSE_MESSAGES.invalidLogin) {
          return state.formError = ERROR_MESSAGES.loginShouldBeAlphanumeric;
        }
        if (response.info === RESPONSE_MESSAGES.loginAlreadyInUse) {
          return state.formError = ERROR_MESSAGES.loginIsAlreadyInUse;
        }
        if (response.info === RESPONSE_MESSAGES.loginIsTooLong) {
          return state.formError = ERROR_MESSAGES.loginIsTooLong;
        }
        if (response.info === RESPONSE_MESSAGES.missingData) {
          return state.formError = ERROR_MESSAGES.missingData;
        }
        if (response.info === RESPONSE_MESSAGES.passwordContainsSpaces) {
          return state.formError = ERROR_MESSAGES.passwordContainsSpaces;
        }
        if (response.info === RESPONSE_MESSAGES.passwordIsTooShort) {
          return state.formError = ERROR_MESSAGES.passwordIsTooShort;
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
      SIGN UP
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
      <TextAreaComponent
        @input="handleInput"
        :custom-styles="{ marginTop: `${SPACER}px` }"
        :disabled="state.loading"
        :name="'recoveryQuestion'"
        :placeholder="'Recovery question'"
        :value="state.recoveryQuestion"
      />
      <InputComponent
        @input="handleInput"
        :custom-styles="{ marginTop: `${SPACER}px` }"
        :disabled="state.loading"
        :name="'recoveryAnswer'"
        :placeholder="'Recovery answer'"
        :type="'text'"
        :value="state.recoveryAnswer"
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
        SIGN UP
      </WideButton>
    </form>
    <LinkButton
      @click="() => router.push('/sign-in')"
      :custom-button-styles="{
        marginTop: `${SPACER}px`,
      }"
      :disabled="state.loading"
    >
      I alreay have an account
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
