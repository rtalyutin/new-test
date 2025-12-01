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

export const useApiClient = () => {
  const { token, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    async (input, options = {}) => {
      const { skipAuth = false, ...fetchOptions } = options;
      const headers = toHeaders(fetchOptions.headers);

      if (!skipAuth && token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      const response = await fetch(input, {
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
