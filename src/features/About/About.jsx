import PropTypes from 'prop-types';

const About = ({ data }) => (
  <div className="about">
    <p className="about__lead">{data.lead}</p>
    <div className="about__grid">
      {data.highlights.map(({ title, description }) => (
        <article key={title} className="about__card">
          <h3 className="about__card-title">{title}</h3>
          <p className="about__card-description">{description}</p>
        </article>
      ))}
    </div>
  </div>
);

About.propTypes = {
  data: PropTypes.shape({
    lead: PropTypes.string.isRequired,
    highlights: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default About;
