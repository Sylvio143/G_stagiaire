import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search,
  Filter,
  CheckCircle,
  PlayCircle,
  Clock,
  Calendar,
  Target,
  Flag,
  UserCheck,
  FileText,
  AlertCircle,
  TrendingUp,
  BarChart3,
  CheckSquare,
  ListChecks
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
const stageActuel = {
  id: 1,
  titre: "Stage Développement Fullstack",
  entreprise: "TechCorp Solutions",
  progression: 75,
  encadreur: "Thomas Leroy",
  dateDebut: "2024-09-01",
  dateFin: "2025-02-28"
};

const tachesData = [
  {
    id: 1,
    titre: "Développement module authentification",
    description: "Création du système de connexion sécurisé avec JWT et gestion des rôles utilisateurs",
    dateCreation: "2024-09-10",
    dateEcheance: "2024-12-20",
    priorite: "haute",
    statut: "en_cours",
    progression: 80,
    competences: ["React", "Node.js", "JWT", "MongoDB"],
    tempsEstime: "40 heures",
    notes: "Intégrer avec le système existant et respecter les normes de sécurité",
    sousTaches: [
      { id: 1, titre: "Configuration JWT", terminee: true },
      { id: 2, titre: "Middleware d'authentification", terminee: true },
      { id: 3, titre: "Gestion des rôles", terminee: false },
      { id: 4, titre: "Tests de sécurité", terminee: false }
    ]
  },
  {
    id: 2,
    titre: "Documentation API",
    description: "Rédaction complète de la documentation Swagger pour l'API REST",
    dateCreation: "2024-11-15",
    dateEcheance: "2024-12-25",
    priorite: "moyenne",
    statut: "a_faire",
    progression: 0,
    competences: ["Swagger", "Documentation", "API Design"],
    tempsEstime: "20 heures",
    notes: "Inclure des exemples d'utilisation pour chaque endpoint",
    sousTaches: [
      { id: 1, titre: "Structure Swagger", terminee: false },
      { id: 2, titre: "Documentation endpoints", terminee: false },
      { id: 3, titre: "Exemples d'utilisation", terminee: false }
    ]
  },
  {
    id: 3,
    titre: "Tests unitaires",
    description: "Implémentation des tests Jest pour les composants critiques",
    dateCreation: "2024-10-05",
    dateEcheance: "2024-12-18",
    priorite: "haute",
    statut: "termine",
    progression: 100,
    competences: ["Jest", "Testing", "React Testing Library"],
    tempsEstime: "30 heures",
    notes: "Cibler une couverture de tests > 80%",
    sousTaches: [
      { id: 1, titre: "Setup Jest", terminee: true },
      { id: 2, titre: "Tests composants", terminee: true },
      { id: 3, titre: "Tests services", terminee: true },
      { id: 4, titre: "Rapport couverture", terminee: true }
    ]
  },
  {
    id: 4,
    titre: "Refactoring base de données",
    description: "Optimisation des schémas MongoDB et création d'index",
    dateCreation: "2024-11-20",
    dateEcheance: "2025-01-10",
    priorite: "moyenne",
    statut: "a_faire",
    progression: 0,
    competences: ["MongoDB", "Optimisation", "Indexation"],
    tempsEstime: "25 heures",
    notes: "Analyser les performances actuelles avant refactoring",
    sousTaches: [
      { id: 1, titre: "Analyse performance", terminee: false },
      { id: 2, titre: "Refactoring schémas", terminee: false },
      { id: 3, titre: "Création index", terminee: false }
    ]
  },
  {
    id: 5,
    titre: "Interface dashboard admin",
    description: "Création de l'interface d'administration avec React et Material-UI",
    dateCreation: "2024-12-01",
    dateEcheance: "2025-01-15",
    priorite: "basse",
    statut: "en_cours",
    progression: 40,
    competences: ["React", "Material-UI", "Dashboard Design"],
    tempsEstime: "35 heures",
    notes: "Respecter la charte graphique de l'entreprise",
    sousTaches: [
      { id: 1, titre: "Maquette Figma", terminee: true },
      { id: 2, titre: "Composants base", terminee: true },
      { id: 3, titre: "Intégration données", terminee: false },
      { id: 4, titre: "Responsive design", terminee: false }
    ]
  }
];

export default function StagiaireTache() {
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [filtrePriorite, setFiltrePriorite] = useState("tous");
  const [recherche, setRecherche] = useState("");
  const [taches, setTaches] = useState(tachesData);

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'termine': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';
      case 'en_cours': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      case 'a_faire': return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getPrioriteColor = (priorite) => {
    switch (priorite) {
      case 'haute': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300';
      case 'moyenne': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300';
      case 'basse': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
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

  // Composant de barre de progression personnalisée
  const CustomProgressBar = ({ value, className = "" }) => {
    const getColor = (val) => {
      if (val >= 80) return 'bg-emerald-500';
      if (val >= 60) return 'bg-blue-500';
      if (val >= 40) return 'bg-amber-500';
      return 'bg-red-500';
    };

    return (
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 ${className}`}>
        <motion.div
          className={`h-2 rounded-full ${getColor(value)}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>
    );
  };

  const tachesFiltres = taches.filter(tache => {
    const correspondRecherche = 
      tache.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      tache.description.toLowerCase().includes(recherche.toLowerCase());
    
    const correspondStatut = filtreStatut === "tous" || tache.statut === filtreStatut;
    const correspondPriorite = filtrePriorite === "tous" || tache.priorite === filtrePriorite;
    
    return correspondRecherche && correspondStatut && correspondPriorite;
  });

  const handleCommencerTache = (tacheId) => {
    setTaches(prev => prev.map(tache => 
      tache.id === tacheId 
        ? { ...tache, statut: 'en_cours', progression: 10 }
        : tache
    ));
    // Mettre à jour la progression du stage
    console.log('Tâche commencée:', tacheId);
  };

  const handleTerminerTache = (tacheId) => {
    setTaches(prev => prev.map(tache => 
      tache.id === tacheId 
        ? { ...tache, statut: 'termine', progression: 100 }
        : tache
    ));
    // Mettre à jour la progression du stage
    console.log('Tâche terminée:', tacheId);
  };

  const handleToggleSousTache = (tacheId, sousTacheId) => {
    setTaches(prev => prev.map(tache => {
      if (tache.id === tacheId) {
        const sousTachesMaj = tache.sousTaches.map(st => 
          st.id === sousTacheId ? { ...st, terminee: !st.terminee } : st
        );
        const progression = (sousTachesMaj.filter(st => st.terminee).length / sousTachesMaj.length) * 100;
        
        return {
          ...tache,
          sousTaches: sousTachesMaj,
          progression: progression,
          statut: progression === 100 ? 'termine' : progression > 0 ? 'en_cours' : 'a_faire'
        };
      }
      return tache;
    }));
  };

  const calculateDaysRemaining = (dateEcheance) => {
    const today = new Date();
    const echeance = new Date(dateEcheance);
    const diffTime = echeance - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const stats = {
    total: taches.length,
    terminees: taches.filter(t => t.statut === 'termine').length,
    enCours: taches.filter(t => t.statut === 'en_cours').length,
    aFaire: taches.filter(t => t.statut === 'a_faire').length,
    progressionMoyenne: Math.round(taches.reduce((acc, tache) => acc + tache.progression, 0) / taches.length),
    urgentes: taches.filter(t => t.priorite === 'haute' && t.statut !== 'termine').length
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
              Mes Tâches
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Gestion des tâches pour le stage: {stageActuel.titre}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Informations du stage actuel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                    Stage en cours
                  </Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Encadré par {stageActuel.encadreur}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {stageActuel.titre}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {stageActuel.entreprise} • {new Date(stageActuel.dateDebut).toLocaleDateString()} - {new Date(stageActuel.dateFin).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stageActuel.progression}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Progression</div>
                </div>
                <CustomProgressBar value={stageActuel.progression} className="w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistiques des tâches */}
      <motion.div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {[
          {
            title: "Total Tâches",
            icon: (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <ListChecks className="h-6 w-6 text-emerald-600" />
              </motion.div>
            ),
            count: stats.total,
            text: "Tâches assignées",
            gradient: "from-emerald-500 to-emerald-600"
          },
          {
            title: "Terminées",
            icon: (
              <motion.div
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <CheckSquare className="h-6 w-6 text-blue-600" />
              </motion.div>
            ),
            count: stats.terminees,
            text: "Tâches accomplies",
            gradient: "from-blue-500 to-blue-600"
          },
          {
            title: "En Cours",
            icon: (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <PlayCircle className="h-6 w-6 text-purple-600" />
              </motion.div>
            ),
            count: stats.enCours,
            text: "En progression",
            gradient: "from-purple-500 to-purple-600"
          },
          {
            title: "Tâches Urgentes",
            icon: (
              <motion.div
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </motion.div>
            ),
            count: stats.urgentes,
            text: "Priorité haute",
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

      {/* Filtres et Recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
                {/* Barre de recherche */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher une tâche..."
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    className="pl-9 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                  />
                </div>

                {/* Filtres */}
                <div className="flex gap-2">
                  <Select value={filtreStatut} onValueChange={setFiltreStatut}>
                    <SelectTrigger className="w-[140px] bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les statuts</SelectItem>
                      <SelectItem value="a_faire">À faire</SelectItem>
                      <SelectItem value="en_cours">En cours</SelectItem>
                      <SelectItem value="termine">Terminées</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filtrePriorite} onValueChange={setFiltrePriorite}>
                    <SelectTrigger className="w-[140px] bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="Priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Toutes priorités</SelectItem>
                      <SelectItem value="haute">Haute</SelectItem>
                      <SelectItem value="moyenne">Moyenne</SelectItem>
                      <SelectItem value="basse">Basse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                {tachesFiltres.length} tâche(s) trouvée(s)
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Liste des tâches */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <AnimatePresence>
          {tachesFiltres.map((tache) => {
            const joursRestants = calculateDaysRemaining(tache.dateEcheance);
            
            return (
              <motion.div
                key={tache.id}
                variants={cardVariants}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
                  <div className="p-6">
                    {/* En-tête de la tâche */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            {getStatutIcon(tache.statut)}
                            <Badge className={getStatutColor(tache.statut)}>
                              {tache.statut === 'termine' ? 'Terminée' : tache.statut === 'en_cours' ? 'En cours' : 'À faire'}
                            </Badge>
                          </div>
                          <Badge className={getPrioriteColor(tache.priorite)}>
                            Priorité {tache.priorite}
                          </Badge>
                          {joursRestants <= 3 && joursRestants > 0 && (
                            <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                              {joursRestants} jour(s)
                            </Badge>
                          )}
                          {joursRestants < 0 && (
                            <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300">
                              En retard
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                          {tache.titre}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {tache.description}
                        </p>
                      </div>
                    </div>

                    {/* Informations détaillées */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          <span>Échéance: {new Date(tache.dateEcheance).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>Temps estimé: {tache.tempsEstime}</span>
                        </div>
                        {tache.notes && (
                          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <FileText className="h-4 w-4 mt-0.5" />
                            <span>{tache.notes}</span>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Compétences
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {tache.competences.map((competence, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                              {competence}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Sous-tâches */}
                    {tache.sousTaches && tache.sousTaches.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Sous-tâches ({tache.sousTaches.filter(st => st.terminee).length}/{tache.sousTaches.length})
                        </div>
                        <div className="space-y-2">
                          {tache.sousTaches.map((sousTache) => (
                            <div key={sousTache.id} className="flex items-center gap-3">
                              <button
                                onClick={() => handleToggleSousTache(tache.id, sousTache.id)}
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                  sousTache.terminee
                                    ? 'bg-emerald-500 border-emerald-500 text-white'
                                    : 'border-gray-300 dark:border-gray-600 hover:border-emerald-500'
                                }`}
                              >
                                {sousTache.terminee && <CheckCircle className="h-3 w-3" />}
                              </button>
                              <span className={`text-sm ${
                                sousTache.terminee
                                  ? 'text-gray-500 dark:text-gray-400 line-through'
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {sousTache.titre}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Progression et actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600 dark:text-gray-400">Progression</span>
                          <span className="font-semibold text-emerald-600">{tache.progression}%</span>
                        </div>
                        <CustomProgressBar value={tache.progression} />
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        {tache.statut === 'a_faire' && (
                          <Button
                            onClick={() => handleCommencerTache(tache.id)}
                            className="bg-emerald-600 hover:bg-emerald-700"
                            size="sm"
                          >
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Commencer
                          </Button>
                        )}
                        {tache.statut === 'en_cours' && (
                          <Button
                            onClick={() => handleTerminerTache(tache.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                            size="sm"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Terminer
                          </Button>
                        )}
                        {tache.statut === 'termine' && (
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                            Terminée
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Message si aucun résultat */}
      {tachesFiltres.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <CheckSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">
            Aucune tâche trouvée
          </h3>
          <p className="text-gray-400 dark:text-gray-500">
            Aucune tâche ne correspond à vos critères de recherche.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}