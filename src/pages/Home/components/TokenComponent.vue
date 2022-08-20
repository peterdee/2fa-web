<script setup lang="ts">
import { onMounted, reactive } from 'vue';

import { generateToken, getTimeLeft } from '@/utilities/otp';
import type { StoredSecretEntry } from '@/types/models';

interface ComponentProps {
  entry: StoredSecretEntry;
}

interface ComponentState {
  token: number | null;
  timeLeft: number;
}

const props = defineProps<ComponentProps>();
const state = reactive<ComponentState>({
  token: null,
  timeLeft: getTimeLeft(props.entry.period),
});

async function refreshToken(entry: StoredSecretEntry): Promise<void> {
  state.token = await generateToken(entry);
}

setInterval(
  (): void => {
    const { entry } = props;
    state.timeLeft = getTimeLeft(entry.period);
    refreshToken(entry);
  },
  1000,
);

onMounted((): Promise<void> => refreshToken(props.entry));
</script>

<template>
  <div class="flex header-width justify-space-between">
    <div class="flex direction-column">
      <div class="issuer-text">
        {{ entry.issuer }}
      </div>
      <div class="account-text">
        {{ entry.accountName }}
      </div>
      <div class="token-text">
        {{ state.token }}
      </div>
    </div>
    <div class="time-left">
      {{ state.timeLeft }}
    </div>
  </div>
</template>

<style scoped>

</style>
