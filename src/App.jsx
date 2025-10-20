import Section from './components/Section.jsx';
import News from './features/News/News.jsx';
import Schedule from './features/Schedule/Schedule.jsx';
import newsConfig from './features/News/config.json';
import scheduleConfig from './features/Schedule/config.json';

const App = () => {
  const sections = [
    { id: 'news', title: 'Latest News', component: <News data={newsConfig} /> },
    { id: 'schedule', title: 'Upcoming Schedule', component: <Schedule data={scheduleConfig} /> },
  ];

  return (
    <main className="app">
      <header className="app__header">
        <h1>Feature-based SPA Template</h1>
        <p>React single-page application structured by feature blocks.</p>
      </header>
      {sections.map(({ id, title, component }) => (
        <Section key={id} title={title}>
          {component}
        </Section>
      ))}
    </main>
  );
};

export default App;
