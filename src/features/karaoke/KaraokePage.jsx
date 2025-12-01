import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import './KaraokePage.css';

const KaraokePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [authNotice, setAuthNotice] = useState(location.state?.authNotice || '');

  useEffect(() => {
    if (location.state?.authNotice) {
      setAuthNotice(location.state.authNotice);
      navigate(location.pathname, { replace: true });
    }
  }, [location.pathname, location.state?.authNotice, navigate]);

  return (
    <main className="karaoke-page">
      <section className="karaoke-card" aria-labelledby="karaoke-title">
        {authNotice ? (
          <div className="karaoke-toast" role="status" aria-live="polite">
            {authNotice}
          </div>
        ) : null}
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
};

export default KaraokePage;
