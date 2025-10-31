import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus,
  Users, 
  Calendar,
  Building,
  MapPin,
  Clock,
  Search,
  Filter,
  GraduationCap,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  Target,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  ListTodo,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export default function EncadreurStage() {
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [recherche, setRecherche] = useState("");
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTacheDialogOpen, setIsTacheDialogOpen] = useState(false);
  const [stageSelectionne, setStageSelectionne] = useState(null);
  const [nouveauStage, setNouveauStage] = useState({
    titre: "",
    description: "",
    dateDebut: "",
    dateFin: "",
    places: 1
  });
  const [nouvelleTache, setNouvelleTache] = useState({
    titre: "",
    description: "",
    dateDebut: "",
    dateFin: "",
    priorite: 2
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [validationTacheErrors, setValidationTacheErrors] = useState({});

  // Configuration API
  const API_BASE_URL = "http://localhost:9090/api";

  // Charger les stages de l'encadreur connecté
  const fetchStages = async () => {
    try {
      setLoading(true);
      
      // Récupérer l'ID de l'encadreur connecté
      const user = JSON.parse(localStorage.getItem("user"));
      const encadreurId = user?.entityDocumentId;
      
      if (!encadreurId) {
        toast.error("Impossible de récupérer les informations de l'encadreur");
        return;
      }

      // Récupérer tous les stages avec relations
      const response = await axios.get(`${API_BASE_URL}/stages/with-relations`);
      const tousLesStages = response.data;

      // Filtrer pour ne garder que les stages de cet encadreur
      const stagesEncadreur = tousLesStages.filter(
        stage => stage.encadreurDocumentId === encadreurId
      );

      // Enrichir les données des stages
      const stagesEnrichis = await Promise.all(
        stagesEncadreur.map(async (stage) => {
          try {
            // Compter les stagiaires assignés
            const nombreStagiaires = stage.stagiairesDocumentIds?.length || 0;

            // Récupérer les tâches du stage
            let taches = [];
            let nombreTaches = 0;
            try {
              const tachesResponse = await axios.get(`${API_BASE_URL}/taches/stage/${stage.documentId}`);
              taches = tachesResponse.data;
              nombreTaches = taches.length;
            } catch (error) {
              console.error("Erreur récupération tâches:", error);
            }

            return {
              ...stage,
              nombreStagiaires,
              nombreTaches,
              taches: taches,
              places: stage.places || 5,
              placesRestantes: Math.max(0, (stage.places || 5) - nombreStagiaires)
            };
          } catch (error) {
            console.error("Erreur enrichissement stage:", error);
            return {
              ...stage,
              nombreStagiaires: 0,
              nombreTaches: 0,
              taches: [],
              places: 5,
              placesRestantes: 5
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

  useEffect(() => {
    fetchStages();
  }, []);

  // Validation du formulaire stage
  const validateForm = () => {
    const errors = {};
    
    if (!nouveauStage.titre?.trim()) {
      errors.titre = "Le titre est obligatoire";
    } else if (nouveauStage.titre.length < 5) {
      errors.titre = "Le titre doit contenir au moins 5 caractères";
    }
    
    if (!nouveauStage.description?.trim()) {
      errors.description = "La description est obligatoire";
    } else if (nouveauStage.description.length < 20) {
      errors.description = "La description doit contenir au moins 20 caractères";
    }
    
    if (!nouveauStage.dateDebut) {
      errors.dateDebut = "La date de début est obligatoire";
    } else if (new Date(nouveauStage.dateDebut) < new Date()) {
      errors.dateDebut = "La date de début ne peut pas être dans le passé";
    }
    
    if (!nouveauStage.dateFin) {
      errors.dateFin = "La date de fin est obligatoire";
    } else if (new Date(nouveauStage.dateFin) <= new Date(nouveauStage.dateDebut)) {
      errors.dateFin = "La date de fin doit être après la date de début";
    }
    
    if (!nouveauStage.places || nouveauStage.places < 1) {
      errors.places = "Le nombre de places doit être d'au moins 1";
    } else if (nouveauStage.places > 10) {
      errors.places = "Le nombre de places ne peut pas dépasser 10";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validation du formulaire tâche
  const validateTacheForm = () => {
    const errors = {};
    
    if (!nouvelleTache.titre?.trim()) {
      errors.titre = "Le titre est obligatoire";
    }
    
    if (!nouvelleTache.description?.trim()) {
      errors.description = "La description est obligatoire";
    }
    
    if (!nouvelleTache.dateDebut) {
      errors.dateDebut = "La date de début est obligatoire";
    }
    
    if (!nouvelleTache.dateFin) {
      errors.dateFin = "La date de fin est obligatoire";
    } else if (new Date(nouvelleTache.dateFin) <= new Date(nouvelleTache.dateDebut)) {
      errors.dateFin = "La date de fin doit être après la date de début";
    }
    
    // Vérifier que les dates de la tâche sont dans la période du stage
    if (stageSelectionne) {
      const dateDebutStage = new Date(stageSelectionne.dateDebut);
      const dateFinStage = new Date(stageSelectionne.dateFin);
      const dateDebutTache = new Date(nouvelleTache.dateDebut);
      const dateFinTache = new Date(nouvelleTache.dateFin);
      
      if (dateDebutTache < dateDebutStage) {
        errors.dateDebut = `La tâche ne peut pas commencer avant le stage (${dateDebutStage.toLocaleDateString()})`;
      }
      
      if (dateFinTache > dateFinStage) {
        errors.dateFin = `La tâche ne peut pas se terminer après le stage (${dateFinStage.toLocaleDateString()})`;
      }
    }
    
    setValidationTacheErrors(errors);
    return Object.keys(errors).length === 0;
  };

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

  const getPrioriteColor = (priorite) => {
    switch (priorite) {
      case 1: return 'bg-red-100 text-red-700 border-red-200';
      case 2: return 'bg-amber-100 text-amber-700 border-amber-200';
      case 3: return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
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

  const stagesFiltres = stages.filter(stage => {
    const correspondRecherche = 
      stage.titre?.toLowerCase().includes(recherche.toLowerCase()) ||
      stage.description?.toLowerCase().includes(recherche.toLowerCase());
    
    const correspondStatut = filtreStatut === "tous" || stage.statutStage === filtreStatut;
    
    return correspondRecherche && correspondStatut;
  });

  const handleAjouterStage = async () => {
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const encadreurId = user?.entityDocumentId;

      if (!encadreurId) {
        toast.error("Impossible de récupérer les informations de l'encadreur");
        return;
      }

      // Récupérer le supérieur hiérarchique de l'encadreur
      let superieurHierarchiqueId = null;
      try {
        const encadreurResponse = await axios.get(`${API_BASE_URL}/encadreurs/${encadreurId}`);
        const encadreur = encadreurResponse.data;
        superieurHierarchiqueId = encadreur.superieurHierarchiqueDocumentId;
      } catch (error) {
        console.error("Erreur récupération supérieur:", error);
        toast.error("Erreur lors de la récupération du supérieur hiérarchique");
        return;
      }

      const stageData = {
        titre: nouveauStage.titre.trim(),
        description: nouveauStage.description.trim(),
        dateDebut: nouveauStage.dateDebut,
        dateFin: nouveauStage.dateFin,
        statutStage: 'EN_ATTENTE_VALIDATION',
        encadreurDocumentId: encadreurId,
        superieurHierarchiqueDocumentId: superieurHierarchiqueId,
        stagiairesDocumentIds: [],
        places: parseInt(nouveauStage.places)
      };

      const response = await axios.post(`${API_BASE_URL}/stages`, stageData);
      
      // Créer une notification pour le supérieur hiérarchique
      if (superieurHierarchiqueId) {
        try {
          // Récupérer le compte utilisateur du supérieur
          const compteResponse = await axios.get(
            `${API_BASE_URL}/comptes-utilisateurs/entity/${superieurHierarchiqueId}/type/SUPERIEUR_HIERARCHIQUE`
          );
          
          if (compteResponse.data) {
            const compteSuperieur = compteResponse.data;
            
            await axios.post(`${API_BASE_URL}/notifications/create`, {
              titre: "Nouveau stage à valider",
              message: `L'encadreur ${user.email} a créé un nouveau stage "${stageData.titre}" nécessitant votre validation.`,
              type: "NOUVEAU_STAGE",
              compteUtilisateurDocumentId: compteSuperieur.documentId,
              documentIdReference: response.data.documentId,
              typeReference: "STAGE"
            });
          }
        } catch (notifError) {
          console.error("Erreur création notification:", notifError);
        }
      }

      toast.success("Stage créé avec succès et envoyé pour validation");
      await fetchStages();
      
      setNouveauStage({
        titre: "",
        description: "",
        dateDebut: "",
        dateFin: "",
        places: 1
      });
      setValidationErrors({});
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la création du stage:", error);
      if (error.response?.status === 400) {
        toast.error("Données invalides pour la création du stage");
      } else {
        toast.error("Erreur lors de la création du stage");
      }
    }
  };

  const handleAjouterTache = async () => {
    if (!validateTacheForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    try {
      const tacheData = {
        titre: nouvelleTache.titre.trim(),
        description: nouvelleTache.description.trim(),
        dateDebut: nouvelleTache.dateDebut + 'T09:00:00', // Ajouter l'heure
        dateFin: nouvelleTache.dateFin + 'T17:00:00', // Ajouter l'heure
        statut: 'A_FAIRE',
        priorite: parseInt(nouvelleTache.priorite),
        stageDocumentId: stageSelectionne.documentId
      };

      const response = await axios.post(`${API_BASE_URL}/taches`, tacheData);

      // Créer des notifications pour tous les stagiaires du stage
      if (stageSelectionne.stagiairesDocumentIds && stageSelectionne.stagiairesDocumentIds.length > 0) {
        try {
          for (const stagiaireId of stageSelectionne.stagiairesDocumentIds) {
            // Récupérer le compte utilisateur du stagiaire
            const compteResponse = await axios.get(
              `${API_BASE_URL}/comptes-utilisateurs/entity/${stagiaireId}/type/STAGIAIRE`
            );
            
            if (compteResponse.data) {
              const compteStagiaire = compteResponse.data;
              
              await axios.post(`${API_BASE_URL}/notifications/create`, {
                titre: "Nouvelle tâche assignée",
                message: `Une nouvelle tâche "${tacheData.titre}" vous a été assignée pour le stage "${stageSelectionne.titre}".`,
                type: "NOUVELLE_TACHE",
                compteUtilisateurDocumentId: compteStagiaire.documentId,
                documentIdReference: response.data.documentId,
                typeReference: "TACHE"
              });
            }
          }
        } catch (notifError) {
          console.error("Erreur création notifications stagiaires:", notifError);
        }
      }

      toast.success("Tâche créée avec succès et notifications envoyées aux stagiaires");
      await fetchStages(); // Recharger pour avoir les nouvelles tâches
      
      setNouvelleTache({
        titre: "",
        description: "",
        dateDebut: "",
        dateFin: "",
        priorite: 2
      });
      setValidationTacheErrors({});
      setIsTacheDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la création de la tâche:", error);
      toast.error("Erreur lors de la création de la tâche");
    }
  };

  const handleOuvrirModalTache = (stage) => {
    if (stage.statutStage !== 'EN_COURS') {
      toast.error("Vous ne pouvez ajouter des tâches qu'aux stages en cours");
      return;
    }
    
    setStageSelectionne(stage);
    setNouvelleTache({
      titre: "",
      description: "",
      dateDebut: stage.dateDebut, // Pré-remplir avec les dates du stage
      dateFin: stage.dateFin,
      priorite: 2
    });
    setValidationTacheErrors({});
    setIsTacheDialogOpen(true);
  };

  const handleSupprimerStage = async (stageId) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce stage ? Cette action est irréversible.")) {
      return;
    }

    try {
      // Vérifier si le stage a des stagiaires assignés
      const stage = stages.find(s => s.documentId === stageId);
      if (stage && stage.nombreStagiaires > 0) {
        toast.error("Impossible de supprimer un stage avec des stagiaires assignés");
        return;
      }

      await axios.delete(`${API_BASE_URL}/stages/${stageId}`);
      toast.success("Stage supprimé avec succès");
      await fetchStages();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression du stage");
    }
  };

  const handleVoirDetails = (stage) => {
    console.log('Voir détails stage:', stage);
    // Navigation vers la page de détails du stage
  };

  const handleModifier = (stage) => {
    if (stage.statutStage === 'VALIDE' || stage.statutStage === 'EN_COURS') {
      toast.error("Impossible de modifier un stage validé ou en cours");
      return;
    }
    console.log('Modifier stage:', stage);
    // Logique de modification à implémenter
  };

  const stats = {
    total: stages.length,
    enAttente: stages.filter(s => s.statutStage === 'EN_ATTENTE_VALIDATION').length,
    valides: stages.filter(s => s.statutStage === 'VALIDE').length,
    refuses: stages.filter(s => s.statutStage === 'REFUSE').length,
    enCours: stages.filter(s => s.statutStage === 'EN_COURS').length,
    placesTotal: stages.reduce((acc, stage) => acc + (stage.places || 0), 0),
    placesRestantes: stages.reduce((acc, stage) => acc + (stage.placesRestantes || 0), 0),
    totalStagiaires: stages.reduce((acc, stage) => acc + (stage.nombreStagiaires || 0), 0),
    totalTaches: stages.reduce((acc, stage) => acc + (stage.nombreTaches || 0), 0)
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

      {/* Header avec bouton d'ajout */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gestion des Stages
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Création et gestion de vos offres de stage
          </p>
        </motion.div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4" />
              Nouveau Stage
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
            <DialogHeader>
              <DialogTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Créer un Nouveau Stage
              </DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer une nouvelle offre de stage. 
                Le stage devra être validé par votre supérieur hiérarchique.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="titre">Titre du stage *</Label>
                <Input
                  id="titre"
                  value={nouveauStage.titre}
                  onChange={(e) => setNouveauStage({...nouveauStage, titre: e.target.value})}
                  placeholder="Ex: Stage Développement Web Fullstack"
                  className={validationErrors.titre ? "border-red-500" : ""}
                />
                {validationErrors.titre && (
                  <p className="text-red-500 text-sm">{validationErrors.titre}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description détaillée *</Label>
                <Textarea
                  id="description"
                  value={nouveauStage.description}
                  onChange={(e) => setNouveauStage({...nouveauStage, description: e.target.value})}
                  placeholder="Décrivez les missions, objectifs et compétences visées..."
                  rows={4}
                  className={validationErrors.description ? "border-red-500" : ""}
                />
                {validationErrors.description && (
                  <p className="text-red-500 text-sm">{validationErrors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateDebut">Date de début *</Label>
                  <Input
                    id="dateDebut"
                    type="date"
                    value={nouveauStage.dateDebut}
                    onChange={(e) => setNouveauStage({...nouveauStage, dateDebut: e.target.value})}
                    className={validationErrors.dateDebut ? "border-red-500" : ""}
                  />
                  {validationErrors.dateDebut && (
                    <p className="text-red-500 text-sm">{validationErrors.dateDebut}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFin">Date de fin *</Label>
                  <Input
                    id="dateFin"
                    type="date"
                    value={nouveauStage.dateFin}
                    onChange={(e) => setNouveauStage({...nouveauStage, dateFin: e.target.value})}
                    className={validationErrors.dateFin ? "border-red-500" : ""}
                  />
                  {validationErrors.dateFin && (
                    <p className="text-red-500 text-sm">{validationErrors.dateFin}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="places">Nombre de places *</Label>
                <Input
                  id="places"
                  type="number"
                  min="1"
                  max="10"
                  value={nouveauStage.places}
                  onChange={(e) => setNouveauStage({...nouveauStage, places: e.target.value})}
                  placeholder="Nombre de stagiaires maximum"
                  className={validationErrors.places ? "border-red-500" : ""}
                />
                {validationErrors.places && (
                  <p className="text-red-500 text-sm">{validationErrors.places}</p>
                )}
                <p className="text-xs text-gray-500">
                  Maximum 10 places par stage
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsDialogOpen(false);
                setValidationErrors({});
              }}>
                Annuler
              </Button>
              <Button 
                onClick={handleAjouterStage}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Créer le Stage
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
                <BookOpen className="h-6 w-6 text-blue-600" />
              </motion.div>
            ),
            count: stats.total,
            text: "Offres créées",
            gradient: "from-blue-500 to-blue-600"
          },
          {
            title: "En Cours",
            icon: (
              <motion.div
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Clock className="h-6 w-6 text-green-600" />
              </motion.div>
            ),
            count: stats.enCours,
            text: "Stages actifs",
            gradient: "from-green-500 to-green-600"
          },
          {
            title: "Stagiaires Actifs",
            icon: (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Users className="h-6 w-6 text-purple-600" />
              </motion.div>
            ),
            count: stats.totalStagiaires,
            text: "Total assignés",
            gradient: "from-purple-500 to-purple-600"
          },
          {
            title: "Tâches Créées",
            icon: (
              <motion.div
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <ListTodo className="h-6 w-6 text-orange-600" />
              </motion.div>
            ),
            count: stats.totalTaches,
            text: "Tâches assignées",
            gradient: "from-orange-500 to-orange-600"
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
                    <SelectItem value="EN_ATTENTE_VALIDATION">En attente</SelectItem>
                    <SelectItem value="VALIDE">Validés</SelectItem>
                    <SelectItem value="REFUSE">Refusés</SelectItem>
                    <SelectItem value="EN_COURS">En cours</SelectItem>
                    <SelectItem value="TERMINE">Terminés</SelectItem>
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

      {/* Modal pour ajouter une tâche */}
      <Dialog open={isTacheDialogOpen} onOpenChange={setIsTacheDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ajouter une Tâche
            </DialogTitle>
            <DialogDescription>
              Créez une nouvelle tâche pour le stage "{stageSelectionne?.titre}".
              Les stagiaires recevront une notification.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="titreTache">Titre de la tâche *</Label>
              <Input
                id="titreTache"
                value={nouvelleTache.titre}
                onChange={(e) => setNouvelleTache({...nouvelleTache, titre: e.target.value})}
                placeholder="Ex: Conception de la base de données"
                className={validationTacheErrors.titre ? "border-red-500" : ""}
              />
              {validationTacheErrors.titre && (
                <p className="text-red-500 text-sm">{validationTacheErrors.titre}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="descriptionTache">Description détaillée *</Label>
              <Textarea
                id="descriptionTache"
                value={nouvelleTache.description}
                onChange={(e) => setNouvelleTache({...nouvelleTache, description: e.target.value})}
                placeholder="Décrivez la tâche en détail..."
                rows={3}
                className={validationTacheErrors.description ? "border-red-500" : ""}
              />
              {validationTacheErrors.description && (
                <p className="text-red-500 text-sm">{validationTacheErrors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateDebutTache">Date de début *</Label>
                <Input
                  id="dateDebutTache"
                  type="date"
                  value={nouvelleTache.dateDebut}
                  onChange={(e) => setNouvelleTache({...nouvelleTache, dateDebut: e.target.value})}
                  min={stageSelectionne?.dateDebut}
                  max={stageSelectionne?.dateFin}
                  className={validationTacheErrors.dateDebut ? "border-red-500" : ""}
                />
                {validationTacheErrors.dateDebut && (
                  <p className="text-red-500 text-sm">{validationTacheErrors.dateDebut}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFinTache">Date de fin *</Label>
                <Input
                  id="dateFinTache"
                  type="date"
                  value={nouvelleTache.dateFin}
                  onChange={(e) => setNouvelleTache({...nouvelleTache, dateFin: e.target.value})}
                  min={stageSelectionne?.dateDebut}
                  max={stageSelectionne?.dateFin}
                  className={validationTacheErrors.dateFin ? "border-red-500" : ""}
                />
                {validationTacheErrors.dateFin && (
                  <p className="text-red-500 text-sm">{validationTacheErrors.dateFin}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prioriteTache">Priorité</Label>
              <Select 
                value={nouvelleTache.priorite.toString()} 
                onValueChange={(value) => setNouvelleTache({...nouvelleTache, priorite: parseInt(value)})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Haute</SelectItem>
                  <SelectItem value="2">Moyenne</SelectItem>
                  <SelectItem value="3">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Informations sur les dates du stage */}
            {stageSelectionne && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Période du stage :</strong> {new Date(stageSelectionne.dateDebut).toLocaleDateString()} - {new Date(stageSelectionne.dateFin).toLocaleDateString()}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Les dates de la tâche doivent être comprises dans cette période.
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTacheDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleAjouterTache}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2"
            >
              <Bell className="h-4 w-4" />
              Créer et Notifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  {/* En-tête avec statut */}
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

                    {/* Liste des tâches récentes */}
                    {stage.taches && stage.taches.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Tâches récentes :
                        </div>
                        <div className="space-y-1 max-h-20 overflow-y-auto">
                          {stage.taches.slice(0, 3).map((tache) => (
                            <div key={tache.documentId} className="flex items-center justify-between text-xs p-1">
                              <span className="truncate flex-1">{tache.titre}</span>
                              <Badge className={`text-xs ${getPrioriteColor(tache.priorite)} ml-2`}>
                                {getPrioriteLabel(tache.priorite)}
                              </Badge>
                            </div>
                          ))}
                          {stage.taches.length > 3 && (
                            <div className="text-xs text-gray-500 text-center">
                              +{stage.taches.length - 3} autres tâches
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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
                    
                    {/* Bouton Ajouter Tâche - seulement pour les stages en cours */}
                    {stage.statutStage === 'EN_COURS' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 border-green-300 dark:border-green-600 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                        onClick={() => handleOuvrirModalTache(stage)}
                        title="Ajouter une tâche"
                      >
                        <Plus className="h-4 w-4" />
                        Tâche
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-gray-300 dark:border-gray-600"
                      onClick={() => handleModifier(stage)}
                      title="Modifier"
                      disabled={stage.statutStage === 'VALIDE' || stage.statutStage === 'EN_COURS'}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-red-300 dark:border-red-600 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      onClick={() => handleSupprimerStage(stage.documentId)}
                      title="Supprimer"
                      disabled={stage.nombreStagiaires > 0 || stage.statutStage === 'EN_COURS'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Messages d'information */}
                  {stage.nombreStagiaires > 0 && (
                    <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        ⓘ Ce stage a des stagiaires assignés et ne peut pas être supprimé
                      </p>
                    </div>
                  )}
                  
                  {stage.statutStage === 'EN_COURS' && (
                    <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-xs text-green-700 dark:text-green-300">
                        ✅ Stage en cours - Vous pouvez ajouter des tâches
                      </p>
                    </div>
                  )}
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
            {stages.length === 0 ? "Aucun stage créé" : "Aucun stage trouvé"}
          </h3>
          <p className="text-gray-400 dark:text-gray-500 mb-4">
            {stages.length === 0 
              ? "Commencez par créer votre premier stage." 
              : "Aucun stage ne correspond à vos critères de recherche."
            }
          </p>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="h-4 w-4" />
            Créer un stage
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}