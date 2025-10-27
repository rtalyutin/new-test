import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import './Footer.css';

const Footer = ({ isFeminineTheme, onThemeToggle }) => {
  const currentYear = new Date().getFullYear();
  const [isEasterEggActive, setIsEasterEggActive] = useState(false);

  useEffect(() => {
    if (!isEasterEggActive) {
      return undefined;
    }

    const { body } = document;

    if (!body) {
      return undefined;
    }

    body.classList.add('app-barrel-roll');

    return () => {
      body.classList.remove('app-barrel-roll');
    };
  }, [isEasterEggActive]);

  const handleSupportTriggerClick = (event) => {
    event.preventDefault();

    setIsEasterEggActive(true);
  };

  return (
    <footer className="footer" aria-labelledby="footer-title">
      <div className="footer__content">
        <div className="footer__brand" id="footer-title">
          <span className="footer__brand-mark" aria-hidden="true">
            YCS
          </span>
          <div className="footer__brand-text">
            <span className="footer__brand-name">YarCyberSeason</span>
            <p className="footer__brand-description">
              Сообщество киберспорта Ярославской области
            </p>
          </div>
        </div>
        <div className="footer__links" aria-label="Контактная информация YarCyberSeason">
          <div className="footer__section">
            <h3 className="footer__section-title">Контакты</h3>
            <ul className="footer__contact-list">
              <li className="footer__contact-item">
                <a className="footer__contact-link" href="tel:+79065253445">
                  +7 (906) 525-34-45
                </a>
              </li>
              <li className="footer__contact-item">
                <a className="footer__contact-link" href="mailto:info@ycs.bar">
                  info@ycs.bar
                </a>
              </li>
            </ul>
          </div>
          <div className="footer__section">
            <p className="footer__support-note">
              <button
                type="button"
                className="footer__support-trigger"
                onClick={handleSupportTriggerClick}
                aria-expanded={isEasterEggActive}
              >
                Не нашли ответ?
              </button>{' '}
              Напишите нам на почту — ответим в течение рабочего дня.
            </p>
            {isEasterEggActive ? (
              <div className="footer__easter-egg" role="status" aria-live="polite">
                <p className="footer__easter-egg-title">🎮 Пасхалка активирована!</p>
                <p className="footer__easter-egg-text">
                  Вы запустили barrel roll, и теперь сайт перевёрнут вверх ногами. Чтобы вернуть всё как
                  было, просто обновите страницу — а пока наслаждайтесь видом.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <p className="footer__copyright">
            © {currentYear} YarCyberSeason. Все права защищены.
          </p>
          <button
            type="button"
            className={`footer__theme-toggle${isFeminineTheme ? ' footer__theme-toggle--active' : ''}`}
            onClick={onThemeToggle}
            aria-pressed={isFeminineTheme}
          >
            <span className="footer__theme-icon" aria-hidden="true">
              {isFeminineTheme ? '🌸' : '🌺'}
            </span>
            <span className="footer__theme-text">
              <span className="footer__theme-label">Женская версия</span>
              <span className="footer__theme-description">
                {isFeminineTheme ? 'Нежная палитра активна' : 'Включить нежную палитру'}
              </span>
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  isFeminineTheme: PropTypes.bool.isRequired,
  onThemeToggle: PropTypes.func.isRequired,
};

export default Footer;
