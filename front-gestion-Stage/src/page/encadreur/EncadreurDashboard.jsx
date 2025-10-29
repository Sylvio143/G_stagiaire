import { motion } from "framer-motion";
import { 
  Users, 
  UserCheck, 
  FileText, 
  Clock, 
  TrendingUp, 
  Calendar,
  Star,
  Target
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

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

const statsVariants = {
  hidden: { opacity: 0, x: -30 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function EncadreurDashboard() {
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
      count: 12,
      text: "En cours d'encadrement",
      color: "blue",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Évaluations Terminées",
      icon: (
        <motion.div
          animate={{ y: [-8, 0, -8] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <UserCheck className="h-6 w-6 text-emerald-600" />
        </motion.div>
      ),
      count: 8,
      text: "Ce mois",
      color: "emerald",
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Rapports en Attente",
      icon: (
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <FileText className="h-6 w-6 text-amber-600" />
        </motion.div>
      ),
      count: 3,
      text: "À rédiger",
      color: "amber",
      gradient: "from-amber-500 to-amber-600"
    },
    {
      title: "Heures d'Encadrement",
      icon: (
        <motion.div
          animate={{ y: [-8, 0, -8] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Clock className="h-6 w-6 text-purple-600" />
        </motion.div>
      ),
      count: "42h",
      text: "Ce mois",
      color: "purple",
      gradient: "from-purple-500 to-purple-600"
    },
  ];

  const progressData = [
    { label: "Satisfaction Générale", value: 85, icon: <Star className="h-4 w-4" /> },
    { label: "Objectifs Atteints", value: 72, icon: <Target className="h-4 w-4" /> },
    { label: "Présence", value: 94, icon: <Calendar className="h-4 w-4" /> },
  ];

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
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Tableau de Bord Encadrement
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Supervision et suivi de vos stagiaires
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

      {/* Section Progression */}
      <motion.div
        className="grid gap-6 lg:grid-cols-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Progression des indicateurs */}
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
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.label}
                    </span>
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

        {/* Prochaines échéances */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-purple-600 to-blue-600" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Calendar className="h-5 w-5 text-purple-600" />
              Prochaines Échéances
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Évaluations et rapports à venir
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { task: "Évaluation trimestrielle - Jean Dupont", date: "15 Déc", type: "Évaluation" },
              { task: "Rapport de stage - Marie Martin", date: "18 Déc", type: "Rapport" },
              { task: "Entretien de mi-parcours - Pierre Blanc", date: "20 Déc", type: "Entretien" },
            ].map((item, index) => (
              <motion.div
                key={item.task}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.task}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.type}
                  </p>
                </div>
                <span className="px-2 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-full font-semibold">
                  {item.date}
                </span>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Section Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Nouvelle Évaluation", icon: UserCheck, color: "blue" },
                { label: "Rapport Hebdo", icon: FileText, color: "emerald" },
                { label: "Planning", icon: Calendar, color: "purple" },
                { label: "Statistiques", icon: TrendingUp, color: "indigo" },
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 border border-gray-200/50 dark:border-gray-600/50 shadow-sm hover:shadow-md transition-all duration-200 group"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
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