export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:2244';

export const CLIENT_TYPE = 'web';

export const COLORS = {
  accent: '#2244FF',
  accentLight: '#4488FF',
  background: '#FFFFFF',
  muted: '#A0A0A0',
  mutedDark: '#686868',
  mutedLight: '#EAEAEA',
  negative: '#BF1725',
  positive: '#259F37',
  text: '#080808',
  textInverted: '#FFFFFF',
  warning: '#DD8834',
};

export const ERROR_MESSAGES = {
  generic: 'Something went wrong...',
  pleaseProvideRequiredData: 'Please provide required data!',
};

export const SPACER = 16;
