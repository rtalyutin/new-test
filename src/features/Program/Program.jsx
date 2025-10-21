import PropTypes from 'prop-types';
import './Program.css';

const Program = ({ sessions }) => (
  <ol className="program">
    {sessions.map(({ id, title, description, date, format }) => (
      <li key={id} className="program__item">
        <div className="program__date">{date}</div>
        <div className="program__body">
          <h3 className="program__title">{title}</h3>
          <p className="program__description">{description}</p>
          <span className="program__format">{format}</span>
        </div>
      </li>
    ))}
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
    })
  ).isRequired,
};

export default Program;
