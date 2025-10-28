import { Routes, Route } from 'react-router-dom';

// Pages
import Login from '../page/login/Login';

export default function AppRouter() {
  return (
    <Routes>

      {/* Page de connexion */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      {/* Agent sécurisé */}
    </Routes>
    
  );
}
