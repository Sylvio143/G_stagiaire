import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  Calendar,
  ChevronsLeft,
  ChevronsRight,
  Sun,
  Moon,
  Bell,
  Settings,
  LogOut,
  GraduationCap,
  BarChart3,
  Clock,
  UserCog,
  Building
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";

export default function SuperieurSidebar({
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

  const [superieurInfo, setSuperieurInfo] = useState({
    nom: "Supérieur",
    prenom: "",
    email: "",
    photoUrl: null
  });
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchSuperieurData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        
        if (user && user.entityDocumentId) {
          const response = await axios.get(`http://localhost:9090/api/superieurs-hierarchiques/${user.entityDocumentId}`);
          const superieurData = response.data;
          
          setSuperieurInfo({
            nom: superieurData.nom || "Supérieur",
            prenom: superieurData.prenom || "",
            email: superieurData.email || "",
            photoUrl: superieurData.photoUrl || null
          });
        } else {
          const userData = JSON.parse(localStorage.getItem("user") || "{}");
          setSuperieurInfo({
            nom: "Supérieur",
            prenom: "",
            email: userData.email || "",
            photoUrl: null
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données supérieur:", error);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setSuperieurInfo({
          nom: "Supérieur",
          prenom: "",
          email: user.email || "",
          photoUrl: null
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSuperieurData();
  }, []);

  const getInitials = (prenom, nom) => {
    if (!prenom && !nom) return "SH";
    
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

  const menuItems = [
    {
      label: "Tableau de Bord",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: "/superieur/dashboard",
    },
    { 
      label: "Mes Stagiaires", 
      icon: <Users className="w-5 h-5" />, 
      path: "/superieur/stagiaires" 
    },
    { 
      label: "Stage", 
      icon: <UserCheck className="w-5 h-5" />, 
      path: "/superieur/stage" 
    },
    {
      label: "Encadreurs",
      icon: <UserCog className="w-5 h-5" />,
      path: "/superieur/encadreurs"
    },
    { 
      label: "Notifications", 
      icon: (
        <div className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            5
          </span>
        </div>
      ), 
      path: "/superieur/notifications" 
    },
    { 
      label: "Paramètres", 
      icon: <Settings className="w-5 h-5" />, 
      path: "/superieur/parametres" 
    },
  ];

  const displayName = superieurInfo.prenom && superieurInfo.nom 
    ? `${superieurInfo.prenom} ${superieurInfo.nom}`
    : superieurInfo.nom;

  const initials = getInitials(superieurInfo.prenom, superieurInfo.nom);
  const avatarColor = getAvatarColor(superieurInfo.nom);

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
                src={superieurInfo.photoUrl} 
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
                  className="font-semibold text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent select-none whitespace-nowrap overflow-hidden text-ellipsis max-w-[9rem]"
                  title={displayName}
                >
                  {loading ? "Chargement..." : displayName}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Supérieur Hiérarchique
                </span>
                {superieurInfo.email && (
                  <span 
                    className="text-xs text-gray-400 dark:text-gray-500 mt-1 whitespace-nowrap overflow-hidden text-ellipsis max-w-[10rem]"
                    title={superieurInfo.email}
                  >
                    {superieurInfo.email}
                  </span>
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
          {menuItems.map((item, index) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setMobileOpen(false)}
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
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-medium">
                    {item.label}
                  </span>
                  {/* Badge pour la nouvelle section Encadreurs */}
                  {item.label === "Encadreurs" && (
                    <span className="bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      N
                    </span>
                  )}
                </div>
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
                <div className="h-6 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full relative">
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