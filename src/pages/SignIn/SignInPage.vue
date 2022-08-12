<script setup lang="ts">
import { computed, reactive } from 'vue';

import { COLORS, SPACER } from '@/constants';
import InputComponent from '@/components/InputComponent/InputComponent.vue';
import LinkButton from '@/components/LinkButtonComponent/LinkButtonComponent.vue';
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

const state: ComponentState = reactive({
  formError: '',
  loading: false,
  login: '',
  password: '',
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

const handleSubmit = async (): Promise<void> => {
  state.formError = 'error';
  state.loading = true;
  return;
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
