import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import SponsorModal from '../../components/SponsorModal/SponsorModal.jsx';
import './Sponsors.css';

const resolveSponsorLogo = (logoPath) => {
  if (!logoPath) {
    return '';
  }

  if (/^https?:/i.test(logoPath)) {
    return logoPath;
  }

  try {
    return new URL(logoPath, import.meta.url).href;
  } catch (error) {
    console.warn('Не удалось обработать логотип спонсора', logoPath, error);
    return logoPath;
  }
};

const normalizeSponsors = (sponsors) =>
  Array.isArray(sponsors)
    ? sponsors.map((sponsor) => ({
        ...sponsor,
        logo: resolveSponsorLogo(sponsor.logo),
      }))
    : [];

const CheckIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    focusable="false"
    aria-hidden="true"
  >
    <path
      d="M10.242 16.314a1.25 1.25 0 0 1-1.768 0l-3.788-3.788a1.25 1.25 0 1 1 1.768-1.768l2.904 2.903 7.318-7.317a1.25 1.25 0 0 1 1.768 1.768z"
      fill="currentColor"
    />
  </svg>
);

CheckIcon.propTypes = {
  className: PropTypes.string,
};

CheckIcon.defaultProps = {
  className: undefined,
};

const SponsorsTier = ({ tier }) => {
  const hasHighlights = Array.isArray(tier?.highlights) && tier.highlights.length > 0;
  const hasStats = Array.isArray(tier?.stats) && tier.stats.length > 0;
  const sponsors = Array.isArray(tier?.sponsors) ? tier.sponsors : [];

  return (
    <article className="sponsor-tier" aria-labelledby={`${tier.id}-title`}>
      <header className="sponsor-tier__heading">
        <h3 id={`${tier.id}-title`} className="sponsor-tier__title">
          {tier.label}
        </h3>
        {tier.description ? (
          <p className="sponsor-tier__description">{tier.description}</p>
        ) : null}
      </header>

      {hasHighlights ? (
        <ul className="sponsor-tier__highlights">
          {tier.highlights.map((highlight, index) => (
            <li key={`${tier.id}-highlight-${index}`} className="sponsor-tier__highlight">
              <CheckIcon className="sponsor-tier__highlight-icon" />
              <p className="sponsor-tier__highlight-text">{highlight}</p>
            </li>
          ))}
        </ul>
      ) : null}

      {hasStats ? (
        <dl className="sponsor-tier__stats">
          {tier.stats.map((stat, index) => (
            <div key={`${tier.id}-stat-${index}`} className="sponsor-tier__stat">
              {stat.value ? <dt className="sponsor-tier__stat-value">{stat.value}</dt> : null}
              {stat.label ? <dd className="sponsor-tier__stat-label">{stat.label}</dd> : null}
            </div>
          ))}
        </dl>
      ) : null}

      {sponsors.length ? (
        <ul className="sponsor-tier__logos">
          {sponsors.map((sponsor) => (
            <li key={`${tier.id}-${sponsor.name}`}>
              {sponsor.url ? (
                <a
                  className="sponsors__logo-link"
                  href={sponsor.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Перейти на сайт ${sponsor.name}`}
                >
                  <img
                    className="sponsors__logo-image"
                    src={sponsor.logo}
                    alt={sponsor.alt || sponsor.name}
                    loading="lazy"
                  />
                </a>
              ) : (
                <div className="sponsor-tier__logo-static">
                  <img
                    className="sponsors__logo-image"
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
    </article>
  );
};

SponsorsTier.propTypes = {
  tier: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
    highlights: PropTypes.arrayOf(PropTypes.string),
    stats: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
      }),
    ),
    sponsors: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        logo: PropTypes.string.isRequired,
        url: PropTypes.string,
        alt: PropTypes.string,
      }),
    ),
  }).isRequired,
};

const Sponsors = ({ data, onSponsorFormSubmit }) => {
  const intro = data?.intro ?? {};
  const benefits = data?.benefits ?? {};
  const benefitItems = Array.isArray(benefits?.items) ? benefits.items : [];

  const tiers = useMemo(() => {
    if (!Array.isArray(data?.tiers)) {
      return [];
    }

    return data.tiers.map((tier) => ({
      ...tier,
      sponsors: normalizeSponsors(tier?.sponsors),
    }));
  }, [data]);

  const featuredTier = tiers.find((tier) => tier?.featured);
  const featuredSponsors = useMemo(() => {
    if (!featuredTier || !Array.isArray(featuredTier.sponsors)) {
      return [];
    }

    return featuredTier.sponsors;
  }, [featuredTier]);

  const featuredHighlightsLabel = useMemo(() => {
    if (!featuredTier) {
      return '';
    }

    if (featuredTier.highlightsTitle) {
      return featuredTier.highlightsTitle;
    }

    if (featuredSponsors.length === 1) {
      return `Преимущества ${featuredSponsors[0].name}`;
    }

    return 'Преимущества партнёров';
  }, [featuredTier, featuredSponsors]);

  const regularTiers = useMemo(() => {
    return tiers.filter((tier) => {
      if (tier?.featured) {
        return false;
      }

      const hasSponsors = Array.isArray(tier?.sponsors) && tier.sponsors.length > 0;
      const hasDescription = Boolean(tier?.description);
      const hasHighlights = Array.isArray(tier?.highlights) && tier.highlights.length > 0;
      const hasStats = Array.isArray(tier?.stats) && tier.stats.length > 0;

      return hasSponsors || hasDescription || hasHighlights || hasStats;
    });
  }, [tiers]);

  const heroCta = featuredTier?.cta;
  const heroCtaHref = typeof heroCta?.href === 'string' ? heroCta.href : '';
  const heroCtaIsExternal = /^https?:/i.test(heroCtaHref);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSubmissionError(null);
    setIsSubmitting(false);
  }, []);

  const handleModalSubmit = useCallback(
    async (formData) => {
      setSubmissionError(null);

      if (typeof onSponsorFormSubmit !== 'function') {
        setIsModalOpen(false);
        return;
      }

      try {
        setIsSubmitting(true);
        await Promise.resolve(onSponsorFormSubmit(formData));
        setIsModalOpen(false);
      } catch (error) {
        console.error('Не удалось отправить форму спонсора', error);
        setSubmissionError('Не удалось отправить форму. Попробуйте ещё раз.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSponsorFormSubmit],
  );

  const hasDownloadCta = Boolean(intro?.download?.href && intro?.download?.label);

  return (
    <div className="sponsors">
      <div className="sponsors__intro">
        {intro?.eyebrow ? <p className="sponsors__eyebrow">{intro.eyebrow}</p> : null}
        {intro?.description ? (
          <p className="sponsors__description">{intro.description}</p>
        ) : null}
        <div className="sponsors__actions">
          <button type="button" className="sponsors__cta-button" onClick={openModal}>
            Стать спонсором/партнёром
          </button>
          {hasDownloadCta ? (
            <a
              className="sponsors__download-link"
              href={intro.download.href}
              target="_blank"
              rel="noreferrer"
            >
              {intro.download.label}
            </a>
          ) : null}
        </div>
      </div>

      {benefitItems.length ? (
        <section className="sponsors__benefits" aria-labelledby="sponsors-benefits-title">
          <h3 id="sponsors-benefits-title" className="sponsors__benefits-title">
            {benefits.title || 'Ключевые выгоды партнёрства'}
          </h3>
          <ul className="sponsors__benefit-list">
            {benefitItems.map((item, index) => (
              <li key={`${item}-${index}`} className="sponsors__benefit-card">
                <span className="sponsors__benefit-index">{String(index + 1).padStart(2, '0')}</span>
                <p className="sponsors__benefit-text">{item}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {featuredTier ? (
        <section className="sponsors__feature" aria-labelledby={`${featuredTier.id}-title`}>
          <div className="sponsors__feature-content">
            <h2 id={`${featuredTier.id}-title`} className="sponsors__feature-title">
              {featuredTier.label}
            </h2>
            {featuredTier.description ? (
              <p className="sponsors__feature-description">{featuredTier.description}</p>
            ) : null}

            {Array.isArray(featuredTier.highlights) && featuredTier.highlights.length ? (
              <div className="sponsors__feature-highlights">
                {featuredHighlightsLabel ? (
                  <p className="sponsors__feature-highlights-label">{featuredHighlightsLabel}</p>
                ) : null}
                <ul className="sponsors__feature-highlights-list">
                  {featuredTier.highlights.map((highlight, index) => (
                    <li key={`${featuredTier.id}-highlight-${index}`} className="sponsors__feature-highlight">
                      <CheckIcon className="sponsors__feature-highlight-icon" />
                      <span className="sponsors__feature-highlight-text">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {Array.isArray(featuredTier.stats) && featuredTier.stats.length ? (
              <dl className="sponsors__feature-stats">
                {featuredTier.stats.map((stat, index) => (
                  <div key={`${featuredTier.id}-stat-${index}`} className="sponsors__feature-stat">
                    {stat.value ? (
                      <dt className="sponsors__feature-stat-value">{stat.value}</dt>
                    ) : null}
                    {stat.label ? (
                      <dd className="sponsors__feature-stat-label">{stat.label}</dd>
                    ) : null}
                  </div>
                ))}
              </dl>
            ) : null}

            {heroCta?.href && heroCta?.label ? (
              <a
                className="sponsors__feature-cta"
                href={heroCtaHref}
                target={heroCtaIsExternal ? '_blank' : undefined}
                rel={heroCtaIsExternal ? 'noreferrer' : undefined}
              >
                {heroCta.label}
              </a>
            ) : null}
          </div>

          {featuredSponsors.length ? (
            <ul className="sponsors__feature-logos">
              {featuredSponsors.map((sponsor) => (
                <li key={`featured-${sponsor.name}`}>
                  {sponsor.url ? (
                    <a
                      className="sponsors__logo-card"
                      href={sponsor.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Перейти на сайт ${sponsor.name}`}
                    >
                      <img
                        className="sponsors__logo-image"
                        src={sponsor.logo}
                        alt={sponsor.alt || sponsor.name}
                        loading="lazy"
                      />
                    </a>
                  ) : (
                    <div className="sponsors__logo-card">
                      <img
                        className="sponsors__logo-image"
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

      {regularTiers.length ? (
        <div className="sponsors__tiers">
          {regularTiers.map((tier) => (
            <SponsorsTier key={tier.id} tier={tier} />
          ))}
        </div>
      ) : null}

      <SponsorModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        isSubmitting={isSubmitting}
        errorMessage={submissionError}
      />
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
    benefits: PropTypes.shape({
      title: PropTypes.string,
      items: PropTypes.arrayOf(PropTypes.string),
    }),
    tiers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        description: PropTypes.string,
        featured: PropTypes.bool,
        highlights: PropTypes.arrayOf(PropTypes.string),
        highlightsTitle: PropTypes.string,
        stats: PropTypes.arrayOf(statShape),
        cta: ctaShape,
        sponsors: PropTypes.arrayOf(sponsorShape),
      }),
    ),
  }).isRequired,
  onSponsorFormSubmit: PropTypes.func,
};

Sponsors.defaultProps = {
  onSponsorFormSubmit: undefined,
};

export default Sponsors;
