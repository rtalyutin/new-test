import PropTypes from 'prop-types';
import './Sponsors.css';

const Sponsors = ({ data }) => {
  const { intro, tiers } = data;

  return (
    <div className="sponsors">
      <div className="sponsors__intro">
        {intro?.eyebrow ? (
          <span className="sponsors__eyebrow">{intro.eyebrow}</span>
        ) : null}
        {intro?.description ? (
          <p className="sponsors__description">{intro.description}</p>
        ) : null}
        {intro?.download ? (
          <a
            className="sponsors__cta"
            href={intro.download.href}
            target="_blank"
            rel="noreferrer"
          >
            {intro.download.label}
          </a>
        ) : null}
      </div>
      <div className="sponsors__tiers">
        {tiers.map((tier) => (
          <section key={tier.id} className="sponsors__tier" aria-labelledby={`${tier.id}-heading`}>
            <h3 id={`${tier.id}-heading`} className="sponsors__tier-title">
              {tier.label}
            </h3>
            <ul className="sponsors__logos">
              {tier.sponsors.map((sponsor) => (
                <li key={sponsor.name} className="sponsors__logo-item">
                  <a
                    className="sponsors__logo-link"
                    href={sponsor.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Перейти на сайт ${sponsor.name}`}
                  >
                    <img
                      className="sponsors__logo"
                      src={sponsor.logo}
                      alt={sponsor.alt || sponsor.name}
                      loading="lazy"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
};

Sponsors.propTypes = {
  data: PropTypes.shape({
    intro: PropTypes.shape({
      eyebrow: PropTypes.string,
      description: PropTypes.string,
      download: PropTypes.shape({
        label: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired,
      }),
    }).isRequired,
    tiers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        sponsors: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string.isRequired,
            logo: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
            alt: PropTypes.string,
          }),
        ).isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default Sponsors;
