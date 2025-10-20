import PropTypes from 'prop-types';

const Benefits = ({ items }) => (
  <div className="benefits">
    {items.map(({ title, description, icon, category }) => (
      <article key={title} className="benefits__card">
        <div className="benefits__icon" aria-hidden="true">
          {icon}
        </div>
        <div className="benefits__body">
          <span className="benefits__category">{category}</span>
          <h3 className="benefits__title">{title}</h3>
          <p className="benefits__description">{description}</p>
        </div>
      </article>
    ))}
  </div>
);

Benefits.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default Benefits;
