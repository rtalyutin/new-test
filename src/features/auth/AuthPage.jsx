import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import './AuthPage.css';

const AuthPage = () => {
  const { setToken } = useAuth();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submitDisabled = useMemo(
    () => loading || !login.trim() || !password.trim(),
    [loading, login, password],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.message || 'Не удалось выполнить вход');
      }

      if (!payload?.token) {
        throw new Error('Токен не получен от сервера');
      }

      setToken(payload.token, { remember: rememberMe });
    } catch (err) {
      setError(err.message || 'Произошла ошибка при выполнении запроса');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <header className="auth-card__header">
          <h1 id="auth-title" className="auth-card__title">
            Войти в аккаунт
          </h1>
          <p className="auth-card__subtitle">
            Получите доступ к закрытым разделам платформы, используя свои учетные данные.
          </p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="auth-form__field">
            <span className="auth-form__label">Логин</span>
            <input
              className="auth-form__input"
              type="text"
              value={login}
              onChange={(event) => setLogin(event.target.value)}
              required
              autoComplete="username"
              placeholder="Введите логин"
            />
          </label>
          <label className="auth-form__field">
            <span className="auth-form__label">Пароль</span>
            <input
              className="auth-form__input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              placeholder="Введите пароль"
            />
          </label>
          <label className="auth-form__checkbox-row">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            <span>Запомнить меня</span>
          </label>
          {error ? (
            <div className="auth-form__error" role="alert">
              {error}
            </div>
          ) : null}
          <button className="auth-form__submit" type="submit" disabled={submitDisabled}>
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </form>
        <p className="auth-card__hint">
          Убедитесь, что используете корпоративные учетные данные. Если не удается войти, попробуйте
          снять отметку «Запомнить меня» и повторите попытку.
        </p>
      </section>
    </div>
  );
};

export default AuthPage;
