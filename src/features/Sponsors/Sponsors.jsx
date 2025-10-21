import PropTypes from 'prop-types';
import './Sponsors.css';

const Sponsors = ({ data }) => {
  const intro = data?.intro ?? {};
  const tiers = Array.isArray(data?.tiers) ? data.tiers : [];

  const featuredTier = tiers.find((tier) => tier?.featured);
  const regularTiers = tiers.filter((tier) => !tier?.featured);

  const featuredSponsors = Array.isArray(featuredTier?.sponsors)
    ? featuredTier.sponsors
    : [];
  const regularTiersWithSponsors = regularTiers.filter((tier) =>
    Array.isArray(tier?.sponsors) && tier.sponsors.length > 0,
  );

  const heroCta = featuredTier?.cta;
  const heroCtaHref = typeof heroCta?.href === 'string' ? heroCta.href : '';
  const heroCtaIsExternal = /^https?:/i.test(heroCtaHref);

  return (
    <div className="sponsors">
      <div className="sponsors__intro">
        {intro?.eyebrow ? (
          <span className="sponsors__eyebrow">{intro.eyebrow}</span>
        ) : null}
        {intro?.description ? (
          <p className="sponsors__description">{intro.description}</p>
        ) : null}
        {intro?.download?.href && intro?.download?.label ? (
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

      {featuredTier ? (
        <section
          className="sponsors__featured sponsors__panel sponsors__panel--featured"
          aria-labelledby={`${featuredTier.id}-heading`}
        >
          <div className="sponsors__featured-content">
            <h2 id={`${featuredTier.id}-heading`} className="sponsors__featured-title">
              {featuredTier.label}
            </h2>
            {featuredTier.description ? (
              <p className="sponsors__featured-description">
                {featuredTier.description}
              </p>
            ) : null}
            {Array.isArray(featuredTier.highlights) && featuredTier.highlights.length ? (
              <ul className="sponsors__featured-highlights">
                {featuredTier.highlights.map((highlight, index) => (
                  <li key={`${highlight}-${index}`} className="sponsors__featured-highlight">
                    {highlight}
                  </li>
                ))}
              </ul>
            ) : null}
            {Array.isArray(featuredTier.stats) && featuredTier.stats.length ? (
              <dl className="sponsors__featured-stats">
                {featuredTier.stats.map((stat, index) => (
                  <div key={`${stat.label || stat.value || index}`} className="sponsors__featured-stat">
                    {stat.value ? (
                      <dt className="sponsors__featured-stat-value">{stat.value}</dt>
                    ) : null}
                    {stat.label ? (
                      <dd className="sponsors__featured-stat-label">{stat.label}</dd>
                    ) : null}
                  </div>
                ))}
              </dl>
            ) : null}
            {heroCta?.href && heroCta?.label ? (
              <a
                className="sponsors__featured-cta"
                href={heroCtaHref}
                target={heroCtaIsExternal ? '_blank' : undefined}
                rel={heroCtaIsExternal ? 'noreferrer' : undefined}
              >
                {heroCta.label}
              </a>
            ) : null}
          </div>
          {featuredSponsors.length ? (
            <ul className="sponsors__featured-logos">
              {featuredSponsors.map((sponsor) => (
                <li
                  key={sponsor.name}
                  className="sponsors__featured-logo-item sponsors__logo-spot"
                >
                  {sponsor?.url ? (
                    <a
                      className="sponsors__featured-logo-link sponsors__logo-tile"
                      href={sponsor.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Перейти на сайт ${sponsor.name}`}
                    >
                      <img
                        className="sponsors__featured-logo-image"
                        src={sponsor.logo}
                        alt={sponsor.alt || sponsor.name}
                        loading="lazy"
                      />
                    </a>
                  ) : (
                    <div className="sponsors__featured-logo-static sponsors__logo-tile">
                      <img
                        className="sponsors__featured-logo-image"
                        src={sponsor.logo}
                        alt={sponsor.alt || sponsor.name}
                        loading="lazy"
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {regularTiersWithSponsors.length ? (
        <div className="sponsors__tiers">
          {regularTiersWithSponsors.map((tier) => (
            <section
              key={tier.id}
              className="sponsors__tier sponsors__panel"
              aria-labelledby={`${tier.id}-heading`}
            >
              <div className="sponsors__tier-header">
                <h3 id={`${tier.id}-heading`} className="sponsors__tier-title">
                  {tier.label}
                </h3>
                {tier.description ? (
                  <p className="sponsors__tier-description">{tier.description}</p>
                ) : null}
                {Array.isArray(tier.highlights) && tier.highlights.length ? (
                  <ul className="sponsors__tier-highlights">
                    {tier.highlights.map((highlight, index) => (
                      <li key={`${tier.id}-highlight-${index}`}>{highlight}</li>
                    ))}
                  </ul>
                ) : null}
                {Array.isArray(tier.stats) && tier.stats.length ? (
                  <dl className="sponsors__tier-stats">
                    {tier.stats.map((stat, index) => (
                      <div key={`${tier.id}-stat-${index}`} className="sponsors__tier-stat">
                        {stat.value ? (
                          <dt className="sponsors__tier-stat-value">{stat.value}</dt>
                        ) : null}
                        {stat.label ? (
                          <dd className="sponsors__tier-stat-label">{stat.label}</dd>
                        ) : null}
                      </div>
                    ))}
                  </dl>
                ) : null}
              </div>
              <ul className="sponsors__logos">
                {(Array.isArray(tier.sponsors) ? tier.sponsors : []).map((sponsor) => {
                  const hasLink = Boolean(sponsor?.url);

                  return (
                    <li
                      key={sponsor.name}
                      className="sponsors__logo-item sponsors__logo-spot"
                    >
                      {hasLink ? (
                        <a
                          className="sponsors__logo-link sponsors__logo-tile"
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
                      ) : (
                        <div className="sponsors__logo-static sponsors__logo-tile">
                          <img
                            className="sponsors__logo"
                            src={sponsor.logo}
                            alt={sponsor.alt || sponsor.name}
                            loading="lazy"
                          />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const sponsorShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  url: PropTypes.string,
  alt: PropTypes.string,
});

const statShape = PropTypes.shape({
  label: PropTypes.string,
  value: PropTypes.string,
});

const ctaShape = PropTypes.shape({
  label: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
});

Sponsors.propTypes = {
  data: PropTypes.shape({
    intro: PropTypes.shape({
      eyebrow: PropTypes.string,
      description: PropTypes.string,
      download: PropTypes.shape({
        label: PropTypes.string,
        href: PropTypes.string,
      }),
    }),
    tiers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        description: PropTypes.string,
        featured: PropTypes.bool,
        highlights: PropTypes.arrayOf(PropTypes.string),
        stats: PropTypes.arrayOf(statShape),
        cta: ctaShape,
        sponsors: PropTypes.arrayOf(sponsorShape),
      }),
    ),
  }).isRequired,
};

export default Sponsors;
