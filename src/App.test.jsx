import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';

import App from './App.jsx';

const getDisciplineTabList = () => screen.getAllByRole('tablist')
  .find((list) => within(list).queryByRole('tab', { name: 'Dota2' }));

describe('App game discipline switcher', () => {
  it('renders one section with CS2 tab active by default', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Игровые дисциплины' })).toBeInTheDocument();

    const tabList = getDisciplineTabList();
    const dotaTab = within(tabList).getByRole('tab', { name: 'Dota2' });
    const cs2Tab = within(tabList).getByRole('tab', { name: 'CS2' });

    expect(dotaTab).toHaveAttribute('aria-selected', 'false');
    expect(cs2Tab).toHaveAttribute('aria-selected', 'true');

    expect(document.getElementById('panel-dota2')).toHaveAttribute('hidden');
    expect(document.getElementById('panel-cs2')).not.toHaveAttribute('hidden');
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

    const tabList = getDisciplineTabList();
    fireEvent.click(within(tabList).getByRole('tab', { name: 'Dota2' }));

    expect(within(document.getElementById('panel-dota2')).getAllByRole('heading', { name: 'Галерея ростеров' })).toHaveLength(1);

    fireEvent.click(within(tabList).getByRole('tab', { name: 'CS2' }));

    expect(within(document.getElementById('panel-cs2')).getAllByRole('heading', { name: 'Галерея ростеров' })).toHaveLength(1);
    expect(within(document.getElementById('panel-cs2')).getByRole('heading', { name: 'Результаты последних матчей' })).toBeInTheDocument();
  });
});
