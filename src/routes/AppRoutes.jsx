import { Navigate, Route, Routes } from 'react-router-dom';

import App from '../App.jsx';
import ProtectedPage from '../features/protected/ProtectedPage.jsx';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/dashboard" element={<ProtectedPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
