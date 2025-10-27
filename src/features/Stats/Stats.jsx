import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './Stats.css';

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const getFormattedValue = (value, item, formatterCache) => {
  const decimals = Number.isInteger(item.decimals) ? item.decimals : 0;
  const cacheKey = decimals;

  if (!formatterCache.has(cacheKey)) {
    formatterCache.set(
      cacheKey,
      new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    );
  }

  const formatter = formatterCache.get(cacheKey);
  return formatter.format(value);
};

const Stats = ({ items, animationDuration = 1600, isFeminine = false }) => {
  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const formatterCache = useMemo(() => new Map(), []);
  const [displayValues, setDisplayValues] = useState(() => items.map(() => 0));
  const [isActive, setIsActive] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setDisplayValues(items.map(() => 0));
    setHasAnimated(false);
    setIsActive(false);
  }, [items]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (event) => {
      setReduceMotion(event.matches);
    };

    setReduceMotion(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setDisplayValues(items.map((item) => item.value));
      setHasAnimated(true);
      return;
    }

    const node = containerRef.current;
    if (!node || hasAnimated) {
      return undefined;
    }

    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      setIsActive(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsActive(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasAnimated, reduceMotion, items]);

  useEffect(() => {
    if (!isActive || hasAnimated) {
      return undefined;
    }

    if (reduceMotion) {
      setDisplayValues(items.map((item) => item.value));
      setHasAnimated(true);
      return undefined;
    }

    const startValues = items.map(() => 0);
    const targetValues = items.map((item) => item.value);
    const decimals = items.map((item) => (Number.isInteger(item.decimals) ? item.decimals : 0));
    let startTime = null;

    setDisplayValues(startValues);

    const update = (timestamp) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      const eased = easeOutCubic(progress);

      setDisplayValues(
        targetValues.map((target, index) => {
          const factor = 10 ** decimals[index];
          const value = target * eased;
          return Math.round(value * factor) / factor;
        }),
      );

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(update);
      } else {
        setHasAnimated(true);
        setDisplayValues(targetValues);
        frameRef.current = null;
      }
    };

    frameRef.current = requestAnimationFrame(update);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [animationDuration, hasAnimated, isActive, items, reduceMotion]);

  const statsClassName = `stats${isFeminine ? ' stats--feminine' : ''}`;

  return (
    <div className={statsClassName} ref={containerRef}>
      <dl className="stats__grid" role="list" aria-label="Ключевые показатели YarCyberSeason">
        {items.map((item, index) => {
          const visibleValue = getFormattedValue(displayValues[index] ?? 0, item, formatterCache);
          const finalValue = getFormattedValue(item.value, item, formatterCache);
          const prefix = item.prefix ?? '';
          const suffix = item.suffix ?? '';
          const accessibleValue = item.a11y || `${prefix}${finalValue}${suffix}`;
          const descriptionId = item.description ? `${item.id}-description` : undefined;
          const labelId = `${item.id}-label`;

          return (
            <div
              key={item.id}
              className="stats__item"
              role="listitem"
              aria-labelledby={labelId}
              aria-describedby={descriptionId}
            >
              <dt className="stats__label" id={labelId}>
                {item.label}
              </dt>
              <dd className="stats__value" aria-live="off">
                <span aria-hidden="true">{`${prefix}${visibleValue}${suffix}`}</span>
                <span className="sr-only">{accessibleValue}</span>
              </dd>
              {item.description ? (
                <p className="stats__description" id={descriptionId}>
                  {item.description}
                </p>
              ) : null}
            </div>
          );
        })}
      </dl>
    </div>
  );
};

Stats.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      prefix: PropTypes.string,
      suffix: PropTypes.string,
      description: PropTypes.string,
      decimals: PropTypes.number,
      a11y: PropTypes.string,
    }),
  ).isRequired,
  animationDuration: PropTypes.number,
  isFeminine: PropTypes.bool,
};

export default Stats;
