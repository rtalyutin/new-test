import PropTypes from 'prop-types';
import './Bracket.css';

const Bracket = ({ stages }) => (
  <div className="bracket">
    {stages.map(({ name, matches }) => (
      <section key={name} className="bracket__stage">
        <h3 className="bracket__stage-title">{name}</h3>
        <ul className="bracket__matches">
          {matches.map(({ id, teams, time }) => (
            <li key={id} className="bracket__match">
              <div className="bracket__teams">
                <span className="bracket__team">{teams.home}</span>
                <span className="bracket__vs">vs</span>
                <span className="bracket__team">{teams.away}</span>
              </div>
              <span className="bracket__time">{time}</span>
            </li>
          ))}
        </ul>
      </section>
    ))}
  </div>
);

Bracket.propTypes = {
  stages: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      matches: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          time: PropTypes.string.isRequired,
          teams: PropTypes.shape({
            home: PropTypes.string.isRequired,
            away: PropTypes.string.isRequired,
          }).isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default Bracket;
