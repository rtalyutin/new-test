import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { createBodyPortalContainer } from '../SponsorModal/createBodyPortalContainer';
import './SeasonSelectorModal.css';

const focusableSelectors =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const SeasonSelectorModal = ({
  isOpen,
  onClose,
  selector,
  onSelect,
  isPending,
  error,
  dialogId,
  stepsText,
}) => {
  const dialogRef = useRef(null);
  const [portalElement, setPortalElement] = useState(null);
  const [activeDiscipline, setActiveDiscipline] = useState(null);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const { container, dispose } = createBodyPortalContainer(document);
    setPortalElement(container);

    return dispose;
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    setActiveDiscipline(null);

    return undefined;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const dialogElement = dialogRef.current;

    if (!dialogElement) {
      return undefined;
    }

    const previouslyFocusedElement = document.activeElement;

    const trapFocus = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusableElements = dialogElement.querySelectorAll(focusableSelectors);

      if (!focusableElements.length) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', trapFocus);

    return () => {
      document.removeEventListener('keydown', trapFocus);
      if (previouslyFocusedElement && previouslyFocusedElement.focus) {
        previouslyFocusedElement.focus();
      }
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      const dialogElement = dialogRef.current;

      if (!dialogElement) {
        return;
      }

      if (event.target instanceof Node && !dialogElement.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const dialogElement = dialogRef.current;

    if (!dialogElement) {
      return undefined;
    }

    const focusTimer = window.setTimeout(() => {
      const focusableElements = dialogElement.querySelectorAll(focusableSelectors);
      const firstFocusable = focusableElements[0];

      if (firstFocusable instanceof HTMLElement) {
        firstFocusable.focus();
      }
    }, 0);

    return () => {
      window.clearTimeout(focusTimer);
    };
  }, [isOpen, activeDiscipline]);

  if (!isOpen || !portalElement) {
    return null;
  }

  const disciplines = Array.isArray(selector?.disciplines) ? selector.disciplines : [];
  const dialogElementId = dialogId || 'season-selector-modal-dialog';
  const modalTitleId = `${dialogElementId}-title`;
  const stepsInstructionId = `${dialogElementId}-steps`;
  const modalTitle = selector?.modal?.title ?? 'Выбор дисциплины и дивизиона';
  const modalDescription = selector?.modal?.description ?? '';
  const modalDescriptionId = modalDescription ? `${dialogElementId}-description` : undefined;
  const modalStepsText =
    stepsText ||
    selector?.modal?.stepsText ||
    'Сначала выберите дисциплину, затем дивизион для перехода к заявке.';
  const describedBy = [modalDescriptionId, stepsInstructionId].filter(Boolean);
  const dialogDescribedBy = describedBy.length > 0 ? describedBy.join(' ') : undefined;
  const emptyTitle = selector?.emptyState?.title ?? '';
  const emptyDescription = selector?.emptyState?.description ?? '';

  const handleDisciplineSelect = (discipline) => {
    setActiveDiscipline(discipline);
  };

  const handleBack = () => {
    setActiveDiscipline(null);
  };

  const handleDivisionSelect = (division) => {
    if (isPending || !activeDiscipline) {
      return;
    }

    onSelect({
      href: division.href,
      disciplineId: activeDiscipline.id,
      divisionId: division.id,
    });
    onClose();
  };

  const renderDisciplineButton = (discipline) => {
    const hasPreview = Boolean(discipline.preview);

    return (
      <button
        key={discipline.id}
        type="button"
        className="season-selector-modal__discipline"
        onClick={() => handleDisciplineSelect(discipline)}
        data-preview={hasPreview ? 'true' : 'false'}
        style={
          hasPreview
            ? {
                backgroundImage: `linear-gradient(160deg, rgba(9, 12, 28, 0.82), rgba(9, 12, 28, 0.6)), url(${discipline.preview})`,
              }
            : undefined
        }
      >
        <span className="season-selector-modal__discipline-label">{discipline.label}</span>
        {discipline.description ? (
          <span className="season-selector-modal__discipline-description">{discipline.description}</span>
        ) : null}
      </button>
    );
  };

  const renderDivisionButton = (division) => (
    <button
      key={division.id}
      type="button"
      className="season-selector-modal__division"
      onClick={() => handleDivisionSelect(division)}
      disabled={isPending}
    >
      <span className="season-selector-modal__division-label">{division.label}</span>
      <span className="season-selector-modal__division-action">
        {isPending ? 'Загрузка…' : 'Перейти к заявке'}
      </span>
    </button>
  );

  return createPortal(
    <div className="season-selector-modal" role="presentation">
      <div className="season-selector-modal__backdrop" aria-hidden="true" />
      <div className="season-selector-modal__overlay">
        <div
          className="season-selector-modal__dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby={modalTitleId}
          aria-describedby={dialogDescribedBy}
          ref={dialogRef}
          id={dialogElementId}
        >
          <header className="season-selector-modal__header">
            <div className="season-selector-modal__header-text">
              <p className="season-selector-modal__eyebrow">Регистрация сезона</p>
              <h2 id={modalTitleId} className="season-selector-modal__title">
                {modalTitle}
              </h2>
              {modalDescription ? (
                <p id={modalDescriptionId} className="season-selector-modal__subtitle">
                  {modalDescription}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              className="season-selector-modal__close"
              onClick={onClose}
              aria-label="Закрыть окно"
            >
              ×
            </button>
          </header>

          <p id={stepsInstructionId} className="season-selector-modal__sr-only">
            {modalStepsText}
          </p>

          {error ? <p className="season-selector-modal__error">{error}</p> : null}

          {!activeDiscipline ? (
            <div className="season-selector-modal__content season-selector-modal__content--disciplines">
              {(emptyTitle || emptyDescription) && (
                <div className="season-selector-modal__intro">
                  {emptyTitle ? <h3 className="season-selector-modal__intro-title">{emptyTitle}</h3> : null}
                  {emptyDescription ? (
                    <p className="season-selector-modal__intro-description">{emptyDescription}</p>
                  ) : null}
                </div>
              )}
              <div className="season-selector-modal__grid">
                {disciplines.map((discipline) => renderDisciplineButton(discipline))}
              </div>
            </div>
          ) : (
            <div className="season-selector-modal__content season-selector-modal__content--divisions">
              <button type="button" className="season-selector-modal__back" onClick={handleBack}>
                ← Назад
              </button>
              <div className="season-selector-modal__selected">
                <h3 className="season-selector-modal__selected-title">{activeDiscipline.label}</h3>
                {activeDiscipline.description ? (
                  <p className="season-selector-modal__selected-description">{activeDiscipline.description}</p>
                ) : null}
              </div>
              <div className="season-selector-modal__options">
                {Array.isArray(activeDiscipline.divisions)
                  ? activeDiscipline.divisions.map((division) => renderDivisionButton(division))
                  : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    portalElement,
  );
};

SeasonSelectorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selector: PropTypes.shape({
    modal: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      stepsText: PropTypes.string,
    }),
    emptyState: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
    }),
    disciplines: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        description: PropTypes.string,
        preview: PropTypes.string,
        divisions: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            href: PropTypes.string.isRequired,
          }),
        ),
      }),
    ),
  }),
  onSelect: PropTypes.func.isRequired,
  isPending: PropTypes.bool,
  error: PropTypes.string,
  dialogId: PropTypes.string,
  stepsText: PropTypes.string,
};

SeasonSelectorModal.defaultProps = {
  selector: undefined,
  isPending: false,
  error: undefined,
  dialogId: undefined,
  stepsText: undefined,
};

export default SeasonSelectorModal;
