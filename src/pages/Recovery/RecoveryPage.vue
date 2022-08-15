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
    if (!(receivedRecoveryQuestion && receivedUserId)) {
      return state.formError = ERROR_MESSAGES.generic;
    }

    state.loading = false;
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
  console.log('stage', state.stage);
};

const disableStageTwoSubmit = computed((): boolean => {
  if (state.loading) {
    return true;
  }
  return !(state.newPassword && state.recoveryAnswer);
});
</script>

<template>
  <div class="wrap width">
    <div class="auth-title noselect">
      ACCOUNT RECOVERY
    </div>
    <form
      v-if="state.stage === 1"
      @submit.prevent="handleStageOne"
      class="form mt-3"
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
      class="form mt-3"
    >
      <div>
        Please answer the following question:
      </div>
      <div>
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
    <LinkButton
      @click="() => router.back()"
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
  flex-direction: column;
  height: calc(100vh - (var(--footer-height) + var(--header-height)));
  justify-content: center;
  margin: 0 auto;
  padding: 0 var(--spacer);
}
</style>
