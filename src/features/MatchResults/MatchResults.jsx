import PropTypes from 'prop-types';
import styles from './MatchResults.module.css';

const MatchResults = ({ data }) => {
  const { title, description, matches } = data;

  const buildScoreLabel = (match) =>
    `${match.teams.home} ${match.score.home} — ${match.score.away} ${match.teams.away} · BO${match.bestOf}`;

  return (
    <section className={styles.results} aria-labelledby="match-results-title">
      <header className={styles.header}>
        <div>
          <h3 id="match-results-title" className={styles.title}>
            {title}
          </h3>
          {description ? (
            <p className={styles.description}>{description}</p>
          ) : null}
        </div>
      </header>
      <ol className={styles.resultsList} aria-label="Список последних матчей">
        {matches.map((match) => {
          const scoreLabel = buildScoreLabel(match);
          const isHomeWinner = match.winner === 'home';
          const isAwayWinner = match.winner === 'away';

          return (
            <li key={match.id} className={styles.resultItem}>
              <div className={styles.meta}>
                <time dateTime={match.dateTime} className={styles.date}>
                  {match.dateLabel}
                </time>
                {match.stage ? (
                  <span className={styles.stage}>{match.stage}</span>
                ) : null}
              </div>
              <div className={styles.teams}>
                <div className={`${styles.team} ${isHomeWinner ? styles.teamWinner : ''}`}>
                  <span className={styles.teamName}>{match.teams.home}</span>
                </div>
                <div className={styles.scoreWrapper} aria-label={`Счёт: ${scoreLabel}`}>
                  <span className={styles.score} aria-hidden="true">
                    <span className={styles.scoreValue}>{match.score.home}</span>
                    <span className={styles.scoreSeparator}>—</span>
                    <span className={styles.scoreValue}>{match.score.away}</span>
                  </span>
                  <span className={styles.bestOf} aria-label={`Формат серии best-of-${match.bestOf}`}>
                    BO{match.bestOf}
                  </span>
                </div>
                <div className={`${styles.team} ${isAwayWinner ? styles.teamWinner : ''}`}>
                  <span className={styles.teamName}>{match.teams.away}</span>
                </div>
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
    </section>
  );
};

MatchResults.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    matches: PropTypes.arrayOf(
      PropTypes.shape({
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
        bestOf: PropTypes.number.isRequired,
        status: PropTypes.string.isRequired,
        statusLabel: PropTypes.string.isRequired,
        detailsUrl: PropTypes.string.isRequired,
        detailsLabel: PropTypes.string.isRequired,
        winner: PropTypes.oneOf(['home', 'away']).isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default MatchResults;
