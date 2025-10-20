import PropTypes from 'prop-types';

const Section = ({ title, children, variant = 'default', hideTitle = false }) => {
  const sectionClassNames = ['section'];

  if (variant && variant !== 'default') {
    sectionClassNames.push(`section--${variant}`);
  }

  return (
    <section className={sectionClassNames.join(' ')}>
      {!hideTitle && title ? (
        <div className="section__header">
          <h2 className="section__title">{title}</h2>
        </div>
      ) : null}
      <div className="section__content">{children}</div>
    </section>
  );
};

Section.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  variant: PropTypes.string,
  hideTitle: PropTypes.bool,
};

Section.defaultProps = {
  title: undefined,
  variant: 'default',
  hideTitle: false,
};

export default Section;
