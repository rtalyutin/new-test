import config from './config.json';

const Schedule = () => (
  <div className="schedule">
    <p className="schedule__description">{config.description}</p>
    <ul className="schedule__list">
      {config.items.map((item) => (
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

export default Schedule;
