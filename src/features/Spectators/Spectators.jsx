import PropTypes from 'prop-types';

const renderPreview = (preview, title, watchUrl) => {
  if (!preview) {
    return null;
  }

  if (preview.type === 'gallery' && Array.isArray(preview.images)) {
    return (
      <div className="spectators__gallery" role="group" aria-label={`Фотографии трансляции «${title}»`}>
        {preview.images.map((image) => (
          <figure key={image.src} className="spectators__gallery-item">
            <img src={image.src} alt={image.alt} loading="lazy" />
          </figure>
        ))}
      </div>
    );
  }

  if (preview.type === 'video') {
    return (
      <a
        className="spectators__video"
        href={watchUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`Посмотреть видеопревью «${title}»`}
      >
        <img src={preview.thumbnail} alt={preview.label || `Превью трансляции ${title}`} loading="lazy" />
        <div className="spectators__video-meta" aria-hidden="true">
          <span className="spectators__video-icon">▶</span>
          <span className="spectators__video-label">{preview.label}</span>
          {preview.duration ? (
            <span className="spectators__video-duration">{preview.duration}</span>
          ) : null}
        </div>
      </a>
    );
  }

  return null;
};

const Spectators = ({ streams, lanFinal }) => (
  <div className="spectators">
    <section className="spectators__streams" aria-label="Онлайн-трансляции YarCyberSeason">
      {streams.map(({ id, title, description, platform, schedule, watchUrl, calendarUrl, tags, preview }) => (
        <article key={id} className="spectators__card">
          <header className="spectators__card-header">
            <span className="spectators__badge" aria-label={`Платформа: ${platform}`}>
              {platform}
            </span>
            <span className="spectators__schedule">{schedule}</span>
          </header>
          <h3 className="spectators__card-title">{title}</h3>
          <p className="spectators__card-description">{description}</p>
          {tags?.length ? (
            <ul className="spectators__tags" aria-label="Особенности трансляции">
              {tags.map((tag) => (
                <li key={tag} className="spectators__tag">
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
          {renderPreview(preview, title, watchUrl)}
          <div className="spectators__actions" role="group" aria-label={`Действия для трансляции «${title}»`}>
            <a className="spectators__button spectators__button--primary" href={watchUrl} target="_blank" rel="noreferrer">
              Смотреть стрим
            </a>
            <a className="spectators__button spectators__button--secondary" href={calendarUrl} target="_blank" rel="noreferrer">
              Добавить в календарь
            </a>
          </div>
        </article>
      ))}
    </section>
    <section className="spectators__lan" aria-labelledby="spectators-lan-title">
      <div className="spectators__lan-info">
        <h3 id="spectators-lan-title" className="spectators__lan-title">
          {lanFinal.title}
        </h3>
        <div className="spectators__lan-meta">
          <span className="spectators__lan-date" aria-label="Дата и время офлайн-финала">
            🗓️ {lanFinal.date}
          </span>
          <span className="spectators__lan-location" aria-label="Место проведения офлайн-финала">
            📍 {lanFinal.location}
          </span>
        </div>
        <p className="spectators__lan-description">{lanFinal.description}</p>
        {lanFinal.highlights?.length ? (
          <ul className="spectators__lan-list">
            {lanFinal.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </div>
      {lanFinal.media?.type === 'gallery' && Array.isArray(lanFinal.media.images) ? (
        <div className="spectators__lan-media" role="group" aria-label="Кадры офлайн-финала">
          {lanFinal.media.images.map((image) => (
            <figure key={image.src} className="spectators__lan-media-item">
              <img src={image.src} alt={image.alt} loading="lazy" />
            </figure>
          ))}
        </div>
      ) : null}
    </section>
  </div>
);

const mediaShape = PropTypes.shape({
  type: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
    }),
  ),
  thumbnail: PropTypes.string,
  label: PropTypes.string,
  duration: PropTypes.string,
});

Spectators.propTypes = {
  streams: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      platform: PropTypes.string.isRequired,
      schedule: PropTypes.string.isRequired,
      watchUrl: PropTypes.string.isRequired,
      calendarUrl: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string),
      preview: mediaShape,
    }),
  ).isRequired,
  lanFinal: PropTypes.shape({
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    highlights: PropTypes.arrayOf(PropTypes.string),
    media: mediaShape,
  }).isRequired,
};

export default Spectators;
