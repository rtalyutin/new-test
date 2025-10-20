
import PropTypes from "prop-types";



const Section = ({ title, children }) => (
  <section className="section">
    <div className="section__header">
      <h2 className="section__title">{title}</h2>
    </div>
    <div className="section__content">{children}</div>
  </section>
);

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Section;
