import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import AppRoutes from './AppRoutes.jsx';

const renderRoutes = (initialPath) =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AppRoutes />
    </MemoryRouter>,
  );

describe('AppRoutes', () => {
  it('redirects /karaoke to home page', async () => {
    renderRoutes('/karaoke');

    expect((await screen.findAllByText('ЯрКиберСезон 25/26')).length).toBeGreaterThan(0);
  });

  it('redirects /auth to home page', async () => {
    renderRoutes('/auth');

    expect((await screen.findAllByText('ЯрКиберСезон 25/26')).length).toBeGreaterThan(0);
  });

  it('keeps dashboard route public', async () => {
    renderRoutes('/dashboard');

    expect(await screen.findByText('Открытый раздел')).toBeInTheDocument();
    expect(screen.getByText('Раздел доступен всем пользователям без авторизации.')).toBeInTheDocument();
  });
});
