<script setup lang="ts">
import {
  computed,
  onMounted,
  reactive,
} from 'vue';
import { useRouter } from 'vue-router';

import AuthErrorComponent from '@/components/AuthErrorComponent/AuthErrorComponent.vue';
import {
  CLIENT_TYPE,
  COLORS,
  ERROR_MESSAGES,
  PASSWORD_MIN_LENGTH,
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
  newPassword: string;
  recoveryAnswer: string;
  recoveryQuestion: string;
  stage: number;
  userId: number | null;
}

enum InputNames {
  login = 'login',
  recoveryAnswer = 'recoveryAnswer',
}

interface RecoveryCheckPayload {
  recoveryQuestion: string;
  userId: number;
}

interface RecoveryUpdatePayload {
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
  newPassword: '',
  recoveryAnswer: '',
  recoveryQuestion: '',
  stage: 1,
  userId: null,
});
const store = useStore();

onMounted((): void | Promise<Navigation> => {
  const { login, token, userId } = store;
  if (!!login && !!token && !!userId) {
    return router.replace('/home');
  }
});

const handleInput = (event: Event): void => {
  const { name = '', value = '' } = event.target as HTMLInputElement;
  const typedName = name as InputNames;
  state[typedName] = value;
  state.formError = '';
};

const handleStageOne = async (): Promise<Navigation | number | string> => {
  const { login } = state;
  const trimmedLogin = login.trim();
  if (!trimmedLogin) {
    return state.formError = ERROR_MESSAGES.pleaseProvideRequiredData;
  }

  state.loading = true;

  try {
    const { data } = await request<RecoveryCheckPayload>({
      ...ENDPOINTS.recoveryCheck,
      data: { login: trimmedLogin },
    });
    const {
      data: {
        recoveryQuestion: receivedRecoveryQuestion,
        userId: receivedUserId,
      } = {},
    } = data;

    state.loading = false;
    if (!(receivedRecoveryQuestion && receivedUserId)) {
      return state.formError = ERROR_MESSAGES.generic;
    }

    state.recoveryQuestion = receivedRecoveryQuestion;
    state.userId = receivedUserId;
    return state.stage = 2;
  } catch (error) {
    state.loading = false;
    const typedError = error as ResponseError;
    if (typedError.response && typedError.response.data) {
      const response = typedError.response.data;
      if (response.status === 400) {
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

const handleStageTwo = async (): Promise<Navigation | number | string> => {
  const { newPassword, recoveryAnswer } = state;
  const trimmedNewPassword = newPassword.trim();
  const trimmedRecoveryAnswer = recoveryAnswer.trim();
  if (!(trimmedNewPassword && trimmedRecoveryAnswer)) {
    return state.formError = ERROR_MESSAGES.pleaseProvideRequiredData;
  }

  if (trimmedNewPassword.includes(' ')) {
    return  state.formError = ERROR_MESSAGES.passwordContainsSpaces;
  }
  if (trimmedNewPassword.length < PASSWORD_MIN_LENGTH) {
    return  state.formError = ERROR_MESSAGES.passwordIsTooShort;
  }

  state.loading = true;

  try {
    const { data } = await request<RecoveryUpdatePayload>({
      ...ENDPOINTS.recoveryUpdate,
      data: {
        clientType: CLIENT_TYPE,
        newPassword: trimmedNewPassword,
        recoveryAnswer: trimmedRecoveryAnswer,
        userId: state.userId,
      },
    });

    state.loading = false;
    const { data: { token: tokenString, user: userData } = {} } = data;
    if (!(tokenString && userData)) {
      return state.formError = ERROR_MESSAGES.generic;
    }

    store.setAuth({
      login: userData.login,
      token: tokenString,
      userId: userData.id,
    });
    return state.stage = 3;
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
      if (response.status === 403) {
        return state.formError = ERROR_MESSAGES.recoveryAnswerIsInvalid;
      }
    }
    return state.formError = ERROR_MESSAGES.generic;
  }
};

const disableStageTwoSubmit = computed((): boolean => {
  if (state.loading) {
    return true;
  }
  return !(state.newPassword.trim() && state.recoveryAnswer.trim());
});
</script>

<template>
  <div class="flex direction-column centered-wrap width">
    <div
      v-if="state.stage !== 3"
      class="auth-title mb-1 noselect"
    >
      ACCOUNT RECOVERY
    </div>
    <form
      v-if="state.stage === 1"
      @submit.prevent="handleStageOne"
      class="flex direction-column"
    >
      <InputComponent
        @input="handleInput"
        :disabled="state.loading"
        :name="'login'"
        :placeholder="'Please enter your login'"
        :type="'text'"
        :value="state.login"
      />
      <AuthErrorComponent :message="state.formError" />
      <WideButton
        :custom-button-styles="{
          backgroundColor: state.loading || state.login.length === 0
            ? COLORS.muted
            : COLORS.accent,
        }"
        :disabled="state.loading || state.login.length === 0"
        :is-submit="true"
        :loading="state.loading"
      >
        PROCEED
      </WideButton>
    </form>
    <form
      v-if="state.stage === 2"
      @submit.prevent="handleStageTwo"
      class="flex direction-column"
    >
      <div class="answer-question mb-1 noselect">
        Please answer the following question:
      </div>
      <div class="question mb-1 noselect">
        {{ state.recoveryQuestion }}
      </div>
      <InputComponent
        @input="handleInput"
        :disabled="state.loading"
        :name="'recoveryAnswer'"
        :placeholder="'Answer'"
        :type="'text'"
        :value="state.recoveryAnswer"
      />
      <InputComponent
        @input="handleInput"
        :disabled="state.loading"
        :name="'newPassword'"
        :placeholder="'New password'"
        :type="'password'"
        :value="state.newPassword"
        class="mt-1"
      />
      <AuthErrorComponent :message="state.formError" />
      <WideButton
        :custom-button-styles="{
          backgroundColor: disableStageTwoSubmit
            ? COLORS.muted
            : COLORS.accent,
        }"
        :disabled="disableStageTwoSubmit"
        :is-submit="true"
        :loading="state.loading"
      >
        SUBMIT
      </WideButton>
    </form>
    <div
      v-if="state.stage === 3"
      class="recovery-complete noselect"
    >
      Account recovery completed!
    </div>
    <LinkButton
      @click="() => router.back()"
      :custom-button-styles="{
        marginTop: `${SPACER}px`,
      }"
      :disabled="state.loading"
    >
      {{ state.stage !== 3 ? 'Back' : 'Proceed' }}
    </LinkButton>
  </div>
</template>

<style scoped>
.answer-question, .question, .recovery-complete {
  text-align: center;
  width: 100%;
}
.question {
  color: var(--accent);
  font-weight: 500;
}
.recovery-complete {
  color: var(--positive);
  font-size: calc(var(--spacer) + var(--spacer-half));
}
</style>
