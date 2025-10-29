import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  Briefcase,
  TrendingUp, 
  AlertTriangle,
  Calendar,
  BarChart3,
  Shield,
  Settings,
  Eye,
  MoreHorizontal,
  Download,
  Search,
  Filter,
  Plus
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
const statsData = {
  totalUsers: 156,
  activeUsers: 142,
  newThisMonth: 23,
  pendingApprovals: 8,
  superieurs: 12,
  encadreurs: 45,
  stagiaires: 99,
  activeStages: 67,
  completedStages: 32
};

const recentActivities = [
  {
    id: 1,
    user: "Marie Martin",
    action: "a créé un nouveau compte encadreur",
    time: "Il y a 5 min",
    type: "creation",
    role: "Encadreur"
  },
  {
    id: 2,
    user: "Pierre Bernard",
    action: "a modifié les paramètres du système",
    time: "Il y a 15 min",
    type: "modification",
    role: "Administrateur"
  },
  {
    id: 3,
    user: "Sophie Dubois",
    action: "a désactivé un compte supérieur",
    time: "Il y a 1 heure",
    type: "desactivation",
    role: "Supérieur"
  },
  {
    id: 4,
    user: "Thomas Leroy",
    action: "a approuvé 3 nouveaux stagiaires",
    time: "Il y a 2 heures",
    type: "approbation",
    role: "Encadreur"
  },
  {
    id: 5,
    user: "Alice Moreau",
    action: "a généré un rapport mensuel",
    time: "Il y a 3 heures",
    type: "rapport",
    role: "Administrateur"
  }
];

const pendingApprovals = [
  {
    id: 1,
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@email.com",
    role: "Encadreur",
    date: "2024-12-10",
    status: "en_attente"
  },
  {
    id: 2,
    nom: "Martin",
    prenom: "Sophie",
    email: "sophie.martin@email.com",
    role: "Supérieur",
    date: "2024-12-09",
    status: "en_attente"
  },
  {
    id: 3,
    nom: "Bernard",
    prenom: "Pierre",
    email: "pierre.bernard@email.com",
    role: "Stagiaire",
    date: "2024-12-08",
    status: "en_attente"
  }
];

const systemStats = {
  performance: 98.5,
  storage: 76,
  activeSessions: 23,
  uptime: "99.9%"
};

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const getActivityColor = (type) => {
    switch (type) {
      case 'creation': return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300';
      case 'modification': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300';
      case 'desactivation': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300';
      case 'approbation': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300';
      case 'rapport': return 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Administrateur': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300';
      case 'Supérieur': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300';
      case 'Encadreur': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Stagiaire': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const handleApprove = (id) => {
    console.log('Approuver:', id);
    // Logique d'approbation
  };

  const handleReject = (id) => {
    console.log('Rejeter:', id);
    // Logique de rejet
  };

  const handleViewDetails = (user) => {
    console.log('Voir détails:', user);
    // Navigation vers les détails
  };

  const handleExportReport = () => {
    console.log('Exporter le rapport');
    // Logique d'export
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
              Tableau de Bord Administrateur
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Vue d'ensemble du système et gestion des utilisateurs
            </p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[140px] bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="quarter">Ce trimestre</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleExportReport}
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
            title: "Utilisateurs Totaux",
            icon: (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Users className="h-6 w-6 text-blue-600" />
              </motion.div>
            ),
            count: statsData.totalUsers,
            change: "+12%",
            text: "Depuis le mois dernier",
            gradient: "from-blue-500 to-blue-600"
          },
          {
            title: "Utilisateurs Actifs",
            icon: (
              <motion.div
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <UserCheck className="h-6 w-6 text-emerald-600" />
              </motion.div>
            ),
            count: statsData.activeUsers,
            change: "+8%",
            text: "En ligne cette semaine",
            gradient: "from-emerald-500 to-emerald-600"
          },
          {
            title: "Nouveaux Utilisateurs",
            icon: (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </motion.div>
            ),
            count: statsData.newThisMonth,
            change: "+23%",
            text: "Ce mois",
            gradient: "from-purple-500 to-purple-600"
          },
          {
            title: "Approbations en Attente",
            icon: (
              <motion.div
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </motion.div>
            ),
            count: statsData.pendingApprovals,
            change: "+2",
            text: "Nécessitent votre attention",
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
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${
                    item.change.startsWith('+') 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {item.change}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.text}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Deuxième ligne de statistiques */}
      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {[
          {
            title: "Supérieurs",
            icon: <Briefcase className="h-5 w-5 text-purple-600" />,
            count: statsData.superieurs,
            color: "text-purple-600"
          },
          {
            title: "Encadreurs",
            icon: <UserCheck className="h-5 w-5 text-blue-600" />,
            count: statsData.encadreurs,
            color: "text-blue-600"
          },
          {
            title: "Stagiaires",
            icon: <GraduationCap className="h-5 w-5 text-emerald-600" />,
            count: statsData.stagiaires,
            color: "text-emerald-600"
          },
          {
            title: "Stages Actifs",
            icon: <Calendar className="h-5 w-5 text-amber-600" />,
            count: statsData.activeStages,
            color: "text-amber-600"
          },
        ].map((item, index) => (
          <Card key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {item.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {item.count}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 ${item.color}`}>
                  {item.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Approbations en attente */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Approbations en Attente</CardTitle>
                <CardDescription>
                  {pendingApprovals.length} demandes nécessitent votre validation
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                {pendingApprovals.length}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.map((approval) => (
                  <div key={approval.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {approval.prenom[0]}{approval.nom[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {approval.prenom} {approval.nom}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getRoleColor(approval.role)}>
                            {approval.role}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(approval.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(approval.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Approuver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(approval.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        Rejeter
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activités récentes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Activités Récentes</CardTitle>
              <CardDescription>
                Dernières actions des utilisateurs du système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                      <Shield className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {activity.user}
                        </span>
                        <Badge className={getRoleColor(activity.role)}>
                          {activity.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {activity.action}
                      </p>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Statistiques système */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Statistiques du Système</CardTitle>
            <CardDescription>
              Performances et état du système de gestion des stages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Performance",
                  value: `${systemStats.performance}%`,
                  icon: <TrendingUp className="h-5 w-5 text-emerald-600" />,
                  description: "Charge du serveur"
                },
                {
                  title: "Stockage",
                  value: `${systemStats.storage}%`,
                  icon: <BarChart3 className="h-5 w-5 text-blue-600" />,
                  description: "Espace utilisé"
                },
                {
                  title: "Sessions Actives",
                  value: systemStats.activeSessions,
                  icon: <Users className="h-5 w-5 text-purple-600" />,
                  description: "Utilisateurs connectés"
                },
                {
                  title: "Disponibilité",
                  value: systemStats.uptime,
                  icon: <Shield className="h-5 w-5 text-amber-600" />,
                  description: "Taux de disponibilité"
                },
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-center mb-2">
                    <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {stat.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.description}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}