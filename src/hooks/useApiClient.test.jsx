import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

import PropTypes from 'prop-types';

import { AuthContext } from '../context/AuthContext.jsx';
import useApiClient from './useApiClient.js';

const navigateMock = vi.fn();
const locationMock = { pathname: '/secure', search: '?q=1', hash: '#top' };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useLocation: () => locationMock,
  };
});

const createWrapper = (contextValue) => {
  const ProviderWrapper = ({ children }) => (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );

  ProviderWrapper.displayName = 'ProviderWrapper';
  ProviderWrapper.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return ProviderWrapper;
};

describe('useApiClient', () => {
  const originalEnv = { ...import.meta.env };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn());
    import.meta.env.VITE_API_BASE_URL = originalEnv.VITE_API_BASE_URL;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    import.meta.env.VITE_API_BASE_URL = originalEnv.VITE_API_BASE_URL;
  });

  it('adds Authorization header when token is present', async () => {
    fetch.mockResolvedValueOnce({ ok: true, status: 200 });
    const signOut = vi.fn();
    const { result } = renderHook(() => useApiClient(), {
      wrapper: createWrapper({ token: 'token-123', setToken: vi.fn(), signOut }),
    });

    await result.current('/api/protected', { method: 'GET' });

    const headers = fetch.mock.calls[0][1].headers;
    expect(headers.get('Authorization')).toBe('Bearer token-123');
    expect(signOut).not.toHaveBeenCalled();
  });

  it('skips Authorization header when skipAuth is true', async () => {
    fetch.mockResolvedValueOnce({ ok: true, status: 200 });
    const signOut = vi.fn();
    const { result } = renderHook(() => useApiClient(), {
      wrapper: createWrapper({ token: 'token-123', setToken: vi.fn(), signOut }),
    });

    await result.current('/api/public', { method: 'GET', skipAuth: true });

    const headers = fetch.mock.calls[0][1].headers;
    expect(headers.get('Authorization')).toBeNull();
    expect(signOut).not.toHaveBeenCalled();
  });

  it('resolves request URL with provided base API env', async () => {
    import.meta.env.VITE_API_BASE_URL = 'https://api.example.com';
    fetch.mockResolvedValueOnce({ ok: true, status: 200 });
    const signOut = vi.fn();
    const { result } = renderHook(() => useApiClient(), {
      wrapper: createWrapper({ token: 'token-123', setToken: vi.fn(), signOut }),
    });

    await result.current('/api/protected', { method: 'GET' });

    const [requestUrl] = fetch.mock.calls[0];
    expect(requestUrl).toBeInstanceOf(URL);
    expect(requestUrl.href).toBe('https://api.example.com/api/protected');
  });

  it('falls back to window origin when base API env is not set', async () => {
    import.meta.env.VITE_API_BASE_URL = undefined;
    fetch.mockResolvedValueOnce({ ok: true, status: 200 });
    const signOut = vi.fn();
    const { result } = renderHook(() => useApiClient(), {
      wrapper: createWrapper({ token: 'token-123', setToken: vi.fn(), signOut }),
    });

    await result.current('/api/public', { method: 'GET' });

    const [requestUrl] = fetch.mock.calls[0];
    expect(requestUrl).toBeInstanceOf(URL);
    expect(requestUrl.href).toBe(new URL('/api/public', window.location.href).href);
  });

  it('signs out and navigates to auth on 401 responses', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 401 });
    const signOut = vi.fn();
    const { result } = renderHook(() => useApiClient(), {
      wrapper: createWrapper({ token: 'expired-token', setToken: vi.fn(), signOut }),
    });

    const response = await result.current('/api/protected', { method: 'GET' });

    expect(response.status).toBe(401);
    expect(signOut).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('/auth', {
      replace: true,
      state: {
        from: locationMock,
        authNotice: 'Ваша сессия истекла. Авторизуйтесь снова.',
      },
    });
  });
});
