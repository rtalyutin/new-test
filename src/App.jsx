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

const brand = {
  abbreviation: 'YCS',
  title: 'YarCyberSeason',
  tagline: 'Фестиваль кибербезопасности и технологических битв',
};

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

const App = () => (
  <main className="app">
    <header className="app__brand" role="banner">
      <div className="app__brand-logo" aria-hidden="true">
        <span className="app__brand-mark">{brand.abbreviation}</span>
      </div>
      <div className="app__brand-copy">
        <p className="app__brand-title">{brand.title}</p>
        <p className="app__brand-subtitle">{brand.tagline}</p>
      </div>
    </header>
    {sections.map(({ id, title, component, variant, hideHeader }) => (
      <Section key={id} id={id} title={title} variant={variant} hideHeader={hideHeader}>
        {component}
      </Section>
    ))}
  </main>
);

export default App;
