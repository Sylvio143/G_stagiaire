import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  UserCheck, 
  FileText, 
  Clock, 
  TrendingUp, 
  Calendar,
  Star,
  Target,
  BookOpen,
  ListTodo,
  CheckCircle,
  AlertCircle,
  Bell,
  GraduationCap
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function EncadreurDashboard() {
  const [stats, setStats] = useState({
    stagiairesActifs: 0,
    stagesEnCours: 0,
    tachesEnAttente: 0,
    notificationsNonLues: 0,
    progressionMoyenne: 0,
    evaluationsTerminees: 0
  });
  const [stagesRecents, setStagesRecents] = useState([]);
  const [tachesUrgentes, setTachesUrgentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Configuration API
  const API_BASE_URL = "http://localhost:9090/api";

  // Récupérer l'encadreur connecté
  const getCurrentEncadreur = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.entityDocumentId;
  };

  // Charger les données du dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const encadreurId = getCurrentEncadreur();

      if (!encadreurId) {
        toast.error("Impossible de récupérer les informations de l'encadreur");
        return;
      }

      // Charger les stagiaires
      const stagiairesResponse = await axios.get(`${API_BASE_URL}/stagiaires/encadreur/${encadreurId}`);
      const stagiaires = stagiairesResponse.data;
      
      // Charger les stages
      const stagesResponse = await axios.get(`${API_BASE_URL}/stages/encadreur/${encadreurId}`);
      const stages = stagesResponse.data;

      // Charger les notifications
      let notificationsNonLues = 0;
      try {
        const compteResponse = await axios.get(
          `${API_BASE_URL}/comptes-utilisateurs/entity/${encadreurId}/type/ENCADREUR`
        );
        if (compteResponse.data) {
          const notificationsResponse = await axios.get(
            `${API_BASE_URL}/notifications/compte/${compteResponse.data.documentId}`
          );
          notificationsNonLues = notificationsResponse.data.filter(n => !n.lue).length;
        }
      } catch (error) {
        console.error("Erreur chargement notifications:", error);
      }

      // Calculer les statistiques
      const stagiairesActifs = stagiaires.filter(s => s.statut === 'ACTIF').length;
      const stagesEnCours = stages.filter(s => s.statutStage === 'EN_COURS').length;
      
      // Calculer les tâches en attente
      let tachesEnAttente = 0;
      let tachesUrgentesList = [];
      
      for (const stage of stages) {
        try {
          const tachesResponse = await axios.get(`${API_BASE_URL}/taches/stage/${stage.documentId}`);
          const tachesStage = tachesResponse.data;
          const tachesAFaire = tachesStage.filter(t => t.statut === 'A_FAIRE');
          tachesEnAttente += tachesAFaire.length;
          
          // Tâches urgentes (priorité haute et échéance proche)
          const maintenant = new Date();
          const tachesUrgentesStage = tachesAFaire.filter(tache => {
            if (tache.priorite === 1) return true;
            if (tache.dateFin) {
              const dateFin = new Date(tache.dateFin);
              const diffJours = (dateFin - maintenant) / (1000 * 60 * 60 * 24);
              return diffJours <= 3; // Échéance dans 3 jours ou moins
            }
            return false;
          });
          
          tachesUrgentesList.push(...tachesUrgentesStage.map(tache => ({
            ...tache,
            stageTitre: stage.titre
          })));
        } catch (error) {
          console.error("Erreur chargement tâches:", error);
        }
      }

      // Calculer la progression moyenne des stages
      let progressionTotale = 0;
      let stagesAvecProgression = 0;
      
      stages.forEach(stage => {
        if (stage.statutStage === 'EN_COURS' && stage.dateDebut && stage.dateFin) {
          const progression = calculerProgression(stage);
          progressionTotale += progression;
          stagesAvecProgression++;
        }
      });
      
      const progressionMoyenne = stagesAvecProgression > 0 ? Math.round(progressionTotale / stagesAvecProgression) : 0;

      // Mettre à jour le state
      setStats({
        stagiairesActifs,
        stagesEnCours,
        tachesEnAttente,
        notificationsNonLues,
        progressionMoyenne,
        evaluationsTerminees: Math.floor(stagiairesActifs * 0.6) // Estimation
      });

      // Stages récents (5 derniers)
      setStagesRecents(stages
        .sort((a, b) => new Date(b.createdAt || b.dateDebut) - new Date(a.createdAt || a.dateDebut))
        .slice(0, 5)
      );

      // Tâches urgentes
      setTachesUrgentes(tachesUrgentesList.slice(0, 5));

    } catch (error) {
      console.error("Erreur lors du chargement du dashboard:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  // Calculer la progression d'un stage
  const calculerProgression = (stage) => {
    if (!stage.dateDebut || !stage.dateFin) return 0;
    
    const debut = new Date(stage.dateDebut);
    const fin = new Date(stage.dateFin);
    const aujourdhui = new Date();
    
    if (aujourdhui < debut) return 0;
    if (aujourdhui > fin) return 100;
    
    const total = fin.getTime() - debut.getTime();
    const ecoule = aujourdhui.getTime() - debut.getTime();
    
    return Math.min(Math.round((ecoule / total) * 100), 100);
  };

  // Formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  // Navigation rapide
  const handleQuickAction = (destination) => {
    navigate(destination);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statsData = [
    {
      title: "Stagiaires Actifs",
      icon: (
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Users className="h-6 w-6 text-blue-600" />
        </motion.div>
      ),
      count: stats.stagiairesActifs,
      text: "En cours d'encadrement",
      gradient: "from-blue-500 to-blue-600",
      action: () => handleQuickAction("/encadreur/stagiaires")
    },
    {
      title: "Stages en Cours",
      icon: (
        <motion.div
          animate={{ y: [-8, 0, -8] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <BookOpen className="h-6 w-6 text-emerald-600" />
        </motion.div>
      ),
      count: stats.stagesEnCours,
      text: "En progression",
      gradient: "from-emerald-500 to-emerald-600",
      action: () => handleQuickAction("/encadreur/stages")
    },
    {
      title: "Tâches en Attente",
      icon: (
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <ListTodo className="h-6 w-6 text-amber-600" />
        </motion.div>
      ),
      count: stats.tachesEnAttente,
      text: "À assigner ou vérifier",
      gradient: "from-amber-500 to-amber-600",
      action: () => handleQuickAction("/encadreur/stages")
    },
    {
      title: "Notifications",
      icon: (
        <motion.div
          animate={{ y: [-8, 0, -8] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Bell className="h-6 w-6 text-purple-600" />
        </motion.div>
      ),
      count: stats.notificationsNonLues,
      text: "Non lues",
      gradient: "from-purple-500 to-purple-600",
      action: () => handleQuickAction("/encadreur/notifications")
    },
  ];

  const progressData = [
    { 
      label: "Progression Moyenne", 
      value: stats.progressionMoyenne, 
      icon: <TrendingUp className="h-4 w-4" />,
      description: "Avancement des stages"
    },
    { 
      label: "Taux d'Activité", 
      value: Math.min(stats.stagiairesActifs * 20, 100), 
      icon: <UserCheck className="h-4 w-4" />,
      description: "Stagiaires actifs"
    },
    { 
      label: "Satisfaction", 
      value: 85, 
      icon: <Star className="h-4 w-4" />,
      description: "Retour des stagiaires"
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
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
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 80 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
        className="min-h-screen p-6 space-y-8 bg-transparent"
      >
        {/* Header */}
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tableau de Bord Encadrement
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Supervision et suivi de vos stagiaires et stages
          </p>
        </motion.div>

        {/* Statistiques principales */}
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {statsData.map((item, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Card 
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer"
                onClick={item.action}
              >
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

        {/* Section Progression et Activités */}
        <motion.div
          className="grid gap-6 lg:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Indicateurs de Performance */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-600 to-purple-600" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Indicateurs de Performance
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Progression globale de l'encadrement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {progressData.map((item, index) => (
                <motion.div
                  key={item.label}
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {item.label}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {item.value}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Tâches Urgentes */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-amber-500 to-red-500" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                Tâches Urgentes
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Actions requises rapidement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {tachesUrgentes.length > 0 ? (
                tachesUrgentes.map((tache, index) => (
                  <motion.div
                    key={tache.documentId}
                    className="flex items-center justify-between p-3 rounded-lg bg-amber-50/50 dark:bg-amber-900/20 backdrop-blur-sm border border-amber-200/50 dark:border-amber-600/50"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {tache.titre}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {tache.stageTitre}
                      </p>
                      {tache.dateFin && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                          Échéance: {formatDate(tache.dateFin)}
                        </p>
                      )}
                    </div>
                    <Badge className={
                      tache.priorite === 1 
                        ? "bg-red-100 text-red-700 border-red-200" 
                        : "bg-amber-100 text-amber-700 border-amber-200"
                    }>
                      {tache.priorite === 1 ? "Haute" : "Moyenne"}
                    </Badge>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-4">
                  <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Aucune tâche urgente
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sections supplémentaires */}
        <motion.div
          className="grid gap-6 lg:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Stages Récents */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-purple-600 to-blue-600" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Calendar className="h-5 w-5 text-purple-600" />
                Stages Récents
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Derniers stages créés ou modifiés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {stagesRecents.length > 0 ? (
                stagesRecents.map((stage, index) => (
                  <motion.div
                    key={stage.documentId}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {stage.titre}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={
                          stage.statutStage === 'EN_COURS' 
                            ? "bg-green-100 text-green-700 border-green-200"
                            : stage.statutStage === 'VALIDE'
                            ? "bg-blue-100 text-blue-700 border-blue-200"
                            : "bg-amber-100 text-amber-700 border-amber-200"
                        }>
                          {stage.statutStage === 'EN_COURS' ? 'En cours' : 
                           stage.statutStage === 'VALIDE' ? 'Validé' : 
                           stage.statutStage === 'EN_ATTENTE_VALIDATION' ? 'En attente' : stage.statutStage}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {stage.stagiairesDocumentIds?.length || 0} stagiaires
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(stage.dateDebut)}
                    </span>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-4">
                  <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Aucun stage créé
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions Rapides */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600" />
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Actions Rapides
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Accédez rapidement aux fonctionnalités principales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { 
                    label: "Gérer Stages", 
                    icon: BookOpen, 
                    color: "blue",
                    action: () => handleQuickAction("/encadreur/stage")
                  },
                  { 
                    label: "Stagiaires", 
                    icon: Users, 
                    color: "emerald",
                    action: () => handleQuickAction("/encadreur/stagiaires")
                  },
                  { 
                    label: "Notifications", 
                    icon: Bell, 
                    color: "purple",
                    action: () => handleQuickAction("/encadreur/notifications")
                  },
                  { 
                    label: "Nouveau Stage", 
                    icon: FileText, 
                    color: "indigo",
                    action: () => handleQuickAction("/encadreur/stage?new=true")
                  },
                ].map((action, index) => (
                  <motion.button
                    key={action.label}
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 border border-gray-200/50 dark:border-gray-600/50 shadow-sm hover:shadow-md transition-all duration-200 group"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={action.action}
                  >
                    <action.icon className={`h-8 w-8 mb-2 text-${action.color}-600 group-hover:scale-110 transition-transform`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                      {action.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </>
  );
}