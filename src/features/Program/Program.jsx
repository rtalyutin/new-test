import PropTypes from 'prop-types';

const Program = ({ data }) => (
  <div className="program">
    {data.days.map((day) => (
      <section key={day.id} className="program__day">
        <h3 className="program__day-title">{day.title}</h3>
        <p className="program__day-summary">{day.summary}</p>
        <ul className="program__sessions">
          {day.sessions.map((session) => (
            <li key={session.id} className="program__session">
              <span className="program__session-time">{session.time}</span>
              <div className="program__session-body">
                <h4 className="program__session-title">{session.title}</h4>
                <p className="program__session-speaker">{session.speaker}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    ))}
  </div>
);

Program.propTypes = {
  data: PropTypes.shape({
    days: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        title: PropTypes.string.isRequired,
        summary: PropTypes.string.isRequired,
        sessions: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
            time: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            speaker: PropTypes.string.isRequired,
          }),
        ).isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default Program;
