import { useCallback, useEffect, useState } from 'react';

import Section from './components/Section.jsx';
import Footer from './components/Footer.jsx';
import Hero from './features/Hero/Hero.jsx';
import Overview from './features/Overview/Overview.jsx';
import Program from './features/Program/Program.jsx';
import RegistrationCta from './features/RegistrationCta/RegistrationCta.jsx';
import Stats from './features/Stats/Stats.jsx';
import Sponsors from './features/Sponsors/Sponsors.jsx';
import heroConfig from './features/Hero/config.json';
import overviewConfig from './features/Overview/config.json';
import programConfig from './features/Program/config.json';
import registrationCtaConfig from './features/RegistrationCta/config.json';
import statsConfig from './features/Stats/config.json';
import sponsorsConfig from './features/Sponsors/config.json';
import './App.css';

const App = () => {
  const handleSponsorFormSubmit = useCallback(async (formData) => {
    // Здесь мог бы быть вызов API или интеграция с сервисом отправки.
    console.log('Sponsor form submitted', formData);
  }, []);

  const sections = [
    {
      id: 'hero',
      component: <Hero data={heroConfig} disableVideoOnMobile={heroConfig.media?.disableOnMobile} />,
      variant: 'hero',
      hideTitle: true,
      fullBleed: true,
      navLabel: 'Главная',
    },
    {
      id: 'overview',
      title: 'Обзор YarCyberSeason',
      component: <Overview data={overviewConfig} />,
      navLabel: 'Обзор',
      variant: 'overview',
      background: (
        <div className="overview-background">
          <div className="overview-background__blur overview-background__blur--primary" />
          <div className="overview-background__blur overview-background__blur--secondary" />
          <div className="overview-background__grain" />
        </div>
      ),
    },
    {
      id: 'registration',
      component: <RegistrationCta data={registrationCtaConfig} />,
      navLabel: 'Регистрация',
      variant: 'registration-cta',
      hideTitle: true,
    },
    {
      id: 'sponsors',
      title: 'Партнёры и спонсоры',
      component: (
        <Sponsors
          data={sponsorsConfig}
          onSponsorFormSubmit={handleSponsorFormSubmit}
        />
      ),
      navLabel: 'Партнёры',
      variant: 'sponsors',
    },
    {
      id: 'stats',
      title: 'Ключевые показатели сезона',
      component: <Stats items={statsConfig} />,
      navLabel: 'Статистика',
    },
    {
      id: 'program',
      title: 'Программа сезона',
      component: <Program sessions={programConfig} />,
      navLabel: 'Программа',
    },
  ];

  const navigationItems = sections
    .filter((section) => Boolean(section.navLabel))
    .map((section) => ({
      id: section.id,
      label: section.navLabel,
    }));

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleNavLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <main className="app">
      <header className="app__header">
        <a className="app__logo" href="#hero" aria-label="Перейти к началу страницы">
          <span className="app__logo-mark" aria-hidden="true">
            YCS
          </span>
          <span className="app__logo-text">YarCyberSeason</span>
        </a>
        <button
          type="button"
          className={`app__menu-toggle${isMenuOpen ? ' app__menu-toggle--open' : ''}`}
          aria-label={isMenuOpen ? 'Скрыть меню' : 'Открыть меню'}
          aria-expanded={isMenuOpen}
          aria-controls="app-navigation"
          onClick={toggleMenu}
        >
          <span className="app__menu-toggle-line" aria-hidden="true" />
          <span className="app__menu-toggle-line" aria-hidden="true" />
          <span className="app__menu-toggle-line" aria-hidden="true" />
        </button>
        <nav
          id="app-navigation"
          className={`app__nav${isMenuOpen ? ' app__nav--open' : ''}`}
          aria-label="Навигация по секциям YarCyberSeason"
        >
          <ul className="app__nav-list">
            {navigationItems.map(({ id, label }) => (
              <li key={id} className="app__nav-item">
                <a className="app__nav-link" href={`#${id}`} onClick={handleNavLinkClick}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {heroConfig.primaryCta ? (
          <a
            className="app__cta"
            href={heroConfig.primaryCta.href}
            aria-label={heroConfig.primaryCta.ariaLabel || 'Зарегистрироваться на YarCyberSeason'}
          >
            {heroConfig.primaryCta.label}
          </a>
        ) : null}
      </header>
      {sections.map((section) => {
        const { id, title, component, variant, hideTitle, fullBleed, background, modifiers } = section;
        return (
          <Section
            key={id}
            id={id}
            title={title}
            variant={variant}
            hideTitle={hideTitle}
            fullBleed={fullBleed}
            background={background}
            modifiers={modifiers}
          >
            {component}
          </Section>
        );
      })}
      <Footer />
    </main>
  );
};

export default App;
