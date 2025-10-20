import PropTypes from 'prop-types';

const Hero = ({ data }) => {
  const { tagline, title, subtitle, season, action } = data;
  return (
    <div className="hero">
      <span className="hero__tagline">{tagline}</span>
      <h1 className="hero__title">{title}</h1>
      <p className="hero__subtitle">{subtitle}</p>
      <div className="hero__meta">
        <span className="hero__season">{season.label}</span>
        <span className="hero__dates">{season.dates}</span>
        <span className="hero__location">{season.location}</span>
      </div>
      <div className="hero__actions">
        <a className="hero__cta" href={action.href}>
          {action.label}
        </a>
        <span className="hero__note">{action.note}</span>
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
    action: PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      note: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default Hero;
