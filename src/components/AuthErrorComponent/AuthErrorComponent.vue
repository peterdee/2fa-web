<script setup lang="ts">
interface AuthErrorComponentProps {
  message: string;
}

defineProps<AuthErrorComponentProps>();
</script>

<template>
  <div class="error-block">
    <div
      v-if="message"
      class="error-content"
    >
      {{ message }}
    </div>
  </div>
</template>

<style scoped>
.error-block {
  align-items: center;
  display: flex;
  height: calc(var(--spacer) * 3);
  justify-content: center;
  width: 100%;
}
.error-content {
  color: var(--negative);
  font-size: var(--spacer);
  text-align: center;
}
</style>
