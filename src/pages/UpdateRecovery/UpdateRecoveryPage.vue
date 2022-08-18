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
  RESPONSE_MESSAGES,
  SPACER,
} from '@/constants';
import InputComponent from '@/components/InputComponent/InputComponent.vue';
import type { Navigation } from '@/types/navigation';
import request, { ENDPOINTS, type ResponseError } from '@/utilities/api';
import TextArea from '@/components/TextAreaComponent/TextAreaComponent.vue';
import { useAppStore } from '@/stores/app.store';
import { useStore } from '@/stores/auth.store';
import WideButton from '@/components/WideButtonComponent/WideButtonComponent.vue';

interface ComponentState {
  formError: string;
  loading: boolean;
  newRecoveryAnswer: string;
  newRecoveryQuestion: string;
  recoveryDataUpdated: boolean;
}

enum InputNames {
  newRecoveryAnswer = 'newRecoveryAnswer',
  newRecoveryQuestion = 'newRecoveryQuestion',
}

const appStore = useAppStore();
const router = useRouter();
const state = reactive<ComponentState>({
  formError: '',
  loading: false,
  newRecoveryAnswer: '',
  newRecoveryQuestion: '',
  recoveryDataUpdated: false,
});
const store = useStore();

onMounted((): void | Promise<Navigation> => {
  const { login, token, userId } = store;
  if (!(!!login && !!token && !!userId)) {
    return router.replace('/sign-in');
  }
});

const disableSubmit = computed((): boolean => {
  const {
    loading,
    newRecoveryAnswer,
    newRecoveryQuestion,
  } = state;
  if (loading) {
    return true;
  }
  return !(
    newRecoveryAnswer
      && newRecoveryAnswer.trim()
      && newRecoveryQuestion
      && newRecoveryQuestion.trim()
  );
});

const handleInput = (event: Event): void => {
  const { name = '', value = '' } = event.target as HTMLInputElement;
  const typedName = name as InputNames;
  state[typedName] = value;
  state.formError = '';
  state.recoveryDataUpdated = false;
};

const handleSubmit = async (): Promise<Navigation | boolean | string> => {
  state.formError = '';
  state.recoveryDataUpdated = false;

  const {
    newRecoveryAnswer,
    newRecoveryQuestion,
  } = state;

  const trimmedNewRecoveryAnswer = newRecoveryAnswer.trim();
  const trimmedNewRecoveryQuestion = newRecoveryQuestion.trim();
  if (!(trimmedNewRecoveryAnswer && trimmedNewRecoveryQuestion)) {
    return state.formError = ERROR_MESSAGES.pleaseProvideRequiredData;
  }

  state.loading = true;

  try {
    await request({
      ...ENDPOINTS.changeRecoveryData,
      data: {
        newRecoveryAnswer: trimmedNewRecoveryAnswer,
        newRecoveryQuestion: trimmedNewRecoveryQuestion,
      },
      token: store.token,
    });

    state.loading = false;
    return state.recoveryDataUpdated = true;
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
      Update recovery data
    </div>
    <form
      @submit.prevent="handleSubmit"
      class="flex direction-column mt-1"
    >
      <TextArea
        @input="handleInput"
        :disabled="state.loading"
        :name="'newRecoveryQuestion'"
        :placeholder="'New recovery question'"
        :value="state.newRecoveryQuestion"
      ></TextArea>
      <InputComponent
        @input="handleInput"
        :custom-styles="{ marginTop: `${SPACER}px` }"
        :disabled="state.loading"
        :name="'newRecoveryAnswer'"
        :placeholder="'New recovery answer'"
        :type="'text'"
        :value="state.newRecoveryAnswer"
      />
      <ActionSuccess
        v-if="!state.formError && state.recoveryDataUpdated"
        message="Recovery data updated!"
      />
      <AuthError
        v-if="!!state.formError || !state.recoveryDataUpdated"
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
