const DEFAULT_ENDPOINTS = {
  SIGN_IN: '/api/auth/sign-in',
};

const hasValue = (value) => value !== undefined && value !== null && value !== 'undefined';

const ENV_KEYS = {
  SIGN_IN: 'VITE_SIGN_IN_ENDPOINT',
};

export const getApiEndpoint = (key) => {
  const envKey = ENV_KEYS[key];
  const envValue = envKey ? import.meta.env[envKey] : undefined;

  return hasValue(envValue) ? envValue : DEFAULT_ENDPOINTS[key] ?? '';
};

export const API_ENDPOINTS = {
  get SIGN_IN() {
    return getApiEndpoint('SIGN_IN');
  },
};

export default API_ENDPOINTS;
