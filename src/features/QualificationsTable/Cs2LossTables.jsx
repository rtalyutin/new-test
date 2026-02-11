import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { buildStandingsFromMatchResults, sortTeams } from './standings.js';
import styles from './QualificationsTable.module.css';

const LOSS_GROUPS = [
  { losses: 0, title: 'Команды с 0 поражений' },
  { losses: 1, title: 'Команды с 1 поражением' },
  { losses: 2, title: 'Команды с 2 поражениями' },
];

const Cs2LossTables = ({ data, matchResults }) => {
  const { title, description, captionPrefix, columnLabels } = data;

  const groupedTeams = useMemo(() => {
    const teams = sortTeams(buildStandingsFromMatchResults(matchResults), 'points');

    return LOSS_GROUPS.map((group) => ({
      ...group,
      teams: teams.filter((team) => team.losses === group.losses),
    }));
  }, [matchResults]);

  return (
    <section className={styles.wrapper} aria-labelledby="cs2-loss-tables-title">
      <div className={styles.headerRow}>
        <div className={styles.heading}>
          <h3 id="cs2-loss-tables-title" className={styles.title}>
            {title}
          </h3>
          {description ? <p className={styles.description}>{description}</p> : null}
        </div>
      </div>

      <div className={styles.lossGroups}>
        {groupedTeams.map((group) => (
          <article key={group.title} className={styles.lossGroup} aria-labelledby={`loss-group-${group.losses}`}>
            <h4 id={`loss-group-${group.losses}`} className={styles.lossGroupTitle}>
              {group.title}
            </h4>

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <caption className="sr-only">{`${captionPrefix}: ${group.title}`}</caption>
                <thead>
                  <tr>
                    <th scope="col">{columnLabels.team}</th>
                    <th scope="col">{columnLabels.matches}</th>
                    <th scope="col">{columnLabels.wins}</th>
                    <th scope="col">{columnLabels.losses}</th>
                    <th scope="col">{columnLabels.maps}</th>
                    <th scope="col">{columnLabels.points}</th>
                  </tr>
                </thead>
                <tbody>
                  {group.teams.length ? (
                    group.teams.map((team) => (
                      <tr key={team.id}>
                        <th scope="row" className={styles.teamCell}>
                          <div className={styles.teamName}>{team.name}</div>
                        </th>
                        <td className={styles.numeric}>{team.matches}</td>
                        <td className={styles.numeric}>{team.wins}</td>
                        <td className={styles.numeric}>{team.losses}</td>
                        <td className={`${styles.numeric} ${styles.mapDiff}`}>
                          <span className={styles.mapScore}>{team.mapWins}:{team.mapLosses}</span>
                          <span
                            className={team.mapDiff >= 0 ? styles.positive : styles.negative}
                            aria-label={`Разница карт ${team.mapDiff}`}
                          >
                            {team.mapDiff > 0 ? '+' : ''}
                            {team.mapDiff}
                          </span>
                        </td>
                        <td className={`${styles.numeric} ${styles.pointsCell}`}>
                          <span className={styles.pointsValue}>{team.points}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className={styles.emptyState}>Нет команд в этой группе.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </div>

      <p className={styles.mobileNotice} role="note">
        Таблицы доступны на десктопных устройствах. Откройте сайт на более широком экране,
        чтобы посмотреть распределение команд по поражениям.
      </p>
    </section>
  );
};

Cs2LossTables.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    captionPrefix: PropTypes.string.isRequired,
    columnLabels: PropTypes.shape({
      team: PropTypes.string.isRequired,
      matches: PropTypes.string.isRequired,
      wins: PropTypes.string.isRequired,
      losses: PropTypes.string.isRequired,
      maps: PropTypes.string.isRequired,
      points: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  matchResults: PropTypes.shape({
    rounds: PropTypes.array,
  }).isRequired,
};

export default Cs2LossTables;
