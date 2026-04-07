import PropTypes from 'prop-types';

import './DotaMainGroups.css';
import groupsConfig from './config.json';

const normalizeTeam = (team) => {
  if (typeof team === 'string') {
    return {
      name: team,
      games: 0,
      winMaps: 0,
      loseMaps: 0,
      points: 0,
    };
  }

  return {
    name: team.name,
    games: team.games ?? 0,
    winMaps: team.winMaps ?? 0,
    loseMaps: team.loseMaps ?? 0,
    points: team.points ?? 0,
  };
};

const DotaMainGroups = ({ data = groupsConfig }) => (
  <section className="dota-main-groups" aria-labelledby="dota-main-groups-title">
    <h4 id="dota-main-groups-title" className="dota-main-groups__title">{data.title}</h4>
    <div className="dota-main-groups__grid">
      {(data.groups ?? []).map((group) => (
        <article key={group.name} className="dota-main-groups__card" aria-label={group.name}>
          <h5 className="dota-main-groups__group-title">{group.name}</h5>
          <div className="dota-main-groups__table-wrapper">
            <table className="dota-main-groups__table">
              <thead>
                <tr>
                  <th scope="col">Команда</th>
                  <th scope="col">Игры</th>
                  <th scope="col">Win maps</th>
                  <th scope="col">Lose maps</th>
                  <th scope="col">Очки</th>
                </tr>
              </thead>
              <tbody>
                {(group.teams ?? []).map((team) => {
                  const normalizedTeam = normalizeTeam(team);

                  return (
                    <tr key={`${group.name}-${normalizedTeam.name}`}>
                      <th scope="row">{normalizedTeam.name}</th>
                      <td>{normalizedTeam.games}</td>
                      <td>{normalizedTeam.winMaps}</td>
                      <td>{normalizedTeam.loseMaps}</td>
                      <td>{normalizedTeam.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </article>
      ))}
    </div>
  </section>
);

const teamShape = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({
    name: PropTypes.string.isRequired,
    games: PropTypes.number,
    winMaps: PropTypes.number,
    loseMaps: PropTypes.number,
    points: PropTypes.number,
  }),
]);

DotaMainGroups.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        teams: PropTypes.arrayOf(teamShape).isRequired,
      }),
    ),
  }),
};

export default DotaMainGroups;
