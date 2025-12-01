import { Navigate, Route, Routes } from 'react-router-dom';

import App from '../App.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import KaraokePage from '../features/karaoke/KaraokePage.jsx';
import ProtectedPage from '../features/protected/ProtectedPage.jsx';
import AuthPage from '../features/auth/AuthPage.jsx';

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<AuthPage />} />
    <Route path="/" element={<App />} />
    <Route path="/karaoke" element={<KaraokePage />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<ProtectedPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
