import totp from 'totp-generator';

import type { StoredSecretEntry } from '@/types/models';

type TOTPOptions = Pick<StoredSecretEntry, 'algorithm' | 'digits' | 'period'>;

export async function generateToken(entry: StoredSecretEntry): Promise<null | number> {
  if (!(entry && entry.secret)) {
    return null;
  }

  const options = {} as TOTPOptions;
  if (entry.algorithm) options.algorithm = entry.algorithm;
  if (entry.digits) options.digits = entry.digits;
  if (entry.period) options.period = entry.period;

  const token = totp(entry.secret, options);

  // prevent the issue with invalid token using recursive token generating
  if (entry.digits && (`${token}`.length !== Number(entry.digits))) {
    await new Promise((resolve: (value: unknown) => void): void => {
      setTimeout(resolve, 500);
    });
    return generateToken(entry);
  }

  return Number(token);
}

export function getTimeLeft(period = 30): number {
  return period - (Math.round(Date.now() / 1000) % period);
}
