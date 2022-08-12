<script setup lang="ts">
import { reactive } from 'vue';

import InputComponent from '@/components/InputComponent/InputComponent.vue';
import { SPACER } from '@/constants';

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

const handleInput = (event: Event): void => {
  const { name = '', value = '' } = event.target as HTMLInputElement;
  const typedName = name as InputNames;
  state[typedName] = value;
  state.formError = '';
};

const handleSubmit = async (): Promise<void> => {
  state.formError = 'error';
  return;
};
</script>

<template>
  <div class="wrap">
    <h1>
      Sign in page
    </h1>
    <form
      class="form"
      @submit.prevent="handleSubmit"
    >
      <InputComponent
        :custom-styles="{ marginTop: `${SPACER}px` }"
        :handleInput="handleInput"
        :name="'login'"
        :placeholder="'Login'"
        :type="'text'"
        :value="state.login"
      />
      <InputComponent
        :custom-styles="{ marginTop: `${SPACER}px` }"
        :handleInput="handleInput"
        :name="'password'"
        :placeholder="'Password'"
        :type="'password'"
        :value="state.password"
      />
      <div class="error-block">
        <div
          v-if="! state.formError"
          class="error-content"
        >
          {{ state.formError }}
        </div>
      </div>
      <button
        class="mt-1"
        type="submit"
      >
        Sign In
      </button>
    </form>
  </div>
</template>

<style scoped>
.form, .wrap {
  display: flex;
  flex-direction: column;
}
.form {
  max-width: calc(var(--spacer) * 20);
}
</style>
