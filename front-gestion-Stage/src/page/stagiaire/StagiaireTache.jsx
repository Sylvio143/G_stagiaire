import { useState, useEffect } from "react";
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
  ListChecks,
  Bell
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

export default function StagiaireTache() {
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [filtrePriorite, setFiltrePriorite] = useState("tous");
  const [recherche, setRecherche] = useState("");
  const [taches, setTaches] = useState([]);
  const [stageActuel, setStageActuel] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configuration API
  const API_BASE_URL = "http://localhost:9090/api";

  // Charger les tâches du stage en cours
  const fetchTaches = async () => {
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
        setStageActuel(null);
        setTaches([]);
        return;
      }

      // Récupérer les détails complets du stage
      const stageDetailResponse = await axios.get(`${API_BASE_URL}/stages/${stageEnCours.documentId}`);
      const stageDetail = stageDetailResponse.data;

      // Récupérer les informations de l'encadreur
      let encadreurNom = "Non assigné";
      let encadreurId = null;
      if (stageDetail.encadreurDocumentId) {
        try {
          const encadreurResponse = await axios.get(`${API_BASE_URL}/encadreurs/${stageDetail.encadreurDocumentId}`);
          const encadreur = encadreurResponse.data;
          encadreurNom = `${encadreur.prenom} ${encadreur.nom}`;
          encadreurId = encadreur.documentId;
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

      setStageActuel({
        ...stageDetail,
        encadreurNom,
        encadreurId,
        entreprise,
        progression: Math.round(progressionStage)
      });

      // Récupérer les tâches du stage
      const tachesResponse = await axios.get(`${API_BASE_URL}/taches/stage/${stageEnCours.documentId}`);
      const tachesData = tachesResponse.data;

      // Enrichir les données des tâches
      const tachesEnrichies = tachesData.map(tache => {
        const joursRestants = calculateDaysRemaining(tache.dateFin);
        const estEnRetard = tache.dateFin && new Date(tache.dateFin) < new Date() && tache.statut !== 'TERMINEE';
        
        return {
          ...tache,
          joursRestants,
          estEnRetard,
          competences: getCompetencesFromDescription(tache.description),
          tempsEstime: "À estimer"
        };
      });

      setTaches(tachesEnrichies);
    } catch (error) {
      console.error("Erreur lors du chargement des tâches:", error);
      toast.error("Erreur lors du chargement des tâches");
    } finally {
      setLoading(false);
    }
  };

  // Fonction utilitaire pour calculer les jours restants
  const calculateDaysRemaining = (dateEcheance) => {
    if (!dateEcheance) return null;
    const today = new Date();
    const echeance = new Date(dateEcheance);
    const diffTime = echeance - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Fonction pour extraire les compétences de la description
  const getCompetencesFromDescription = (description) => {
    if (!description) return ["Développement", "Collaboration"];
    
    const competences = [];
    if (description.toLowerCase().includes('react')) competences.push("React");
    if (description.toLowerCase().includes('node')) competences.push("Node.js");
    if (description.toLowerCase().includes('mongodb')) competences.push("MongoDB");
    if (description.toLowerCase().includes('javascript')) competences.push("JavaScript");
    if (description.toLowerCase().includes('typescript')) competences.push("TypeScript");
    if (description.toLowerCase().includes('api')) competences.push("API Design");
    if (description.toLowerCase().includes('test')) competences.push("Testing");
    
    return competences.length > 0 ? competences : ["Développement", "Collaboration"];
  };

  // Fonction pour créer une notification
  const creerNotification = async (titre, message, type, destinataireId, referenceId, typeReference) => {
    try {
      // Récupérer le compte utilisateur du destinataire
      const compteResponse = await axios.get(
        `${API_BASE_URL}/comptes-utilisateurs/entity/${destinataireId}/type/ENCADREUR`
      );
      
      if (compteResponse.data) {
        const compteDestinataire = compteResponse.data;
        
        await axios.post(`${API_BASE_URL}/notifications/create`, {
          titre,
          message,
          type,
          compteUtilisateurDocumentId: compteDestinataire.documentId,
          documentIdReference: referenceId,
          typeReference
        });
      }
    } catch (notifError) {
      console.error("Erreur création notification:", notifError);
    }
  };

  useEffect(() => {
    fetchTaches();
  }, []);

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'TERMINEE': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';
      case 'EN_COURS': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      case 'A_FAIRE': return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
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

  const getPrioriteColor = (priorite) => {
    switch (priorite) {
      case 1: return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300';
      case 2: return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300';
      case 3: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
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

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'TERMINEE': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'EN_COURS': return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case 'A_FAIRE': return <Clock className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const tachesFiltres = taches.filter(tache => {
    const correspondRecherche = 
      tache.titre?.toLowerCase().includes(recherche.toLowerCase()) ||
      tache.description?.toLowerCase().includes(recherche.toLowerCase());
    
    const correspondStatut = filtreStatut === "tous" || tache.statut === filtreStatut;
    const correspondPriorite = filtrePriorite === "tous" || tache.priorite?.toString() === filtrePriorite;
    
    return correspondRecherche && correspondStatut && correspondPriorite;
  });

  const handleCommencerTache = async (tache) => {
    try {
      await axios.put(`${API_BASE_URL}/taches/${tache.documentId}/statut/EN_COURS`);
      
      // Créer une notification pour l'encadreur
      if (stageActuel.encadreurId) {
        await creerNotification(
          "Tâche commencée",
          `Le stagiaire a commencé la tâche "${tache.titre}"`,
          "RAPPEL_TACHE",
          stageActuel.encadreurId,
          tache.documentId,
          "TACHE"
        );
      }
      
      toast.success("Tâche mise en cours - Notification envoyée à l'encadreur");
      await fetchTaches(); // Recharger les données
    } catch (error) {
      console.error("Erreur mise en cours tâche:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleTerminerTache = async (tache) => {
    try {
      await axios.put(`${API_BASE_URL}/taches/${tache.documentId}/statut/TERMINEE`);
      
      // Créer une notification pour l'encadreur
      if (stageActuel.encadreurId) {
        await creerNotification(
          "Tâche terminée",
          `Le stagiaire a terminé la tâche "${tache.titre}"`,
          "RAPPEL_TACHE",
          stageActuel.encadreurId,
          tache.documentId,
          "TACHE"
        );
      }
      
      toast.success(
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span>Tâche terminée - Notification envoyée à l'encadreur</span>
        </div>
      );
      await fetchTaches(); // Recharger les données
    } catch (error) {
      console.error("Erreur terminaison tâche:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const stats = {
    total: taches.length,
    terminees: taches.filter(t => t.statut === 'TERMINEE').length,
    enCours: taches.filter(t => t.statut === 'EN_COURS').length,
    aFaire: taches.filter(t => t.statut === 'A_FAIRE').length,
    urgentes: taches.filter(t => t.priorite === 1 && t.statut !== 'TERMINEE').length,
    enRetard: taches.filter(t => t.estEnRetard).length
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de vos tâches...</p>
        </div>
      </div>
    );
  }

  if (!stageActuel) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <ListChecks className="h-16 w-16 text-gray-300 mx-auto mb-4" />
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
                    Encadré par {stageActuel.encadreurNom}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {stageActuel.titre}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {stageActuel.entreprise} • {new Date(stageActuel.dateDebut).toLocaleDateString()} - {new Date(stageActuel.dateFin).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.terminees}/{stats.total}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Tâches terminées</div>
                </div>
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
            title: "En Retard",
            icon: (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <AlertCircle className="h-6 w-6 text-red-600" />
              </motion.div>
            ),
            count: stats.enRetard,
            text: "Tâches en retard",
            gradient: "from-red-500 to-red-600"
          },
          {
            title: "Tâches Urgentes",
            icon: (
              <motion.div
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Flag className="h-6 w-6 text-amber-600" />
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
                      <SelectItem value="A_FAIRE">À faire</SelectItem>
                      <SelectItem value="EN_COURS">En cours</SelectItem>
                      <SelectItem value="TERMINEE">Terminées</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filtrePriorite} onValueChange={setFiltrePriorite}>
                    <SelectTrigger className="w-[140px] bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="Priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Toutes priorités</SelectItem>
                      <SelectItem value="1">Haute</SelectItem>
                      <SelectItem value="2">Moyenne</SelectItem>
                      <SelectItem value="3">Basse</SelectItem>
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
          {tachesFiltres.map((tache) => (
            <motion.div
              key={tache.documentId}
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
                            {getStatutLabel(tache.statut)}
                          </Badge>
                        </div>
                        <Badge className={getPrioriteColor(tache.priorite)}>
                          Priorité {getPrioriteLabel(tache.priorite)}
                        </Badge>
                        {tache.estEnRetard && (
                          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            En retard
                          </Badge>
                        )}
                        {tache.joursRestants !== null && tache.joursRestants <= 3 && tache.joursRestants > 0 && !tache.estEnRetard && (
                          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                            <Clock className="h-3 w-3 mr-1" />
                            {tache.joursRestants} jour(s)
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
                      {tache.dateFin && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          <span>Échéance: {new Date(tache.dateFin).toLocaleDateString()}</span>
                        </div>
                      )}
                      {tache.dateDebut && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>Début: {new Date(tache.dateDebut).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Bell className="h-4 w-4" />
                        <span>L'encadreur sera notifié</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {tache.statut === 'A_FAIRE' && (
                        <Button
                          onClick={() => handleCommencerTache(tache)}
                          className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                          size="sm"
                        >
                          <PlayCircle className="h-4 w-4" />
                          Commencer
                        </Button>
                      )}
                      {tache.statut === 'EN_COURS' && (
                        <Button
                          onClick={() => handleTerminerTache(tache)}
                          className="bg-blue-600 hover:bg-blue-700 gap-2"
                          size="sm"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Terminer
                        </Button>
                      )}
                      {tache.statut === 'TERMINEE' && (
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Terminée
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Message si aucun résultat */}
      {tachesFiltres.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <CheckSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">
            {taches.length === 0 ? "Aucune tâche assignée" : "Aucune tâche trouvée"}
          </h3>
          <p className="text-gray-400 dark:text-gray-500">
            {taches.length === 0 
              ? "Aucune tâche n'a été assignée à votre stage en cours." 
              : "Aucune tâche ne correspond à vos critères de recherche."
            }
          </p>
        </motion.div>
      )}
    </motion.div>
    </>
  );
}