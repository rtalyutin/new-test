import PropTypes from 'prop-types';

const Section = ({
  id,
  title,
  children,
  variant = 'default',
  hideTitle = false,
  background = null,
  fullBleed = false,
  modifiers = [],
}) => {
  const sectionClassNames = ['section'];

  if (variant && variant !== 'default') {
    sectionClassNames.push(`section--${variant}`);
  }

  if (fullBleed) {
    sectionClassNames.push('section--full-bleed');
  }

  if (Array.isArray(modifiers)) {
    modifiers.filter(Boolean).forEach((modifier) => {
      sectionClassNames.push(`section--${modifier}`);
    });
  }

  return (
    <section id={id} className={sectionClassNames.join(' ')}>
      {background ? (
        <div className="section__background" aria-hidden="true">
          {background}
        </div>
      ) : null}
      <div className={fullBleed ? 'section__inner section__inner--full-bleed' : 'section__inner'}>
        {!hideTitle && title ? (
          <div className="section__header">
            <h2 className="section__title">{title}</h2>
          </div>
        ) : null}
        <div className={fullBleed ? 'section__content section__content--full-bleed' : 'section__content'}>
          {children}
        </div>
      </div>
    </section>
  );
};

Section.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  variant: PropTypes.string,
  hideTitle: PropTypes.bool,
  background: PropTypes.node,
  fullBleed: PropTypes.bool,
  modifiers: PropTypes.arrayOf(PropTypes.string),
};

Section.defaultProps = {
  id: undefined,
  title: undefined,
  variant: 'default',
  hideTitle: false,
  background: null,
  fullBleed: false,
  modifiers: [],
};

export default Section;
