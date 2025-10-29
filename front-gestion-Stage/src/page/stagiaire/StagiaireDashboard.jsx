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

// Données de démonstration
const dashboardData = {
  stage: {
    entreprise: "TechCorp Solutions",
    poste: "Développeur Fullstack",
    dateDebut: "2024-09-01",
    dateFin: "2025-02-28",
    progression: 75,
    encadreur: "Thomas Leroy",
    statut: "En cours",
    dureeRestante: "2 mois 15 jours"
  },
  taches: [
    {
      id: 1,
      titre: "Développement module authentification",
      description: "Création du système de connexion avec JWT",
      dateEcheance: "2024-12-20",
      priorite: "haute",
      statut: "en_cours",
      progression: 80
    },
    {
      id: 2,
      titre: "Documentation API",
      description: "Rédaction de la documentation Swagger",
      dateEcheance: "2024-12-25",
      priorite: "moyenne",
      statut: "a_faire",
      progression: 0
    },
    {
      id: 3,
      titre: "Tests unitaires",
      description: "Implémentation des tests Jest",
      dateEcheance: "2024-12-18",
      priorite: "haute",
      statut: "termine",
      progression: 100
    }
  ],
  competences: [
    { nom: "React", niveau: 85 },
    { nom: "Node.js", niveau: 78 },
    { nom: "MongoDB", niveau: 70 },
    { nom: "TypeScript", niveau: 65 }
  ],
  recentActivity: [
    {
      id: 1,
      type: "tache_terminee",
      message: "Vous avez terminé la tâche 'Tests unitaires'",
      time: "Il y a 2 heures",
      icon: <CheckCircle className="h-4 w-4 text-emerald-500" />
    },
    {
      id: 2,
      type: "feedback",
      message: "Thomas Leroy a commenté votre rapport hebdomadaire",
      time: "Il y a 5 heures",
      icon: <UserCheck className="h-4 w-4 text-blue-500" />
    },
    {
      id: 3,
      type: "rappel",
      message: "Rapport d'activité à soumettre dans 3 jours",
      time: "Il y a 1 jour",
      icon: <Bell className="h-4 w-4 text-amber-500" />
    }
  ],
  stats: {
    tachesTerminees: 12,
    tachesEnCours: 3,
    tachesRetard: 1,
    heuresTravail: 245,
    objectifsAtteints: 8,
    totalObjectifs: 10
  }
};

export default function StagiaireDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("semaine");
  const [loading, setLoading] = useState(false);

  const getPrioriteColor = (priorite) => {
    switch (priorite) {
      case 'haute': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      case 'moyenne': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800';
      case 'basse': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'termine': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300';
      case 'en_cours': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      case 'a_faire': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'termine': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'en_cours': return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case 'a_faire': return <Clock className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleStartTask = (tacheId) => {
    console.log('Démarrer tâche:', tacheId);
    // Logique pour démarrer une tâche
  };

  const handleCompleteTask = (tacheId) => {
    console.log('Terminer tâche:', tacheId);
    // Logique pour terminer une tâche
  };

  const handleViewDetails = (tacheId) => {
    console.log('Voir détails tâche:', tacheId);
    // Navigation vers les détails de la tâche
  };

  const calculateDaysRemaining = (dateEcheance) => {
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

  return (
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
                    {dashboardData.stage.encadreur}
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
                  Tâches en Cours
                </CardTitle>
                <CardDescription>
                  {dashboardData.taches.filter(t => t.statut === 'en_cours' || t.statut === 'a_faire').length} tâches à réaliser
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                {dashboardData.taches.filter(t => t.statut === 'en_cours').length} en cours
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.taches
                  .filter(tache => tache.statut !== 'termine')
                  .slice(0, 3)
                  .map((tache) => {
                    const joursRestants = calculateDaysRemaining(tache.dateEcheance);
                    return (
                      <div key={tache.id} className="flex items-start justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
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
                                {tache.priorite}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                              {tache.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                              <span>Échéance: {new Date(tache.dateEcheance).toLocaleDateString()}</span>
                              {joursRestants <= 3 && joursRestants > 0 && (
                                <Badge variant="outline" className="text-amber-600 border-amber-300">
                                  {joursRestants} jour(s)
                                </Badge>
                              )}
                              {joursRestants < 0 && (
                                <Badge variant="outline" className="text-red-600 border-red-300">
                                  En retard
                                </Badge>
                              )}
                            </div>
                            {tache.statut === 'en_cours' && (
                              <div className="mt-2">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Progression</span>
                                  <span>{tache.progression}%</span>
                                </div>
                                <CustomProgressBar value={tache.progression} />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          {tache.statut === 'a_faire' && (
                            <Button
                              size="sm"
                              onClick={() => handleStartTask(tache.id)}
                              className="h-8 px-2 bg-emerald-600 hover:bg-emerald-700"
                            >
                              <PlayCircle className="h-3 w-3" />
                            </Button>
                          )}
                          {tache.statut === 'en_cours' && (
                            <Button
                              size="sm"
                              onClick={() => handleCompleteTask(tache.id)}
                              className="h-8 px-2 bg-blue-600 hover:bg-blue-700"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
                {dashboardData.recentActivity.map((activity) => (
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
                ))}
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