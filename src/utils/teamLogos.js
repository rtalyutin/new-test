const normalizeTeamName = (name) =>
  name
    ? name
        .trim()
        .toLowerCase()
        .replace(/\.(jpg|jpeg|png|svg|webp)$/i, '')
        .replace(/[^\p{L}\p{N}]+/gu, '')
    : '';

const teamLogosMap = {};

const buildTeamLogosMap = (teams) => {
  if (!Array.isArray(teams)) {
    return;
  }

  teams.forEach((team) => {
    if (!team || typeof team !== 'object') {
      return;
    }

    const { name, logo } = team;

    if (!name || !logo) {
      return;
    }

    teamLogosMap[name] = logo;

    const normalizedName = normalizeTeamName(name);

    if (normalizedName && !teamLogosMap[normalizedName]) {
      teamLogosMap[normalizedName] = logo;
    }
  });
};

const teamShowcaseConfigPromise = import('../features/team-showcase/config.json')
  .then((module) => module.default)
  .then(buildTeamLogosMap)
  .catch(() => {
    // no-op: при ошибке загрузки сохраняем пустую map и безопасный fallback.
  });

void teamShowcaseConfigPromise;

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
