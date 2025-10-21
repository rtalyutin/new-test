import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './SponsorModal.css';

const INITIAL_FORM_STATE = {
  name: '',
  company: '',
  email: '',
  message: '',
};

const focusableSelectors =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const SponsorModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  errorMessage,
}) => {
  const dialogRef = useRef(null);
  const nameInputRef = useRef(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  useEffect(() => {
    if (isOpen) {
      setFormData(INITIAL_FORM_STATE);
    }
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

    const focusTimer = window.setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      } else {
        const fallbackTarget = dialogElement.querySelector(focusableSelectors);
        fallbackTarget?.focus();
      }
    }, 0);

    document.addEventListener('keydown', trapFocus);

    return () => {
      window.clearTimeout(focusTimer);
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

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    onSubmit({ ...formData });
  };

  return (
    <div className="sponsor-modal" role="presentation">
      <div className="sponsor-modal__backdrop" aria-hidden="true" />
      <div className="sponsor-modal__overlay">
        <div
          className="sponsor-modal__dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sponsor-modal-title"
          ref={dialogRef}
        >
          <header className="sponsor-modal__header">
            <div>
              <p className="sponsor-modal__eyebrow">Партнёрская заявка</p>
              <h2 id="sponsor-modal-title" className="sponsor-modal__title">
                Присоединяйтесь к YarCyberSeason
              </h2>
              <p className="sponsor-modal__subtitle">
                Заполните форму, и команда по работе с партнёрами свяжется с вами в ближайшее время.
              </p>
            </div>
            <button
              type="button"
              className="sponsor-modal__close"
              onClick={onClose}
              aria-label="Закрыть окно"
            >
              ×
            </button>
          </header>

          <form className="sponsor-modal__form" onSubmit={handleSubmit}>
            <div className="sponsor-modal__field">
              <label className="sponsor-modal__label" htmlFor="sponsor-name">
                Имя и фамилия
              </label>
              <input
                ref={nameInputRef}
                id="sponsor-name"
                name="name"
                type="text"
                className="sponsor-modal__input"
                placeholder="Например, Алексей Смирнов"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>

            <div className="sponsor-modal__field">
              <label className="sponsor-modal__label" htmlFor="sponsor-company">
                Компания
              </label>
              <input
                id="sponsor-company"
                name="company"
                type="text"
                className="sponsor-modal__input"
                placeholder="Название компании"
                value={formData.company}
                onChange={handleChange}
                autoComplete="organization"
              />
            </div>

            <div className="sponsor-modal__field">
              <label className="sponsor-modal__label" htmlFor="sponsor-email">
                Рабочая почта
              </label>
              <input
                id="sponsor-email"
                name="email"
                type="email"
                className="sponsor-modal__input"
                placeholder="partner@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="sponsor-modal__field">
              <label className="sponsor-modal__label" htmlFor="sponsor-message">
                Инициативы или вопросы
              </label>
              <textarea
                id="sponsor-message"
                name="message"
                className="sponsor-modal__textarea"
                placeholder="Расскажите, какие интеграции вы рассматриваете"
                value={formData.message}
                onChange={handleChange}
                rows={4}
              />
            </div>

            {errorMessage ? (
              <p className="sponsor-modal__error" role="alert">
                {errorMessage}
              </p>
            ) : null}

            <div className="sponsor-modal__actions">
              <button
                type="submit"
                className="sponsor-modal__submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Отправляем…' : 'Отправить заявку'}
              </button>
              <button
                type="button"
                className="sponsor-modal__secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Отменить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

SponsorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  errorMessage: PropTypes.string,
};

SponsorModal.defaultProps = {
  isSubmitting: false,
  errorMessage: undefined,
};

export default SponsorModal;
