import PropTypes from 'prop-types';

import './GameDisciplineSection.css';

const GameDisciplineSection = ({ id, title, isExpanded, onToggle, children }) => {
  const contentId = `${id}-content`;

  return (
    <article className="game-discipline" aria-labelledby={`${id}-title`}>
      <div className="game-discipline__header">
        <h3 id={`${id}-title`} className="game-discipline__title">{title}</h3>
        <button
          type="button"
          className="game-discipline__toggle"
          onClick={onToggle}
          aria-expanded={isExpanded}
          aria-controls={contentId}
        >
          {isExpanded ? 'Свернуть' : 'Развернуть'}
        </button>
      </div>
      <div
        id={contentId}
        className={`game-discipline__content${isExpanded ? ' game-discipline__content--expanded' : ''}`}
        hidden={!isExpanded}
      >
        {children}
      </div>
    </article>
  );
};

GameDisciplineSection.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default GameDisciplineSection;
