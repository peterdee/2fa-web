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
  accessDenied: 'Access denied!',
  generic: 'Something went wrong...',
  invalidData: 'Provided data is invalid!',
  loginIsAlreadyInUse: 'Login is already in use!',
  loginIsTooLong: 'Login is too long!',
  loginShouldBeAlphanumeric: 'Login should be alphanumeric!',
  missingData: 'Required data is missing!',
  passwordContainsSpaces: 'Password contains spaces!',
  passwordIsTooShort: 'Password is too short!',
  pleaseProvideRequiredData: 'Please provide required data!',
  recoveryAnswerIsInvalid: 'Recovery answer is invalid!',
};

export const LOGIN_MAX_LENGTH = 16;

export const PASSWORD_MIN_LENGTH = 8;

export const RESPONSE_MESSAGES = {
  invalidData: 'INVALID_DATA',
  invalidLogin: 'INVALID_LOGIN',
  loginAlreadyInUse: 'LOGIN_ALREADY_IN_USE',
  loginIsTooLong: 'LOGIN_IS_TOO_LONG',
  missingData: 'MISSING_DATA',
  passwordContainsSpaces: 'PASSWORD_CONTAINS_SPACES',
  passwordIsTooShort: 'PASSWORD_IS_TOO_SHORT',
};

export const SPACER = 16;
