<script setup lang="ts">
import { onMounted, reactive } from 'vue';

import formatDate from '@/utilities/format-date';
import { generateToken, getTimeLeft } from '@/utilities/otp';
import type { StoredSecretEntry } from '@/types/models';

interface ComponentProps {
  entry: StoredSecretEntry;
  withBorder: boolean;
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
  <div
    :class="[
      'flex justify-space-between mt-1',
      withBorder ? 'with-border' : '',
    ]"
  >
    <div class="flex direction-column">
      <div class="issuer-text">
        {{ entry.issuer }}
      </div>
      <div class="account-text">
        {{ entry.accountName }}
      </div>
      <div class="dates-text noselect">
        Scanned: {{ formatDate(entry.scannedAt) }}
      </div>
      <div class="dates-text noselect">
        Synchronized: {{ formatDate(entry.synchronizedAt) }}
      </div>
      <div class="token-text">
        {{ state.token }}
      </div>
    </div>
    <div
      :class="[
        'flex direction-column justify-end time-left noselect',
        state.timeLeft < 10 ? 'time-out' : '',
      ]"
    >
      {{ state.timeLeft }}
    </div>
  </div>
</template>

<style scoped>
.with-border {
  border-bottom: 1px solid var(--muted-light);
}
.issuer-text {
  color: var(--text);
  font-size: calc(var(--spacer) + var(--spacer-half) / 2);
  font-weight: 200;
}
.account-text, .dates-text {
  color: var(--muted-dark);
  font-size: calc(var(--spacer) - var(--spacer-half) / 2);
  font-weight: 300;
}
.dates-text {
  color: var(--muted);
  font-weight: 200;
}
.time-left, .token-text {
  font-size: calc(var(--spacer) + var(--spacer-half) + var(--spacer-half) / 2);
  font-weight: 200;
}
.time-out {
  color: var(--negative);
}
</style>
