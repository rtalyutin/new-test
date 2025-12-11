import slugify from '../../utils/slugify.js';

export const calculateMapDiff = (team) => team.mapWins - team.mapLosses;

const ensureTeam = (teamsMap, name) => {
  if (!teamsMap.has(name)) {
    teamsMap.set(name, {
      id: slugify(name),
      name,
      matches: 0,
      wins: 0,
      losses: 0,
      mapWins: 0,
      mapLosses: 0,
      points: 0,
    });
  }

  return teamsMap.get(name);
};

const toNumber = (value) => (Number.isFinite(value) ? value : 0);

const POINT_DEDUCTIONS = {
  'Не Знающие Побед': 6,
  'Labubu Team': 6,
};

const applyPointDeductions = (teams, deductions) =>
  teams.map((team) => {
    const deduction = deductions[team.name];

    if (!deduction) {
      return team;
    }

    return {
      ...team,
      points: team.points - deduction,
    };
  });

export const extractFinishedMatchesByWeek = (matchResults) =>
  (matchResults?.rounds ?? [])
    .flatMap((round) => round?.weeks ?? [])
    .map((week) => ({
      id: week?.id,
      title: week?.title,
      matches: (week?.matches ?? [])
        .filter((match) => match?.status === 'finished' && match?.score && match?.teams),
    }))
    .filter((week) => week.matches.length > 0);

export const extractFinishedMatches = (matchResults) =>
  extractFinishedMatchesByWeek(matchResults).flatMap((week) => week.matches);

export const buildStandingsFromMatches = (finishedMatches) => {
  const teamsMap = new Map();

  finishedMatches.forEach((match) => {
    const homeName = match.teams.home;
    const awayName = match.teams.away;

    if (!homeName || !awayName) {
      return;
    }

    const homeMaps = toNumber(match.score.home);
    const awayMaps = toNumber(match.score.away);

    const homeTeam = ensureTeam(teamsMap, homeName);
    const awayTeam = ensureTeam(teamsMap, awayName);

    homeTeam.matches += 1;
    awayTeam.matches += 1;

    homeTeam.mapWins += homeMaps;
    homeTeam.mapLosses += awayMaps;
    awayTeam.mapWins += awayMaps;
    awayTeam.mapLosses += homeMaps;

    if (homeMaps > awayMaps) {
      homeTeam.wins += 1;
      awayTeam.losses += 1;
    } else if (homeMaps < awayMaps) {
      awayTeam.wins += 1;
      homeTeam.losses += 1;
    }

    homeTeam.points += homeMaps;
    awayTeam.points += awayMaps;
  });

  const teams = Array.from(teamsMap.values());

  return applyPointDeductions(teams, POINT_DEDUCTIONS);
};

export const buildStandingsFromMatchResults = (matchResults) =>
  buildStandingsFromMatches(extractFinishedMatches(matchResults));

export const sortTeams = (teams, sortBy) => {
  const sorted = [...teams].sort((teamA, teamB) => {
    const mapDiffA = calculateMapDiff(teamA);
    const mapDiffB = calculateMapDiff(teamB);

    if (sortBy === 'mapDiff') {
      if (mapDiffB !== mapDiffA) {
        return mapDiffB - mapDiffA;
      }

      if (teamB.points !== teamA.points) {
        return teamB.points - teamA.points;
      }
    } else {
      if (teamB.points !== teamA.points) {
        return teamB.points - teamA.points;
      }

      if (mapDiffB !== mapDiffA) {
        return mapDiffB - mapDiffA;
      }
    }

    if (teamB.mapWins !== teamA.mapWins) {
      return teamB.mapWins - teamA.mapWins;
    }

    return teamA.name.localeCompare(teamB.name, 'ru', { sensitivity: 'base' });
  });

  return sorted.map((team, index) => ({
    ...team,
    position: index + 1,
    mapDiff: calculateMapDiff(team),
  }));
};
