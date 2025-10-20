import PropTypes from 'prop-types';

const Section = ({ title, children, variant = 'default', hideHeader = false }) => (
  <section className={`section section--${variant}`}>
    {!hideHeader && title && (
      <div className="section__header">
        <h2 className="section__title">{title}</h2>
      </div>
    )}
    <div className="section__content">{children}</div>
  </section>
);

Section.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  variant: PropTypes.string,
  hideHeader: PropTypes.bool,
};

Section.defaultProps = {
  title: undefined,
  variant: 'default',
  hideHeader: false,
};

export default Section;
