import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const Schedule = ({ data }) => {
  const itemRefs = useRef([]);

  useEffect(() => {
    const nodes = itemRefs.current.filter(Boolean);

    if (nodes.length === 0) {
      return undefined;
    }

    const reveal = (element) => {
      element.classList.add('schedule__item--visible');
    };

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      nodes.forEach(reveal);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.35,
        rootMargin: '0px 0px -10% 0px',
      },
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [data.items]);

  const setItemRef = (index) => (node) => {
    itemRefs.current[index] = node;
  };

  return (
    <section
      className="schedule"
      aria-labelledby="schedule-title"
      aria-describedby="schedule-description schedule-a11y"
    >
      <header className="schedule__header">
        <h3 id="schedule-title" className="schedule__heading">
          {data.title}
        </h3>
        <p id="schedule-description" className="schedule__description">
          {data.description}
        </p>
        <p id="schedule-a11y" className="schedule__sr">
          {data.screenReaderDescription}
        </p>
      </header>
      <ol className="schedule__timeline">
        {data.items.map((item, index) => {
          const baseId = `schedule-${item.id}`;
          const descriptionId = `${baseId}-description`;
          const dateId = `${baseId}-date`;
          const srId = `${baseId}-sr`;

          return (
            <li
              key={item.id}
              className="schedule__item"
              ref={setItemRef(index)}
              aria-labelledby={`${baseId}-title`}
              aria-describedby={`${dateId} ${descriptionId} ${srId}`}
            >
              <div className="schedule__rail" aria-hidden="true" />
              <div className="schedule__marker" aria-hidden="true">
                <span className="schedule__icon" aria-hidden="true">
                  {item.icon}
                </span>
              </div>
              <div className="schedule__content">
                <time id={dateId} className="schedule__date" dateTime={item.dateRange.start}>
                  {item.dateRange.label}
                </time>
                <h4 id={`${baseId}-title`} className="schedule__title">
                  {item.title}
                </h4>
                <p id={descriptionId} className="schedule__text">
                  {item.description}
                </p>
                <div className="schedule__actions">
                  <a className="schedule__link" href={item.rulesLink.href}>
                    {item.rulesLink.label}
                  </a>
                </div>
                <details className="schedule__accordion">
                  <summary className="schedule__accordion-summary">Preparation tips</summary>
                  <ul className="schedule__tips">
                    {item.tips.map((tip, tipIndex) => (
                      <li key={`${item.id}-tip-${tipIndex}`} className="schedule__tip">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </details>
                <span id={srId} className="schedule__sr">
                  {item.a11yDescription}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

Schedule.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    screenReaderDescription: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        title: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        dateRange: PropTypes.shape({
          label: PropTypes.string.isRequired,
          start: PropTypes.string.isRequired,
          end: PropTypes.string.isRequired,
        }).isRequired,
        description: PropTypes.string.isRequired,
        rulesLink: PropTypes.shape({
          href: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        }).isRequired,
        tips: PropTypes.arrayOf(PropTypes.string).isRequired,
        a11yDescription: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default Schedule;
