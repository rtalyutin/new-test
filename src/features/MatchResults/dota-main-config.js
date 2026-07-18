import dotaMatchResultsConfig from './config.json';

const DOTA_MAIN_ROUNDS = new Set(['Результаты 1-го тура']);

const dotaMainMatchResultsConfig = {
  ...dotaMatchResultsConfig,
  rounds: [
    ...dotaMatchResultsConfig.rounds.filter((round) => DOTA_MAIN_ROUNDS.has(round.title)),
    {
      id: 'dota-main-playoff-results',
      title: 'Плей-офф. Результаты',
      subtitle: 'Плей-офф',
      defaultExpanded: false,
      weeks: [
        {

          id: 'dota-main-playoff-matches',
          title: 'Плей-офф · Матчи',
          matches: [
            {
              id: '2026-04-26-wayprod-tech-titans-playoff',
              dateLabel: '26 апр',
              dateTime: '2026-04-26T20:00:00+03:00',
              stage: 'BO5 · Россия',
              teams: { home: 'Wayprod.', away: 'Tech Titans' },
              score: { home: 3, away: 0 },
              bestOf: 5,
              status: 'finished',
              statusLabel: '3–0 · завершён',
              detailsUrl: 'https://example.com/dota-main-2026-04-26-wayprod-tech-titans-playoff',

              detailsLabel: 'Смотреть повтор',
              winner: 'home',
            },
            {

              id: '2026-04-19-samozvancy-japan-playoff',
              dateLabel: '19 апр',
              dateTime: '2026-04-19T20:00:00+03:00',
              stage: 'BO5 · Россия',
              teams: { home: 'Самозванцы', away: 'Japan' },
              score: { home: 3, away: 1 },
              bestOf: 5,
              status: 'finished',
              statusLabel: '3–1 · завершён',
              detailsUrl: 'https://example.com/dota-main-2026-04-19-samozvancy-japan-playoff',
              detailsLabel: 'Смотреть повтор',
              winner: 'home',
            },
            {
              id: '2026-04-15-samozvancy-buyback-academy-playoff',
              dateLabel: '15 апр',
              dateTime: '2026-04-15T20:00:00+03:00',
              stage: 'BO2 · Россия',
              teams: { home: 'Самозванцы', away: 'Buyback Academy' },
              score: { home: 2, away: 0 },
              bestOf: 2,
              status: 'finished',
              statusLabel: '2–0 · завершён',
              detailsUrl: 'https://example.com/dota-main-2026-04-15-samozvancy-buyback-academy-playoff',
              detailsLabel: 'Смотреть повтор',
              winner: 'home',
            },
            {
              id: '2026-04-20-tech-titans-team-borisogleb-playoff',
              dateLabel: '20 апр',
              dateTime: '2026-04-20T20:00:00+03:00',
              stage: 'BO3 · Европа',
              teams: { home: 'Tech Titans', away: 'Team Borisogleb' },
              score: { home: 2, away: 1 },
              bestOf: 3,
              status: 'finished',
              statusLabel: '2–1 · завершён',
              detailsUrl: 'https://example.com/dota-main-2026-04-20-tech-titans-team-borisogleb-playoff',
              detailsLabel: 'Смотреть повтор',
              winner: 'home',
            },
            {
              id: '2026-04-26-wayprod-synergia-playoff',
              dateLabel: '26 апр',
              dateTime: '2026-04-26T18:00:00+03:00',
              stage: 'BO2 · Россия',
              teams: { home: 'Wayprod.', away: 'Синергия' },
              score: { home: 2, away: 0 },
              bestOf: 2,
              status: 'finished',
              statusLabel: '2–0 · завершён',
              detailsUrl: 'https://example.com/dota-main-2026-04-26-wayprod-synergia-playoff',

              detailsLabel: 'Смотреть повтор',
              winner: 'home',
            },
            {

              id: '2026-04-22-japan-mi-ne-pushim-playoff',
              dateLabel: '22 апр',
              dateTime: '2026-04-22T20:00:00+03:00',
              stage: 'BO2 · Россия',
              teams: { home: 'Japan', away: 'Mi ne pushim' },
              score: { home: 2, away: 0 },
              bestOf: 2,
              status: 'finished',
              statusLabel: '2–0 · завершён',
              detailsUrl: 'https://example.com/dota-main-2026-04-22-japan-mi-ne-pushim-playoff',
              detailsLabel: 'Смотреть повтор',
              winner: 'home',
            },

          ],
        },
      ],
    },
  ],
};

export default dotaMainMatchResultsConfig;
