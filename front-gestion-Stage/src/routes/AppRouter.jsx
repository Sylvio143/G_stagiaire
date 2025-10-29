import { Routes, Route } from 'react-router-dom';

// Pages
import Login from '../page/login/Login';

// Encadreur
import EncadreurLayout from '../layouts/EncadreurLayout';
import EncadreurDashboard from '../page/encadreur/EncadreurDashboard';
import EncadreurStagiaire from '../page/encadreur/EncadreurStagiaire';
import EncadreurStage from '../page/encadreur/EncadreurStage';
import EncadreurRapport from '../page/encadreur/EncadreurRapport';
import EncadreurNotification from '../page/encadreur/EncadreurNotification';
import EncadreurParametre from '../page/encadreur/EncadreurParametre';

//Superieur
import SuperieurLayout from '../layouts/SuperieurLayout';
import SuperieurDashboard from '../page/superieur/SuperieurDashboard';
import SuperieurStagiaire from '../page/superieur/SuperieurStagiaire';
import SuperieurStage from '../page/superieur/SuperieurStage';
import SuperieurEncadreur from '../page/superieur/SuperieurEncadreur';
import SuperieurNotification from '../page/superieur/SuperieurNotification';
import SuperieurParametre from '../page/superieur/SuperieurParametre';

//Admin
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../page/admin/AdminDashboard';
import AdminSuperieur from '../page/admin/AdminSuperieur';
import AdminEncadreur from '../page/admin/AdminEncadreur';
import AdminStagiaire from '../page/admin/AdminStagiaire';
import AdminCompte from '../page/admin/AdminCompte';
import AdminParametre from '../page/admin/AdminParametre';

//Stagiaire
import StagiaireLayout from '../layouts/StagiaireLayout';
import StagiaireDashboard from '../page/stagiaire/StagiaireDashboard';
import StagiaireNotification from '../page/stagiaire/StagiaireNotification';
import StagiaireParametre from '../page/stagiaire/StagiaireParametre';
import StagiaireStage from '../page/stagiaire/stagiaireStage';
import StagiaireTache from '../page/stagiaire/StagiaireTache';
export default function AppRouter() {
  return (
    <Routes>     
      
      {/* Encadreur */}
      <Route path="/encadreur" element={<EncadreurLayout />}>
        <Route index element={<EncadreurDashboard />} />
        <Route path="dashboard" element={<EncadreurDashboard />} />
        <Route path="stagiaires" element={<EncadreurStagiaire />} />
        <Route path="stage" element={<EncadreurStage />} />
        <Route path="rapports" element={<EncadreurRapport/>} />
        <Route path="notifications" element={<EncadreurNotification/>} />
        <Route path="parametres" element={<EncadreurParametre/>} />
      </Route>

      {/*Superieur */}
      <Route path="/superieur" element={<SuperieurLayout />}>
        <Route index element={<SuperieurDashboard />} />
        <Route path="dashboard" element={<SuperieurDashboard />} />
        <Route path="stagiaires" element={<SuperieurStagiaire />} />
        <Route path="encadreurs" element={<SuperieurEncadreur />} />
        <Route path="notifications" element={<SuperieurNotification/>} />
        <Route path="stage" element={<SuperieurStage />} />
        <Route path="parametres" element={<SuperieurParametre/>} />
      </Route>

      {/*Admin*/}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="superieurs" element={<AdminSuperieur />} />
        <Route path="encadreurs" element={<AdminEncadreur />} />
        <Route path="stagiaires" element={<AdminStagiaire />} />
        <Route path="comptes-utilisateurs" element={<AdminCompte />} />
        <Route path="parametres" element={<AdminParametre/>} />
      </Route>

      {/*Stagiaire*/}
      <Route path="/stagiaire" element={<StagiaireLayout />}>
        <Route index element={<StagiaireDashboard />} />
        <Route path="dashboard" element={<StagiaireDashboard />} />
        <Route path="parametres" element={<StagiaireParametre />} />
        <Route path="notifications" element={<StagiaireNotification />} />
        <Route path="stages" element={<StagiaireStage />} />
        <Route path="taches" element={<StagiaireTache />} />
      </Route>
      {/* Page de connexion */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}