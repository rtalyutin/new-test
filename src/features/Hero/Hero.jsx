import PropTypes from 'prop-types';

const Hero = ({ data }) => (
  <div className="hero">
    <div className="hero__badge">{data.badge}</div>
    <h1 className="hero__title">{data.title}</h1>
    <p className="hero__subtitle">{data.subtitle}</p>
    <div className="hero__meta">
      <span className="hero__date">{data.date}</span>
      <span className="hero__location">{data.location}</span>
    </div>
    <p className="hero__description">{data.description}</p>
    <a className="hero__cta" href={data.ctaLink} target="_blank" rel="noreferrer">
      {data.ctaText}
    </a>
  </div>
);

Hero.propTypes = {
  data: PropTypes.shape({
    badge: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    ctaText: PropTypes.string.isRequired,
    ctaLink: PropTypes.string.isRequired,
  }).isRequired,
};

export default Hero;
