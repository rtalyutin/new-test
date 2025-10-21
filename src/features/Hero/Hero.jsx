import { useEffect, useMemo, useRef, useState } from 'react';
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

const Hero = ({ data, disableVideoOnMobile }) => {
  const {
    tagline,
    title,
    subtitle,
    season,
    media,
    facts,
    primaryCta,
    secondaryCta,
    timer,
  } = data;

  const videoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [autoplayFailed, setAutoplayFailed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mobileQuery = window.matchMedia('(max-width: 640px)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleMobileChange = (event) => {
      setIsMobile(event.matches);
    };

    const handleMotionChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    setIsMobile(mobileQuery.matches);
    setPrefersReducedMotion(reducedMotionQuery.matches);

    mobileQuery.addEventListener('change', handleMobileChange);
    reducedMotionQuery.addEventListener('change', handleMotionChange);

    return () => {
      mobileQuery.removeEventListener('change', handleMobileChange);
      reducedMotionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  const shouldDisableVideo = useMemo(() => {
    if (!media?.src) {
      return true;
    }

    if (prefersReducedMotion) {
      return true;
    }

    if (isMobile && (disableVideoOnMobile || media?.disableOnMobile)) {
      return true;
    }

    return false;
  }, [media?.src, media?.disableOnMobile, disableVideoOnMobile, isMobile, prefersReducedMotion]);

  useEffect(() => {
    if (shouldDisableVideo || autoplayFailed) {
      return;
    }

    const videoElement = videoRef.current;
    if (!videoElement) {
      return;
    }

    const playPromise = videoElement.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.catch(() => {
        setAutoplayFailed(true);
      });
    }
  }, [shouldDisableVideo, autoplayFailed, media?.src]);

  useEffect(() => {
    if (!shouldDisableVideo) {
      setAutoplayFailed(false);
    }
  }, [shouldDisableVideo]);

  const posterSource = useMemo(() => {
    if (!media) {
      return null;
    }

    if (isMobile && media.mobilePoster) {
      return media.mobilePoster;
    }

    return media.poster ?? null;
  }, [media, isMobile]);

  const showVideo = Boolean(media?.src) && !shouldDisableVideo && !autoplayFailed;

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
    <div className={`hero${showVideo ? '' : ' hero--static'}`}>
      <div className="hero__background" aria-hidden="true">
        {showVideo ? (
          <video
            ref={videoRef}
            className="hero__video"
            poster={posterSource || media?.poster}
            preload="metadata"
            muted
            loop
            playsInline
            autoPlay
          >
            <source src={media?.src} type={media?.type || 'video/mp4'} />
          </video>
        ) : posterSource ? (
          <img className="hero__poster" src={posterSource} alt={media?.alt || 'YarCyberSeason'} loading="lazy" />
        ) : null}
      </div>
      <div className="hero__overlay" aria-hidden="true" />
      <div className="hero__inner">
        <div className="hero__content">
          <span className="hero__tagline">{tagline}</span>
          <h1 className="hero__title">{title}</h1>
          <p className="hero__subtitle">{subtitle}</p>
          <div className="hero__meta" role="list">
            <span className="hero__meta-item hero__season" role="listitem">
              {season.label}
            </span>
            <span className="hero__meta-item hero__dates" role="listitem">
              {season.dates}
            </span>
            <span className="hero__meta-item hero__location" role="listitem">
              {season.location}
            </span>
          </div>
          <div className="hero__actions">
            {primaryCta ? (
              <a className="hero__cta" href={primaryCta.href} aria-label={primaryCta.ariaLabel || primaryCta.label}>
                {primaryCta.icon ? <span aria-hidden="true">{primaryCta.icon}</span> : null}
                <span>{primaryCta.label}</span>
              </a>
            ) : null}
            {secondaryCta ? (
              <a
                className="hero__cta hero__cta--secondary"
                href={secondaryCta.href}
                aria-label={secondaryCta.ariaLabel || secondaryCta.label}
              >
                {secondaryCta.icon ? <span aria-hidden="true">{secondaryCta.icon}</span> : null}
                <span>{secondaryCta.label}</span>
              </a>
            ) : null}
          </div>
          {primaryCta?.note ? <span className="hero__note">{primaryCta.note}</span> : null}
        </div>
        <aside className="hero__aside">
          {timer?.deadline ? (
            <div className="hero__timer" aria-live="polite">
              <span className="hero__timer-label">{timer.label}</span>
              {countdownUnavailable ? (
                <span className="hero__timer-expired">{timerUnavailableLabel}</span>
              ) : timeLeft ? (
                timeLeft.expired ? (
                  <span className="hero__timer-expired">{timerExpiredLabel}</span>
                ) : (
                  <div className="hero__timer-grid" role="group" aria-label="Обратный отсчет до старта">
                    <div className="hero__timer-segment">
                      <span className="hero__timer-value">{timeLeft.days}</span>
                      <span className="hero__timer-unit">дней</span>
                    </div>
                    <div className="hero__timer-segment">
                      <span className="hero__timer-value">{timeLeft.hours}</span>
                      <span className="hero__timer-unit">часов</span>
                    </div>
                    <div className="hero__timer-segment">
                      <span className="hero__timer-value">{timeLeft.minutes}</span>
                      <span className="hero__timer-unit">минут</span>
                    </div>
                    <div className="hero__timer-segment">
                      <span className="hero__timer-value">{timeLeft.seconds}</span>
                      <span className="hero__timer-unit">секунд</span>
                    </div>
                  </div>
                )
              ) : null}
            </div>
          ) : null}
          {Array.isArray(facts) && facts.length > 0 ? (
            <div className="hero__facts" role="list">
              {facts.map((fact) => (
                <div key={fact.title} className="hero__fact" role="listitem">
                  {fact.icon ? (
                    <span className="hero__fact-icon" aria-hidden="true">
                      {fact.icon}
                    </span>
                  ) : null}
                  <div className="hero__fact-content">
                    <span className="hero__fact-title">{fact.title}</span>
                    {fact.description ? <p className="hero__fact-description">{fact.description}</p> : null}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
};

Hero.propTypes = {
  data: PropTypes.shape({
    tagline: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    season: PropTypes.shape({
      label: PropTypes.string.isRequired,
      dates: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
    }).isRequired,
    media: PropTypes.shape({
      src: PropTypes.string,
      type: PropTypes.string,
      poster: PropTypes.string,
      mobilePoster: PropTypes.string,
      disableOnMobile: PropTypes.bool,
      alt: PropTypes.string,
    }),
    facts: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        icon: PropTypes.string,
      })
    ),
    primaryCta: PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      note: PropTypes.string,
      icon: PropTypes.string,
      ariaLabel: PropTypes.string,
    }),
    secondaryCta: PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      icon: PropTypes.string,
      ariaLabel: PropTypes.string,
    }),
    timer: PropTypes.shape({
      label: PropTypes.string.isRequired,
      deadline: PropTypes.string.isRequired,
      expiredLabel: PropTypes.string,
      fallbackLabel: PropTypes.string,
    }),
  }).isRequired,
  disableVideoOnMobile: PropTypes.bool,
};

Hero.defaultProps = {
  disableVideoOnMobile: false,
};

export default Hero;
