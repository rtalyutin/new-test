import Section from './components/Section.jsx';
import News from './features/News/News.jsx';
import Schedule from './features/Schedule/Schedule.jsx';

const App = () => {
  const sections = [
    { id: 'news', title: 'Latest News', component: <News /> },
    { id: 'schedule', title: 'Upcoming Schedule', component: <Schedule /> },
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
