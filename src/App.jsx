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
      hideHeader: true,
    },
    {
      id: 'about',
      title: aboutConfig.title,
      component: <About data={aboutConfig} />,
    },
    {
      id: 'benefits',
      title: benefitsConfig.title,
      component: <Benefits data={benefitsConfig} />,
    },
    {
      id: 'program',
      title: programConfig.title,
      component: <Program data={programConfig} />,
    },
    {
      id: 'bracket',
      title: bracketConfig.title,
      component: <Bracket data={bracketConfig} />,
    },
  ];

  return (
    <main className="app">
      <header className="app__brand">
        <div className="app__brand-logo" aria-hidden="true">
          YCS
        </div>
        <div className="app__brand-copy">
          <p className="app__brand-title">YarCyberSeason</p>
          <p className="app__brand-subtitle">
            Фестиваль кибербезопасности и технологических битв
          </p>
        </div>
      </header>
      {sections.map(({ id, title, component, variant, hideHeader }) => (
        <Section key={id} title={title} variant={variant} hideHeader={hideHeader}>
          {component}
        </Section>
      ))}
    </main>
  );
};

export default App;
