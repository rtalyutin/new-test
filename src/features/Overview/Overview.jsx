import PropTypes from 'prop-types';
import './Overview.css';

const Overview = ({ data }) => {
  const { lead, history, goals, metrics } = data;
  const historyTitle = history?.title ?? 'История сезона';
  const historySummary = history?.summary;
  const milestones = Array.isArray(history?.milestones) ? history.milestones : [];
  const mainGoal = Array.isArray(goals) && goals.length ? goals[0] : null;

  return (
    <div className="overview">
      <p className="overview__lead">{lead}</p>
      <div className="overview__layout">
        <section className="overview__history" aria-labelledby="overview-history-title">
          <h3 id="overview-history-title" className="overview__subtitle">
            {historyTitle}
          </h3>
          {historySummary ? (
            <p className="overview__history-summary">{historySummary}</p>
          ) : null}
          {milestones.length ? (
            <ol className="overview__timeline">
              {milestones.map((milestone, index) => {
                const { period, title, description } = milestone;

                return (
                  <li key={`${period || index}-${title || index}`} className="overview__timeline-item">
                    {period ? (
                      <span className="overview__timeline-period">{period}</span>
                    ) : null}
                    <div className="overview__timeline-content">
                      {title ? (
                        <h4 className="overview__timeline-title">{title}</h4>
                      ) : null}
                      {description ? (
                        <p className="overview__timeline-description">{description}</p>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : null}
          {mainGoal ? (
            <p className="overview__history-goal">
              <span className="overview__history-goal-label">Главная цель сезона:</span>
              <span className="overview__history-goal-text">{mainGoal}</span>
            </p>
          ) : null}
        </section>
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
    history: PropTypes.shape({
      title: PropTypes.string,
      summary: PropTypes.string,
      milestones: PropTypes.arrayOf(
        PropTypes.shape({
          period: PropTypes.string,
          title: PropTypes.string,
          description: PropTypes.string,
        }),
      ),
    }).isRequired,
    goals: PropTypes.arrayOf(PropTypes.string),
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
