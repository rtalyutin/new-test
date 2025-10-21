import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Hero.css';

const DEFAULT_EXPIRED_LABEL = 'Сезон уже стартовал';
const MOBILE_MEDIA_QUERY = '(max-width: 767px)';

const calculateTimeLeft = (deadline) => {
  if (!deadline) {
    return null;
  }

  const parsedDeadline = new Date(deadline);
  if (Number.isNaN(parsedDeadline.getTime())) {
    return null;
  }

  const now = Date.now();
  const distance = parsedDeadline.getTime() - now;

  if (distance <= 0) {
    return {
      expired: true,
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
    };
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  return {
    expired: false,
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
};

const getIsMobile = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia(MOBILE_MEDIA_QUERY).matches;
};

const Hero = ({ data }) => {
  const {
    branding,
    title,
    subtitle,
    background,
    match,
    tabs,
    qualifiers,
    prize,
    timer,
    logos,
    media,
    keyFacts,
    primaryCta,
  } = data;

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(timer?.deadline));
  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    if (!timer?.deadline || typeof window === 'undefined') {
      return undefined;
    }

    const update = () => {
      setTimeLeft(calculateTimeLeft(timer.deadline));
    };

    update();

    const intervalId = window.setInterval(update, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [timer?.deadline]);

  useEffect(() => {
    if (typeof window === 'undefined' || !media?.disableOnMobile) {
      return undefined;
    }

    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);

    const handleChange = (event) => {
      setIsMobile(event.matches);
    };

    setIsMobile(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }

    mediaQuery.addListener(handleChange);
    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, [media?.disableOnMobile]);

  const timerExpiredLabel = timer?.expiredLabel ?? DEFAULT_EXPIRED_LABEL;
  const timerUnavailableLabel = timer?.fallbackLabel ?? timerExpiredLabel;
  const countdownUnavailable = timer?.deadline && timeLeft === null;

  const videoSources = Array.isArray(media?.sources)
    ? media.sources.filter((source) => source && source.src)
    : [];
  const shouldRenderVideo = videoSources.length > 0 && !(media?.disableOnMobile && isMobile);
  const fallbackImage = media?.fallbackImage || media?.poster;

  return (
    <div className="hero hero--versus">
      <div className="hero__background" aria-hidden="true">
        {shouldRenderVideo ? (
          <video
            className="hero__background-video"
            autoPlay
            loop
            muted
            playsInline
            poster={media?.poster}
            preload="auto"
            {...(media?.ariaLabel ? { 'aria-label': media.ariaLabel } : { 'aria-hidden': 'true' })}
          >
            {videoSources.map((source) => (
              <source key={`${source.src}-${source.type || 'video/mp4'}`} src={source.src} type={source.type} />
            ))}
          </video>
        ) : null}

        {!shouldRenderVideo && fallbackImage ? (
          <div
            className="hero__background-fallback"
            style={{ backgroundImage: `url(${fallbackImage})` }}
          />
        ) : null}

        {background?.left ? (
          <div
            className="hero__background-layer hero__background-layer--left"
            style={{ backgroundImage: `url(${background.left})` }}
          />
        ) : null}
        {background?.right ? (
          <div
            className="hero__background-layer hero__background-layer--right"
            style={{ backgroundImage: `url(${background.right})` }}
          />
        ) : null}
      </div>
      <div className="hero__overlay" aria-hidden="true" />
      <div className="hero__inner hero__inner--versus">
        <header className="hero__topbar">
          <div className="hero__brand">
            <span className="hero__brand-mark" aria-hidden="true">
              YCS
            </span>
            <div className="hero__brand-text">
              {branding?.tagline ? <span className="hero__brand-tagline">{branding.tagline}</span> : null}
              {branding?.label ? <span className="hero__brand-label">{branding.label}</span> : null}
            </div>
          </div>
          {Array.isArray(branding?.links) && branding.links.length > 0 ? (
            <nav className="hero__topnav" aria-label="Навигация по турниру">
              <ul className="hero__topnav-list">
                {branding.links.map((link) => (
                  <li key={`${link.href || link.label}`} className="hero__topnav-item">
                    <a className="hero__topnav-link" href={link.href}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </header>

        <div className="hero__centerpiece">
          {branding?.seasonLabel ? (
            <span className="hero__season hero__badge hero__badge--accent">
              {branding.seasonLabel}
            </span>
          ) : null}
          {branding?.tagline ? (
            <span className="hero__tagline hero__display-lead">{branding.tagline}</span>
          ) : null}
          <h1 className="hero__title hero__display">{title}</h1>
          <p className="hero__subtitle hero__display-subtitle">{subtitle}</p>

          {primaryCta ? (
            <a
              className="hero__primary-cta"
              href={primaryCta.href}
              aria-label={primaryCta.ariaLabel || primaryCta.label}
            >
              {primaryCta.label}
            </a>
          ) : null}

          {match ? (
            <div
              className="hero__matchup hero__glass hero__glass--strong"
              role="group"
              aria-label="Противостояние игр"
            >
              {match.left ? (
                <div className="hero__match-side hero__match-side--left">
                  <span className="hero__match-code">{match.left.code}</span>
                  <span className="hero__match-name">{match.left.name}</span>
                  {match.left.note ? <span className="hero__match-note">{match.left.note}</span> : null}
                </div>
              ) : null}
              <span className="hero__match-versus" aria-hidden="true">
                VS
              </span>
              {match.right ? (
                <div className="hero__match-side hero__match-side--right">
                  <span className="hero__match-code">{match.right.code}</span>
                  <span className="hero__match-name">{match.right.name}</span>
                  {match.right.note ? <span className="hero__match-note">{match.right.note}</span> : null}
                </div>
              ) : null}
            </div>
          ) : null}

          {Array.isArray(tabs) && tabs.length > 0 ? (
            <div className="hero__tabs" role="tablist" aria-label="Игровые дисциплины">
              {tabs.map((tab) => (
                <a key={`${tab.href || tab.label}`} className="hero__tab" href={tab.href} role="tab">
                  {tab.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        {Array.isArray(keyFacts) && keyFacts.length > 0 ? (
          <div className="hero__keyfacts" role="list">
            {keyFacts.map((fact) => (
              <article
                key={fact.title}
                className="hero__keyfact hero__glass"
                role="listitem"
              >
                {fact.tag ? (
                  <span className="hero__keyfact-tag hero__badge hero__badge--soft">{fact.tag}</span>
                ) : null}
                <h2 className="hero__keyfact-title">{fact.title}</h2>
                {fact.value ? <p className="hero__keyfact-value">{fact.value}</p> : null}
                {fact.description ? <p className="hero__keyfact-description">{fact.description}</p> : null}
                {fact.cta ? (
                  <a
                    className="hero__keyfact-cta"
                    href={fact.cta.href}
                    aria-label={fact.cta.ariaLabel || fact.cta.label}
                  >
                    {fact.cta.label}
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}

        {Array.isArray(qualifiers) && qualifiers.length > 0 ? (
          <div className="hero__qualifiers" role="list">
            {qualifiers.map((qualifier) => (
              <article
                key={qualifier.title}
                className="hero__qualifier hero__glass hero__glass--soft"
                role="listitem"
              >
                {qualifier.tag ? (
                  <span className="hero__qualifier-tag hero__badge hero__badge--outline">
                    {qualifier.tag}
                  </span>
                ) : null}
                <h2 className="hero__qualifier-title">{qualifier.title}</h2>
                {qualifier.description ? <p className="hero__qualifier-description">{qualifier.description}</p> : null}
                {qualifier.cta ? (
                  <a
                    className="hero__qualifier-cta"
                    href={qualifier.cta.href}
                    aria-label={qualifier.cta.ariaLabel || qualifier.cta.label}
                  >
                    {qualifier.cta.label}
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}

        <footer className="hero__footer">
          {prize ? (
            <div className="hero__stat">
              <span className="hero__stat-label">{prize.label}</span>
              <span className="hero__stat-value">{prize.value}</span>
            </div>
          ) : null}

          {timer?.deadline ? (
            <div className="hero__countdown" aria-live="polite">
              <span className="hero__countdown-label">{timer.label}</span>
              {countdownUnavailable ? (
                <span className="hero__countdown-status">{timerUnavailableLabel}</span>
              ) : timeLeft ? (
                timeLeft.expired ? (
                  <span className="hero__countdown-status">{timerExpiredLabel}</span>
                ) : (
                  <div className="hero__countdown-grid" role="group" aria-label="Обратный отсчет до старта">
                    <div className="hero__countdown-segment">
                      <span className="hero__countdown-value">{timeLeft.days}</span>
                      <span className="hero__countdown-unit">дни</span>
                    </div>
                    <div className="hero__countdown-segment">
                      <span className="hero__countdown-value">{timeLeft.hours}</span>
                      <span className="hero__countdown-unit">часы</span>
                    </div>
                    <div className="hero__countdown-segment">
                      <span className="hero__countdown-value">{timeLeft.minutes}</span>
                      <span className="hero__countdown-unit">минуты</span>
                    </div>
                    <div className="hero__countdown-segment">
                      <span className="hero__countdown-value">{timeLeft.seconds}</span>
                      <span className="hero__countdown-unit">секунды</span>
                    </div>
                  </div>
                )
              ) : null}
            </div>
          ) : null}

          {Array.isArray(logos) && logos.length > 0 ? (
            <div className="hero__logos" aria-label="Партнеры и дисциплины">
              {logos.map((logo) => (
                <span key={logo} className="hero__logo-chip">
                  {logo}
                </span>
              ))}
            </div>
          ) : null}
        </footer>
      </div>
    </div>
  );
};

Hero.propTypes = {
  data: PropTypes.shape({
    branding: PropTypes.shape({
      tagline: PropTypes.string,
      label: PropTypes.string,
      seasonLabel: PropTypes.string,
      links: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          href: PropTypes.string.isRequired,
        })
      ),
    }).isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    background: PropTypes.shape({
      left: PropTypes.string,
      right: PropTypes.string,
    }),
    match: PropTypes.shape({
      left: PropTypes.shape({
        code: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        note: PropTypes.string,
      }),
      right: PropTypes.shape({
        code: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        note: PropTypes.string,
      }),
    }),
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired,
      })
    ),
    qualifiers: PropTypes.arrayOf(
      PropTypes.shape({
        tag: PropTypes.string,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        cta: PropTypes.shape({
          label: PropTypes.string.isRequired,
          href: PropTypes.string.isRequired,
          ariaLabel: PropTypes.string,
        }),
      })
    ),
    prize: PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
    timer: PropTypes.shape({
      label: PropTypes.string.isRequired,
      deadline: PropTypes.string.isRequired,
      expiredLabel: PropTypes.string,
      fallbackLabel: PropTypes.string,
    }),
    logos: PropTypes.arrayOf(PropTypes.string),
    media: PropTypes.shape({
      disableOnMobile: PropTypes.bool,
      poster: PropTypes.string,
      fallbackImage: PropTypes.string,
      ariaLabel: PropTypes.string,
      sources: PropTypes.arrayOf(
        PropTypes.shape({
          src: PropTypes.string.isRequired,
          type: PropTypes.string,
        })
      ),
    }),
    keyFacts: PropTypes.arrayOf(
      PropTypes.shape({
        tag: PropTypes.string,
        title: PropTypes.string.isRequired,
        value: PropTypes.string,
        description: PropTypes.string,
        cta: PropTypes.shape({
          label: PropTypes.string.isRequired,
          href: PropTypes.string.isRequired,
          ariaLabel: PropTypes.string,
        }),
      })
    ),
    primaryCta: PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      ariaLabel: PropTypes.string,
    }),
  }).isRequired,
};

export default Hero;
