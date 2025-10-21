import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './RegistrationCta.css';

const calculateTimeLeft = (deadline) => {
  if (!deadline) {
    return null;
  }

  const parsed = new Date(deadline);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const now = Date.now();
  const difference = parsed.getTime() - now;

  if (difference <= 0) {
    return {
      expired: true,
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return {
    expired: false,
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
};

const RegistrationCta = ({ data }) => {
  const { title, description, deadline, termsTitle, terms, primaryCta, secondaryCta, disclaimer } = data;

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(deadline?.iso));

  useEffect(() => {
    if (!deadline?.iso || typeof window === 'undefined') {
      return undefined;
    }

    const tick = () => {
      setTimeLeft(calculateTimeLeft(deadline.iso));
    };

    tick();

    const intervalId = window.setInterval(tick, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [deadline?.iso]);

  const renderTimer = () => {
    if (!deadline?.iso || timeLeft === null) {
      return deadline?.fallback ? <span className="registration-cta__deadline-value">{deadline.fallback}</span> : null;
    }

    if (timeLeft.expired) {
      return deadline?.expiredLabel ? (
        <span className="registration-cta__deadline-value">{deadline.expiredLabel}</span>
      ) : null;
    }

    const countdownLabel = `Осталось ${parseInt(timeLeft.days, 10)} дн ${parseInt(
      timeLeft.hours,
      10,
    )} ч ${parseInt(timeLeft.minutes, 10)} мин ${parseInt(timeLeft.seconds, 10)} с`;

    return (
      <div
        className="registration-cta__countdown"
        role="timer"
        aria-live="polite"
        aria-label={countdownLabel}
      >
        <div className="registration-cta__countdown-segment">
          <span className="registration-cta__countdown-value">{timeLeft.days}</span>
          <span className="registration-cta__countdown-label">дн</span>
        </div>
        <div className="registration-cta__countdown-separator" aria-hidden="true">
          :
        </div>
        <div className="registration-cta__countdown-segment">
          <span className="registration-cta__countdown-value">{timeLeft.hours}</span>
          <span className="registration-cta__countdown-label">ч</span>
        </div>
        <div className="registration-cta__countdown-separator" aria-hidden="true">
          :
        </div>
        <div className="registration-cta__countdown-segment">
          <span className="registration-cta__countdown-value">{timeLeft.minutes}</span>
          <span className="registration-cta__countdown-label">мин</span>
        </div>
        <div className="registration-cta__countdown-separator" aria-hidden="true">
          :
        </div>
        <div className="registration-cta__countdown-segment">
          <span className="registration-cta__countdown-value">{timeLeft.seconds}</span>
          <span className="registration-cta__countdown-label">с</span>
        </div>
      </div>
    );
  };

  return (
    <div className="registration-cta">
      <header className="registration-cta__header">
        <div className="registration-cta__heading">
          <h3 className="registration-cta__title">{title}</h3>
          {description ? <p className="registration-cta__description">{description}</p> : null}
        </div>
        {deadline?.label ? (
          <div className="registration-cta__deadline" role="group" aria-label="Информация о дедлайне регистрации">
            <span className="registration-cta__deadline-label">{deadline.label}</span>
            {renderTimer()}
          </div>
        ) : null}
      </header>

      <div className="registration-cta__body">
        {termsTitle ? <span className="registration-cta__terms-title">{termsTitle}</span> : null}
        {Array.isArray(terms) && terms.length > 0 ? (
          <ul className="registration-cta__terms">
            {terms
              .map((term) => {
                if (typeof term === 'string') {
                  return (
                    <li key={term} className="registration-cta__term">
                      <span className="registration-cta__term-icon" aria-hidden="true">
                        ●
                      </span>
                      <span className="registration-cta__term-text">{term}</span>
                    </li>
                  );
                }

                if (term && typeof term === 'object') {
                  const { id, title: termTitle, quota, items, note } = term;
                  const key = id || termTitle || JSON.stringify(term);
                  const nestedItems = Array.isArray(items) ? items : [];

                  return (
                    <li key={key} className="registration-cta__term-group">
                      <div className="registration-cta__term-heading">
                        {termTitle ? <span className="registration-cta__term-title">{termTitle}</span> : null}
                        {quota ? <span className="registration-cta__term-quota">{quota}</span> : null}
                      </div>

                      {nestedItems.length > 0 ? (
                        <ul className="registration-cta__term-items">
                          {nestedItems.map((item) => (
                            <li key={item} className="registration-cta__term-item">
                              <span className="registration-cta__term-bullet" aria-hidden="true">
                                ●
                              </span>
                              <span className="registration-cta__term-text">{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      {note ? <p className="registration-cta__term-note">{note}</p> : null}
                    </li>
                  );
                }

                return null;
              })
              .filter(Boolean)}
          </ul>
        ) : null}
      </div>

      <div className="registration-cta__actions" role="group" aria-label="Действия регистрации">
        {primaryCta ? (
          <a
            className="registration-cta__button registration-cta__button--primary"
            href={primaryCta.href}
            aria-label={primaryCta.ariaLabel || primaryCta.label}
          >
            {primaryCta.label}
          </a>
        ) : null}
        {secondaryCta ? (
          <a
            className="registration-cta__button registration-cta__button--secondary"
            href={secondaryCta.href}
            aria-label={secondaryCta.ariaLabel || secondaryCta.label}
          >
            {secondaryCta.label}
          </a>
        ) : null}
      </div>

      <div className="registration-cta__mobile-spacer" aria-hidden="true" />

      {disclaimer ? <p className="registration-cta__disclaimer">{disclaimer}</p> : null}
    </div>
  );
};

RegistrationCta.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    deadline: PropTypes.shape({
      label: PropTypes.string,
      iso: PropTypes.string,
      fallback: PropTypes.string,
      expiredLabel: PropTypes.string,
    }),
    termsTitle: PropTypes.string,
    terms: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          id: PropTypes.string,
          title: PropTypes.string,
          quota: PropTypes.string,
          items: PropTypes.arrayOf(PropTypes.string),
          note: PropTypes.string,
        }),
      ]),
    ),
    primaryCta: PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      ariaLabel: PropTypes.string,
    }),
    secondaryCta: PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      ariaLabel: PropTypes.string,
    }),
    disclaimer: PropTypes.string,
  }).isRequired,
};

export default RegistrationCta;
