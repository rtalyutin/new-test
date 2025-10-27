import PropTypes from 'prop-types';
import './Overview.css';

const Overview = ({ data }) => {
  const { lead, metrics } = data;

  return (
    <div className="overview">
      <p className="overview__lead">{lead}</p>
      <div className="overview__metrics" role="list">
        {metrics.map(({ label, value, description }) => (
          <article key={label} className="overview__metric-card" role="listitem">
            <p className="overview__metric-value">{value}</p>
            <h4 className="overview__metric-label">{label}</h4>
            {description ? <p className="overview__metric-description">{description}</p> : null}
          </article>
        ))}
      </div>
    </div>
  );
};

Overview.propTypes = {
  data: PropTypes.shape({
    lead: PropTypes.string.isRequired,
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
