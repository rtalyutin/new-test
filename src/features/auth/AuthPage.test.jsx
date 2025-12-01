import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext.jsx';
import AuthPage from './AuthPage.jsx';
import KaraokePage from '../karaoke/KaraokePage.jsx';

const renderAuth = (contextValue) =>
  render(
    <AuthContext.Provider value={contextValue}>
      <MemoryRouter initialEntries={['/auth']}>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/karaoke" element={<KaraokePage />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );

describe('AuthPage', () => {
  const setToken = vi.fn();
  const signOut = vi.fn();
  const baseContext = { token: null, setToken, signOut };
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

  it('navigates to karaoke and shows success notice after successful sign in', async () => {
    import.meta.env.VITE_API_BASE_URL = 'https://api.example.com';
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ token: 'sample-token' }),
    });

    renderAuth(baseContext);

    fireEvent.change(screen.getByPlaceholderText('Введите логин'), {
      target: { value: 'demo' },
    });
    fireEvent.change(screen.getByPlaceholderText('Введите пароль'), {
      target: { value: 'secret' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => expect(setToken).toHaveBeenCalledWith('sample-token', { remember: true }));

    const [requestUrl] = fetch.mock.calls[0];
    expect(requestUrl).toBeInstanceOf(URL);
    expect(requestUrl.href).toBe('https://api.example.com/api/auth/sign-in');

    expect(await screen.findByText('Вы успешно вошли в систему')).toBeInTheDocument();
    expect(screen.getByText('Караоке доступно всем')).toBeInTheDocument();
  });

  it('shows friendly server error and keeps form active', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: 'Internal server error' }),
    });

    renderAuth(baseContext);

    fireEvent.change(screen.getByPlaceholderText('Введите логин'), {
      target: { value: 'demo' },
    });
    fireEvent.change(screen.getByPlaceholderText('Введите пароль'), {
      target: { value: 'secret' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

    expect(
      await screen.findByText('Internal server error'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Войти' })).toBeEnabled();
    expect(screen.getByPlaceholderText('Введите логин')).toHaveValue('demo');
  });
});
