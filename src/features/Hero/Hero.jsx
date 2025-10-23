import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import msLogo from './ms.png';
import fksLogo from './fks.png';
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
    prize,
    timer,
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

          {primaryCta || (Array.isArray(branding?.links) && branding.links.length > 0) ? (
            <div className="hero__actions">
              {primaryCta ? (
                <a
                  className="hero__primary-cta"
                  href={primaryCta.href}
                  aria-label={primaryCta.ariaLabel || primaryCta.label}
                >
                  {primaryCta.label}
                </a>
              ) : null}
              {Array.isArray(branding?.links) && branding.links.length > 0 ? (
                <nav className="hero__quicklinks" aria-label="Полезные ссылки сезона">
                  {branding.links.map((link) => (
                    <a key={`${link.href || link.label}`} className="hero__quicklink" href={link.href}>
                      {link.label}
                    </a>
                  ))}
                </nav>
              ) : null}
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

        <footer className="hero__footer">
          {prize ? (
            <div className="hero__stat">
              <span className="hero__stat-label">{prize.label}</span>
              <span className="hero__stat-value">{prize.value}</span>
            </div>
          ) : null}

          {timer?.deadline ? (
            <div className="hero__countdown" aria-live="polite">
              <div className="hero__countdown-header">
                <span className="hero__countdown-label">{timer.label}</span>

                <div className="hero__support" aria-label="При поддержке">
                  <span className="hero__support-label">при поддержке</span>
                  <div className="hero__support-logos" role="group" aria-label="Логотипы партнеров">
                    <img className="hero__support-logo" src={msLogo} alt="Microsoft" />
                    <img
                      className="hero__support-logo"
                      src={fksLogo}
                      alt="Федерация компьютерного спорта"
                    />
                  </div>
                </div>

              </div>
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
          <div className="hero__support" aria-label="При поддержке">
            <span className="hero__support-label">при поддержке</span>
            <div className="hero__support-logos" role="group" aria-label="Логотипы партнеров">
              <img className="hero__support-logo" src={msLogo} alt="Microsoft" />
              <img
                className="hero__support-logo"
                src={fksLogo}
                alt="Федерация компьютерного спорта"
              />
            </div>
          </div>
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
