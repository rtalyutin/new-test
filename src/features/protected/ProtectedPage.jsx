import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext.jsx';
import './ProtectedPage.css';

const ProtectedPage = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/auth', { replace: true });
  };

  return (
    <main className="protected-page">
      <section className="protected-card" aria-labelledby="protected-title">
        <div className="protected-card__header">
          <p className="protected-badge">Закрытый раздел</p>
          <button type="button" className="protected-signout" onClick={handleSignOut}>
            Выйти
          </button>
        </div>
        <h1 id="protected-title" className="protected-title">
          Добро пожаловать!
        </h1>
        <p className="protected-description">
          Вы вошли в защищенную часть платформы. Здесь появятся инструменты и данные, доступные
          только авторизованным пользователям.
        </p>
      </section>
    </main>
  );
};

export default ProtectedPage;
