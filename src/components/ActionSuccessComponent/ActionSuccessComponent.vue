<script setup lang="ts">
interface AuthErrorComponentProps {
  message: string;
}

defineProps<AuthErrorComponentProps>();
</script>

<template>
  <div class="success-block">
    <div
      v-if="message"
      class="success-content noselect"
    >
      {{ message }}
    </div>
  </div>
</template>

<style scoped>
.success-block {
  align-items: center;
  display: flex;
  height: calc(var(--spacer) * 3);
  justify-content: center;
  width: 100%;
}
.success-content {
  color: var(--positive);
  font-size: var(--spacer);
  text-align: center;
}
</style>
