import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  buildStandingsFromMatchResults,
  buildStandingsFromMatches,
  extractFinishedMatchesByWeek,
  sortTeams,
} from './standings.js';
import styles from './QualificationsTable.module.css';

const QualificationsTable = ({ data, matchResults }) => {
  const { title, description, caption, columnLabels, sortLabels, pointsPerWin, pointsPerDraw } = data;
  const [sortBy, setSortBy] = useState('points');

  const derivedTeams = useMemo(
    () =>
      buildStandingsFromMatchResults(matchResults, {
        pointsPerWin,
        pointsPerDraw,
      }),
    [matchResults, pointsPerWin, pointsPerDraw],
  );

  const finishedWeeks = useMemo(() => extractFinishedMatchesByWeek(matchResults), [matchResults]);
  const latestFinishedWeek = finishedWeeks[finishedWeeks.length - 1];

  const previousWeekMatches = useMemo(
    () => finishedWeeks.slice(0, -1).flatMap((week) => week.matches),
    [finishedWeeks],
  );

  const previousStandings = useMemo(() => {
    if (!previousWeekMatches.length) {
      return [];
    }

    const previousTeams = buildStandingsFromMatches(previousWeekMatches, { pointsPerWin, pointsPerDraw });
    return sortTeams(previousTeams, sortBy);
  }, [pointsPerDraw, pointsPerWin, previousWeekMatches, sortBy]);

  const previousPositions = useMemo(() => {
    const map = new Map();
    previousStandings.forEach((team) => map.set(team.id, team.position));
    return map;
  }, [previousStandings]);

  const sortedTeams = useMemo(() => sortTeams(derivedTeams, sortBy), [derivedTeams, sortBy]);

  const getPositionDelta = (teamId, currentPosition) => {
    const previousPosition = previousPositions.get(teamId);
    if (!previousPosition) {
      return 0;
    }

    return previousPosition - currentPosition;
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const sortStatusLabel =
    sortBy === 'points' ? 'Таблица отсортирована по очкам' : 'Таблица отсортирована по разнице карт';

  return (
    <section className={styles.wrapper} aria-labelledby="qualifications-title">
      <div className={styles.headerRow}>
        <div className={styles.heading}>
          <h3 id="qualifications-title" className={styles.title}>
            {title}
          </h3>
          <p className={styles.description}>{description}</p>
          {latestFinishedWeek ? (
            <p className={styles.updateNote}>
              Обновлено по итогам: <span className={styles.updateHighlight}>{latestFinishedWeek.title}</span>
            </p>
          ) : null}
        </div>
        <div className={styles.controls} aria-label="Управление сортировкой таблицы">
          <span className={styles.controlsLabel}>Сортировка:</span>
          <div className={styles.sortButtons} role="group" aria-label="Настройки сортировки таблицы квалификаций">
            <button
              type="button"
              className={`${styles.sortButton}${sortBy === 'points' ? ` ${styles.sortButtonActive}` : ''}`}
              onClick={() => handleSortChange('points')}
              aria-pressed={sortBy === 'points'}
            >
              Очки
              <span className="sr-only"> — {sortLabels.points}</span>
            </button>
            <button
              type="button"
              className={`${styles.sortButton}${sortBy === 'mapDiff' ? ` ${styles.sortButtonActive}` : ''}`}
              onClick={() => handleSortChange('mapDiff')}
              aria-pressed={sortBy === 'mapDiff'}
            >
              Разница карт
              <span className="sr-only"> — {sortLabels.mapDiff}</span>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <div className="sr-only" role="status" aria-live="polite">
          {sortStatusLabel}
        </div>
        <table className={styles.table}>
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              <th scope="col" aria-sort="none">{columnLabels.position}</th>
              <th scope="col" aria-sort="none">{columnLabels.team}</th>
              <th scope="col" aria-sort="none">{columnLabels.matches}</th>
              <th scope="col" aria-sort="none">{columnLabels.wins}</th>
              <th scope="col" aria-sort="none">{columnLabels.losses}</th>
              <th
                scope="col"
                aria-sort={sortBy === 'mapDiff' ? 'descending' : 'none'}
                aria-label={`${columnLabels.maps}. Текущее упорядочивание: ${sortBy === 'mapDiff' ? 'по разнице карт' : 'без сортировки'}`}
              >
                {columnLabels.maps}
              </th>
              <th
                scope="col"
                aria-sort={sortBy === 'points' ? 'descending' : 'none'}
                aria-label={`${columnLabels.points}. Текущее упорядочивание: ${sortBy === 'points' ? 'по очкам' : 'без сортировки'}`}
              >
                {columnLabels.points}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map((team) => (
              <tr key={team.id}>
                <th scope="row" aria-label={`Место ${team.position}`} className={styles.positionCell}>
                  <span className={styles.positionValue}>#{team.position}</span>
                  <span
                    className={`${styles.delta} ${
                      getPositionDelta(team.id, team.position) > 0
                        ? styles.deltaUp
                        : getPositionDelta(team.id, team.position) < 0
                          ? styles.deltaDown
                          : styles.deltaEven
                    }`}
                    aria-label={(() => {
                      const change = getPositionDelta(team.id, team.position);
                      if (change > 0) return `+${change} позиций относительно прошлой недели`;
                      if (change < 0) return `${change} позиций относительно прошлой недели`;
                      return 'Позиция без изменений относительно прошлой недели';
                    })()}
                  >
                    {(() => {
                      const change = getPositionDelta(team.id, team.position);
                      if (change > 0) return `+${change}`;
                      if (change < 0) return `${change}`;
                      return '—';
                    })()}
                  </span>
                </th>
                <td className={styles.teamCell}>
                  <div className={styles.teamName}>{team.name}</div>
                  <div className={styles.teamMeta} aria-hidden="true">
                    {team.wins}–{team.losses} · карты {team.mapWins}:{team.mapLosses}
                  </div>
                </td>
                <td className={styles.numeric}>{team.matches}</td>
                <td className={styles.numeric}>{team.wins}</td>
                <td className={styles.numeric}>{team.losses}</td>
                <td className={`${styles.numeric} ${styles.mapDiff}`}>
                  <span className={styles.mapScore}>
                    {team.mapWins}:{team.mapLosses}
                  </span>
                  <span className={team.mapDiff >= 0 ? styles.positive : styles.negative} aria-label={`Разница карт ${team.mapDiff}`}>
                    {team.mapDiff > 0 ? '+' : ''}
                    {team.mapDiff}
                  </span>
                </td>
                <td className={`${styles.numeric} ${styles.pointsCell}`}>
                  <span className={styles.pointsValue}>{team.points}</span>
                  <span className="sr-only"> очков</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

QualificationsTable.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    caption: PropTypes.string,
    columnLabels: PropTypes.shape({
      position: PropTypes.string.isRequired,
      team: PropTypes.string.isRequired,
      matches: PropTypes.string.isRequired,
      wins: PropTypes.string.isRequired,
      losses: PropTypes.string.isRequired,
      maps: PropTypes.string.isRequired,
      points: PropTypes.string.isRequired,
    }).isRequired,
    sortLabels: PropTypes.shape({
      points: PropTypes.string.isRequired,
      mapDiff: PropTypes.string.isRequired,
    }).isRequired,
    pointsPerWin: PropTypes.number,
    pointsPerDraw: PropTypes.number,
  }).isRequired,
  matchResults: PropTypes.shape({
    rounds: PropTypes.arrayOf(
      PropTypes.shape({
        weeks: PropTypes.arrayOf(
          PropTypes.shape({
            matches: PropTypes.arrayOf(
              PropTypes.shape({
                status: PropTypes.string,
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

export default QualificationsTable;
