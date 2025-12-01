import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';

const AUTH_NOTICE_MESSAGE = 'Ваша сессия истекла. Авторизуйтесь снова.';

const toHeaders = (headers) => {
  if (headers instanceof Headers) {
    return headers;
  }

  return new Headers(headers ?? {});
};

const serializeLocation = (location) => ({
  pathname: location.pathname,
  search: location.search,
  hash: location.hash,
});

const getBaseUrl = () => {
  const envBase = import.meta.env.VITE_API_BASE_URL;

  if (envBase) {
    return envBase;
  }

  if (typeof window !== 'undefined' && window.location?.origin && window.location.origin !== 'null') {
    return window.location.origin;
  }

  return 'http://localhost';
};

export const useApiClient = () => {
  const { token, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const baseUrl = getBaseUrl();

  return useCallback(
    async (input, options = {}) => {
      const { skipAuth = false, ...fetchOptions } = options;
      const headers = toHeaders(fetchOptions.headers);

      if (!skipAuth && token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      const fallbackBaseUrl =
        typeof window !== 'undefined' && window.location?.href ? window.location.href : 'http://localhost';

      let requestUrl;

      try {
        requestUrl = new URL(input, baseUrl);
      } catch {
        requestUrl = new URL(input, fallbackBaseUrl);
      }

      const response = await fetch(requestUrl, {
        ...fetchOptions,
        headers,
      });

      if (response.status === 401 && !skipAuth) {
        signOut();
        navigate('/auth', {
          replace: true,
          state: {
            from: serializeLocation(location),
            authNotice: AUTH_NOTICE_MESSAGE,
          },
        });
      }

      return response;
    },
    [location, navigate, signOut, token],
  );
};

export default useApiClient;
