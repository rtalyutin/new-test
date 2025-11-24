import teamShowcaseConfig from '../features/team-showcase/config.json';

const normalizeTeamName = (name) =>
  name
    ? name
        .trim()
        .toLowerCase()
        .replace(/\.(jpg|jpeg|png|svg|webp)$/i, '')
        .replace(/[^\p{L}\p{N}]+/gu, '')
    : '';

const teamLogosMap = teamShowcaseConfig.reduce((acc, team) => {
  if (!team || typeof team !== 'object') {
    return acc;
  }

  const { name, logo } = team;

  if (!name || !logo) {
    return acc;
  }

  acc[name] = logo;

  const normalizedName = normalizeTeamName(name);

  if (normalizedName && !acc[normalizedName]) {
    acc[normalizedName] = logo;
  }

  return acc;
}, {});

const TEAM_LOGO_ALIASES = {
  arb: 'arbesports',
};

const getTeamLogo = (name) => {
  if (!name) {
    return null;
  }

  const normalizedName = normalizeTeamName(name);
  const alias = TEAM_LOGO_ALIASES[normalizedName];

  return (
    teamLogosMap[name] ??
    teamLogosMap[normalizedName] ??
    (alias ? teamLogosMap[alias] : null) ??
    null
  );
};

export { getTeamLogo, normalizeTeamName, teamLogosMap };
