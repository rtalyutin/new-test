import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { buildCs2Bracket } from './buildCs2Bracket.js';
import styles from './Cs2Bracket.module.css';

const MatchCard = ({ match }) => (
  <article className={styles.matchCard} aria-label={`${match.title}: ${match.top} против ${match.bottom}`}>
    <header className={styles.matchHeader}>
      <span>{match.title}</span>
      {match.score ? <span className={styles.score}>{match.score}</span> : null}
    </header>
    <div className={styles.team}>{match.top}</div>
    <div className={styles.team}>{match.bottom}</div>
  </article>
);

MatchCard.propTypes = {
  match: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    top: PropTypes.string.isRequired,
    bottom: PropTypes.string.isRequired,
    score: PropTypes.string,
  }).isRequired,
};

const MatchColumn = ({ title, matches }) => (
  <section className={styles.column} aria-label={title}>
    <h4 className={styles.columnTitle}>{title}</h4>
    <div className={styles.matchList}>
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  </section>
);

MatchColumn.propTypes = {
  title: PropTypes.string.isRequired,
  matches: PropTypes.arrayOf(MatchCard.propTypes.match).isRequired,
};

const Cs2Bracket = ({ matchResults }) => {
  const bracket = useMemo(() => buildCs2Bracket(matchResults), [matchResults]);

  return (
    <section className={styles.wrapper} aria-labelledby="cs2-bracket-title">
      <header className={styles.header}>
        <h3 id="cs2-bracket-title" className={styles.title}>Турнирная сетка CS2</h3>
        <p className={styles.description}>
          Посев формируется по таблице: 1–8, 2–7, 3–6, 4–5. Результаты подтягиваются из сыгранных матчей CS2.
        </p>
      </header>

      <div className={styles.grid}>
        <MatchColumn title="Upper Bracket · 1/4" matches={bracket.upperQuarterfinals} />
        <MatchColumn title="Upper Bracket · 1/2" matches={bracket.upperSemifinals} />
        <MatchColumn title="Upper Bracket · финал" matches={[bracket.upperFinal]} />
        <MatchColumn title="Финал" matches={[bracket.grandFinal]} />
      </div>

      <div className={styles.grid}>
        <MatchColumn title="Lower Bracket · раунд 1" matches={bracket.lowerRound1} />
        <MatchColumn title="Lower Bracket · раунд 2" matches={bracket.lowerRound2} />
        <MatchColumn title="Lower Bracket · раунд 3" matches={bracket.lowerRound3} />
        <MatchColumn title="Lower Bracket · финал" matches={[bracket.lowerFinal]} />
      </div>
    </section>
  );
};

Cs2Bracket.propTypes = {
  matchResults: PropTypes.shape({
    rounds: PropTypes.arrayOf(
      PropTypes.shape({
        weeks: PropTypes.arrayOf(
          PropTypes.shape({
            matches: PropTypes.arrayOf(
              PropTypes.shape({
                status: PropTypes.string,
                playoffMatchId: PropTypes.string,
                winner: PropTypes.string,
                teams: PropTypes.shape({
                  home: PropTypes.string,
                  away: PropTypes.string,
                }),
                score: PropTypes.shape({
                  home: PropTypes.number,
                  away: PropTypes.number,
                }),
              }),
            ),
          }),
        ),
      }),
    ),
  }).isRequired,
};

export default Cs2Bracket;
