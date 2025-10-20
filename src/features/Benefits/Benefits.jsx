import PropTypes from 'prop-types';

const Benefits = ({ data }) => (
  <div className="benefits">
    <ul className="benefits__list">
      {data.items.map((item) => (
        <li key={item.id} className="benefits__item">
          <h3 className="benefits__item-title">{item.title}</h3>
          <p className="benefits__item-description">{item.description}</p>
        </li>
      ))}
    </ul>
  </div>
);

Benefits.propTypes = {
  data: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default Benefits;
