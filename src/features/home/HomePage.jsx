import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Section from '../../components/Section.jsx';
import Footer from '../../components/Footer.jsx';
import Hero from '../Hero/Hero.jsx';
import Overview from '../Overview/Overview.jsx';
import RegistrationCta from '../RegistrationCta/RegistrationCta.jsx';
import Sponsors from '../Sponsors/Sponsors.jsx';
import TeamShowcase from '../team-showcase/TeamShowcase.js';
import SocialLinks from '../SocialLinks/SocialLinks.jsx';
import heroConfig from '../Hero/config.json';
import overviewConfig from '../Overview/config.json';
import UpcomingMatches from '../UpcomingMatches/UpcomingMatches.jsx';
import upcomingMatchesConfig from '../UpcomingMatches/config.json';
import MatchResults from '../MatchResults/MatchResults.jsx';
import matchResultsConfig from '../MatchResults/config.json';
import registrationCtaConfig from '../RegistrationCta/config.json';
import sponsorsConfig from '../Sponsors/config.json';
import socialLinksConfig from '../SocialLinks/config.json';
import QualificationsTable from '../QualificationsTable/QualificationsTable.jsx';
import qualificationsConfig from '../QualificationsTable/config.json';
import logoImage from '../../ChatGPT Image 20 окт. 2025 г., 22_02_10.png';
import { useAuth } from '../../context/AuthContext.js';
import '../../App.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSponsorFormSubmit = useCallback(async (formData) => {
    // Здесь мог бы быть вызов API или интеграция с сервисом отправки.
    console.log('Sponsor form submitted', formData);
  }, []);

  const handleSignOut = useCallback(() => {
    setIsMenuOpen(false);
    signOut();
    navigate('/auth', { replace: true });
  }, [navigate, setIsMenuOpen, signOut]);

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
      id: 'team-showcase',
      title: 'Команды сезона',
      component: <TeamShowcase />,
      navLabel: 'Команды',
      variant: 'team-showcase',
      hideTitle: true,
    },
    {
      id: 'upcoming-matches',
      component: <UpcomingMatches data={upcomingMatchesConfig} />,
      navLabel: 'Матчи',
      variant: 'upcoming-matches',
      hideTitle: true,
    },
    {
      id: 'qualifications',
      component: (
        <QualificationsTable data={qualificationsConfig} matchResults={matchResultsConfig} />
      ),
      navLabel: 'Таблица',
      variant: 'qualifications-table',
      hideTitle: true,
      fullBleed: true,
    },
    {
      id: 'match-results',
      component: <MatchResults data={matchResultsConfig} />,
      navLabel: 'Результаты',
      variant: 'match-results',
      hideTitle: true,
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

  const THEME_STORAGE_KEY = 'ycs-theme';

  const getInitialTheme = useCallback(() => {
    if (typeof window === 'undefined') {
      return 'default';
    }

    return window.localStorage.getItem(THEME_STORAGE_KEY) || 'default';
  }, []);

  const [theme, setTheme] = useState(getInitialTheme);
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
        <button type="button" className="app__logout-button" onClick={handleSignOut}>
          Выйти
        </button>
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

export default HomePage;
