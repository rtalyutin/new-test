import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext.js';

export const prepareRequestInit = (init = {}, token) => {
  const headers = new Headers(init.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return { ...init, headers };
};

export const useApiClient = () => {
  const { token } = useAuth();

  return useCallback(
    (input, init = {}) => {
      const requestInit = prepareRequestInit(init, token);
      return fetch(input, requestInit);
    },
    [token],
  );
};

export default useApiClient;
