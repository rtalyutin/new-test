const DEFAULT_ENDPOINTS = {
  SIGN_IN: '/api/auth/sign-in',
  JOB_STATUS: '/api/karaoke-tracks/tasks',
  CREATE_TASK_FROM_URL: '/api/karaoke-tracks/create-task-from-url',
  CREATE_TASK_FROM_FILE: '/api/karaoke-tracks/create-task-from-file',
};

const hasValue = (value) => value !== undefined && value !== null && value !== 'undefined';

const ENV_KEYS = {
  SIGN_IN: 'VITE_SIGN_IN_ENDPOINT',
  JOB_STATUS: 'VITE_JOB_STATUS_ENDPOINT',
  CREATE_TASK_FROM_URL: 'VITE_CREATE_TASK_URL',
  CREATE_TASK_FROM_FILE: 'VITE_CREATE_TASK_FILE',
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
  get JOB_STATUS() {
    return getApiEndpoint('JOB_STATUS');
  },
  get CREATE_TASK_FROM_URL() {
    return getApiEndpoint('CREATE_TASK_FROM_URL');
  },
  get CREATE_TASK_FROM_FILE() {
    return getApiEndpoint('CREATE_TASK_FROM_FILE');
  },
};

export default API_ENDPOINTS;
