import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import ProtectedRoute from './ProtectedRoute.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

const renderWithAuth = (token) => {
  const contextValue = {
    token,
    setToken: vi.fn(),
    signOut: vi.fn(),
  };

  render(
    <AuthContext.Provider value={contextValue}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Secured content</div>} />
          </Route>
          <Route path="/auth" element={<div>Auth fallback</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
};

describe('ProtectedRoute', () => {
  it('redirects to auth page when token is missing', () => {
    renderWithAuth(null);

    expect(screen.getByText('Auth fallback')).toBeInTheDocument();
    expect(screen.queryByText('Secured content')).toBeNull();
  });

  it('renders child route when token is present', () => {
    renderWithAuth('token-value');

    expect(screen.getByText('Secured content')).toBeInTheDocument();
  });
});
