import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';

import App from './App.jsx';

const getDisciplineTabList = () => screen.getAllByRole('tablist')
  .find((list) => within(list).queryByRole('tab', { name: 'Dota 2.Main' }));

describe('App game discipline switcher', () => {
  it('renders one section with Dota 2.Main tab active by default', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Игровые дисциплины' })).toBeInTheDocument();

    const tabList = getDisciplineTabList();
    const dotaMainTab = within(tabList).getByRole('tab', { name: 'Dota 2.Main' });
    const dotaQualTab = within(tabList).getByRole('tab', { name: 'DotA 2.Qual' });
    const cs2Tab = within(tabList).getByRole('tab', { name: 'CS2' });

    expect(dotaMainTab).toHaveAttribute('aria-selected', 'true');
    expect(dotaQualTab).toHaveAttribute('aria-selected', 'false');
    expect(cs2Tab).toHaveAttribute('aria-selected', 'false');

    expect(document.getElementById('panel-dota2-main')).not.toHaveAttribute('hidden');
    expect(document.getElementById('panel-dota2-qual')).toHaveAttribute('hidden');
    expect(document.getElementById('panel-cs2')).toHaveAttribute('hidden');
  });

  it('switches between Dota 2.Main, DotA 2.Qual and CS2 independently', () => {
    render(<App />);

    const tabList = getDisciplineTabList();
    const dotaMainTab = within(tabList).getByRole('tab', { name: 'Dota 2.Main' });
    const dotaQualTab = within(tabList).getByRole('tab', { name: 'DotA 2.Qual' });
    const cs2Tab = within(tabList).getByRole('tab', { name: 'CS2' });

    fireEvent.click(dotaQualTab);

    expect(document.getElementById('panel-dota2-qual')).not.toHaveAttribute('hidden');
    expect(document.getElementById('panel-dota2-main')).toHaveAttribute('hidden');
    expect(document.getElementById('panel-cs2')).toHaveAttribute('hidden');
    expect(within(document.getElementById('panel-dota2-qual')).getByRole('heading', { name: 'DotA 2.Qual' })).toBeInTheDocument();

    fireEvent.click(cs2Tab);

    expect(document.getElementById('panel-cs2')).not.toHaveAttribute('hidden');
    expect(document.getElementById('panel-dota2-main')).toHaveAttribute('hidden');
    expect(document.getElementById('panel-dota2-qual')).toHaveAttribute('hidden');

    expect(within(document.getElementById('panel-cs2')).getByRole('heading', { name: 'Counter Strike 2' })).toBeInTheDocument();

    fireEvent.click(dotaMainTab);

    expect(document.getElementById('panel-dota2-main')).not.toHaveAttribute('hidden');
    expect(document.getElementById('panel-dota2-qual')).toHaveAttribute('hidden');
    expect(document.getElementById('panel-cs2')).toHaveAttribute('hidden');
    expect(within(document.getElementById('panel-dota2-main')).getByRole('heading', { name: 'Dota 2.Main' })).toBeInTheDocument();
  });

  it('renders group stage in Dota 2.Main and roster gallery in DotA 2.Qual and CS2 sections', () => {
    render(<App />);

    const tabList = getDisciplineTabList();
    fireEvent.click(within(tabList).getByRole('tab', { name: 'Dota 2.Main' }));
    expect(within(document.getElementById('panel-dota2-main')).getByRole('heading', { name: 'Групповой этап' })).toBeInTheDocument();

    fireEvent.click(within(tabList).getByRole('tab', { name: 'DotA 2.Qual' }));
    expect(within(document.getElementById('panel-dota2-qual')).getAllByRole('heading', { name: 'Галерея ростеров' })).toHaveLength(1);

    fireEvent.click(within(tabList).getByRole('tab', { name: 'CS2' }));

    expect(within(document.getElementById('panel-cs2')).getAllByRole('heading', { name: 'Галерея ростеров' })).toHaveLength(1);
    expect(within(document.getElementById('panel-cs2')).getByRole('heading', { name: 'Результаты последних матчей' })).toBeInTheDocument();
  });
});
