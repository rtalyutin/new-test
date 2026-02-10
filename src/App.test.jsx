import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';

import App from './App.jsx';

const getDisciplineTabList = () => screen.getAllByRole('tablist')
  .find((list) => within(list).queryByRole('tab', { name: 'Dota2' }));

describe('App game discipline switcher', () => {
  it('renders one section with Dota2 tab active by default', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Игровые дисциплины' })).toBeInTheDocument();

    const tabList = getDisciplineTabList();
    const dotaTab = within(tabList).getByRole('tab', { name: 'Dota2' });
    const cs2Tab = within(tabList).getByRole('tab', { name: 'CS2' });

    expect(dotaTab).toHaveAttribute('aria-selected', 'true');
    expect(cs2Tab).toHaveAttribute('aria-selected', 'false');

    expect(document.getElementById('panel-dota2')).not.toHaveAttribute('hidden');
    expect(document.getElementById('panel-cs2')).toHaveAttribute('hidden');
  });

  it('switches between Dota2 and CS2 independently', () => {
    render(<App />);

    const tabList = getDisciplineTabList();
    const cs2Tab = within(tabList).getByRole('tab', { name: 'CS2' });
    fireEvent.click(cs2Tab);

    expect(document.getElementById('panel-cs2')).not.toHaveAttribute('hidden');
    expect(document.getElementById('panel-dota2')).toHaveAttribute('hidden');

    expect(within(document.getElementById('panel-cs2')).getByRole('heading', { name: 'Counter Strike 2' })).toBeInTheDocument();

    const dotaTab = within(tabList).getByRole('tab', { name: 'Dota2' });
    fireEvent.click(dotaTab);

    expect(document.getElementById('panel-dota2')).not.toHaveAttribute('hidden');
    expect(document.getElementById('panel-cs2')).toHaveAttribute('hidden');
    expect(within(document.getElementById('panel-dota2')).getByRole('heading', { name: 'Dota 2' })).toBeInTheDocument();
  });

  it('renders roster gallery in both Dota2 and CS2 sections', () => {
    render(<App />);

    expect(within(document.getElementById('panel-dota2')).getAllByRole('heading', { name: 'Галерея ростеров' })).toHaveLength(1);

    const tabList = getDisciplineTabList();
    fireEvent.click(within(tabList).getByRole('tab', { name: 'CS2' }));

    expect(within(document.getElementById('panel-cs2')).getAllByRole('heading', { name: 'Галерея ростеров' })).toHaveLength(1);
  });
});
