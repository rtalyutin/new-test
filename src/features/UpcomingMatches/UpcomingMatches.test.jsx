import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';

import UpcomingMatches from './UpcomingMatches.jsx';

describe('UpcomingMatches', () => {
  it('sorts matches by start datetime from earliest to latest', () => {
    const data = {
      title: 'Расписание ближайших матчей',
      tags: ['cs2'],
      channelPresets: {},
      matches: [
        {
          id: 'late',
          dayLabel: 'пт',
          timeLabel: '22:00',
          dateTime: '2026-02-13T22:00:00+03:00',
          teams: { home: 'A', away: 'B' },
          channelIds: [],
        },
        {
          id: 'early',
          dayLabel: 'чт',
          timeLabel: '18:00',
          dateTime: '2026-02-12T18:00:00+03:00',
          teams: { home: 'C', away: 'D' },
          channelIds: [],
        },
      ],
    };

    render(<UpcomingMatches data={data} />);

    const list = screen.getByRole('list');
    const dateTimes = within(list)
      .getAllByText(/\d{2}:\d{2}/)
      .map((timeElement) => timeElement.getAttribute('dateTime'));

    expect(dateTimes).toEqual([
      '2026-02-12T18:00:00+03:00',
      '2026-02-13T22:00:00+03:00',
    ]);
  });
});
