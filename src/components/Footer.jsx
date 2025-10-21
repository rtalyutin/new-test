import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
                <a className="footer__contact-link" href="tel:+74852999999">
                  +7 (4852) 999-999
                </a>
              </li>
              <li className="footer__contact-item">
                <a className="footer__contact-link" href="mailto:team@yarseason.ru">
                  team@yarseason.ru
                </a>
              </li>
            </ul>
          </div>
          <div className="footer__section">
            <h3 className="footer__section-title">Поддержка</h3>
            <a className="footer__link" href="#faq">
              Часто задаваемые вопросы
            </a>
            <p className="footer__support-note">
              Не нашли ответ? Напишите нам на почту — ответим в течение рабочего дня.
            </p>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <p className="footer__copyright">
          © {currentYear} YarCyberSeason. Все права защищены.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
