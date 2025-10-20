import PropTypes from 'prop-types';
import heroBackdrop from '../../assets/hero/hero-backdrop.svg';
import cs2Operator from '../../assets/hero/cs2-operator.svg';
import phoenixAvatar from '../../assets/hero/phoenix-avatar.svg';

const figureImages = {
  backdrop: heroBackdrop,
  cs2: cs2Operator,
  operator: cs2Operator,
  dota: phoenixAvatar,
  phoenix: phoenixAvatar,
};

const Hero = ({ data }) => {
  const { badge, title, subtitle, tabs, panels, meta, partners, figures } = data;

  const figureConfig = [
    ['backdrop', figures?.backdrop],
    ['left', figures?.left],
    ['center', figures?.center],
    ['right', figures?.right],
  ].filter(([, value]) => value?.key && figureImages[value.key]);

  return (
    <div className="hero">
      <div className="hero__gradient hero__gradient--left" aria-hidden="true" />
      <div className="hero__gradient hero__gradient--right" aria-hidden="true" />

      {figureConfig.map(([position, value]) => (
        <div key={position} className={`hero__figure hero__figure--${position}`}>
          <img src={figureImages[value.key]} alt={value.alt} loading="lazy" />
        </div>
      ))}

      <div className="hero__body">
        <span className="hero__badge">{badge}</span>

        <h1 className="hero__title" aria-label={`${title.left} ${title.accent} ${title.right}`}>
          <span className="hero__title-part hero__title-part--left">{title.left}</span>
          <span className="hero__title-accent">{title.accent}</span>
          <span className="hero__title-part hero__title-part--right">{title.right}</span>
        </h1>

        <p className="hero__subtitle">{subtitle}</p>

        {tabs?.length ? (
          <nav className="hero__tabs" aria-label="Дисциплины сезона">
            <ul>
              {tabs.map((tab) => (
                <li key={tab.label}>
                  <a
                    className={`hero__tab ${tab.active ? 'hero__tab--active' : ''}`.trim()}
                    href={tab.href}
                    aria-current={tab.active ? 'page' : undefined}
                  >
                    {tab.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <div className="hero__panels" role="list">
          {panels.map((panel) => (
            <article key={panel.id} className="hero__panel" role="listitem">
              <header className="hero__panel-header">
                <h2 className="hero__panel-title">{panel.title}</h2>
                <p className="hero__panel-description">{panel.description}</p>
              </header>
              <div className="hero__panel-actions">
                <a className="hero__panel-action hero__panel-action--primary" href={panel.primaryAction.href}>
                  {panel.primaryAction.label}
                </a>
                <a className="hero__panel-action hero__panel-action--ghost" href={panel.secondaryAction.href}>
                  {panel.secondaryAction.label}
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="hero__divider" aria-hidden="true" />

        <div className="hero__footer">
          <div className="hero__metric">
            <span className="hero__metric-label">{meta.prize.label}</span>
            <span className="hero__metric-value">{meta.prize.value}</span>
          </div>
          <div className="hero__timer">
            <span className="hero__metric-label">{meta.timer.label}</span>
            <span className="hero__timer-value">{meta.timer.value}</span>
          </div>
          {partners?.length ? (
            <div className="hero__partners" aria-label="Партнёры сезона">
              {partners.map((partner) => (
                <a key={partner.href} className="hero__partner" href={partner.href}>
                  {partner.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

Hero.propTypes = {
  data: PropTypes.shape({
    badge: PropTypes.string.isRequired,
    title: PropTypes.shape({
      left: PropTypes.string.isRequired,
      accent: PropTypes.string.isRequired,
      right: PropTypes.string.isRequired,
    }).isRequired,
    subtitle: PropTypes.string.isRequired,
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired,
        active: PropTypes.bool,
      })
    ),
    panels: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        primaryAction: PropTypes.shape({
          label: PropTypes.string.isRequired,
          href: PropTypes.string.isRequired,
        }).isRequired,
        secondaryAction: PropTypes.shape({
          label: PropTypes.string.isRequired,
          href: PropTypes.string.isRequired,
        }).isRequired,
      })
    ).isRequired,
    meta: PropTypes.shape({
      prize: PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }).isRequired,
      timer: PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    partners: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired,
      })
    ),
    figures: PropTypes.shape({
      backdrop: PropTypes.shape({
        key: PropTypes.oneOf(Object.keys(figureImages)).isRequired,
        alt: PropTypes.string.isRequired,
      }),
      left: PropTypes.shape({
        key: PropTypes.oneOf(Object.keys(figureImages)).isRequired,
        alt: PropTypes.string.isRequired,
      }),
      center: PropTypes.shape({
        key: PropTypes.oneOf(Object.keys(figureImages)).isRequired,
        alt: PropTypes.string.isRequired,
      }),
      right: PropTypes.shape({
        key: PropTypes.oneOf(Object.keys(figureImages)).isRequired,
        alt: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
};

export default Hero;
