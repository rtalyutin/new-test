import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SponsorModal from '../../components/SponsorModal/SponsorModal.jsx';
import './Sponsors.css';

const SLIDER_SPONSOR_THRESHOLD = 6;

const useAutoScroll = (isEnabled) => {
  const listRef = useRef(null);

  useEffect(() => {
    if (!isEnabled || typeof window === 'undefined') {
      return undefined;
    }

    const listElement = listRef.current;

    if (!listElement) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    const desktopMedia = window.matchMedia(
      '(pointer: fine) and (min-width: 1024px)',
    );

    if (prefersReducedMotion.matches || !desktopMedia.matches) {
      return undefined;
    }

    let animationFrame;
    let isHovering = false;
    let lastTime;
    let direction = 1;
    let isActive = false;
    let isInView = false;

    const step = (timestamp) => {
      if (!isActive || !listRef.current) {
        return;
      }

      if (isHovering) {
        lastTime = timestamp;
        animationFrame = window.requestAnimationFrame(step);
        return;
      }

      if (typeof lastTime !== 'number') {
        lastTime = timestamp;
        animationFrame = window.requestAnimationFrame(step);
        return;
      }

      const delta = timestamp - lastTime;
      lastTime = timestamp;

      const element = listRef.current;
      const maxScroll = element.scrollWidth - element.clientWidth;

      if (maxScroll <= 0) {
        isActive = false;
        return;
      }

      const speed = 0.12;
      element.scrollLeft += direction * speed * delta;

      if (element.scrollLeft <= 0) {
        element.scrollLeft = 0;
        direction = 1;
      } else if (element.scrollLeft >= maxScroll) {
        element.scrollLeft = maxScroll;
        direction = -1;
      }

      animationFrame = window.requestAnimationFrame(step);
    };

    const start = () => {
      if (isActive) {
        return;
      }
      isActive = true;
      lastTime = undefined;
      animationFrame = window.requestAnimationFrame(step);
    };

    const stop = () => {
      isActive = false;
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
        if (isInView && desktopMedia.matches && !prefersReducedMotion.matches) {
          start();
        } else {
          stop();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(listElement);

    const handleMouseEnter = () => {
      isHovering = true;
    };

    const handleMouseLeave = () => {
      isHovering = false;
    };

    listElement.addEventListener('mouseenter', handleMouseEnter);
    listElement.addEventListener('mouseleave', handleMouseLeave);

    const handleDesktopChange = (event) => {
      if (!event.matches) {
        stop();
      } else if (isInView && !prefersReducedMotion.matches) {
        start();
      }
    };

    const handleMotionChange = (event) => {
      if (event.matches) {
        stop();
      } else if (isInView && desktopMedia.matches) {
        start();
      }
    };

    desktopMedia.addEventListener('change', handleDesktopChange);
    prefersReducedMotion.addEventListener('change', handleMotionChange);

    return () => {
      stop();
      observer.disconnect();
      listElement.removeEventListener('mouseenter', handleMouseEnter);
      listElement.removeEventListener('mouseleave', handleMouseLeave);
      desktopMedia.removeEventListener('change', handleDesktopChange);
      prefersReducedMotion.removeEventListener('change', handleMotionChange);
    };
  }, [isEnabled]);

  return listRef;
};

const SponsorsTier = ({ tier, enableSlider, enableAutoScroll }) => {
  const sliderRef = useAutoScroll(enableSlider && enableAutoScroll);

  const sponsors = Array.isArray(tier?.sponsors) ? tier.sponsors : [];

  return (
    <section
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
      <ul
        ref={enableSlider ? sliderRef : null}
        className={`sponsors__logos${enableSlider ? ' sponsors__logos--slider' : ''}`}
      >
        {sponsors.map((sponsor) => {
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
  enableSlider: PropTypes.bool,
  enableAutoScroll: PropTypes.bool,
};

SponsorsTier.defaultProps = {
  enableSlider: false,
  enableAutoScroll: false,
};

const Sponsors = ({ data, onSponsorFormSubmit }) => {
  const intro = data?.intro ?? {};
  const tiers = useMemo(
    () => (Array.isArray(data?.tiers) ? data.tiers : []),
    [data],
  );

  const featuredTier = tiers.find((tier) => tier?.featured);

  const featuredSponsors = Array.isArray(featuredTier?.sponsors)
    ? featuredTier.sponsors
    : [];

  const regularTiersWithMeta = useMemo(
    () =>
      tiers
        .filter(
          (tier) =>
            !tier?.featured && Array.isArray(tier?.sponsors) && tier.sponsors.length > 0,
        )
        .map((tier) => {
          const sponsors = tier.sponsors;
          const preferSlider = tier.layout === 'slider';
          const enableSlider = preferSlider || sponsors.length > SLIDER_SPONSOR_THRESHOLD;
          const enableAutoScroll = enableSlider && (tier.autoScroll ?? true);

          return {
            ...tier,
            sponsors,
            enableSlider,
            enableAutoScroll,
          };
        }),
    [tiers],
  );

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
        {intro?.eyebrow ? (
          <span className="sponsors__eyebrow">{intro.eyebrow}</span>
        ) : null}
        {intro?.description ? (
          <p className="sponsors__description">{intro.description}</p>
        ) : null}
        <div className="sponsors__cta-group">
          <button
            type="button"
            className="sponsors__cta sponsors__cta--primary"
            onClick={openModal}
          >
            Стать спонсором
          </button>
          {hasDownloadCta ? (
            <a
              className="sponsors__cta sponsors__cta--ghost"
              href={intro.download.href}
              target="_blank"
              rel="noreferrer"
            >
              {intro.download.label}
            </a>
          ) : null}
        </div>
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

      {regularTiersWithMeta.length ? (
        <div className="sponsors__tiers">
          {regularTiersWithMeta.map((tier) => (
            <SponsorsTier
              key={tier.id}
              tier={tier}
              enableSlider={tier.enableSlider}
              enableAutoScroll={tier.enableAutoScroll}
            />
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
    tiers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        description: PropTypes.string,
        featured: PropTypes.bool,
        layout: PropTypes.oneOf(['slider', 'grid']),
        autoScroll: PropTypes.bool,
        highlights: PropTypes.arrayOf(PropTypes.string),
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
