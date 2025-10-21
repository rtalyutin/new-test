import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const DEFAULT_EXPIRED_LABEL = 'Сезон уже стартовал';

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

const Hero = ({ data }) => {
  const { branding, title, subtitle, background, match, tabs, qualifiers, prize, timer, logos } = data;

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(timer?.deadline));

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

  const timerExpiredLabel = timer?.expiredLabel ?? DEFAULT_EXPIRED_LABEL;
  const timerUnavailableLabel = timer?.fallbackLabel ?? timerExpiredLabel;
  const countdownUnavailable = timer?.deadline && timeLeft === null;

  return (
    <div className="hero hero--versus">
      <div className="hero__background" aria-hidden="true">
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
          {branding?.tagline ? <span className="hero__tagline">{branding.tagline}</span> : null}
          <h1 className="hero__title">{title}</h1>
          <p className="hero__subtitle">{subtitle}</p>

          {match ? (
            <div className="hero__matchup" role="group" aria-label="Противостояние игр">
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

        {Array.isArray(qualifiers) && qualifiers.length > 0 ? (
          <div className="hero__qualifiers" role="list">
            {qualifiers.map((qualifier) => (
              <article key={qualifier.title} className="hero__qualifier" role="listitem">
                {qualifier.tag ? <span className="hero__qualifier-tag">{qualifier.tag}</span> : null}
                <h2 className="hero__qualifier-title">{qualifier.title}</h2>
                {qualifier.description ? <p className="hero__qualifier-description">{qualifier.description}</p> : null}
                {qualifier.cta ? (
                  <a className="hero__qualifier-cta" href={qualifier.cta.href} aria-label={qualifier.cta.ariaLabel || qualifier.cta.label}>
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
  }).isRequired,
};

export default Hero;
