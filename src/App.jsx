import Section from './components/Section.jsx';
import Hero from './features/Hero/Hero.jsx';
import Overview from './features/Overview/Overview.jsx';
import Benefits from './features/Benefits/Benefits.jsx';
import Program from './features/Program/Program.jsx';
import Disciplines from './features/Disciplines/Disciplines.jsx';
import Bracket from './features/Bracket/Bracket.jsx';
import Schedule from './features/Schedule/Schedule.jsx';
import News from './features/News/News.jsx';
import Divisions from './features/Divisions/Divisions.jsx';
import RegistrationCta from './features/RegistrationCta/RegistrationCta.jsx';
import Spectators from './features/Spectators/Spectators.jsx';
import heroConfig from './features/Hero/config.json';
import overviewConfig from './features/Overview/config.json';
import benefitsConfig from './features/Benefits/config.json';
import programConfig from './features/Program/config.json';
import disciplinesConfig from './features/Disciplines/config.json';
import bracketConfig from './features/Bracket/config.json';
import scheduleConfig from './features/Schedule/config.json';
import newsConfig from './features/News/config.json';
import divisionsConfig from './features/Divisions/config.json';
import registrationCtaConfig from './features/RegistrationCta/config.json';
import spectatorsConfig from './features/Spectators/config.json';

const App = () => {
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
      id: 'schedule',
      title: 'Календарь событий',
      component: <Schedule data={scheduleConfig} />,
      navLabel: 'Расписание',
    },
    {
      id: 'registration',
      component: <RegistrationCta data={registrationCtaConfig} />,
      navLabel: 'Регистрация',
      variant: 'registration-cta',
      hideTitle: true,
    },
    {
      id: 'program',
      title: 'Программа сезона',
      component: <Program sessions={programConfig} />,
      navLabel: 'Программа',
    },
    {
      id: 'divisions',
      title: 'Дивизионы участия',
      component: <Divisions divisions={divisionsConfig.divisions} />,
      navLabel: 'Дивизионы',
      variant: 'divisions',
    },
    {
      id: 'benefits',
      title: 'Почему стоит участвовать',
      component: <Benefits items={benefitsConfig} />,
      navLabel: 'Преимущества',
    },
    {
      id: 'disciplines',
      title: 'Киберспортивные дисциплины',
      component: <Disciplines disciplines={disciplinesConfig} />,
      navLabel: 'Дисциплины',
    },
    {
      id: 'news',
      title: 'Новости экосистемы',
      component: <News data={newsConfig} />,
      navLabel: 'Новости',
    },
    {
      id: 'spectators',
      title: 'Для зрителей',
      component: (
        <Spectators
          streams={spectatorsConfig.streams}
          lanFinal={spectatorsConfig.lanFinal}
        />
      ),
      navLabel: 'Зрителям',
      variant: 'spectators',
    },
    {
      id: 'bracket',
      title: 'Плей-офф YarCyberLeague',
      component: <Bracket stages={bracketConfig} />,
      navLabel: 'Плей-офф',
    },
  ];

  const navigationItems = sections
    .filter((section) => Boolean(section.navLabel))
    .map((section) => ({
      id: section.id,
      label: section.navLabel,
    }));

  return (
    <main className="app">
      <header className="app__header">
        <a className="app__logo" href="#hero" aria-label="Перейти к началу страницы">
          <span className="app__logo-mark" aria-hidden="true">
            YCS
          </span>
          <span className="app__logo-text">YarCyberSeason</span>
        </a>
        <nav className="app__nav" aria-label="Навигация по секциям YarCyberSeason">
          <ul className="app__nav-list">
            {navigationItems.map(({ id, label }) => (
              <li key={id} className="app__nav-item">
                <a className="app__nav-link" href={`#${id}`}>
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
    </main>
  );
};

export default App;
