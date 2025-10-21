import PropTypes from 'prop-types';
import './Program.css';

const Program = ({ sessions }) => (
  <ol className="program">
    {sessions.map(
      ({
        id,
        title,
        description,
        date,
        format,
        location,
        activities,
        resources,
      }) => (
        <li key={id} className="program__item">
          <div className="program__date">{date}</div>
          <div className="program__body">
            <h3 className="program__title">{title}</h3>
            <p className="program__description">{description}</p>
            <span className="program__format">{format}</span>
            {location && <span className="program__location">{location}</span>}
            {(activities?.length || resources?.length) && (
              <div className="program__meta">
                {activities?.length > 0 && (
                  <div className="program__activities">
                    <h4 className="program__subtitle">
                      Активности для зрителей и брендов
                    </h4>
                    <ul className="program__list">
                      {activities.map((item) => (
                        <li key={item} className="program__list-item">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {resources?.length > 0 && (
                  <div className="program__resources">
                    <h4 className="program__subtitle">Материалы и ссылки</h4>
                    <ul className="program__links">
                      {resources.map(({ label, url }) => (
                        <li key={url} className="program__links-item">
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            {label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </li>
      )
    )}
  </ol>
);

Program.propTypes = {
  sessions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      format: PropTypes.string.isRequired,
      location: PropTypes.string,
      activities: PropTypes.arrayOf(PropTypes.string),
      resources: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
};

export default Program;
