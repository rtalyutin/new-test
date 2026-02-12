import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';

import UpcomingMatches from './UpcomingMatches.jsx';
import config from './config.json';

describe('UpcomingMatches', () => {
  it('sorts matches by start datetime from earliest to latest', () => {
    render(<UpcomingMatches data={config} />);

    const list = screen.getByRole('list');
    const dateTimes = within(list)
      .getAllByText(/\d{2}:\d{2}/)
      .map((timeElement) => timeElement.getAttribute('dateTime'));

    expect(dateTimes).toEqual([
      '2026-02-12T18:00:00+03:00',
      '2026-02-12T19:00:00+03:00',
      '2026-02-12T21:00:00+03:00',
      '2026-02-13T20:00:00+03:00',
      '2026-02-13T22:00:00+03:00',
    ]);
  });
});
