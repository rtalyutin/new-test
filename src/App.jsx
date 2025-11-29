import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AuthPage from './features/auth/AuthPage.jsx';
import HomePage from './features/home/HomePage.jsx';
import PrivateRoute from './components/PrivateRoute.js';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<HomePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
