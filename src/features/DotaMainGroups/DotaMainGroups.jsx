import PropTypes from 'prop-types';

import './DotaMainGroups.css';
import groupsConfig from './config.json';

const DotaMainGroups = ({ data = groupsConfig }) => (
  <section className="dota-main-groups" aria-labelledby="dota-main-groups-title">
    <h4 id="dota-main-groups-title" className="dota-main-groups__title">{data.title}</h4>
    <div className="dota-main-groups__grid">
      {(data.groups ?? []).map((group) => (
        <article key={group.name} className="dota-main-groups__card" aria-label={group.name}>
          <h5 className="dota-main-groups__group-title">{group.name}</h5>
          <ul className="dota-main-groups__team-list">
            {(group.teams ?? []).map((team) => (
              <li key={`${group.name}-${team}`} className="dota-main-groups__team-item">{team}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  </section>
);

DotaMainGroups.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        teams: PropTypes.arrayOf(PropTypes.string).isRequired,
      }),
    ),
  }),
};

export default DotaMainGroups;
