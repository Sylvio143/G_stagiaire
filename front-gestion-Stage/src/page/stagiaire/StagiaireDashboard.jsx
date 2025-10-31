import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar,
  Clock,
  Target,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  FileText,
  UserCheck,
  Award,
  BarChart3,
  Bell,
  Download,
  PlayCircle,
  PauseCircle,
  CheckSquare,
  Briefcase,
  ClipboardList
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export default function StagiaireDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("semaine");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stage: null,
    taches: [],
    competences: [],
    recentActivity: [],
    stats: {
      tachesTerminees: 0,
      tachesEnCours: 0,
      tachesRetard: 0,
      heuresTravail: 0,
      objectifsAtteints: 0,
      totalObjectifs: 0
    }
  });

  // Configuration API
  const API_BASE_URL = "http://localhost:9090/api";

  // Charger les données du dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Récupérer l'ID du stagiaire connecté
      const user = JSON.parse(localStorage.getItem("user"));
      const stagiaireId = user?.entityDocumentId;
      
      if (!stagiaireId) {
        toast.error("Impossible de récupérer les informations du stagiaire");
        return;
      }

      // Récupérer les stages du stagiaire
      const stagesResponse = await axios.get(`${API_BASE_URL}/stages/stagiaire/${stagiaireId}`);
      const stagesStagiaire = stagesResponse.data;

      // Trouver le stage en cours
      const stageEnCours = stagesStagiaire.find(stage => stage.statutStage === 'EN_COURS');
      
      if (!stageEnCours) {
        setDashboardData(prev => ({
          ...prev,
          stage: null
        }));
        return;
      }

      // Récupérer les détails complets du stage
      const stageDetailResponse = await axios.get(`${API_BASE_URL}/stages/${stageEnCours.documentId}`);
      const stageDetail = stageDetailResponse.data;

      // Récupérer les informations de l'encadreur
      let encadreurNom = "Non assigné";
      if (stageDetail.encadreurDocumentId) {
        try {
          const encadreurResponse = await axios.get(`${API_BASE_URL}/encadreurs/${stageDetail.encadreurDocumentId}`);
          const encadreur = encadreurResponse.data;
          encadreurNom = `${encadreur.prenom} ${encadreur.nom}`;
        } catch (error) {
          console.error("Erreur récupération encadreur:", error);
        }
      }

      // Récupérer les informations du supérieur hiérarchique (entreprise)
      let entreprise = "Entreprise non spécifiée";
      if (stageDetail.superieurHierarchiqueDocumentId) {
        try {
          const superieurResponse = await axios.get(`${API_BASE_URL}/superieurs-hierarchiques/${stageDetail.superieurHierarchiqueDocumentId}`);
          const superieur = superieurResponse.data;
          entreprise = superieur.departement || "Entreprise non spécifiée";
        } catch (error) {
          console.error("Erreur récupération supérieur:", error);
        }
      }

      // Calculer la progression du stage
      const maintenant = new Date();
      const dateDebut = new Date(stageDetail.dateDebut);
      const dateFin = new Date(stageDetail.dateFin);
      const dureeTotale = dateFin - dateDebut;
      const tempsEcoule = maintenant - dateDebut;
      const progressionStage = Math.min(100, Math.max(0, (tempsEcoule / dureeTotale) * 100));

      // Calculer la durée restante
      const joursRestants = Math.ceil((dateFin - maintenant) / (1000 * 60 * 60 * 24));
      const moisRestants = Math.floor(joursRestants / 30);
      const joursDansMois = joursRestants % 30;
      const dureeRestante = moisRestants > 0 
        ? `${moisRestants} mois ${joursDansMois > 0 ? `${joursDansMois} jours` : ''}`
        : `${joursRestants} jours`;

      // Récupérer les tâches du stage
      const tachesResponse = await axios.get(`${API_BASE_URL}/taches/stage/${stageEnCours.documentId}`);
      const tachesData = tachesResponse.data;

      // Calculer les statistiques des tâches
      const tachesTerminees = tachesData.filter(t => t.statut === 'TERMINEE').length;
      const tachesEnCours = tachesData.filter(t => t.statut === 'EN_COURS').length;
      const tachesAFaire = tachesData.filter(t => t.statut === 'A_FAIRE').length;
      const tachesRetard = tachesData.filter(t => {
        if (!t.dateFin || t.statut === 'TERMINEE') return false;
        return new Date(t.dateFin) < new Date();
      }).length;

      // Récupérer les notifications récentes
      let recentActivity = [];
      try {
        const compteResponse = await axios.get(
          `${API_BASE_URL}/comptes-utilisateurs/entity/${stagiaireId}/type/STAGIAIRE`
        );
        if (compteResponse.data) {
          const compteStagiaire = compteResponse.data;
          const notificationsResponse = await axios.get(
            `${API_BASE_URL}/notifications/compte/${compteStagiaire.documentId}`
          );
          recentActivity = notificationsResponse.data.slice(0, 3).map(notif => ({
            id: notif.documentId,
            type: "notification",
            message: notif.message,
            time: formatTimeAgo(notif.createdAt),
            icon: <Bell className="h-4 w-4 text-blue-500" />
          }));
        }
      } catch (error) {
        console.error("Erreur récupération notifications:", error);
        // Notifications par défaut si erreur
        recentActivity = [
          {
            id: 1,
            type: "welcome",
            message: "Bienvenue sur votre tableau de bord de stage",
            time: "Maintenant",
            icon: <Bell className="h-4 w-4 text-emerald-500" />
          }
        ];
      }

      // Compétences basées sur les tâches
      const competences = genererCompetences(tachesData);

      setDashboardData({
        stage: {
          ...stageDetail,
          encadreurNom,
          entreprise,
          progression: Math.round(progressionStage),
          dureeRestante,
          poste: "Stagiaire" // Vous pourriez adapter selon vos besoins
        },
        taches: tachesData.slice(0, 3), // Afficher seulement 3 tâches
        competences,
        recentActivity,
        stats: {
          tachesTerminees,
          tachesEnCours,
          tachesRetard,
          heuresTravail: Math.round(tachesTerminees * 8), // Estimation basée sur les tâches
          objectifsAtteints: tachesTerminees,
          totalObjectifs: tachesData.length
        }
      });

    } catch (error) {
      console.error("Erreur lors du chargement du dashboard:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

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

  // Générer les compétences basées sur les tâches
  const genererCompetences = (taches) => {
    const competencesMap = {};
    
    taches.forEach(tache => {
      // Analyser la description pour détecter des technologies
      const description = tache.description?.toLowerCase() || '';
      
      if (description.includes('react') || description.includes('frontend')) {
        competencesMap['React'] = Math.min(100, (competencesMap['React'] || 0) + 20);
      }
      if (description.includes('node') || description.includes('backend')) {
        competencesMap['Node.js'] = Math.min(100, (competencesMap['Node.js'] || 0) + 20);
      }
      if (description.includes('mongodb') || description.includes('database')) {
        competencesMap['MongoDB'] = Math.min(100, (competencesMap['MongoDB'] || 0) + 15);
      }
      if (description.includes('typescript')) {
        competencesMap['TypeScript'] = Math.min(100, (competencesMap['TypeScript'] || 0) + 25);
      }
      if (description.includes('javascript')) {
        competencesMap['JavaScript'] = Math.min(100, (competencesMap['JavaScript'] || 0) + 20);
      }
      if (description.includes('api') || description.includes('rest')) {
        competencesMap['API Design'] = Math.min(100, (competencesMap['API Design'] || 0) + 15);
      }
      if (description.includes('test') || description.includes('jest')) {
        competencesMap['Testing'] = Math.min(100, (competencesMap['Testing'] || 0) + 10);
      }
    });

    // Compétences par défaut si aucune détectée
    if (Object.keys(competencesMap).length === 0) {
      return [
        { nom: "Développement", niveau: 60 },
        { nom: "Collaboration", niveau: 75 },
        { nom: "Analyse", niveau: 55 },
        { nom: "Résolution de problèmes", niveau: 70 }
      ];
    }

    return Object.entries(competencesMap).map(([nom, niveau]) => ({
      nom,
      niveau: Math.max(40, Math.min(95, niveau)) // Niveau entre 40% et 95%
    })).slice(0, 4); // Maximum 4 compétences
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getPrioriteColor = (priorite) => {
    switch (priorite) {
      case 1: return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      case 2: return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800';
      case 3: return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getPrioriteLabel = (priorite) => {
    switch (priorite) {
      case 1: return 'Haute';
      case 2: return 'Moyenne';
      case 3: return 'Basse';
      default: return 'Non définie';
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'TERMINEE': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300';
      case 'EN_COURS': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      case 'A_FAIRE': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatutLabel = (statut) => {
    switch (statut) {
      case 'TERMINEE': return 'Terminée';
      case 'EN_COURS': return 'En cours';
      case 'A_FAIRE': return 'À faire';
      default: return statut;
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'TERMINEE': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'EN_COURS': return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case 'A_FAIRE': return <Clock className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleCommencerTache = async (tache) => {
    try {
      await axios.put(`${API_BASE_URL}/taches/${tache.documentId}/statut/EN_COURS`);
      toast.success("Tâche mise en cours");
      await fetchDashboardData(); // Recharger les données
    } catch (error) {
      console.error("Erreur mise en cours tâche:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleTerminerTache = async (tache) => {
    try {
      await axios.put(`${API_BASE_URL}/taches/${tache.documentId}/statut/TERMINEE`);
      toast.success("Tâche terminée avec succès");
      await fetchDashboardData(); // Recharger les données
    } catch (error) {
      console.error("Erreur terminaison tâche:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const calculateDaysRemaining = (dateEcheance) => {
    if (!dateEcheance) return null;
    const today = new Date();
    const echeance = new Date(dateEcheance);
    const diffTime = echeance - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Composant de barre de progression personnalisée
  const CustomProgressBar = ({ value, className = "" }) => {
    return (
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 ${className}`}>
        <motion.div
          className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData.stage) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">
            Aucun stage en cours
          </h3>
          <p className="text-gray-400 dark:text-gray-500">
            Vous n'avez pas de stage en cours actuellement.
          </p>
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Tableau de Bord Stagiaire
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Bienvenue dans votre espace de suivi de stage
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              className="gap-2 border-gray-300 dark:border-gray-600"
            >
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Statistiques principales */}
      <motion.div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {[
          {
            title: "Progression du Stage",
            icon: (
              <motion.div
                animate={{ rotate: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </motion.div>
            ),
            count: `${dashboardData.stage.progression}%`,
            text: `${dashboardData.stage.dureeRestante} restants`,
            gradient: "from-emerald-500 to-emerald-600"
          },
          {
            title: "Tâches Terminées",
            icon: (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <CheckSquare className="h-6 w-6 text-blue-600" />
              </motion.div>
            ),
            count: dashboardData.stats.tachesTerminees,
            text: "Tâches accomplies",
            gradient: "from-blue-500 to-blue-600"
          },
          {
            title: "Heures de Travail",
            icon: (
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Clock className="h-6 w-6 text-purple-600" />
              </motion.div>
            ),
            count: `${dashboardData.stats.heuresTravail}h`,
            text: "Cumulées",
            gradient: "from-purple-500 to-purple-600"
          },
          {
            title: "Objectifs Atteints",
            icon: (
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Target className="h-6 w-6 text-amber-600" />
              </motion.div>
            ),
            count: `${dashboardData.stats.objectifsAtteints}/${dashboardData.stats.totalObjectifs}`,
            text: "Objectifs réalisés",
            gradient: "from-amber-500 to-amber-600"
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Informations du stage */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-emerald-600" />
                Mon Stage
              </CardTitle>
              <CardDescription>
                Informations détaillées sur votre stage actuel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Entreprise</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {dashboardData.stage.entreprise}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Poste</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {dashboardData.stage.poste}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Période</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {new Date(dashboardData.stage.dateDebut).toLocaleDateString()} - {" "}
                    {new Date(dashboardData.stage.dateFin).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Encadreur</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {dashboardData.stage.encadreurNom}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Progression globale</p>
                  <span className="text-sm font-semibold text-emerald-600">
                    {dashboardData.stage.progression}%
                  </span>
                </div>
                <CustomProgressBar value={dashboardData.stage.progression} />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700">
                  Voir détails
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tâches en cours */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-blue-600" />
                  Tâches Récentes
                </CardTitle>
                <CardDescription>
                  {dashboardData.taches.filter(t => t.statut === 'EN_COURS' || t.statut === 'A_FAIRE').length} tâches à réaliser
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                {dashboardData.taches.filter(t => t.statut === 'EN_COURS').length} en cours
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.taches.length > 0 ? (
                  dashboardData.taches.map((tache) => {
                    const joursRestants = calculateDaysRemaining(tache.dateFin);
                    const estEnRetard = tache.dateFin && new Date(tache.dateFin) < new Date() && tache.statut !== 'TERMINEE';
                    
                    return (
                      <div key={tache.documentId} className="flex items-start justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">
                            {getStatutIcon(tache.statut)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-gray-900 dark:text-white truncate">
                                {tache.titre}
                              </p>
                              <Badge className={getPrioriteColor(tache.priorite)}>
                                {getPrioriteLabel(tache.priorite)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                              {tache.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                              {tache.dateFin && (
                                <span>Échéance: {new Date(tache.dateFin).toLocaleDateString()}</span>
                              )}
                              {estEnRetard && (
                                <Badge variant="outline" className="text-red-600 border-red-300">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  En retard
                                </Badge>
                              )}
                              {joursRestants !== null && joursRestants <= 3 && joursRestants > 0 && !estEnRetard && (
                                <Badge variant="outline" className="text-amber-600 border-amber-300">
                                  {joursRestants} jour(s)
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          {tache.statut === 'A_FAIRE' && (
                            <Button
                              size="sm"
                              onClick={() => handleCommencerTache(tache)}
                              className="h-8 px-2 bg-emerald-600 hover:bg-emerald-700"
                            >
                              <PlayCircle className="h-3 w-3" />
                            </Button>
                          )}
                          {tache.statut === 'EN_COURS' && (
                            <Button
                              size="sm"
                              onClick={() => handleTerminerTache(tache)}
                              className="h-8 px-2 bg-blue-600 hover:bg-blue-700"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                          {tache.statut === 'TERMINEE' && (
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Terminée
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4">
                    <ClipboardList className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Aucune tâche assignée</p>
                  </div>
                )}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Voir toutes les tâches
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Compétences développées */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                Compétences Développées
              </CardTitle>
              <CardDescription>
                Progression de vos compétences techniques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.competences.map((competence, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {competence.nom}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {competence.niveau}%
                      </span>
                    </div>
                    <CustomProgressBar value={competence.niveau} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activité récente */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-600" />
                Activité Récente
              </CardTitle>
              <CardDescription>
                Dernières notifications et mises à jour
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentActivity.length > 0 ? (
                  dashboardData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="mt-0.5">
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white mb-1">
                          {activity.message}
                        </p>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Aucune activité récente</p>
                  </div>
                )}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Voir toutes les notifications
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}