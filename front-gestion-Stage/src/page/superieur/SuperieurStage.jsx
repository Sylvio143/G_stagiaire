import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen,
  Clock,
  Calendar,
  MapPin,
  Building,
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  UserCheck,
  AlertCircle,
  TrendingUp,
  Download
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

export default function SuperieurStage() {
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [filtreEncadreur, setFiltreEncadreur] = useState("tous");
  const [recherche, setRecherche] = useState("");
  const [stages, setStages] = useState([]);
  const [motifRefus, setMotifRefus] = useState("");
  const [stageSelectionne, setStageSelectionne] = useState(null);
  const [loading, setLoading] = useState(true);
  const [encadreurs, setEncadreurs] = useState([]);

  // Configuration API
  const API_BASE_URL = "http://localhost:9090/api";

  // Charger les stages sous la supervision du supérieur
  const fetchStages = async () => {
    try {
      setLoading(true);
      
      // Récupérer l'ID du supérieur connecté
      const user = JSON.parse(localStorage.getItem("user"));
      const superieurId = user?.entityDocumentId;
      
      if (!superieurId) {
        toast.error("Impossible de récupérer les informations du supérieur");
        return;
      }

      // Récupérer tous les stages avec relations
      const response = await axios.get(`${API_BASE_URL}/stages/with-relations`);
      const tousLesStages = response.data;

      // Filtrer pour ne garder que les stages sous la supervision de ce supérieur
      const stagesFiltres = tousLesStages.filter(
        stage => stage.superieurHierarchiqueDocumentId === superieurId
      );

      // Enrichir les données des stages
      const stagesEnrichis = await Promise.all(
        stagesFiltres.map(async (stage) => {
          try {
            // Récupérer les détails de l'encadreur
            let encadreurNom = "Non assigné";
            if (stage.encadreurDocumentId) {
              const encadreurResponse = await axios.get(`${API_BASE_URL}/encadreurs/${stage.encadreurDocumentId}`);
              const encadreur = encadreurResponse.data;
              encadreurNom = `${encadreur.prenom} ${encadreur.nom}`;
            }

            // Compter les stagiaires assignés
            const nombreStagiaires = stage.stagiairesDocumentIds?.length || 0;

            // Compter les tâches
            let nombreTaches = 0;
            try {
              const tachesResponse = await axios.get(`${API_BASE_URL}/taches/stage/${stage.documentId}`);
              nombreTaches = tachesResponse.data.length;
            } catch (error) {
              console.error("Erreur récupération tâches:", error);
            }

            return {
              ...stage,
              encadreurNom,
              nombreStagiaires,
              nombreTaches,
              places: stage.nombreStagiaires || 5, // Valeur par défaut
              placesRestantes: Math.max(0, (stage.nombreStagiaires || 5) - nombreStagiaires)
            };
          } catch (error) {
            console.error("Erreur enrichissement stage:", error);
            return {
              ...stage,
              encadreurNom: "Erreur chargement",
              nombreStagiaires: 0,
              nombreTaches: 0,
              places: 5,
              placesRestantes: 5
            };
          }
        })
      );

      setStages(stagesEnrichis);

      // Extraire la liste des encadreurs uniques
      const encadreursUniques = [...new Set(stagesEnrichis.map(s => s.encadreurNom).filter(Boolean))];
      setEncadreurs(encadreursUniques);

    } catch (error) {
      console.error("Erreur lors du chargement des stages:", error);
      toast.error("Erreur lors du chargement des stages");
    } finally {
      setLoading(false);
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

  const getStatutIcon = (statutStage) => {
    switch (statutStage) {
      case 'VALIDE': return <CheckCircle className="h-4 w-4" />;
      case 'REFUSE': return <XCircle className="h-4 w-4" />;
      case 'EN_ATTENTE_VALIDATION': return <Clock className="h-4 w-4" />;
      case 'EN_COURS': return <AlertCircle className="h-4 w-4" />;
      case 'TERMINE': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Stage de fin d\'études': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300';
      case 'Stage professionnel': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300';
      case 'Stage de recherche': return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300';
      case 'Stage opérationnel': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const stagesFiltres = stages.filter(stage => {
    const correspondRecherche = 
      stage.titre?.toLowerCase().includes(recherche.toLowerCase()) ||
      stage.description?.toLowerCase().includes(recherche.toLowerCase()) ||
      stage.encadreurNom?.toLowerCase().includes(recherche.toLowerCase());
    
    const correspondStatut = filtreStatut === "tous" || stage.statutStage === filtreStatut;
    const correspondEncadreur = filtreEncadreur === "tous" || stage.encadreurNom === filtreEncadreur;
    
    return correspondRecherche && correspondStatut && correspondEncadreur;
  });

  const handleValiderStage = async (stageId) => {
    try {
      const stage = stages.find(s => s.documentId === stageId);
      if (!stage) {
        toast.error("Stage non trouvé");
        return;
      }

      // Mettre à jour le statut du stage
      const stageUpdate = {
        ...stage,
        statutStage: 'VALIDE'
      };

      await axios.put(`${API_BASE_URL}/stages/${stageId}`, stageUpdate);
      
      toast.success("Stage validé avec succès");
      await fetchStages(); // Recharger la liste
    } catch (error) {
      console.error("Erreur lors de la validation:", error);
      toast.error("Erreur lors de la validation du stage");
    }
  };

  const handleRefuserStage = async (stageId) => {
    if (!motifRefus.trim()) {
      toast.error("Veuillez saisir un motif de refus");
      return;
    }

    try {
      const stage = stages.find(s => s.documentId === stageId);
      if (!stage) {
        toast.error("Stage non trouvé");
        return;
      }

      // Mettre à jour le statut du stage
      const stageUpdate = {
        ...stage,
        statutStage: 'REFUSE'
        // Note: Vous pourriez vouloir ajouter un champ pour le motif de refus
      };

      await axios.put(`${API_BASE_URL}/stages/${stageId}`, stageUpdate);
      
      // Créer une notification pour l'encadreur
      if (stage.encadreurDocumentId) {
        try {
          // Récupérer le compte utilisateur de l'encadreur
          const compteResponse = await axios.get(
            `${API_BASE_URL}/comptes-utilisateurs/entity/${stage.encadreurDocumentId}/type/ENCADREUR`
          );
          
          if (compteResponse.data) {
            const compteEncadreur = compteResponse.data;
            
            await axios.post(`${API_BASE_URL}/notifications/create`, {
              titre: "Stage refusé",
              message: `Votre stage "${stage.titre}" a été refusé. Motif: ${motifRefus}`,
              type: "STAGE_REFUSE",
              compteUtilisateurDocumentId: compteEncadreur.documentId,
              documentIdReference: stage.documentId,
              typeReference: "STAGE"
            });
          }
        } catch (notifError) {
          console.error("Erreur création notification:", notifError);
        }
      }
      
      toast.success("Stage refusé avec succès");
      await fetchStages(); // Recharger la liste
    } catch (error) {
      console.error("Erreur lors du refus:", error);
      toast.error("Erreur lors du refus du stage");
    }
    
    setMotifRefus("");
    setStageSelectionne(null);
  };

  const handleOuvrirModalRefus = (stage) => {
    setStageSelectionne(stage);
    setMotifRefus("");
  };

  const handleFermerModal = () => {
    setStageSelectionne(null);
    setMotifRefus("");
  };

  const handleExporterRapport = () => {
    console.log('Export du rapport de validation des stages');
    toast.success("Export en cours...");
    // Logique d'export
  };

  const handleVoirDetails = (stage) => {
    console.log('Voir détails stage:', stage);
    // Navigation vers la page de détails du stage
  };

  // Calcul des statistiques
  const stats = {
    total: stages.length,
    enAttente: stages.filter(s => s.statutStage === 'EN_ATTENTE_VALIDATION').length,
    valides: stages.filter(s => s.statutStage === 'VALIDE').length,
    refuses: stages.filter(s => s.statutStage === 'REFUSE').length,
    enCours: stages.filter(s => s.statutStage === 'EN_COURS').length,
    totalStagiaires: stages.reduce((acc, stage) => acc + (stage.nombreStagiaires || 0), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des stages...</p>
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Validation des Stages
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Gestion et validation des stages proposés par les encadreurs
            </p>
          </div>
          <Button 
            onClick={handleExporterRapport}
            variant="outline"
            className="gap-2 border-gray-300 dark:border-gray-600"
          >
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </motion.div>

      {/* Statistiques de validation */}
      <motion.div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {[
          {
            title: "Stages à Valider",
            icon: (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <BookOpen className="h-6 w-6 text-amber-600" />
              </motion.div>
            ),
            count: stats.enAttente,
            text: "En attente de décision",
            gradient: "from-amber-500 to-amber-600"
          },
          {
            title: "Stages Validés",
            icon: (
              <motion.div
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </motion.div>
            ),
            count: stats.valides,
            text: "Approuvés et actifs",
            gradient: "from-emerald-500 to-emerald-600"
          },
          {
            title: "Stages Refusés",
            icon: (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <XCircle className="h-6 w-6 text-red-600" />
              </motion.div>
            ),
            count: stats.refuses,
            text: "Non approuvés",
            gradient: "from-red-500 to-red-600"
          },
          {
            title: "Stagiaires Actifs",
            icon: (
              <motion.div
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </motion.div>
            ),
            count: stats.totalStagiaires,
            text: "Total des stagiaires",
            gradient: "from-blue-500 to-blue-600"
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
                    placeholder="Rechercher un stage, description ou encadreur..."
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    className="pl-9 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                  />
                </div>

                {/* Filtres */}
                <div className="flex gap-2">
                  <Select value={filtreStatut} onValueChange={setFiltreStatut}>
                    <SelectTrigger className="w-[160px] bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="Statut validation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les statuts</SelectItem>
                      <SelectItem value="EN_ATTENTE_VALIDATION">En attente</SelectItem>
                      <SelectItem value="VALIDE">Validés</SelectItem>
                      <SelectItem value="REFUSE">Refusés</SelectItem>
                      <SelectItem value="EN_COURS">En cours</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filtreEncadreur} onValueChange={setFiltreEncadreur}>
                    <SelectTrigger className="w-[160px] bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="Encadreur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les encadreurs</SelectItem>
                      {encadreurs.map(encadreur => (
                        <SelectItem key={encadreur} value={encadreur}>
                          {encadreur}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                {stagesFiltres.length} stage(s) trouvé(s)
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Liste des stages */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2"
      >
        <AnimatePresence>
          {stagesFiltres.map((stage) => (
            <motion.div
              key={stage.documentId}
              variants={cardVariants}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden h-full">
                <div className="p-6">
                  {/* En-tête avec statut et encadreur */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={`text-xs ${getStatutColor(stage.statutStage)} flex items-center gap-1`}>
                          {getStatutIcon(stage.statutStage)}
                          {getStatutLabel(stage.statutStage)}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                        {stage.titre}
                      </h3>
                      <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {stage.description}
                      </div>
                    </div>
                  </div>

                  {/* Encadreur et date */}
                  <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {stage.encadreurNom}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Créé le {new Date(stage.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Informations principales */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(stage.dateDebut).toLocaleDateString()} - {new Date(stage.dateFin).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Places et stagiaires */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Stagiaires assignés
                        </span>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {stage.nombreStagiaires} / {stage.places} places
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          {stage.nombreTaches}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          tâche(s)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions selon le statut */}
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
                    
                    {stage.statutStage === 'EN_ATTENTE_VALIDATION' && (
                      <>
                        <Button
                          size="sm"
                          className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleValiderStage(stage.documentId)}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Valider
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2 border-red-300 text-red-600 hover:text-red-700 dark:border-red-600 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => handleOuvrirModalRefus(stage)}
                        >
                          <XCircle className="h-4 w-4" />
                          Refuser
                        </Button>
                      </>
                    )}
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
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">
            {stages.length === 0 ? "Aucun stage à valider" : "Aucun stage trouvé"}
          </h3>
          <p className="text-gray-400 dark:text-gray-500">
            {stages.length === 0 
              ? "Aucun stage n'est actuellement en attente de votre validation." 
              : "Aucun stage ne correspond à vos critères de recherche."
            }
          </p>
        </motion.div>
      )}

      {/* Modal de refus */}
      {stageSelectionne && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mx-4 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Refuser le stage
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {stageSelectionne.titre} - {stageSelectionne.encadreurNom}
            </p>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Motif de refus *
              </label>
              <textarea
                value={motifRefus}
                onChange={(e) => setMotifRefus(e.target.value)}
                placeholder="Saisissez le motif de refus..."
                className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
              
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={handleFermerModal}
                  className="flex-1 border-gray-300 dark:border-gray-600"
                >
                  Annuler
                </Button>
                <Button
                  onClick={() => handleRefuserStage(stageSelectionne.documentId)}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  disabled={!motifRefus.trim()}
                >
                  Confirmer le refus
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}