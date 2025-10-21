import PropTypes from 'prop-types';
import './Divisions.css';

const Divisions = ({ divisions }) => {
  return (
    <div className="divisions">
      {divisions.map(
        ({
          id,
          title,
          description,
          deadline,
          icon,
          benefits,
          primaryCtaHref,
          primaryCtaLabel,
        }) => {
          const isExternalLink = /^https?:\/\//i.test(primaryCtaHref);

          return (
            <article key={id} className="divisions__card">
              <div className="divisions__card-sheen" aria-hidden="true" />
              <header className="divisions__header">
                {icon ? (
                  <span className="divisions__icon" aria-hidden="true">
                    {icon}
                  </span>
                ) : null}
                <div className="divisions__header-content">
                  <h3 className="divisions__title">{title}</h3>
                  <p className="divisions__description">{description}</p>
                </div>
              </header>
              <p className="divisions__deadline">{deadline}</p>
              <ul className="divisions__benefits" aria-label={`Преимущества дивизиона «${title}»`}>
                {benefits.map((benefit) => (
                  <li key={benefit} className="divisions__benefit">
                    <span className="divisions__benefit-marker" aria-hidden="true" />
                    <span className="divisions__benefit-text">{benefit}</span>
                  </li>
                ))}
              </ul>
              <a
                className="divisions__cta"
                href={primaryCtaHref}
                target={isExternalLink ? '_blank' : undefined}
                rel={isExternalLink ? 'noreferrer noopener' : undefined}
              >
                {primaryCtaLabel || 'Подать заявку'}
              </a>
            </article>
          );
        }
      )}
    </div>
  );
};

Divisions.propTypes = {
  divisions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      deadline: PropTypes.string.isRequired,
      icon: PropTypes.string,
      benefits: PropTypes.arrayOf(PropTypes.string).isRequired,
      primaryCtaHref: PropTypes.string.isRequired,
      primaryCtaLabel: PropTypes.string,
    })
  ).isRequired,
};

export default Divisions;
