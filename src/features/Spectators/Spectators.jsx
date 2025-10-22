import PropTypes from 'prop-types';
import './Spectators.css';

const getLinkClassName = (variant = 'primary') => `spectators__link spectators__link--${variant}`;

const Spectators = ({ sections }) => (
  <div className="spectators">
    {sections.map((section) => {
      const headingId = `spectators-${section.id}`;

      return (
        <section key={section.id} className="spectators__section" aria-labelledby={headingId}>
          <div className="spectators__section-header">
            <h3 id={headingId} className="spectators__section-title">
              {section.title}
            </h3>
            {section.description ? (
              <p className="spectators__section-description">{section.description}</p>
            ) : null}
          </div>

          {section.type === 'links' ? (
            <ul className="spectators__list">
              {section.items.map((item) => (
                <li key={item.id} className="spectators__list-item">
                  <div className="spectators__item-content">
                    <div className="spectators__item-header">
                      <h4 className="spectators__item-title">{item.title}</h4>
                      {item.description ? (
                        <p className="spectators__item-description">{item.description}</p>
                      ) : null}
                    </div>

                    {item.meta?.length ? (
                      <ul className="spectators__meta" aria-label={`Подробности «${item.title}»`}>
                        {item.meta.map((detail) => (
                          <li key={`${detail.label}-${detail.value}`} className="spectators__meta-item">
                            {detail.icon ? (
                              <span className="spectators__meta-icon" aria-hidden="true">
                                {detail.icon}
                              </span>
                            ) : null}
                            <span className="spectators__meta-text">
                              <span className="spectators__meta-label">{detail.label}</span>
                              <span className="spectators__meta-value">{detail.value}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {item.tags?.length ? (
                      <ul className="spectators__tags" aria-label={`Теги для «${item.title}»`}>
                        {item.tags.map((tag) => (
                          <li key={tag} className="spectators__tag">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>

                  {item.links?.length ? (
                    <div className="spectators__actions" role="group" aria-label={`Ссылки для «${item.title}»`}>
                      {item.links.map((link) => (
                        <a
                          key={`${item.id}-${link.label}`}
                          className={getLinkClassName(link.variant)}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}

          {section.type === 'lan' ? (
            <div className="spectators__lan">
              {section.details?.length ? (
                <ul className="spectators__meta spectators__meta--lan" aria-label="Ключевые детали LAN-финала">
                  {section.details.map((detail) => (
                    <li key={`${detail.label}-${detail.value}`} className="spectators__meta-item">
                      {detail.icon ? (
                        <span className="spectators__meta-icon" aria-hidden="true">
                          {detail.icon}
                        </span>
                      ) : null}
                      <span className="spectators__meta-text">
                        <span className="spectators__meta-label">{detail.label}</span>
                        <span className="spectators__meta-value">{detail.value}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {section.description ? (
                <p className="spectators__lan-description">{section.description}</p>
              ) : null}

              {section.actions?.length ? (
                <div className="spectators__actions" role="group" aria-label="Полезные ссылки LAN-финала">
                  {section.actions.map((link) => (
                    <a
                      key={`${section.id}-${link.label}`}
                      className={getLinkClassName(link.variant)}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}

              {section.highlights?.length ? (
                <ul className="spectators__lan-list">
                  {section.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}

              {section.media?.type === 'gallery' && Array.isArray(section.media.images) ? (
                <div className="spectators__lan-media" role="group" aria-label="Кадры LAN-финала">
                  {section.media.images.map((image) => (
                    <figure key={image.src} className="spectators__lan-media-item">
                      <img src={image.src} alt={image.alt} loading="lazy" />
                    </figure>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      );
    })}
  </div>
);

const detailShape = PropTypes.shape({
  icon: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
});

const linkShape = PropTypes.shape({
  label: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary']),
});

const linkItemShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  meta: PropTypes.arrayOf(detailShape),
  tags: PropTypes.arrayOf(PropTypes.string),
  links: PropTypes.arrayOf(linkShape),
});

const mediaShape = PropTypes.shape({
  type: PropTypes.oneOf(['gallery']).isRequired,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
    }),
  ).isRequired,
});

const linkSectionShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['links']).isRequired,
  description: PropTypes.string,
  items: PropTypes.arrayOf(linkItemShape).isRequired,
});

const lanSectionShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['lan']).isRequired,
  description: PropTypes.string,
  details: PropTypes.arrayOf(detailShape),
  actions: PropTypes.arrayOf(linkShape),
  highlights: PropTypes.arrayOf(PropTypes.string),
  media: mediaShape,
});

Spectators.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.oneOfType([linkSectionShape, lanSectionShape])).isRequired,
};

export default Spectators;
