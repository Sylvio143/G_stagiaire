import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar,
  Building,
  MapPin,
  Clock,
  Search,
  Filter,
  GraduationCap,
  Eye,
  UserCheck,
  Target,
  TrendingUp,
  CheckCircle,
  PlayCircle,
  FileText,
  BarChart3,
  Users
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

export default function StagiaireStage() {
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [recherche, setRecherche] = useState("");
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Configuration API
  const API_BASE_URL = "http://localhost:9090/api";

  // Charger les stages du stagiaire connecté
  const fetchStages = async () => {
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
      const response = await axios.get(`${API_BASE_URL}/stages/stagiaire/${stagiaireId}`);
      const stagesStagiaire = response.data;

      // Enrichir les données des stages
      const stagesEnrichis = await Promise.all(
        stagesStagiaire.map(async (stage) => {
          try {
            // Récupérer les détails complets du stage avec relations
            const stageDetailResponse = await axios.get(`${API_BASE_URL}/stages/${stage.documentId}`);
            const stageDetail = stageDetailResponse.data;

            // Récupérer les tâches du stage
            let taches = [];
            let tachesTerminees = 0;
            let tachesEnCours = 0;
            try {
              const tachesResponse = await axios.get(`${API_BASE_URL}/taches/stage/${stage.documentId}`);
              taches = tachesResponse.data;
              tachesTerminees = taches.filter(tache => tache.statut === 'TERMINEE').length;
              tachesEnCours = taches.filter(tache => tache.statut === 'EN_COURS' || tache.statut === 'A_FAIRE').length;
            } catch (error) {
              console.error("Erreur récupération tâches:", error);
            }

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

            // Récupérer les informations du supérieur hiérarchique
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

            // Calculer la progression basée sur les dates
            const maintenant = new Date();
            const dateDebut = new Date(stageDetail.dateDebut);
            const dateFin = new Date(stageDetail.dateFin);
            const dureeTotale = dateFin - dateDebut;
            const tempsEcoule = maintenant - dateDebut;
            
            let progression = 0;
            if (stageDetail.statutStage === 'TERMINE') {
              progression = 100;
            } else if (stageDetail.statutStage === 'EN_COURS' && dureeTotale > 0) {
              progression = Math.min(100, Math.max(0, (tempsEcoule / dureeTotale) * 100));
            }

            // Calculer le nombre de jours restants
            const joursRestants = Math.ceil((dateFin - maintenant) / (1000 * 60 * 60 * 24));

            return {
              ...stageDetail,
              encadreurNom,
              entreprise,
              progression: Math.round(progression),
              tachesTotal: taches.length,
              tachesTerminees,
              tachesEnCours,
              joursRestants: Math.max(0, joursRestants),
              duree: calculerDuree(stageDetail.dateDebut, stageDetail.dateFin),
              competences: ["Développement", "Collaboration", "Analyse"], // À adapter selon les besoins
              type: getTypeStage(stageDetail.statutStage)
            };
          } catch (error) {
            console.error("Erreur enrichissement stage:", error);
            return {
              ...stage,
              encadreurNom: "Non assigné",
              entreprise: "Entreprise non spécifiée",
              progression: 0,
              tachesTotal: 0,
              tachesTerminees: 0,
              tachesEnCours: 0,
              joursRestants: 0,
              duree: "Non spécifiée",
              competences: [],
              type: "Stage"
            };
          }
        })
      );

      setStages(stagesEnrichis);
    } catch (error) {
      console.error("Erreur lors du chargement des stages:", error);
      toast.error("Erreur lors du chargement des stages");
    } finally {
      setLoading(false);
    }
  };

  // Fonction utilitaire pour calculer la durée
  const calculerDuree = (dateDebut, dateFin) => {
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    const diffTime = Math.abs(fin - debut);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const mois = Math.floor(diffDays / 30);
    
    if (mois > 0) {
      return `${mois} mois`;
    }
    return `${diffDays} jours`;
  };

  // Fonction pour déterminer le type de stage
  const getTypeStage = (statutStage) => {
    switch (statutStage) {
      case 'EN_ATTENTE_VALIDATION': return 'En attente de validation';
      case 'VALIDE': return 'Stage validé';
      case 'EN_COURS': return 'Stage en cours';
      case 'TERMINE': return 'Stage terminé';
      case 'REFUSE': return 'Stage refusé';
      default: return 'Stage';
    }
  };

  useEffect(() => {
    fetchStages();
  }, []);

  const getStatutColor = (statutStage) => {
    switch (statutStage) {
      case 'VALIDE': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';
      case 'REFUSE': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      case 'EN_ATTENTE_VALIDATION': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800';
      case 'EN_COURS': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      case 'TERMINE': return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getStatutLabel = (statutStage) => {
    switch (statutStage) {
      case 'VALIDE': return 'Validé';
      case 'REFUSE': return 'Refusé';
      case 'EN_ATTENTE_VALIDATION': return 'En attente';
      case 'EN_COURS': return 'En cours';
      case 'TERMINE': return 'Terminé';
      default: return statutStage;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Stage en cours': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300';
      case 'Stage validé': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300';
      case 'Stage terminé': return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getProgressionColor = (progression) => {
    if (progression >= 80) return 'bg-emerald-500';
    if (progression >= 60) return 'bg-blue-500';
    if (progression >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const stagesFiltres = stages.filter(stage => {
    const correspondRecherche = 
      stage.titre?.toLowerCase().includes(recherche.toLowerCase()) ||
      stage.entreprise?.toLowerCase().includes(recherche.toLowerCase()) ||
      stage.description?.toLowerCase().includes(recherche.toLowerCase());
    
    const correspondStatut = filtreStatut === "tous" || stage.statutStage === filtreStatut;
    
    return correspondRecherche && correspondStatut;
  });

  const handleVoirDetails = (stage) => {
    console.log('Voir détails:', stage);
    // Navigation vers la page de détails du stage
  };

  const handleSoumettreRapport = (stage) => {
    console.log('Soumettre rapport pour:', stage);
    // Logique de soumission de rapport
  };

  const handleContacterEncadreur = (stage) => {
    console.log('Contacter encadreur:', stage.encadreurNom);
    // Logique de contact
  };

  // Composant de barre de progression personnalisée
  const CustomProgressBar = ({ value, className = "" }) => {
    return (
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 ${className}`}>
        <motion.div
          className={`h-2 rounded-full ${getProgressionColor(value)}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>
    );
  };

  const stats = {
    total: stages.length,
    enCours: stages.filter(s => s.statutStage === 'EN_COURS').length,
    termines: stages.filter(s => s.statutStage === 'TERMINE').length,
    enAttente: stages.filter(s => s.statutStage === 'EN_ATTENTE_VALIDATION').length,
    progressionMoyenne: stages.length > 0 ? Math.round(stages.reduce((acc, stage) => acc + stage.progression, 0) / stages.length) : 0,
    tachesTerminees: stages.reduce((acc, stage) => acc + stage.tachesTerminees, 0),
    tachesTotal: stages.reduce((acc, stage) => acc + stage.tachesTotal, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de vos stages...</p>
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
              Mes Stages
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Suivi et gestion de vos stages
            </p>
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
            title: "Total Stages",
            icon: (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <GraduationCap className="h-6 w-6 text-emerald-600" />
              </motion.div>
            ),
            count: stats.total,
            text: "Stages assignés",
            gradient: "from-emerald-500 to-emerald-600"
          },
          {
            title: "En Cours",
            icon: (
              <motion.div
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <PlayCircle className="h-6 w-6 text-blue-600" />
              </motion.div>
            ),
            count: stats.enCours,
            text: "Stages actifs",
            gradient: "from-blue-500 to-blue-600"
          },
          {
            title: "Tâches Accomplies",
            icon: (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </motion.div>
            ),
            count: stats.tachesTerminees,
            text: `sur ${stats.tachesTotal} tâches`,
            gradient: "from-purple-500 to-purple-600"
          },
          {
            title: "Progression Moyenne",
            icon: (
              <motion.div
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </motion.div>
            ),
            count: `${stats.progressionMoyenne}%`,
            text: "Avancement global",
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
                    placeholder="Rechercher un stage..."
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    className="pl-9 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                  />
                </div>

                {/* Filtre par statut */}
                <Select value={filtreStatut} onValueChange={setFiltreStatut}>
                  <SelectTrigger className="w-[180px] bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les statuts</SelectItem>
                    <SelectItem value="EN_COURS">En cours</SelectItem>
                    <SelectItem value="TERMINE">Terminés</SelectItem>
                    <SelectItem value="EN_ATTENTE_VALIDATION">En attente</SelectItem>
                    <SelectItem value="VALIDE">Validés</SelectItem>
                    <SelectItem value="REFUSE">Refusés</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                {stagesFiltres.length} stage(s) trouvé(s)
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Grille des stages */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-2"
      >
        <AnimatePresence>
          {stagesFiltres.map((stage) => (
            <motion.div
              key={stage.documentId}
              variants={cardVariants}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden h-full">
                <div className="p-6">
                  {/* En-tête avec statut et type */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`text-xs ${getStatutColor(stage.statutStage)}`}>
                          {getStatutLabel(stage.statutStage)}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getTypeColor(stage.type)}`}>
                          {stage.type}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                        {stage.titre}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Building className="h-4 w-4" />
                        <span className="font-medium">{stage.entreprise}</span>
                      </div>
                    </div>
                  </div>

                  {/* Informations principales */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>{stage.duree}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(stage.dateDebut).toLocaleDateString()} - {new Date(stage.dateFin).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <UserCheck className="h-4 w-4" />
                      <span>Encadré par {stage.encadreurNom}</span>
                    </div>

                    {stage.joursRestants > 0 && stage.statutStage === 'EN_COURS' && (
                      <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                        <Clock className="h-4 w-4" />
                        <span>{stage.joursRestants} jours restants</span>
                      </div>
                    )}
                  </div>

                  {/* Progression globale */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Progression globale
                      </span>
                      <span className="text-sm font-semibold text-emerald-600">
                        {stage.progression}%
                      </span>
                    </div>
                    <CustomProgressBar value={stage.progression} />
                  </div>

                  {/* Statistiques du stage */}
                  <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {stage.tachesTotal}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Tâches total
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {stage.tachesTerminees}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Terminées
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {stage.tachesEnCours}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        En cours
                      </div>
                    </div>
                  </div>

                  {/* Compétences */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Compétences développées</div>
                    <div className="flex flex-wrap gap-1">
                      {stage.competences.map((competence, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                          {competence}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Description</div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                      {stage.description || "Aucune description disponible."}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 border-gray-300 dark:border-gray-600"
                      onClick={() => handleVoirDetails(stage)}
                    >
                      <Eye className="h-4 w-4" />
                      Détails
                    </Button>
                    
                    {stage.statutStage === 'EN_COURS' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 border-emerald-300 dark:border-emerald-600 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                        onClick={() => handleSoumettreRapport(stage)}
                        title="Soumettre rapport"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-blue-300 dark:border-blue-600 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      onClick={() => handleContacterEncadreur(stage)}
                      title="Contacter l'encadreur"
                    >
                      <UserCheck className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Message si aucun résultat */}
      {stagesFiltres.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">
            {stages.length === 0 ? "Aucun stage assigné" : "Aucun stage trouvé"}
          </h3>
          <p className="text-gray-400 dark:text-gray-500">
            {stages.length === 0 
              ? "Vous n'avez pas encore de stages assignés." 
              : "Aucun stage ne correspond à vos critères de recherche."
            }
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}