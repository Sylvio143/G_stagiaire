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
  Activity
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

// Données de démonstration consolidées pour le supérieur
const dashboardData = {
  statsGlobales: {
    totalStagiaires: 45,
    totalEncadreurs: 8,
    stagesActifs: 23,
    stagesTermines: 12,
    rapportsComplets: 38,
    satisfactionGenerale: 86
  },
  performanceEncadreurs: [
    { nom: "Michel Dubois", stagiaires: 6, progression: 92, satisfaction: 94 },
    { nom: "Sophie Martin", stagiaires: 5, progression: 88, satisfaction: 91 },
    { nom: "Pierre Bernard", stagiaires: 7, progression: 78, satisfaction: 85 },
    { nom: "Alice Moreau", stagiaires: 4, progression: 95, satisfaction: 96 },
    { nom: "Thomas Leroy", stagiaires: 6, progression: 82, satisfaction: 87 }
  ],
  alertes: [
    { type: "urgence", message: "2 rapports en retard", encadreur: "Pierre Bernard" },
    { type: "warning", message: "Stage à risque d'échec", encadreur: "Thomas Leroy" },
    { type: "info", message: "Nouvel encadreur à former", encadreur: "Nouveau" }
  ],
  evolutionMensuelle: {
    stagiaires: [35, 38, 42, 45, 48, 45],
    rapports: [25, 28, 32, 35, 38, 38],
    satisfaction: [82, 84, 85, 86, 87, 86]
  }
};

export default function SuperieurDashboard() {
  const { statsGlobales, performanceEncadreurs, alertes } = dashboardData;

  const getSatisfactionColor = (score) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  const getSatisfactionBadge = (score) => {
    if (score >= 90) return 'bg-emerald-100 text-emerald-700';
    if (score >= 80) return 'bg-blue-100 text-blue-700';
    if (score >= 70) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
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
      case 'urgence': return <Activity className="h-4 w-4 text-red-600" />;
      case 'warning': return <Target className="h-4 w-4 text-amber-600" />;
      case 'info': return <Eye className="h-4 w-4 text-blue-600" />;
      default: return <Star className="h-4 w-4 text-gray-600" />;
    }
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tableau de Bord Supervision
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Vue consolidée de l'ensemble des encadreurs et stagiaires
            </p>
          </div>
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
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
            evolution: "+2"
          },
          {
            title: "Stages Actifs",
            icon: (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Building className="h-6 w-6 text-purple-600" />
              </motion.div>
            ),
            count: statsGlobales.stagesActifs,
            text: "En cours de réalisation",
            gradient: "from-purple-500 to-purple-600",
            evolution: "+5"
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
              {performanceEncadreurs.map((encadreur, index) => (
                <motion.div
                  key={encadreur.nom}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {encadreur.nom}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {encadreur.stagiaires} stagiaires
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
              ))}
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
              {alertes.map((alerte, index) => (
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
                    >
                      Agir
                    </Button>
                  </div>
                </motion.div>
              ))}

              {/* Section statistiques rapides */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {statsGlobales.rapportsComplets}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    Rapports validés
                  </div>
                </div>
                <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {statsGlobales.stagesTermines}
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400">
                    Stages terminés
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
                { label: "Voir tous les encadreurs", icon: UserCheck, path: "/superieur/encadreurs", color: "blue" },
                { label: "Rapports consolidés", icon: FileText, path: "/superieur/rapports", color: "emerald" },
                { label: "Stages en cours", icon: Building, path: "/superieur/stage", color: "purple" },
                { label: "Analytiques détaillées", icon: BarChart3, path: "/superieur/analytics", color: "amber" },
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 border border-gray-200/50 dark:border-gray-600/50 shadow-sm hover:shadow-md transition-all duration-200 group"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => console.log('Navigation vers:', action.path)}
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
  );
}