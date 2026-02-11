import { buildStandingsFromMatches, extractFinishedMatches, sortTeams } from '../QualificationsTable/standings.js';

const EMPTY_SLOT = '—';

const createEmptyMatch = (id, title) => ({
  id,
  title,
  top: EMPTY_SLOT,
  bottom: EMPTY_SLOT,
  score: null,
  winner: null,
  loser: null,
});

const createBracketSkeleton = () => ({
  upperQuarterfinals: [
    createEmptyMatch('G1', 'Игра 1'),
    createEmptyMatch('G2', 'Игра 2'),
    createEmptyMatch('G3', 'Игра 3'),
    createEmptyMatch('G4', 'Игра 4'),
  ],
  upperSemifinals: [
    createEmptyMatch('G5', 'Игра 5'),
    createEmptyMatch('G6', 'Игра 6'),
  ],
  upperFinal: createEmptyMatch('G7', 'Игра 7'),
  grandFinal: createEmptyMatch('GF', 'Гранд-финал'),
  lowerRound1: [
    createEmptyMatch('L1', 'Нижняя сетка 1'),
    createEmptyMatch('L2', 'Нижняя сетка 2'),
  ],
  lowerRound2: [
    createEmptyMatch('L3', 'Нижняя сетка 3'),
    createEmptyMatch('L4', 'Нижняя сетка 4'),
  ],
  lowerRound3: [
    createEmptyMatch('L5', 'Нижняя сетка 5'),
    createEmptyMatch('L6', 'Нижняя сетка 6'),
  ],
  bronzeFinal: createEmptyMatch('BF', 'Матч за бронзу'),
});

const buildSeedPairs = (teams) => [
  [teams[0], teams[7]],
  [teams[1], teams[6]],
  [teams[2], teams[5]],
  [teams[3], teams[4]],
];

const findPlayoffMatch = (matchResults, id) =>
  (matchResults?.rounds ?? [])
    .flatMap((round) => round?.weeks ?? [])
    .flatMap((week) => week?.matches ?? [])
    .find((match) => match?.playoffMatchId === id && match?.status === 'finished');

const applyResult = (targetMatch, sourceMatch) => {
  if (!sourceMatch?.teams || !sourceMatch?.score) {
    return;
  }

  const { teams, score, winner } = sourceMatch;
  targetMatch.top = teams.home || EMPTY_SLOT;
  targetMatch.bottom = teams.away || EMPTY_SLOT;
  targetMatch.score = `${score.home ?? 0}:${score.away ?? 0}`;

  if (winner === 'home') {
    targetMatch.winner = teams.home;
    targetMatch.loser = teams.away;
  } else if (winner === 'away') {
    targetMatch.winner = teams.away;
    targetMatch.loser = teams.home;
  }
};

export const buildCs2Bracket = (matchResults) => {
  const bracket = createBracketSkeleton();
  const qualificationMatches = extractFinishedMatches(matchResults)
    .filter((match) => !match?.playoffMatchId);
  const standings = sortTeams(buildStandingsFromMatches(qualificationMatches), 'points');
  const seededTeams = standings.slice(0, 8);

  if (seededTeams.length < 8) {
    return bracket;
  }

  const pairs = buildSeedPairs(seededTeams);
  bracket.upperQuarterfinals = bracket.upperQuarterfinals.map((match, index) => ({
    ...match,
    top: pairs[index][0].name,
    bottom: pairs[index][1].name,
  }));

  const playoffMatchIds = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'BF', 'GF'];
  const matchById = {
    G1: bracket.upperQuarterfinals[0],
    G2: bracket.upperQuarterfinals[1],
    G3: bracket.upperQuarterfinals[2],
    G4: bracket.upperQuarterfinals[3],
    G5: bracket.upperSemifinals[0],
    G6: bracket.upperSemifinals[1],
    G7: bracket.upperFinal,
    L1: bracket.lowerRound1[0],
    L2: bracket.lowerRound1[1],
    L3: bracket.lowerRound2[0],
    L4: bracket.lowerRound2[1],
    L5: bracket.lowerRound3[0],
    L6: bracket.lowerRound3[1],
    BF: bracket.bronzeFinal,
    GF: bracket.grandFinal,
  };

  playoffMatchIds.forEach((id) => {
    const sourceMatch = findPlayoffMatch(matchResults, id);
    if (sourceMatch) {
      applyResult(matchById[id], sourceMatch);
    }
  });

  bracket.upperSemifinals[0].top = bracket.upperSemifinals[0].top !== EMPTY_SLOT
    ? bracket.upperSemifinals[0].top
    : bracket.upperQuarterfinals[0].winner || 'W1';
  bracket.upperSemifinals[0].bottom = bracket.upperSemifinals[0].bottom !== EMPTY_SLOT
    ? bracket.upperSemifinals[0].bottom
    : bracket.upperQuarterfinals[1].winner || 'W2';

  bracket.upperSemifinals[1].top = bracket.upperSemifinals[1].top !== EMPTY_SLOT
    ? bracket.upperSemifinals[1].top
    : bracket.upperQuarterfinals[2].winner || 'W3';
  bracket.upperSemifinals[1].bottom = bracket.upperSemifinals[1].bottom !== EMPTY_SLOT
    ? bracket.upperSemifinals[1].bottom
    : bracket.upperQuarterfinals[3].winner || 'W4';

  bracket.upperFinal.top = bracket.upperFinal.top !== EMPTY_SLOT ? bracket.upperFinal.top : bracket.upperSemifinals[0].winner || 'W5';
  bracket.upperFinal.bottom = bracket.upperFinal.bottom !== EMPTY_SLOT ? bracket.upperFinal.bottom : bracket.upperSemifinals[1].winner || 'W6';

  bracket.lowerRound1[0].top = bracket.lowerRound1[0].top !== EMPTY_SLOT ? bracket.lowerRound1[0].top : bracket.upperQuarterfinals[0].loser || 'L1';
  bracket.lowerRound1[0].bottom = bracket.lowerRound1[0].bottom !== EMPTY_SLOT ? bracket.lowerRound1[0].bottom : bracket.upperQuarterfinals[1].loser || 'L2';
  bracket.lowerRound1[1].top = bracket.lowerRound1[1].top !== EMPTY_SLOT ? bracket.lowerRound1[1].top : bracket.upperQuarterfinals[2].loser || 'L3';
  bracket.lowerRound1[1].bottom = bracket.lowerRound1[1].bottom !== EMPTY_SLOT ? bracket.lowerRound1[1].bottom : bracket.upperQuarterfinals[3].loser || 'L4';

  bracket.lowerRound2[0].top = bracket.lowerRound2[0].top !== EMPTY_SLOT ? bracket.lowerRound2[0].top : bracket.lowerRound1[0].winner || 'W-L1';
  bracket.lowerRound2[0].bottom = bracket.lowerRound2[0].bottom !== EMPTY_SLOT ? bracket.lowerRound2[0].bottom : bracket.upperSemifinals[0].loser || 'L5';
  bracket.lowerRound2[1].top = bracket.lowerRound2[1].top !== EMPTY_SLOT ? bracket.lowerRound2[1].top : bracket.lowerRound1[1].winner || 'W-L2';
  bracket.lowerRound2[1].bottom = bracket.lowerRound2[1].bottom !== EMPTY_SLOT ? bracket.lowerRound2[1].bottom : bracket.upperSemifinals[1].loser || 'L6';

  bracket.lowerRound3[0].top = bracket.lowerRound3[0].top !== EMPTY_SLOT ? bracket.lowerRound3[0].top : bracket.lowerRound2[0].winner || 'W-L3';
  bracket.lowerRound3[0].bottom = bracket.lowerRound3[0].bottom !== EMPTY_SLOT ? bracket.lowerRound3[0].bottom : bracket.lowerRound2[1].winner || 'W-L4';

  bracket.lowerRound3[1].top = bracket.lowerRound3[1].top !== EMPTY_SLOT ? bracket.lowerRound3[1].top : bracket.lowerRound3[0].winner || 'W-L5';
  bracket.lowerRound3[1].bottom = bracket.lowerRound3[1].bottom !== EMPTY_SLOT ? bracket.lowerRound3[1].bottom : bracket.upperFinal.loser || 'L7';

  bracket.bronzeFinal.top = bracket.bronzeFinal.top !== EMPTY_SLOT ? bracket.bronzeFinal.top : bracket.lowerRound3[1].winner || 'W-L6';
  bracket.bronzeFinal.bottom = bracket.bronzeFinal.bottom !== EMPTY_SLOT ? bracket.bronzeFinal.bottom : bracket.upperFinal.loser || 'L7';

  bracket.grandFinal.top = bracket.grandFinal.top !== EMPTY_SLOT ? bracket.grandFinal.top : bracket.upperFinal.winner || 'W7';
  bracket.grandFinal.bottom = bracket.grandFinal.bottom !== EMPTY_SLOT ? bracket.grandFinal.bottom : bracket.lowerRound3[1].winner || 'W-L6';

  return bracket;
};
