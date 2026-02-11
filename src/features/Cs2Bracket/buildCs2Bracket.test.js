import { describe, expect, it } from 'vitest';
import { buildCs2Bracket } from './buildCs2Bracket.js';

const createPlayoffMatch = (playoffMatchId, home, away, homeScore, awayScore, winner) => ({
  status: 'finished',
  playoffMatchId,
  teams: { home, away },
  score: { home: homeScore, away: awayScore },
  winner,
});

const createSwissMatch = (home, away, homeScore, awayScore) => ({
  status: 'finished',
  teams: { home, away },
  score: { home: homeScore, away: awayScore },
});

const baseResults = {
  rounds: [
    {
      weeks: [
        {
          matches: [
            createSwissMatch('Team A', 'Team H', 1, 0),
            createSwissMatch('Team B', 'Team G', 1, 0),
            createSwissMatch('Team C', 'Team F', 1, 0),
            createSwissMatch('Team D', 'Team E', 1, 0),
          ],
        },
      ],
    },
  ],
};

describe('buildCs2Bracket', () => {
  it('формирует пары 1-8, 2-7, 3-6, 4-5 на основе таблицы', () => {
    const bracket = buildCs2Bracket(baseResults);

    expect(bracket.upperQuarterfinals[0].top).toBe('Team A');
    expect(bracket.upperQuarterfinals[0].bottom).toBe('Team H');
    expect(bracket.upperQuarterfinals[1].top).toBe('Team B');
    expect(bracket.upperQuarterfinals[1].bottom).toBe('Team G');
    expect(bracket.upperQuarterfinals[2].top).toBe('Team C');
    expect(bracket.upperQuarterfinals[2].bottom).toBe('Team F');
    expect(bracket.upperQuarterfinals[3].top).toBe('Team D');
    expect(bracket.upperQuarterfinals[3].bottom).toBe('Team E');
  });

  it('подтягивает сыгранный матч плей-офф по playoffMatchId', () => {
    const resultsWithPlayoff = {
      rounds: [
        ...baseResults.rounds,
        {
          weeks: [
            {
              matches: [
                createPlayoffMatch('G1', 'Team A', 'Team H', 1, 0, 'home'),
              ],
            },
          ],
        },
      ],
    };

    const bracket = buildCs2Bracket(resultsWithPlayoff);

    expect(bracket.upperQuarterfinals[0].score).toBe('1:0');
    expect(bracket.upperQuarterfinals[0].winner).toBe('Team A');
    expect(bracket.upperQuarterfinals[0].loser).toBe('Team H');
    expect(bracket.upperSemifinals[0].top).toBe('Team A');
    expect(bracket.lowerRound1[0].top).toBe('Team H');
  });



  it('не учитывает результаты плей-офф при расчёте посева', () => {
    const resultsWithPlayoff = {
      rounds: [
        ...baseResults.rounds,
        {
          weeks: [
            {
              matches: [
                createPlayoffMatch('G1', 'Team H', 'Team A', 2, 0, 'home'),
                createPlayoffMatch('G2', 'Team G', 'Team B', 2, 0, 'home'),
              ],
            },
          ],
        },
      ],
    };

    const bracket = buildCs2Bracket(resultsWithPlayoff);

    expect(bracket.upperQuarterfinals[2].top).toBe('Team C');
    expect(bracket.upperQuarterfinals[2].bottom).toBe('Team F');
    expect(bracket.upperQuarterfinals[3].top).toBe('Team D');
    expect(bracket.upperQuarterfinals[3].bottom).toBe('Team E');
  });

  it('использует победителя нижней сетки в гранд-финале, а не победителя матча за бронзу', () => {
    const resultsWithUpperFinal = {
      rounds: [
        ...baseResults.rounds,
        {
          weeks: [
            {
              matches: [
                createPlayoffMatch('L6', 'Team X', 'Team Y', 2, 1, 'home'),
                createPlayoffMatch('G7', 'Team A', 'Team B', 2, 0, 'home'),
                createPlayoffMatch('BF', 'Team Z', 'Team C', 2, 0, 'home'),
              ],
            },
          ],
        },
      ],
    };

    const bracket = buildCs2Bracket(resultsWithUpperFinal);

    expect(bracket.grandFinal.top).toBe('Team A');
    expect(bracket.grandFinal.bottom).toBe('Team X');
  });

  it('возвращает пустой каркас, если команд меньше 8', () => {
    const smallBracket = buildCs2Bracket({ rounds: [{ weeks: [{ matches: [createSwissMatch('A', 'B', 1, 0)] }] }] });

    expect(smallBracket.upperQuarterfinals[0].top).toBe('—');
    expect(smallBracket.grandFinal.bottom).toBe('—');
  });
});
