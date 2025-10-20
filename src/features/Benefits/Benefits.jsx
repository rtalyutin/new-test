import PropTypes from 'prop-types';

const Benefits = ({ data }) => (
  <div className="benefits">
    {data.lead && <p className="benefits__lead">{data.lead}</p>}
    <ul className="benefits__list">
      {data.items.map((item) => (
        <li key={item.id} className="benefits__item">
          {item.icon && (
            <span className="benefits__icon" aria-hidden="true">
              {item.icon}
            </span>
          )}
          <div className="benefits__body">
            <h3 className="benefits__item-title">{item.title}</h3>
            <p className="benefits__item-description">{item.description}</p>
          </div>
        </li>
      ))}
    </ul>
    {data.cta && (
      <a className="benefits__cta" href={data.cta.link} target="_blank" rel="noreferrer">
        {data.cta.text}
      </a>
    )}
  </div>
);

Benefits.propTypes = {
  data: PropTypes.shape({
    lead: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        icon: PropTypes.string,
      }),
    ).isRequired,
    cta: PropTypes.shape({
      text: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default Benefits;
