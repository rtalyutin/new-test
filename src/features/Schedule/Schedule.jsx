import PropTypes from 'prop-types';

const Schedule = ({ data }) => (
  <div className="schedule">
    <p className="schedule__description">{data.description}</p>
    <ul className="schedule__list">
      {data.items.map((item) => (
        <li key={item.id} className="schedule__item">
          <time className="schedule__time" dateTime={item.isoDate}>
            {item.date}
          </time>
          <div className="schedule__details">
            <h4 className="schedule__title">{item.title}</h4>
            <p className="schedule__location">{item.location}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

Schedule.propTypes = {
  data: PropTypes.shape({
    description: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        isoDate: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default Schedule;
