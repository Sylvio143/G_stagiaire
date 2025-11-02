import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  ClipboardList,
  Bell,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Sun,
  Moon,
  LogOut,
  GraduationCap
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { motion } from "framer-motion";

export default function StagiaireSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [stagiaireInfo, setStagiaireInfo] = useState({
    nom: "Stagiaire",
    prenom: "",
    email: "",
    photoUrl: null
  });
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Configuration API
  const API_BASE_URL = "http://localhost:9090/api";

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Fonction pour récupérer le compte utilisateur
  const getCurrentUserAndAccount = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.entityDocumentId) {
        return null;
      }

      // Récupérer le compte utilisateur associé au stagiaire
      const compteResponse = await axios.get(
        `${API_BASE_URL}/comptes-utilisateurs/entity/${user.entityDocumentId}/type/STAGIAIRE`
      );
      
      return compteResponse.data;
    } catch (error) {
      console.error("Erreur récupération compte:", error);
      return null;
    }
  };

  // Charger le nombre de notifications non lues
  const loadNotificationCount = async () => {
    try {
      setNotificationsLoading(true);
      const compteUtilisateur = await getCurrentUserAndAccount();
      if (!compteUtilisateur) {
        setNotificationCount(0);
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/notifications/compte/${compteUtilisateur.documentId}/count-non-lues`
      );
      
      setNotificationCount(response.data || 0);
    } catch (error) {
      console.error("Erreur chargement compteur notifications:", error);
      setNotificationCount(0);
    } finally {
      setNotificationsLoading(false);
    }
  };

  // Charger les données du stagiaire
  const fetchStagiaireData = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      
      if (user && user.entityDocumentId) {
        const response = await axios.get(`${API_BASE_URL}/stagiaires/${user.entityDocumentId}`);
        const stagiaireData = response.data;
        
        setStagiaireInfo({
          nom: stagiaireData.nom || "Stagiaire",
          prenom: stagiaireData.prenom || "",
          email: stagiaireData.email || "",
          photoUrl: stagiaireData.photoUrl || null
        });
      } else {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        setStagiaireInfo({
          nom: "Stagiaire",
          prenom: "",
          email: userData.email || "",
          photoUrl: null
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données stagiaire:", error);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setStagiaireInfo({
        nom: "Stagiaire",
        prenom: "",
        email: user.email || "",
        photoUrl: null
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage
  useEffect(() => {
    fetchStagiaireData();
    loadNotificationCount();
  }, []);

  // Mettre à jour le compteur quand la page redevient active
  useEffect(() => {
    const handleFocus = () => {
      loadNotificationCount();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Polling pour les notifications (toutes les 30 secondes)
  useEffect(() => {
    const interval = setInterval(() => {
      loadNotificationCount();
    }, 30000); // 30 secondes

    return () => clearInterval(interval);
  }, []);

  // Recharger les notifications quand on navigue vers la page des notifications
  useEffect(() => {
    if (location.pathname === "/stagiaire/notifications") {
      // Recharger le compteur après un délai pour laisser le temps à la page de traiter les notifications
      setTimeout(() => {
        loadNotificationCount();
      }, 1000);
    }
  }, [location.pathname]);

  const getInitials = (prenom, nom) => {
    if (!prenom && !nom) return "S";
    
    const firstInitial = prenom ? prenom.charAt(0).toUpperCase() : "";
    const lastInitial = nom ? nom.charAt(0).toUpperCase() : "";
    
    return firstInitial + lastInitial;
  };

  const getAvatarColor = (name) => {
    const colors = [
      "bg-gradient-to-r from-blue-600 to-purple-600",
      "bg-gradient-to-r from-indigo-600 to-purple-600",
      "bg-gradient-to-r from-blue-600 to-indigo-600",
      "bg-gradient-to-r from-purple-600 to-blue-600",
      "bg-gradient-to-r from-blue-500 to-purple-700",
      "bg-gradient-to-r from-indigo-500 to-purple-700"
    ];
    
    if (!name) return colors[0];
    
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Composant Badge de notification animé
  const NotificationBadge = ({ count, loading }) => {
    if (loading) {
      return (
        <span className="absolute -top-2 -right-2 bg-gray-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
        </span>
      );
    }

    if (count <= 0) return null;
    
    return (
      <motion.span 
        className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
      >
        {count > 9 ? "9+" : count}
      </motion.span>
    );
  };

  const menuItems = [
    {
      label: "Tableau de Bord",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: "/stagiaire/dashboard",
    },
    { 
      label: "Mes Stages", 
      icon: <Briefcase className="w-5 h-5" />, 
      path: "/stagiaire/stages" 
    },
    { 
      label: "Mes Tâches", 
      icon: <ClipboardList className="w-5 h-5" />, 
      path: "/stagiaire/taches" 
    },
    { 
      label: "Notifications", 
      icon: (
        <div className="relative">
          <Bell className="w-5 h-5" />
          <NotificationBadge count={notificationCount} loading={notificationsLoading} />
        </div>
      ), 
      path: "/stagiaire/notifications" 
    },
    { 
      label: "Paramètres", 
      icon: <Settings className="w-5 h-5" />, 
      path: "/stagiaire/parametres" 
    },
  ];

  const displayName = stagiaireInfo.prenom && stagiaireInfo.nom 
    ? `${stagiaireInfo.prenom} ${stagiaireInfo.nom}`
    : stagiaireInfo.nom;

  const initials = getInitials(stagiaireInfo.prenom, stagiaireInfo.nom);
  const avatarColor = getAvatarColor(stagiaireInfo.nom);

  return (
    <>
      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-r border-gray-200/50 dark:border-gray-700/50 shadow-xl transition-all duration-300 flex flex-col
           ${collapsed ? "w-16" : "w-64"}
           ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
           md:translate-x-0
         `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <div
            className={`flex items-center gap-3 ${
              collapsed ? "justify-center w-full" : ""
            }`}
          >
            <Avatar className="w-10 h-10 flex-shrink-0 border-2 border-white shadow-lg">
              <AvatarImage 
                src={stagiaireInfo.photoUrl} 
                alt={displayName}
                className="object-cover"
              />
              <AvatarFallback className={`${avatarColor} text-white font-semibold text-sm`}>
                {loading ? "..." : initials}
              </AvatarFallback>
            </Avatar>
            
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span
                  className="font-semibold text-sm bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent select-none whitespace-nowrap overflow-hidden text-ellipsis max-w-[9rem]"
                  title={displayName}
                >
                  {loading ? "Chargement..." : displayName}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Stagiaire
                </span>
                {stagiaireInfo.email && (
                  <span 
                    className="text-xs text-gray-400 dark:text-gray-500 mt-1 whitespace-nowrap overflow-hidden text-ellipsis max-w-[10rem]"
                    title={stagiaireInfo.email}
                  >
                    {stagiaireInfo.email}
                  </span>
                )}
                {/* Badge de notification dans le header */}
                {!collapsed && notificationCount > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                      {notificationCount} notification{notificationCount > 1 ? 's' : ''} non lue{notificationCount > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Toggle collapse */}
          <button
            className="hidden md:block p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          </button>
        </div>

        {/* Menu */}
        <nav className="mt-4 px-2 space-y-1 flex-1 overflow-auto">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => {
                setMobileOpen(false);
                // Recharger les notifications quand on clique sur le menu notifications
                if (item.path === "/stagiaire/notifications") {
                  setTimeout(() => {
                    loadNotificationCount();
                  }, 500);
                }
              }}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                location.pathname.startsWith(item.path)
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 hover:shadow-md"
              }`}
            >
              <div className="flex-shrink-0">
                {item.icon}
              </div>
              {!collapsed && (
                <span className="text-sm font-medium flex items-center justify-between w-full">
                  {item.label}
                  {/* Badge supplémentaire dans le texte pour les notifications */}
                  {item.path === "/stagiaire/notifications" && notificationCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-6 text-center">
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </span>
                  )}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div
          className={`mt-auto border-t border-gray-200/50 dark:border-gray-700/50 ${
            collapsed ? "flex flex-col items-center gap-2 p-2" : "p-4 space-y-3"
          }`}
        >
          {/* Dark mode */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className={`${
              collapsed
                ? "w-12 h-12 rounded-full flex justify-center items-center"
                : "w-full p-3 rounded-xl flex justify-between items-center"
            } bg-gray-100/50 dark:bg-gray-700/50 hover:bg-gray-200/50 dark:hover:bg-gray-600/50 backdrop-blur-sm transition-all duration-200`}
          >
            <span className="flex-shrink-0">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </span>
            {!collapsed && (
              <>
                <span className="text-sm">{darkMode ? "Mode Clair" : "Mode Sombre"}</span>
                <div className="h-6 w-12 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full relative">
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${
                      darkMode ? "left-6" : "left-0.5"
                    }`}
                  />
                </div>
              </>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 w-full p-3 rounded-xl text-red-600 hover:bg-red-100/50 dark:hover:bg-red-600/20 transition-all duration-200 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={18} />
            {!collapsed && <span className="text-sm">Déconnexion</span>}
          </button>
        </div>
      </aside>
    </>
  );
}