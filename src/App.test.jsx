import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import App from './App.jsx';

describe('App game discipline blocks', () => {
  it('renders Dota 2 collapsed and Counter Strike 2 expanded by default', () => {
    render(<App />);

    const dotaToggle = screen.getAllByRole('button', { name: /Развернуть|Свернуть/ })
      .find((button) => button.getAttribute('aria-controls') === 'dota-2-content');

    expect(dotaToggle).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Dota 2' })).toBeInTheDocument();
    expect(document.getElementById('dota-2-content')).toHaveAttribute('hidden');

    expect(screen.getByRole('heading', { name: 'Counter Strike 2' })).toBeInTheDocument();
    expect(document.getElementById('counter-strike-2-content')).not.toHaveAttribute('hidden');
  });

  it('toggles game discipline blocks independently', () => {
    render(<App />);

    const toggles = screen.getAllByRole('button', { name: /Развернуть|Свернуть/ });
    const dotaToggle = toggles.find((button) => button.getAttribute('aria-controls') === 'dota-2-content');
    const cs2Toggle = toggles.find((button) => button.getAttribute('aria-controls') === 'counter-strike-2-content');

    fireEvent.click(dotaToggle);
    expect(document.getElementById('dota-2-content')).not.toHaveAttribute('hidden');

    fireEvent.click(cs2Toggle);
    expect(document.getElementById('counter-strike-2-content')).toHaveAttribute('hidden');
  });

  it('shows roster gallery inside both game blocks', () => {
    render(<App />);

    const toggles = screen.getAllByRole('button', { name: /Развернуть|Свернуть/ });
    const dotaToggle = toggles.find((button) => button.getAttribute('aria-controls') === 'dota-2-content');
    fireEvent.click(dotaToggle);

    const galleries = screen.getAllByRole('heading', { name: 'Галерея ростеров' });
    expect(galleries).toHaveLength(2);
  });
});
