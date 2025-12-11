import { assert, test } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildStandingsFromMatchResults,
  buildStandingsFromMatches,
  extractFinishedMatchesByWeek,
  sortTeams,
} from './standings.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const matchResultsConfig = JSON.parse(
  readFileSync(path.join(__dirname, '../MatchResults/config.json'), 'utf-8'),
);

test('buildStandingsFromMatchResults aggregates finished matches into standings', () => {
  const standings = buildStandingsFromMatchResults(matchResultsConfig);

  const miNePushim = standings.find((team) => team.name === 'Mi ne Pushim!');
  assert.deepStrictEqual(miNePushim, {
    id: 'mi-ne-pushim',
    name: 'Mi ne Pushim!',
    matches: 4,
    wins: 2,
    losses: 2,
    mapWins: 6,
    mapLosses: 4,
    points: 6,
  });

  const uniqueIds = new Set(standings.map((team) => team.id));
  assert.strictEqual(standings.length, uniqueIds.size);
  assert.strictEqual(standings.length, 14);
});

test('buildStandingsFromMatches aggregates matches for a single week', () => {
  const [firstFinishedWeek] = extractFinishedMatchesByWeek(matchResultsConfig);
  const standings = buildStandingsFromMatches(firstFinishedWeek.matches);

  const firstTeam = standings.find((team) => team.name === 'Mi ne Pushim!');
  assert.strictEqual(firstTeam.points, 2);
  assert.strictEqual(firstTeam.matches, 1);
});

test('buildStandingsFromMatchResults applies point deductions for penalized teams', () => {
  const standings = buildStandingsFromMatchResults(matchResultsConfig);

  const penalizedTeam = standings.find((team) => team.name === 'Не Знающие Побед');
  const labubuTeam = standings.find((team) => team.name === 'Labubu Team');

  assert.ok(penalizedTeam, 'Penalized team should exist in standings');
  assert.strictEqual(penalizedTeam.points, penalizedTeam.mapWins - 6);

  assert.ok(labubuTeam, 'Labubu Team should exist in standings');
  assert.strictEqual(labubuTeam.points, labubuTeam.mapWins - 6);
});

test('sortTeams orders by points, map difference, map wins, then alphabetically', () => {
  const teams = [
    { id: 'c', name: 'Team C', matches: 1, wins: 1, losses: 0, mapWins: 2, mapLosses: 0, points: 3 },
    { id: 'a', name: 'Team A', matches: 1, wins: 0, losses: 1, mapWins: 1, mapLosses: 2, points: 0 },
    { id: 'b', name: 'Team B', matches: 1, wins: 1, losses: 0, mapWins: 3, mapLosses: 1, points: 3 },
  ];

  const sortedByPoints = sortTeams(teams, 'points');
  assert.deepStrictEqual(sortedByPoints.map((team) => team.name), ['Team B', 'Team C', 'Team A']);
  assert.deepStrictEqual(sortedByPoints.map((team) => team.position), [1, 2, 3]);
  assert.deepStrictEqual(sortedByPoints.map((team) => team.mapDiff), [2, 2, -1]);

  const sortedByDiff = sortTeams(teams, 'mapDiff');
  assert.deepStrictEqual(sortedByDiff.map((team) => team.name), ['Team B', 'Team C', 'Team A']);
});

test('extractFinishedMatchesByWeek keeps only finished matches grouped by week', () => {
  const weeks = extractFinishedMatchesByWeek({
    rounds: [
      {
        weeks: [
          {
            id: 'week-a',
            matches: [
              { status: 'finished', teams: { home: 'A', away: 'B' }, score: { home: 2, away: 0 } },
              { status: 'scheduled', teams: { home: 'C', away: 'D' } },
            ],
          },
          {
            id: 'week-b',
            matches: [
              { status: 'canceled', teams: { home: 'X', away: 'Y' } },
            ],
          },
        ],
      },
    ],
  });

  assert.strictEqual(weeks.length, 1);
  assert.strictEqual(weeks[0].id, 'week-a');
  assert.strictEqual(weeks[0].matches.length, 1);
});
