import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell,
  BellRing,
  CheckCircle,
  AlertCircle,
  Info,
  Mail,
  UserPlus,
  FileText,
  Calendar,
  Clock,
  Search,
  Filter,
  Trash2,
  CheckCheck,
  Settings,
  Volume2,
  VolumeX,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Composant Switch personnalisé
const CustomSwitch = ({ checked, onCheckedChange, id, label, description }) => (
  <div className="flex items-center justify-between">
    <div className="space-y-0.5">
      <Label htmlFor={id} className="text-sm font-medium cursor-pointer">
        {label}
      </Label>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        ${checked 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
          : 'bg-gray-200 dark:bg-gray-700'
        }
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  </div>
);

export default function StagiaireNotification() {
  const [filtreType, setFiltreType] = useState("tous");
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [recherche, setRecherche] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [parametres, setParametres] = useState({
    notificationsEmail: true,
    notificationsPush: true,
    rappelsAutomatiques: true,
    sons: true
  });

  // Configuration API
  const API_BASE_URL = "http://localhost:9090/api";

  // Fonction pour formater le temps écoulé
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    if (diffDays === 1) return "Hier";
    return `Il y a ${diffDays} jours`;
  };

  // Récupérer l'utilisateur connecté et son compte
  const getCurrentUserAndAccount = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.entityDocumentId) {
        throw new Error("Utilisateur non connecté");
      }

      // Récupérer le compte utilisateur associé au stagiaire
      const compteResponse = await axios.get(
        `${API_BASE_URL}/comptes-utilisateurs/entity/${user.entityDocumentId}/type/STAGIAIRE`
      );
      
      if (!compteResponse.data) {
        throw new Error("Compte utilisateur non trouvé");
      }

      return {
        stagiaireId: user.entityDocumentId,
        compteUtilisateur: compteResponse.data
      };
    } catch (error) {
      console.error("Erreur récupération compte:", error);
      throw error;
    }
  };

  // Charger les notifications
  const loadNotifications = async () => {
    try {
      setLoading(true);
      
      const { compteUtilisateur } = await getCurrentUserAndAccount();
      
      // Récupérer les notifications du compte utilisateur
      const notificationsResponse = await axios.get(
        `${API_BASE_URL}/notifications/compte/${compteUtilisateur.documentId}`
      );
      
      const notificationsData = notificationsResponse.data;
      
      // Formater les données pour l'affichage
      const notificationsFormatees = notificationsData.map(notif => ({
        ...notif,
        formattedTime: formatTimeAgo(notif.createdAt),
        typeFrontend: mapNotificationType(notif.type),
        urgent: notif.type === 'MESSAGE_IMPORTANT' || notif.type === 'RAPPEL_TACHE'
      }));

      setNotifications(notificationsFormatees);

    } catch (error) {
      console.error("Erreur lors du chargement des notifications:", error);
      toast.error("Erreur lors du chargement des notifications");
      // Données de démonstration en cas d'erreur
      setNotifications(generateDemoNotifications());
    } finally {
      setLoading(false);
    }
  };

  // Générer des notifications de démonstration
  const generateDemoNotifications = () => {
    const types = ['NOUVEAU_STAGE', 'STAGE_VALIDE', 'NOUVELLE_TACHE', 'RAPPEL_TACHE', 'MESSAGE_IMPORTANT'];
    const messages = {
      'NOUVEAU_STAGE': 'Votre stage a été créé avec succès',
      'STAGE_VALIDE': 'Votre stage a été validé par votre encadrant',
      'NOUVELLE_TACHE': 'Une nouvelle tâche vous a été assignée',
      'RAPPEL_TACHE': 'Rappel: une tâche approche de son échéance',
      'MESSAGE_IMPORTANT': 'Message important de votre encadrant'
    };

    return Array.from({ length: 5 }, (_, i) => ({
      documentId: `demo-${i + 1}`,
      titre: `Notification ${i + 1}`,
      message: messages[types[i % types.length]],
      type: types[i % types.length],
      lue: i > 2,
      createdAt: new Date(Date.now() - i * 3600000).toISOString(),
      formattedTime: formatTimeAgo(new Date(Date.now() - i * 3600000)),
      typeFrontend: mapNotificationType(types[i % types.length]),
      urgent: types[i % types.length] === 'MESSAGE_IMPORTANT'
    }));
  };

  // Mapper les types de notification backend vers frontend
  const mapNotificationType = (type) => {
    const typeMap = {
      'NOUVEAU_STAGE': 'stage',
      'STAGE_VALIDE': 'validation',
      'STAGE_REFUSE': 'validation',
      'NOUVELLE_TACHE': 'evaluation',
      'RAPPEL_TACHE': 'rappel',
      'MESSAGE_IMPORTANT': 'message',
      'COMPTE_ACTIVE': 'system'
    };
    return typeMap[type] || 'system';
  };

  // Fonction pour obtenir le libellé du type
  const getTypeLabel = (type) => {
    const labelMap = {
      'NOUVEAU_STAGE': 'Nouveau Stage',
      'STAGE_VALIDE': 'Stage Validé',
      'STAGE_REFUSE': 'Stage Refusé',
      'NOUVELLE_TACHE': 'Nouvelle Tâche',
      'RAPPEL_TACHE': 'Rappel Tâche',
      'MESSAGE_IMPORTANT': 'Message Important',
      'COMPTE_ACTIVE': 'Système'
    };
    return labelMap[type] || 'Notification';
  };

  const getTypeIcon = (type) => {
    const frontendType = mapNotificationType(type);
    switch (frontendType) {
      case 'stage': return <FileText className="h-5 w-5 text-blue-600" />;
      case 'evaluation': return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case 'message': return <Mail className="h-5 w-5 text-purple-600" />;
      case 'rappel': return <Calendar className="h-5 w-5 text-amber-600" />;
      case 'system': return <Info className="h-5 w-5 text-gray-600" />;
      case 'validation': return <UserPlus className="h-5 w-5 text-indigo-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type) => {
    const frontendType = mapNotificationType(type);
    switch (frontendType) {
      case 'stage': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      case 'evaluation': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300';
      case 'message': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300';
      case 'rappel': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300';
      case 'system': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      case 'validation': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  // Filtrer les notifications
  const notificationsFiltrees = notifications.filter(notif => {
    const correspondRecherche = 
      notif.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      notif.message.toLowerCase().includes(recherche.toLowerCase());
    
    const correspondType = filtreType === "tous" || notif.typeFrontend === filtreType;
    const correspondStatut = filtreStatut === "tous" || 
      (filtreStatut === "non_lu" && !notif.lue) ||
      (filtreStatut === "urgent" && notif.urgent);
    
    return correspondRecherche && correspondType && correspondStatut;
  });

  // Marquer une notification comme lue
  const marquerCommeLu = async (documentId) => {
    try {
      setUpdating(true);
      await axios.put(`${API_BASE_URL}/notifications/${documentId}/marquer-lue`);
      
      // Mettre à jour localement
      setNotifications(notifications.map(notif => 
        notif.documentId === documentId ? { ...notif, lue: true } : notif
      ));
      
      toast.success("Notification marquée comme lue");
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
      
      // Mettre à jour localement même en cas d'erreur (pour la démo)
      setNotifications(notifications.map(notif => 
        notif.documentId === documentId ? { ...notif, lue: true } : notif
      ));
      
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setUpdating(false);
    }
  };

  // Marquer toutes les notifications comme lues
  const marquerToutCommeLu = async () => {
    try {
      setUpdating(true);
      const { compteUtilisateur } = await getCurrentUserAndAccount();
      
      await axios.put(
        `${API_BASE_URL}/notifications/compte/${compteUtilisateur.documentId}/marquer-toutes-lues`
      );
      
      // Mettre à jour localement
      setNotifications(notifications.map(notif => ({ ...notif, lue: true })));
      
      toast.success("Toutes les notifications marquées comme lues");
    } catch (error) {
      console.error('Erreur lors du marquage de toutes comme lues:', error);
      
      // Mettre à jour localement même en cas d'erreur (pour la démo)
      setNotifications(notifications.map(notif => ({ ...notif, lue: true })));
      
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setUpdating(false);
    }
  };

  // Supprimer une notification
  const supprimerNotification = async (documentId) => {
    try {
      setUpdating(true);
      await axios.delete(`${API_BASE_URL}/notifications/${documentId}`);
      
      // Mettre à jour localement
      setNotifications(notifications.filter(notif => notif.documentId !== documentId));
      
      toast.success("Notification supprimée");
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      
      // Mettre à jour localement même en cas d'erreur (pour la démo)
      setNotifications(notifications.filter(notif => notif.documentId !== documentId));
      
      toast.error("Erreur lors de la suppression");
    } finally {
      setUpdating(false);
    }
  };

  // Supprimer toutes les notifications
  const supprimerToutesNotifications = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer toutes les notifications ?')) {
      return;
    }

    try {
      setUpdating(true);
      const { compteUtilisateur } = await getCurrentUserAndAccount();
      
      // Récupérer toutes les notifications pour les supprimer une par une
      const notificationsResponse = await axios.get(
        `${API_BASE_URL}/notifications/compte/${compteUtilisateur.documentId}`
      );
      
      const suppressions = notificationsResponse.data.map(notif =>
        axios.delete(`${API_BASE_URL}/notifications/${notif.documentId}`)
      );
      
      await Promise.all(suppressions);
      
      setNotifications([]);
      toast.success("Toutes les notifications ont été supprimées");
    } catch (error) {
      console.error('Erreur lors de la suppression de toutes les notifications:', error);
      setNotifications([]);
      toast.success("Notifications supprimées localement");
    } finally {
      setUpdating(false);
    }
  };

  // Gérer l'action sur une notification
  const handleAction = (notification) => {
    console.log('Action sur notification:', notification);
    
    // Marquer comme lu si ce n'est pas déjà fait
    if (!notification.lue) {
      marquerCommeLu(notification.documentId);
    }
    
    // Navigation ou action spécifique selon le type de notification
    switch (notification.type) {
      case 'NOUVEAU_STAGE':
      case 'STAGE_VALIDE':
        toast.success("Redirection vers les détails du stage");
        break;
      case 'NOUVELLE_TACHE':
      case 'RAPPEL_TACHE':
        toast.success("Redirection vers les tâches");
        break;
      case 'MESSAGE_IMPORTANT':
        toast.success("Ouverture du message");
        break;
      default:
        toast.info("Notification traitée");
    }
  };

  // Calculer les statistiques
  const stats = {
    total: notifications.length,
    nonLus: notifications.filter(n => !n.lue).length,
    urgents: notifications.filter(n => n.urgent).length,
    aujourdhui: notifications.filter(n => {
      const dateNotif = new Date(n.createdAt);
      const aujourdhui = new Date();
      return dateNotif.toDateString() === aujourdhui.toDateString();
    }).length
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Chargement des notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 80 }}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
      className="min-h-screen p-6 space-y-8 bg-transparent"
    >
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#363636',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '10px',
            padding: '12px 16px',
          },
        }}
      />

      {/* Header */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mes Notifications
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Restez informé de vos activités de stage
            </p>
          </div>
          <div className="flex gap-2">
            {stats.nonLus > 0 && (
              <Button
                variant="outline"
                className="gap-2 border-gray-300 dark:border-gray-600"
                onClick={marquerToutCommeLu}
                disabled={updating}
              >
                {updating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCheck className="h-4 w-4" />
                )}
                Tout marquer comme lu
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Statistiques */}
      <motion.div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {[
          {
            title: "Total Notifications",
            icon: (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Bell className="h-6 w-6 text-blue-600" />
              </motion.div>
            ),
            count: stats.total,
            text: "Notifications reçues",
            gradient: "from-blue-500 to-blue-600"
          },
          {
            title: "Non Lus",
            icon: (
              <motion.div
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <BellRing className="h-6 w-6 text-amber-600" />
              </motion.div>
            ),
            count: stats.nonLus,
            text: "Requièrent votre attention",
            gradient: "from-amber-500 to-amber-600"
          },
          {
            title: "Urgents",
            icon: (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <AlertCircle className="h-6 w-6 text-red-600" />
              </motion.div>
            ),
            count: stats.urgents,
            text: "Actions prioritaires",
            gradient: "from-red-500 to-red-600"
          },
          {
            title: "Aujourd'hui",
            icon: (
              <motion.div
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Clock className="h-6 w-6 text-emerald-600" />
              </motion.div>
            ),
            count: stats.aujourdhui,
            text: "Nouvelles aujourd'hui",
            gradient: "from-emerald-500 to-emerald-600"
          },
        ].map((item, index) => (
          <motion.div key={index} variants={cardVariants}>
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${item.gradient}`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {item.title}
                </CardTitle>
                {item.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {item.count}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.text}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Liste des notifications */}
        <div className="lg:col-span-2">
          {/* Filtres et Recherche */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
                    {/* Barre de recherche */}
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Rechercher une notification..."
                        value={recherche}
                        onChange={(e) => setRecherche(e.target.value)}
                        className="pl-9 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                      />
                    </div>

                    {/* Filtres */}
                    <div className="flex gap-2">
                      <Select value={filtreType} onValueChange={setFiltreType}>
                        <SelectTrigger className="w-[140px] bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tous">Tous les types</SelectItem>
                          <SelectItem value="stage">Stages</SelectItem>
                          <SelectItem value="evaluation">Évaluations</SelectItem>
                          <SelectItem value="message">Messages</SelectItem>
                          <SelectItem value="rappel">Rappels</SelectItem>
                          <SelectItem value="validation">Validations</SelectItem>
                          <SelectItem value="system">Système</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={filtreStatut} onValueChange={setFiltreStatut}>
                        <SelectTrigger className="w-[140px] bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                          <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tous">Tous</SelectItem>
                          <SelectItem value="non_lu">Non lus</SelectItem>
                          <SelectItem value="urgent">Urgents</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Liste des notifications */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <AnimatePresence>
              {notificationsFiltrees.length > 0 ? (
                notificationsFiltrees.map((notification) => (
                  <motion.div
                    key={notification.documentId}
                    variants={cardVariants}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border transition-all duration-300 rounded-2xl overflow-hidden hover:shadow-xl ${
                      !notification.lue 
                        ? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20' 
                        : 'border-white/20 dark:border-gray-700/50'
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Icone type */}
                          <div className="flex-shrink-0 mt-1">
                            {getTypeIcon(notification.type)}
                          </div>

                          {/* Contenu */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <h3 className={`font-semibold truncate ${
                                  !notification.lue 
                                    ? 'text-blue-900 dark:text-blue-100' 
                                    : 'text-gray-900 dark:text-white'
                                }`}>
                                  {notification.titre}
                                </h3>
                                {notification.urgent && (
                                  <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
                                    Urgent
                                  </Badge>
                                )}
                                {!notification.lue && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                              <Badge variant="outline" className={getTypeColor(notification.type)}>
                                {getTypeLabel(notification.type)}
                              </Badge>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                              {notification.message}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                                <span>{notification.formattedTime}</span>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                  onClick={() => supprimerNotification(notification.documentId)}
                                  disabled={updating}
                                  title="Supprimer"
                                >
                                  {updating ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                                {!notification.lue ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                    onClick={() => marquerCommeLu(notification.documentId)}
                                    disabled={updating}
                                    title="Marquer comme lu"
                                  >
                                    {updating ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <EyeOff className="h-4 w-4" />
                                    )}
                                  </Button>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                                    title="Déjà lue"
                                    disabled
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                  onClick={() => handleAction(notification)}
                                  disabled={updating}
                                >
                                  {updating ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    "Voir"
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-12"
                >
                  <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    Aucune notification trouvée
                  </h3>
                  <p className="text-gray-400 dark:text-gray-500">
                    {recherche || filtreType !== "tous" || filtreStatut !== "tous" 
                      ? "Aucune notification ne correspond à vos critères de recherche."
                      : "Vous n'avez aucune notification pour le moment."
                    }
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Paramètres des notifications */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Settings className="h-5 w-5" />
                Paramètres des notifications
              </CardTitle>
              <CardDescription>
                Personnalisez vos préférences de notification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Paramètres avec CustomSwitch */}
              <div className="space-y-4">
                <CustomSwitch
                  id="email-notifications"
                  checked={parametres.notificationsEmail}
                  onCheckedChange={(checked) => 
                    setParametres({...parametres, notificationsEmail: checked})
                  }
                  label="Notifications par email"
                  description="Recevoir les notifications par email"
                />

                <CustomSwitch
                  id="push-notifications"
                  checked={parametres.notificationsPush}
                  onCheckedChange={(checked) => 
                    setParametres({...parametres, notificationsPush: checked})
                  }
                  label="Notifications push"
                  description="Notifications en temps réel"
                />

                <CustomSwitch
                  id="auto-reminders"
                  checked={parametres.rappelsAutomatiques}
                  onCheckedChange={(checked) => 
                    setParametres({...parametres, rappelsAutomatiques: checked})
                  }
                  label="Rappels automatiques"
                  description="Rappels pour les échéances"
                />

                <CustomSwitch
                  id="sounds"
                  checked={parametres.sons}
                  onCheckedChange={(checked) => 
                    setParametres({...parametres, sons: checked})
                  }
                  label="Sons de notification"
                  description="Activer les sons pour les nouvelles notifications"
                />
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  className="w-full gap-2 border-gray-300 dark:border-gray-600"
                  onClick={marquerToutCommeLu}
                  disabled={stats.nonLus === 0 || updating}
                >
                  {updating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCheck className="h-4 w-4" />
                  )}
                  Tout marquer comme lu
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full gap-2 border-red-300 dark:border-red-600 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  onClick={supprimerToutesNotifications}
                  disabled={notifications.length === 0 || updating}
                >
                  {updating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Supprimer toutes les notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}