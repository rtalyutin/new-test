import Section from './components/Section.jsx';
import Hero from './features/Hero/Hero.jsx';
import About from './features/About/About.jsx';
import Benefits from './features/Benefits/Benefits.jsx';
import Program from './features/Program/Program.jsx';
import Bracket from './features/Bracket/Bracket.jsx';
import heroConfig from './features/Hero/config.json';
import aboutConfig from './features/About/config.json';
import benefitsConfig from './features/Benefits/config.json';
import programConfig from './features/Program/config.json';
import bracketConfig from './features/Bracket/config.json';

const App = () => {
  const sections = [
    {
      id: 'hero',
      component: <Hero data={heroConfig} />,
      variant: 'hero',
      hideTitle: true,
    },
    {
      id: 'about',
      title: 'О YarCyberSeason',
      component: <About data={aboutConfig} />,
    },
    {
      id: 'benefits',
      title: 'Почему стоит участвовать',
      component: <Benefits items={benefitsConfig} />,
    },
    {
      id: 'program',
      title: 'Программа сезона',
      component: <Program sessions={programConfig} />,
    },
    {
      id: 'bracket',
      title: 'Плей-офф YarCyberLeague',
      component: <Bracket stages={bracketConfig} />,
    },
  ];

  return (
    <main className="app">
      <header className="app__brand">
        <div className="app__brand-logo" aria-hidden="true">
          YCS
        </div>
        <div className="app__brand-copy">
          <p className="app__brand-label">YarCyberSeason</p>
          <h1 className="app__brand-title">Фестиваль кибербезопасности Ярославской области</h1>
          <p className="app__brand-subtitle">
            Программа поддержки специалистов по информационной безопасности с треками
            для студентов, исследователей и команд предприятий региона.
          </p>
        </div>
      </header>
      {sections.map(({ id, title, component, variant, hideTitle }) => (
        <Section key={id} title={title} variant={variant} hideTitle={hideTitle}>
          {component}
        </Section>
      ))}
    </main>
  );
};

export default App;
