import { Link } from 'react-router-dom';

import './KaraokePage.css';

const KaraokePage = () => (
  <main className="karaoke-page">
    <section className="karaoke-card" aria-labelledby="karaoke-title">
      <h1 id="karaoke-title" className="karaoke-title">
        Караоке доступно всем
      </h1>
      <p className="karaoke-description">
        Эта страница открыта без авторизации. Просто выберите любимую композицию и
        наслаждайтесь атмосферой.
      </p>
      <Link className="karaoke-link" to="/">
        Вернуться на главную
      </Link>
    </section>
  </main>
);

export default KaraokePage;
