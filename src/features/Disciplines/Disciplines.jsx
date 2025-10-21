import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import './Disciplines.css';

const Disciplines = ({ disciplines }) => {
  const [activeId, setActiveId] = useState(disciplines[0]?.id ?? '');

  const activeDiscipline = useMemo(() => {
    if (!disciplines.length) {
      return undefined;
    }

    return disciplines.find((discipline) => discipline.id === activeId) ?? disciplines[0];
  }, [activeId, disciplines]);

  if (!activeDiscipline) {
    return null;
  }

  return (
    <div className="disciplines">
      <div className="disciplines__tabs" role="tablist" aria-label="Дисциплины сезона">
        {disciplines.map(({ id, title }) => {
          const isActive = activeDiscipline.id === id;
          return (
            <button
              key={id}
              type="button"
              className={`disciplines__tab disciplines__tab--${id}${
                isActive ? ' disciplines__tab--active' : ''
              }`}
              role="tab"
              id={`discipline-tab-${id}`}
              aria-selected={isActive}
              aria-controls={`discipline-panel-${id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveId(id)}
            >
              <span className="disciplines__tab-label">{title}</span>
              <span aria-hidden="true" className="disciplines__tab-indicator" />
            </button>
          );
        })}
      </div>

      <div className="disciplines__panels">
        {disciplines.map((discipline) => {
          const { id, title, summary, format, media } = discipline;
          const isActive = activeDiscipline.id === id;

          return (
            <article
              key={id}
              role="tabpanel"
              id={`discipline-panel-${id}`}
              aria-labelledby={`discipline-tab-${id}`}
              aria-hidden={!isActive}
              className={`disciplines__card disciplines__card--${id}${isActive ? ' is-active' : ' is-inactive'}`}
            >
              <header className="disciplines__header">
                <p className="disciplines__eyebrow">Киберспортивная дисциплина</p>
                <h3 className="disciplines__title">{title}</h3>
              </header>
              <p className="disciplines__summary">{summary}</p>
              <div className="disciplines__meta">
                <div className="disciplines__format">
                  <h4 className="disciplines__meta-title">Формат турнира</h4>
                  <p className="disciplines__meta-text">{format}</p>
                </div>
                {media?.src ? (
                  <figure className="disciplines__media">
                    <img src={media.src} alt={media.alt || title} loading="lazy" />
                    {media?.caption ? <figcaption>{media.caption}</figcaption> : null}
                  </figure>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

Disciplines.propTypes = {
  disciplines: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      summary: PropTypes.string.isRequired,
      format: PropTypes.string.isRequired,
      media: PropTypes.shape({
        type: PropTypes.string,
        src: PropTypes.string,
        alt: PropTypes.string,
        caption: PropTypes.string,
      }),
    }),
  ).isRequired,
};

export default Disciplines;
