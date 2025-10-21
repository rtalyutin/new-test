import PropTypes from 'prop-types';
import './Overview.css';

const Overview = ({ data }) => {
  const { lead, goals, metrics } = data;

  return (
    <div className="overview">
      <p className="overview__lead">{lead}</p>
      <div className="overview__layout">
        <div className="overview__goals" aria-labelledby="overview-goals-title">
          <h3 id="overview-goals-title" className="overview__subtitle">
            Ключевые цели сезона
          </h3>
          <ul className="overview__goals-list">
            {goals.map((goal) => (
              <li key={goal} className="overview__goal">
                <span className="overview__goal-marker" aria-hidden="true" />
                <span className="overview__goal-text">{goal}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="overview__metrics">
          {metrics.map(({ label, value, description }) => (
            <article key={label} className="overview__metric-card">
              <p className="overview__metric-value">{value}</p>
              <h4 className="overview__metric-label">{label}</h4>
              {description ? (
                <p className="overview__metric-description">{description}</p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

Overview.propTypes = {
  data: PropTypes.shape({
    lead: PropTypes.string.isRequired,
    goals: PropTypes.arrayOf(PropTypes.string).isRequired,
    metrics: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        description: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
};

export default Overview;
