import { useState } from 'react';
import PropTypes from 'prop-types';
import { getTeamLogo } from '../../utils/teamLogos';
import styles from './MatchResults.module.css';

const MatchResults = ({ data }) => {
  const { title, description, rounds } = data;

  const [expandedRounds, setExpandedRounds] = useState(() =>
    rounds.reduce(
      (acc, round) => ({
        ...acc,
        [round.id]: Boolean(round.defaultExpanded),
      }),
      {},
    ),
  );

  const buildScoreLabel = (match) =>
    `${match.teams.home} ${match.score.home} — ${match.score.away} ${match.teams.away} · BO${match.bestOf}`;

  const renderTeam = (match, side) => {
    const teamName = match.teams[side];
    const teamLogo = getTeamLogo(teamName);
    const isWinner = match.winner === side;

    return (
      <div className={`${styles.team} ${isWinner ? styles.teamWinner : ''}`}>
        {teamLogo ? (
          <img
            src={teamLogo}
            alt={`Логотип команды ${teamName}`}
            className={styles.teamLogo}
            loading="lazy"
            width={32}
            height={32}
          />
        ) : null}
        <span className={styles.teamName}>{teamName}</span>
      </div>
    );
  };

  const toggleRound = (roundId) => {
    setExpandedRounds((prev) => ({
      ...prev,
      [roundId]: !prev[roundId],
    }));
  };

  return (
    <section className={styles.results} aria-labelledby="match-results-title">
      <header className={styles.header}>
        <div>
          <h3 id="match-results-title" className={styles.title}>
            {title}
          </h3>
          {description ? <p className={styles.description}>{description}</p> : null}
        </div>
      </header>

      <div className={styles.rounds}>
        {rounds.map((round) => {
          const isExpanded = expandedRounds[round.id];
          const panelId = `round-panel-${round.id}`;
          const buttonId = `round-toggle-${round.id}`;

          return (
            <article key={round.id} className={styles.round}>
              <div className={styles.roundHeader}>
                <div className={styles.roundMetaWrapper}>
                  {round.subtitle ? <p className={styles.roundSubtitle}>{round.subtitle}</p> : null}
                  <button
                    type="button"
                    id={buttonId}
                    className={styles.roundToggle}
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    onClick={() => toggleRound(round.id)}
                  >
                    <span className={styles.roundToggleLabel}>{round.title}</span>
                    <span className={styles.roundChevron} aria-hidden="true">
                      {isExpanded ? '▾' : '▸'}
                    </span>
                  </button>
                </div>
              </div>

              {isExpanded ? (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={styles.roundPanel}
                >
                  {round.weeks.map((week) => (
                    <div key={week.id} className={styles.weekBlock}>
                      <div className={styles.weekHeader}>
                        <h4 className={styles.weekTitle}>{week.title}</h4>
                      </div>
                      <ol className={styles.resultsList} aria-label={`Матчи за ${week.title}`}>
                        {week.matches.map((match) => {
                          const scoreLabel = buildScoreLabel(match);

                          return (
                            <li key={match.id} className={styles.resultItem}>
                              <div className={styles.meta}>
                                <time dateTime={match.dateTime} className={styles.date}>
                                  {match.dateLabel}
                                </time>
                                {match.stage ? <span className={styles.stage}>{match.stage}</span> : null}
                              </div>
                              <div className={styles.teamsMapsWrapper}>
                                <div className={styles.teams}>
                                  {renderTeam(match, 'home')}
                                  <div
                                    className={styles.scoreWrapper}
                                    aria-label={`Счёт: ${scoreLabel}`}
                                  >
                                    <span className={styles.score} aria-hidden="true">
                                      <span className={styles.scoreValue}>{match.score.home}</span>
                                      <span className={styles.scoreSeparator}>—</span>
                                      <span className={styles.scoreValue}>{match.score.away}</span>
                                    </span>
                                    <span
                                      className={styles.bestOf}
                                      aria-label={`Формат серии best-of-${match.bestOf}`}
                                    >
                                      BO{match.bestOf}
                                    </span>
                                  </div>
                                  {renderTeam(match, 'away')}
                                </div>
                                {match.maps?.length ? (
                                  <div className={styles.maps}>
                                    <p className={styles.mapsTitle}>Игры</p>
                                    <ul className={styles.mapList} aria-label={`Игры: ${scoreLabel}`}>
                                      {match.maps.map((map, index) => {
                                        const mapLabel = `Игра ${index + 1}`;

                                        return (
                                          <li key={`${match.id}-${map.id || index}`} className={styles.mapItem}>
                                            <span className={styles.mapName}>{mapLabel}</span>
                                            <span className={styles.mapScore}>
                                              <span className={styles.scoreValue}>{map.score.home}</span>
                                              <span className={styles.scoreSeparator}>—</span>
                                              <span className={styles.scoreValue}>{map.score.away}</span>
                                            </span>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </div>
                                ) : null}
                              </div>
                              <div className={styles.statusWrapper}>
                                <span className={styles.status} data-status={match.status}>
                                  {match.statusLabel}
                                </span>
                                <a
                                  className={styles.detailsLink}
                                  href={match.detailsUrl}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                >
                                  {match.detailsLabel}
                                </a>
                              </div>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
};

const mapPropType = PropTypes.shape({
  id: PropTypes.string,
  score: PropTypes.shape({
    home: PropTypes.number.isRequired,
    away: PropTypes.number.isRequired,
  }).isRequired,
});

const matchPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  dateLabel: PropTypes.string.isRequired,
  dateTime: PropTypes.string.isRequired,
  stage: PropTypes.string,
  teams: PropTypes.shape({
    home: PropTypes.string.isRequired,
    away: PropTypes.string.isRequired,
  }).isRequired,
  score: PropTypes.shape({
    home: PropTypes.number.isRequired,
    away: PropTypes.number.isRequired,
  }).isRequired,
  maps: PropTypes.arrayOf(mapPropType),
  bestOf: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  statusLabel: PropTypes.string.isRequired,
  detailsUrl: PropTypes.string.isRequired,
  detailsLabel: PropTypes.string.isRequired,
  winner: PropTypes.oneOf(['home', 'away']).isRequired,
});

MatchResults.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    rounds: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        subtitle: PropTypes.string,
        defaultExpanded: PropTypes.bool,
        weeks: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            matches: PropTypes.arrayOf(matchPropType).isRequired,
          }),
        ).isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default MatchResults;
