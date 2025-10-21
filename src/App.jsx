import Section from './components/Section.jsx';
import Hero from './features/Hero/Hero.jsx';
import About from './features/About/About.jsx';
import Benefits from './features/Benefits/Benefits.jsx';
import Program from './features/Program/Program.jsx';
import Bracket from './features/Bracket/Bracket.jsx';
import Schedule from './features/Schedule/Schedule.jsx';
import News from './features/News/News.jsx';
import heroConfig from './features/Hero/config.json';
import aboutConfig from './features/About/config.json';
import benefitsConfig from './features/Benefits/config.json';
import programConfig from './features/Program/config.json';
import bracketConfig from './features/Bracket/config.json';
import scheduleConfig from './features/Schedule/config.json';
import newsConfig from './features/News/config.json';

const App = () => {
  const sections = [
    {
      id: 'hero',
      component: <Hero data={heroConfig} />,
      variant: 'hero',
      hideTitle: true,
      fullBleed: true,
      navLabel: 'Главная',
    },
    {
      id: 'overview',
      title: 'Обзор YarCyberSeason',
      component: <About data={aboutConfig} />,
      navLabel: 'Обзор',
    },
    {
      id: 'schedule',
      title: 'Календарь событий',
      component: <Schedule data={scheduleConfig} />,
      navLabel: 'Расписание',
    },
    {
      id: 'program',
      title: 'Программа сезона',
      component: <Program sessions={programConfig} />,
      navLabel: 'Программа',
    },
    {
      id: 'benefits',
      title: 'Почему стоит участвовать',
      component: <Benefits items={benefitsConfig} />,
      navLabel: 'Преимущества',
    },
    {
      id: 'news',
      title: 'Новости экосистемы',
      component: <News data={newsConfig} />,
      navLabel: 'Новости',
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
        <a
          className="app__cta"
          href={heroConfig.action.href}
          aria-label="Зарегистрироваться на YarCyberSeason"
        >
          Регистрация
        </a>
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
