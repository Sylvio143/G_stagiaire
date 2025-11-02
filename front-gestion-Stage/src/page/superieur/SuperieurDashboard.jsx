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
  Building,
  BarChart3,
  Eye,
  Download,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BookOpen,
  GraduationCap,
  ListTodo
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

export default function SuperieurDashboard() {
  const [dashboardData, setDashboardData] = useState({
    statsGlobales: {
      totalStagiaires: 0,
      totalEncadreurs: 0,
      stagesActifs: 0,
      stagesTermines: 0,
      stagesEnAttente: 0,
      satisfactionGenerale: 0
    },
    performanceEncadreurs: [],
    alertes: [],
    tachesEnRetard: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Configuration API
  const API_BASE_URL = "http://localhost:9090/api";

  // Récupérer le supérieur connecté
  const getCurrentSuperieur = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.entityDocumentId;
  };

  // Charger les données du dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const superieurId = getCurrentSuperieur();
      
      if (!superieurId) {
        toast.error("Impossible de récupérer les informations du supérieur");
        return;
      }

      // Récupérer tous les encadreurs sous la supervision du supérieur
      const encadreursResponse = await axios.get(`${API_BASE_URL}/encadreurs/tous`);
      const encadreursSuperieur = encadreursResponse.data.filter(
        encadreur => encadreur.superieurHierarchiqueDocumentId === superieurId
      );

      // Pour chaque encadreur, récupérer le nombre de stagiaires
      const encadreursAvecStagiaires = await Promise.all(
        encadreursSuperieur.map(async (encadreur) => {
          try {
            const stagiairesResponse = await axios.get(`${API_BASE_URL}/stagiaires/encadreur/${encadreur.documentId}`);
            const nombreStagiaires = stagiairesResponse.data.length;
            
            return {
              ...encadreur,
              nombreStagiaires: nombreStagiaires
            };
          } catch (error) {
            console.error(`Erreur lors du chargement des stagiaires pour ${encadreur.prenom} ${encadreur.nom}:`, error);
            return {
              ...encadreur,
              nombreStagiaires: 0
            };
          }
        })
      );

      // Récupérer tous les stages sous la supervision du supérieur
      const stagesResponse = await axios.get(`${API_BASE_URL}/stages/with-relations`);
      const stagesSuperieur = stagesResponse.data.filter(
        stage => stage.superieurHierarchiqueDocumentId === superieurId
      );

      // Récupérer les tâches en retard
      let tachesEnRetard = [];
      try {
        // Récupérer toutes les tâches des stages supervisés
        const tachesPromises = stagesSuperieur.map(async (stage) => {
          try {
            const tachesResponse = await axios.get(`${API_BASE_URL}/taches/stage/${stage.documentId}`);
            return tachesResponse.data.map(tache => ({
              ...tache,
              stageTitre: stage.titre,
              encadreurNom: stage.encadreurNom
            }));
          } catch (error) {
            console.error("Erreur récupération tâches:", error);
            return [];
          }
        });

        const tachesArrays = await Promise.all(tachesPromises);
        const toutesTaches = tachesArrays.flat();
        
        // Filtrer les tâches en retard
        const maintenant = new Date();
        tachesEnRetard = toutesTaches.filter(tache => {
          if (tache.statut === 'TERMINEE') return false;
          if (!tache.dateFin) return false;
          
          const dateFin = new Date(tache.dateFin);
          return dateFin < maintenant;
        });
      } catch (error) {
        console.error("Erreur récupération tâches en retard:", error);
      }

      // Calculer les statistiques globales
      const totalStagiaires = encadreursAvecStagiaires.reduce((acc, encadreur) => {
        return acc + (encadreur.nombreStagiaires || 0);
      }, 0);

      const stagesActifs = stagesSuperieur.filter(stage => stage.statutStage === 'EN_COURS').length;
      const stagesTermines = stagesSuperieur.filter(stage => stage.statutStage === 'TERMINE').length;
      const stagesEnAttente = stagesSuperieur.filter(stage => stage.statutStage === 'EN_ATTENTE_VALIDATION').length;

      // Calculer la performance des encadreurs
      const performanceEncadreurs = await Promise.all(
        encadreursAvecStagiaires.map(async (encadreur) => {
          try {
            // Récupérer les stages de l'encadreur
            const stagesEncadreur = stagesSuperieur.filter(stage => 
              stage.encadreurDocumentId === encadreur.documentId
            );

            // Récupérer les tâches de l'encadreur
            let tachesTerminees = 0;
            let tachesTotal = 0;
            let tachesEnRetardCount = 0;
            
            for (const stage of stagesEncadreur) {
              try {
                const tachesStageResponse = await axios.get(`${API_BASE_URL}/taches/stage/${stage.documentId}`);
                const tachesStage = tachesStageResponse.data;
                tachesTotal += tachesStage.length;
                tachesTerminees += tachesStage.filter(tache => tache.statut === 'TERMINEE').length;
                
                // Compter les tâches en retard
                const maintenant = new Date();
                tachesEnRetardCount += tachesStage.filter(tache => {
                  if (tache.statut === 'TERMINEE') return false;
                  if (!tache.dateFin) return false;
                  return new Date(tache.dateFin) < maintenant;
                }).length;
              } catch (error) {
                console.error("Erreur récupération tâches:", error);
              }
            }

            // Calculer la progression moyenne
            const progression = tachesTotal > 0 ? Math.round((tachesTerminees / tachesTotal) * 100) : 0;
            
            // Calculer la satisfaction (basée sur la progression, nombre de stagiaires et tâches en retard)
            let baseSatisfaction = progression;
            const bonusStagiaires = Math.min(encadreur.nombreStagiaires * 2, 20);
            const malusRetard = Math.min(tachesEnRetardCount * 5, 30);
            
            const satisfaction = Math.max(0, Math.min(baseSatisfaction + bonusStagiaires - malusRetard, 100));

            return {
              nom: `${encadreur.prenom} ${encadreur.nom}`,
              documentId: encadreur.documentId,
              stagiaires: encadreur.nombreStagiaires,
              progression: progression,
              satisfaction: Math.round(satisfaction),
              stages: stagesEncadreur.length,
              tachesEnRetard: tachesEnRetardCount,
              departement: encadreur.departement
            };
          } catch (error) {
            console.error("Erreur calcul performance encadreur:", error);
            return {
              nom: `${encadreur.prenom} ${encadreur.nom}`,
              documentId: encadreur.documentId,
              stagiaires: encadreur.nombreStagiaires,
              progression: 0,
              satisfaction: 0,
              stages: 0,
              tachesEnRetard: 0,
              departement: encadreur.departement
            };
          }
        })
      );

      // Générer les alertes
      const alertes = [];
      
      // Alertes pour les stages en attente de validation
      if (stagesEnAttente > 0) {
        alertes.push({
          type: "warning",
          message: `${stagesEnAttente} stage(s) en attente de validation`,
          encadreur: "Multiple",
          action: "/superieur/stage"
        });
      }

      // Alertes pour les tâches en retard
      if (tachesEnRetard.length > 0) {
        // Compter les tâches en retard par encadreur
        const tachesParEncadreur = {};
        tachesEnRetard.forEach(tache => {
          const encadreurNom = tache.encadreurNom || "Inconnu";
          tachesParEncadreur[encadreurNom] = (tachesParEncadreur[encadreurNom] || 0) + 1;
        });

        const encadreursAvecRetard = Object.entries(tachesParEncadreur)
          .map(([nom, count]) => `${nom} (${count})`)
          .join(", ");

        alertes.push({
          type: "urgence",
          message: `${tachesEnRetard.length} tâche(s) en retard`,
          encadreur: encadreursAvecRetard,
          action: "/superieur/stage"
        });
      }

      // Alerte si un encadreur a une performance faible
      const encadreursFaiblePerformance = performanceEncadreurs.filter(e => e.satisfaction < 60);
      if (encadreursFaiblePerformance.length > 0) {
        alertes.push({
          type: "info",
          message: `${encadreursFaiblePerformance.length} encadreur(s) avec performance faible`,
          encadreur: encadreursFaiblePerformance.map(e => e.nom.split(' ')[0]).join(", "),
          action: "/superieur/encadreurs"
        });
      }

      // Calculer la satisfaction générale
      const satisfactionGenerale = performanceEncadreurs.length > 0 
        ? Math.round(performanceEncadreurs.reduce((acc, e) => acc + e.satisfaction, 0) / performanceEncadreurs.length)
        : 0;

      setDashboardData({
        statsGlobales: {
          totalStagiaires,
          totalEncadreurs: encadreursSuperieur.length,
          stagesActifs,
          stagesTermines,
          stagesEnAttente,
          satisfactionGenerale
        },
        performanceEncadreurs: performanceEncadreurs.sort((a, b) => b.satisfaction - a.satisfaction),
        alertes,
        tachesEnRetard
      });

    } catch (error) {
      console.error("Erreur lors du chargement du dashboard:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getSatisfactionColor = (score) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  const getSatisfactionBadge = (score) => {
    if (score >= 90) return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';
    if (score >= 80) return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
    if (score >= 70) return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800';
    return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
  };

  const getAlerteColor = (type) => {
    switch (type) {
      case 'urgence': return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'warning': return 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800';
      case 'info': return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      default: return 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  const getAlerteIcon = (type) => {
    switch (type) {
      case 'urgence': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning': return <Clock className="h-4 w-4 text-amber-600" />;
      case 'info': return <Eye className="h-4 w-4 text-blue-600" />;
      default: return <Star className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleExporterRapport = async () => {
    try {
      toast.success("Génération du rapport en cours...");
      // Simulation d'export
      setTimeout(() => {
        toast.success("Rapport exporté avec succès");
      }, 2000);
    } catch (error) {
      toast.error("Erreur lors de l'export du rapport");
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const { statsGlobales, performanceEncadreurs, alertes } = dashboardData;

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tableau de Bord Supervision
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Vue consolidée de l'ensemble des encadreurs et stagiaires
              </p>
            </div>
            <Button
              onClick={handleExporterRapport}
              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Download className="h-4 w-4" />
              Exporter Rapport
            </Button>
          </div>
        </motion.div>

        {/* Statistiques Globales */}
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {[
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
              count: statsGlobales.totalStagiaires,
              text: "Sur l'ensemble des encadreurs",
              gradient: "from-blue-500 to-blue-600",
              evolution: "+12%"
            },
            {
              title: "Encadreurs",
              icon: (
                <motion.div
                  animate={{ y: [-8, 0, -8] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <UserCheck className="h-6 w-6 text-emerald-600" />
                </motion.div>
              ),
              count: statsGlobales.totalEncadreurs,
              text: "Équipe d'encadrement",
              gradient: "from-emerald-500 to-emerald-600",
              evolution: `${statsGlobales.totalEncadreurs}`
            },
            {
              title: "Stages Actifs",
              icon: (
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </motion.div>
              ),
              count: statsGlobales.stagesActifs,
              text: "En cours de réalisation",
              gradient: "from-purple-500 to-purple-600",
              evolution: `${statsGlobales.stagesActifs}`
            },
            {
              title: "Satisfaction",
              icon: (
                <motion.div
                  animate={{ y: [-8, 0, -8] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Star className="h-6 w-6 text-amber-600" />
                </motion.div>
              ),
              count: `${statsGlobales.satisfactionGenerale}%`,
              text: "Moyenne générale",
              gradient: "from-amber-500 to-amber-600",
              evolution: "+4%"
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
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {item.count}
                    </div>
                    <Badge className={`text-xs ${item.gradient.replace('from-', 'bg-').replace('to-', '')} text-white`}>
                      {item.evolution}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.text}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Performance des Encadreurs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl overflow-hidden h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Performance des Encadreurs
                </CardTitle>
                <CardDescription>
                  Classement par qualité d'encadrement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {performanceEncadreurs.length > 0 ? (
                  performanceEncadreurs.map((encadreur, index) => (
                    <motion.div
                      key={encadreur.documentId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 hover:shadow-md transition-all duration-200 cursor-pointer"
                      onClick={() => handleNavigation(`/superieur/encadreurs`)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                            index === 0 ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                            index === 1 ? 'bg-gradient-to-r from-gray-500 to-gray-600' :
                            index === 2 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                            'bg-gradient-to-r from-blue-500 to-purple-500'
                          }`}>
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {encadreur.nom}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {encadreur.stagiaires} stagiaires • {encadreur.stages} stages
                            {encadreur.departement && ` • ${encadreur.departement}`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {encadreur.progression}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Progression
                          </div>
                        </div>
                        <Badge className={getSatisfactionBadge(encadreur.satisfaction)}>
                          {encadreur.satisfaction}%
                        </Badge>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Aucun encadreur sous votre supervision
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Alertes et Activités Récentes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl overflow-hidden h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Activity className="h-5 w-5 text-red-600" />
                  Alertes Prioritaires
                </CardTitle>
                <CardDescription>
                  Actions requises et points de vigilance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {alertes.length > 0 ? (
                  alertes.map((alerte, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border ${getAlerteColor(alerte.type)}`}
                    >
                      <div className="flex items-start gap-3">
                        {getAlerteIcon(alerte.type)}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {alerte.message}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Encadreur: {alerte.encadreur}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          onClick={() => handleNavigation(alerte.action)}
                        >
                          Agir
                        </Button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Aucune alerte prioritaire
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Toutes les activités sont dans les normes
                    </p>
                  </div>
                )}

                {/* Section statistiques rapides */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {statsGlobales.stagesTermines}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      Terminés
                    </div>
                  </div>
                  <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {statsGlobales.stagesEnAttente}
                    </div>
                    <div className="text-xs text-amber-600 dark:text-amber-400">
                      En attente
                    </div>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {statsGlobales.stagesActifs}
                    </div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400">
                      En cours
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Actions Rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Actions Rapides de Supervision
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Accès direct aux fonctionnalités de gestion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { 
                    label: "Gérer Encadreurs", 
                    icon: UserCheck, 
                    path: "/superieur/encadreurs", 
                    color: "blue",
                    count: statsGlobales.totalEncadreurs,
                    description: "Équipe d'encadrement"
                  },
                  { 
                    label: "Valider Stages", 
                    icon: FileText, 
                    path: "/superieur/stage", 
                    color: "emerald",
                    count: statsGlobales.stagesEnAttente,
                    description: "En attente"
                  },
                  { 
                    label: "Voir Stagiaires", 
                    icon: GraduationCap, 
                    path: "/superieur/stagiaires", 
                    color: "purple",
                    count: statsGlobales.totalStagiaires,
                    description: "Tous les stagiaires"
                  },
                  { 
                    label: "Tâches en Retard", 
                    icon: ListTodo, 
                    path: "/superieur/stage", 
                    color: "red",
                    count: dashboardData.tachesEnRetard.length,
                    description: "À suivre"
                  },
                ].map((action, index) => (
                  <motion.button
                    key={action.label}
                    className="relative flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 border border-gray-200/50 dark:border-gray-600/50 shadow-sm hover:shadow-md transition-all duration-200 group"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavigation(action.path)}
                  >
                    {action.count > 0 && (
                      <Badge className={`absolute -top-2 -right-2 ${
                        action.color === 'red' ? 'bg-red-500' : 
                        action.color === 'emerald' ? 'bg-emerald-500' : 
                        'bg-blue-500'
                      } text-white`}>
                        {action.count}
                      </Badge>
                    )}
                    <action.icon className={`h-8 w-8 mb-2 text-${action.color}-600 group-hover:scale-110 transition-transform`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center mb-1">
                      {action.label}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      {action.description}
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