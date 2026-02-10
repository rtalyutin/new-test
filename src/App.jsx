import { useCallback, useEffect, useState } from 'react';

import Section from './components/Section.jsx';
import Footer from './components/Footer.jsx';
import Hero from './features/Hero/Hero.jsx';
import Overview from './features/Overview/Overview.jsx';
import RegistrationCta from './features/RegistrationCta/RegistrationCta.jsx';
import Sponsors from './features/Sponsors/Sponsors.jsx';
import TeamShowcase from './features/team-showcase/TeamShowcase.js';
import Cs2TeamShowcase from './features/cs2-team-showcase/Cs2TeamShowcase.js';
import SocialLinks from './features/SocialLinks/SocialLinks.jsx';
import heroConfig from './features/Hero/config.json';
import overviewConfig from './features/Overview/config.json';
import UpcomingMatches from './features/UpcomingMatches/UpcomingMatches.jsx';
import upcomingMatchesConfig from './features/UpcomingMatches/config.json';
import MatchResults from './features/MatchResults/MatchResults.jsx';
import matchResultsConfig from './features/MatchResults/config.json';
import registrationCtaConfig from './features/RegistrationCta/config.json';
import sponsorsConfig from './features/Sponsors/config.json';
import socialLinksConfig from './features/SocialLinks/config.json';
import QualificationsTable from './features/QualificationsTable/QualificationsTable.jsx';
import qualificationsConfig from './features/QualificationsTable/config.json';
import GameDisciplineSection from './components/GameDisciplineSection.jsx';
import logoImage from './brand-logo.png';
import './App.css';

const App = () => {
  const handleSponsorFormSubmit = useCallback(async (formData) => {
    // Здесь мог бы быть вызов API или интеграция с сервисом отправки.
    console.log('Sponsor form submitted', formData);
  }, []);

  const THEME_STORAGE_KEY = 'ycs-theme';

  const getInitialTheme = useCallback(() => {
    if (typeof window === 'undefined') {
      return 'default';
    }

    return window.localStorage.getItem(THEME_STORAGE_KEY) || 'default';
  }, []);

  const [theme, setTheme] = useState(getInitialTheme);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeGameDiscipline, setActiveGameDiscipline] = useState('dota2');

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

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    root.dataset.theme = theme;

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleNavLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleThemeToggle = () => {
    setTheme((prevTheme) => (prevTheme === 'feminine' ? 'default' : 'feminine'));
  };

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
      id: 'upcoming-matches',
      component: <UpcomingMatches data={upcomingMatchesConfig} />,
      navLabel: 'Матчи',
      variant: 'upcoming-matches',
      hideTitle: true,
    },
    {
      id: 'game-disciplines',
      component: (
        <article className="game-disciplines-switcher" aria-labelledby="game-disciplines-title">
          <div className="game-disciplines-switcher__header">
            <h3 id="game-disciplines-title" className="game-disciplines-switcher__title">Игровые дисциплины</h3>
            <div
              className="game-disciplines-switcher__controls"
              role="tablist"
              aria-label="Переключение дисциплин"
            >
              <button
                type="button"
                role="tab"
                id="tab-dota2"
                aria-selected={activeGameDiscipline === 'dota2'}
                aria-controls="panel-dota2"
                className={`game-disciplines-switcher__tab${activeGameDiscipline === 'dota2' ? ' game-disciplines-switcher__tab--active' : ''}`}
                onClick={() => setActiveGameDiscipline('dota2')}
              >
                Dota2
              </button>
              <button
                type="button"
                role="tab"
                id="tab-cs2"
                aria-selected={activeGameDiscipline === 'cs2'}
                aria-controls="panel-cs2"
                className={`game-disciplines-switcher__tab${activeGameDiscipline === 'cs2' ? ' game-disciplines-switcher__tab--active' : ''}`}
                onClick={() => setActiveGameDiscipline('cs2')}
              >
                CS2
              </button>
            </div>
          </div>

          <div
            role="tabpanel"
            id="panel-dota2"
            aria-labelledby="tab-dota2"
            hidden={activeGameDiscipline !== 'dota2'}
          >
            <GameDisciplineSection id="dota-2" title="Dota 2" isExpanded isCollapsible={false}>
              <TeamShowcase />
              <QualificationsTable data={qualificationsConfig} matchResults={matchResultsConfig} />
              <MatchResults data={matchResultsConfig} />
            </GameDisciplineSection>
          </div>

          <div
            role="tabpanel"
            id="panel-cs2"
            aria-labelledby="tab-cs2"
            hidden={activeGameDiscipline !== 'cs2'}
          >
            <GameDisciplineSection id="counter-strike-2" title="Counter Strike 2" isExpanded isCollapsible={false}>
              <Cs2TeamShowcase />
            </GameDisciplineSection>
          </div>
        </article>
      ),
      navLabel: 'Дисциплины',
      variant: 'game-discipline',
      hideTitle: true,
      fullBleed: true,
    },
    {
      id: 'registration',
      component: <RegistrationCta data={registrationCtaConfig} />,
      navLabel: 'Регистрация',
      variant: 'registration-cta',
      hideTitle: true,
    },
    {
      id: 'social',
      title: 'Социальные каналы',
      component: <SocialLinks data={socialLinksConfig} />,
      navLabel: 'Соцсети',
      variant: 'social-links',
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
  ];

  const navigationItems = sections
    .filter((section) => Boolean(section.navLabel))
    .map((section) => ({
      id: section.id,
      label: section.navLabel,
    }));

  const isFeminineTheme = theme === 'feminine';

  return (
    <main className="app">
      <header className="app__header">
        <a className="app__logo" href="#hero" aria-label="Перейти к началу страницы">
          <img className="app__logo-image" src={logoImage} alt="Логотип YarCyberSeason" />
          <span className="app__logo-text" aria-hidden="true">ЯрКиберСезон 25/26</span>
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
      <Footer isFeminineTheme={isFeminineTheme} onThemeToggle={handleThemeToggle} />
    </main>
  );
};

export default App;
