import './ProtectedPage.css';

const ProtectedPage = () => (
  <main className="protected-page">
    <section className="protected-card" aria-labelledby="protected-title">
      <div className="protected-card__header">
        <p className="protected-badge">Открытый раздел</p>
      </div>
      <h1 id="protected-title" className="protected-title">
        Добро пожаловать!
      </h1>
      <p className="protected-description">
        Раздел доступен всем пользователям без авторизации.
      </p>
    </section>
  </main>
);

export default ProtectedPage;
