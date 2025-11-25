import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import AuthPage from './features/auth/AuthPage.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './styles/base.css';

const Root = () => {
  const isAuthRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/auth');

  return <AuthProvider>{isAuthRoute ? <AuthPage /> : <App />}</AuthProvider>;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
