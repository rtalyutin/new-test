import PropTypes from 'prop-types';

const About = ({ data }) => (
  <div className="about">
    <p className="about__lead">{data.lead}</p>
    <ul className="about__highlights">
      {data.highlights.map((item) => (
        <li key={item.id} className="about__highlight">
          <h3 className="about__highlight-title">{item.title}</h3>
          <p className="about__highlight-description">{item.description}</p>
        </li>
      ))}
    </ul>
  </div>
);

About.propTypes = {
  data: PropTypes.shape({
    lead: PropTypes.string.isRequired,
    highlights: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default About;
