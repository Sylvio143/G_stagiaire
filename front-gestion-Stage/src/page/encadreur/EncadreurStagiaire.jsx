import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Phone, 
  Eye, 
  Mail, 
  Calendar,
  MapPin,
  BadgeCheck,
  Clock,
  Search,
  Filter,
  GraduationCap,
  Building,
  UserCheck,
  UserX,
  TrendingUp,
  Download,
  Plus,
  BookOpen
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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

export default function EncadreurStagiaire() {
  const [stagiaires, setStagiaires] = useState([]);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [filtreStage, setFiltreStage] = useState("tous");
  const [recherche, setRecherche] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [stagiaireSelectionne, setStagiaireSelectionne] = useState(null);
  const [stageSelectionne, setStageSelectionne] = useState("");
  const [nouveauStagiaire, setNouveauStagiaire] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    cin: "",
    ecole: "",
    filiere: "",
    niveauEtude: "",
    dateNaissance: "",
    adresse: ""
  });
  const [validationErrors, setValidationErrors] = useState({});

  // Configuration API
  const API_BASE_URL = "http://localhost:9090/api";

  // Charger les stagiaires de l'encadreur connecté
  const fetchStagiaires = async () => {
    try {
      setLoading(true);
      
      // Récupérer l'ID de l'encadreur connecté
      const user = JSON.parse(localStorage.getItem("user"));
      const encadreurId = user?.entityDocumentId;
      
      if (!encadreurId) {
        toast.error("Impossible de récupérer les informations de l'encadreur");
        return;
      }

      // Récupérer les stagiaires de cet encadreur
      const stagiairesResponse = await axios.get(`${API_BASE_URL}/stagiaires/encadreur/${encadreurId}`);
      const stagiairesData = stagiairesResponse.data;

      // Récupérer les stages VALIDÉS de l'encadreur pour les assignations
      const stagesResponse = await axios.get(`${API_BASE_URL}/stages/encadreur/${encadreurId}`);
      const stagesValides = stagesResponse.data.filter(stage => 
        stage.statutStage === 'VALIDE' || stage.statutStage === 'EN_COURS'
      );
      setStages(stagesValides);

      // Enrichir les données des stagiaires avec leurs stages
      const stagiairesEnrichis = await Promise.all(
        stagiairesData.map(async (stagiaire) => {
          try {
            // Récupérer les stages du stagiaire
            const stagesStagiaireResponse = await axios.get(`${API_BASE_URL}/stages/stagiaire/${stagiaire.documentId}`);
            const stagesStagiaire = stagesStagiaireResponse.data;

            // Trouver le stage actuel (en cours ou validé)
            const stageActuel = stagesStagiaire.find(stage => 
              stage.statutStage === 'EN_COURS' || stage.statutStage === 'VALIDE'
            );

            // Calculer la progression si stage en cours
            let progression = 0;
            if (stageActuel && stageActuel.statutStage === 'EN_COURS') {
              progression = calculerProgression(stageActuel);
            }

            return {
              ...stagiaire,
              stageActuel: stageActuel,
              hasActiveStage: !!stageActuel,
              progression: progression,
              stages: stagesStagiaire,
              dateDebut: stageActuel?.dateDebut,
              dateFin: stageActuel?.dateFin,
              stageTitre: stageActuel?.titre
            };
          } catch (error) {
            console.error(`Erreur lors du chargement du stage pour ${stagiaire.prenom} ${stagiaire.nom}:`, error);
            return {
              ...stagiaire,
              stageActuel: null,
              hasActiveStage: false,
              progression: 0,
              stages: []
            };
          }
        })
      );

      setStagiaires(stagiairesEnrichis);
    } catch (error) {
      console.error("Erreur lors du chargement des stagiaires:", error);
      toast.error("Erreur lors du chargement des stagiaires");
    } finally {
      setLoading(false);
    }
  };

  // Calculer la progression du stage
  const calculerProgression = (stage) => {
    if (!stage.dateDebut || !stage.dateFin) return 0;
    
    const debut = new Date(stage.dateDebut);
    const fin = new Date(stage.dateFin);
    const aujourdhui = new Date();
    
    if (aujourdhui < debut) return 0;
    if (aujourdhui > fin) return 100;
    
    const total = fin.getTime() - debut.getTime();
    const ecoule = aujourdhui.getTime() - debut.getTime();
    
    return Math.min(Math.round((ecoule / total) * 100), 100);
  };

  // Validation du formulaire
  const validateForm = () => {
    const errors = {};
    
    if (!nouveauStagiaire.nom?.trim()) {
      errors.nom = "Le nom est obligatoire";
    }
    
    if (!nouveauStagiaire.prenom?.trim()) {
      errors.prenom = "Le prénom est obligatoire";
    }
    
    if (!nouveauStagiaire.email?.trim()) {
      errors.email = "L'email est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nouveauStagiaire.email)) {
      errors.email = "Format d'email invalide";
    }
    
    if (!nouveauStagiaire.cin?.trim()) {
      errors.cin = "Le CIN est obligatoire";
    }
    
    if (!nouveauStagiaire.ecole?.trim()) {
      errors.ecole = "L'école est obligatoire";
    }
    
    if (!nouveauStagiaire.filiere?.trim()) {
      errors.filiere = "La filière est obligatoire";
    }
    
    if (!nouveauStagiaire.niveauEtude?.trim()) {
      errors.niveauEtude = "Le niveau d'étude est obligatoire";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'ACTIF': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';
      case 'INACTIF': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getStatutLabel = (statut) => {
    switch (statut) {
      case 'ACTIF': return 'Actif';
      case 'INACTIF': return 'Inactif';
      default: return statut;
    }
  };

  const getProgressionColor = (progression) => {
    if (progression >= 80) return 'bg-emerald-500';
    if (progression >= 60) return 'bg-blue-500';
    if (progression >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getStageStatutColor = (statutStage) => {
    switch (statutStage) {
      case 'EN_COURS': return 'bg-emerald-100 text-emerald-700';
      case 'EN_ATTENTE_VALIDATION': return 'bg-amber-100 text-amber-700';
      case 'VALIDE': return 'bg-blue-100 text-blue-700';
      case 'TERMINE': return 'bg-gray-100 text-gray-700';
      case 'REFUSE': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStageStatutLabel = (statutStage) => {
    switch (statutStage) {
      case 'EN_COURS': return 'En cours';
      case 'EN_ATTENTE_VALIDATION': return 'En attente';
      case 'VALIDE': return 'Validé';
      case 'TERMINE': return 'Terminé';
      case 'REFUSE': return 'Refusé';
      default: return statutStage;
    }
  };

  useEffect(() => {
    fetchStagiaires();
  }, []);

  const stagiairesFiltres = stagiaires.filter(stagiaire => {
    const correspondRecherche = 
      stagiaire.nom?.toLowerCase().includes(recherche.toLowerCase()) ||
      stagiaire.prenom?.toLowerCase().includes(recherche.toLowerCase()) ||
      stagiaire.ecole?.toLowerCase().includes(recherche.toLowerCase()) ||
      stagiaire.filiere?.toLowerCase().includes(recherche.toLowerCase()) ||
      stagiaire.email?.toLowerCase().includes(recherche.toLowerCase());
    
    const correspondStatut = filtreStatut === "tous" || stagiaire.statut === filtreStatut;
    const correspondStage = filtreStage === "tous" || 
      (filtreStage === "avec_stage" && stagiaire.hasActiveStage) ||
      (filtreStage === "sans_stage" && !stagiaire.hasActiveStage);
    
    return correspondRecherche && correspondStatut && correspondStage;
  });

  // Fonction pour ouvrir le modal d'assignation
  const handleOuvrirAssignation = (stagiaire) => {
    setStagiaireSelectionne(stagiaire);
    setStageSelectionne("");
    setIsAssignDialogOpen(true);
  };

  // Fonction pour assigner un stage au stagiaire
  const handleAssignerStage = async () => {
    if (!stageSelectionne) {
      toast.error("Veuillez sélectionner un stage");
      return;
    }

    try {
      // Récupérer les détails complets du stage sélectionné
      const stageResponse = await axios.get(`${API_BASE_URL}/stages/${stageSelectionne}`);
      const stage = stageResponse.data;

      // Vérifier s'il reste des places disponibles
      const nombreStagiairesActuels = stage.stagiairesDocumentIds?.length || 0;
      const placesDisponibles = (stage.places || 5) - nombreStagiairesActuels;

      if (placesDisponibles <= 0) {
        toast.error("Ce stage n'a plus de places disponibles");
        return;
      }

      // Ajouter le stagiaire au stage
      await axios.post(`${API_BASE_URL}/stages/${stageSelectionne}/stagiaires/${stagiaireSelectionne.documentId}`);

      // Mettre à jour le statut du stage si nécessaire
      if (stage.statutStage === 'VALIDE') {
        await axios.put(`${API_BASE_URL}/stages/${stageSelectionne}`, {
          ...stage,
          statutStage: 'EN_COURS'
        });
      }

      // Créer une notification pour le stagiaire
      try {
        const compteStagiaire = await axios.get(
          `${API_BASE_URL}/comptes-utilisateurs/entity/${stagiaireSelectionne.documentId}/type/STAGIAIRE`
        );

        if (compteStagiaire.data) {
          await axios.post(`${API_BASE_URL}/notifications/create`, {
            titre: "Nouveau stage assigné",
            message: `Bonjour ${stagiaireSelectionne.prenom}, vous avez été assigné(e) au stage "${stage.titre}". Le stage commence le ${new Date(stage.dateDebut).toLocaleDateString()}.`,
            type: "NOUVEAU_STAGE",
            compteUtilisateurDocumentId: compteStagiaire.data.documentId,
            documentIdReference: stageSelectionne,
            typeReference: "STAGE"
          });
        }
      } catch (notifError) {
        console.error("Erreur création notification:", notifError);
      }

      // Créer une notification pour le supérieur hiérarchique
      try {
        if (stage.superieurHierarchiqueDocumentId) {
          const compteSuperieur = await axios.get(
            `${API_BASE_URL}/comptes-utilisateurs/entity/${stage.superieurHierarchiqueDocumentId}/type/SUPERIEUR_HIERARCHIQUE`
          );

          if (compteSuperieur.data) {
            await axios.post(`${API_BASE_URL}/notifications/create`, {
              titre: "Stagiaire assigné à un stage",
              message: `Le stagiaire ${stagiaireSelectionne.prenom} ${stagiaireSelectionne.nom} a été assigné au stage "${stage.titre}" par l'encadreur.`,
              type: "MESSAGE_IMPORTANT",
              compteUtilisateurDocumentId: compteSuperieur.data.documentId,
              documentIdReference: stageSelectionne,
              typeReference: "STAGE"
            });
          }
        }
      } catch (notifError) {
        console.error("Erreur création notification supérieur:", notifError);
      }

      toast.success("Stage assigné avec succès au stagiaire");
      await fetchStagiaires(); // Recharger la liste
      setIsAssignDialogOpen(false);
      setStagiaireSelectionne(null);
      setStageSelectionne("");
    } catch (error) {
      console.error("Erreur lors de l'assignation du stage:", error);
      toast.error("Erreur lors de l'assignation du stage");
    }
  };

  const handleAjouterStagiaire = async () => {
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

      // Vérifier si l'email existe déjà
      const emailExists = await axios.get(`${API_BASE_URL}/stagiaires/check-email/${nouveauStagiaire.email}`);
      if (emailExists.data) {
        toast.error("Un stagiaire avec cet email existe déjà");
        return;
      }

      // Vérifier si le CIN existe déjà
      const cinExists = await axios.get(`${API_BASE_URL}/stagiaires/check-cin/${nouveauStagiaire.cin}`);
      if (cinExists.data) {
        toast.error("Un stagiaire avec ce CIN existe déjà");
        return;
      }

      const stagiaireData = {
        nom: nouveauStagiaire.nom.trim(),
        prenom: nouveauStagiaire.prenom.trim(),
        email: nouveauStagiaire.email.trim(),
        telephone: nouveauStagiaire.telephone.trim(),
        cin: nouveauStagiaire.cin.trim(),
        ecole: nouveauStagiaire.ecole.trim(),
        filiere: nouveauStagiaire.filiere.trim(),
        niveauEtude: nouveauStagiaire.niveauEtude.trim(),
        dateNaissance: nouveauStagiaire.dateNaissance,
        adresse: nouveauStagiaire.adresse.trim(),
        statut: 'ACTIF',
        encadreurDocumentId: encadreurId
      };

      const response = await axios.post(`${API_BASE_URL}/stagiaires`, stagiaireData);
      
      // Créer un compte utilisateur pour le stagiaire
      try {
        await axios.post(`${API_BASE_URL}/comptes-utilisateurs/create-for-entity`, {
          email: stagiaireData.email,
          password: "stagiaire123", // Mot de passe par défaut
          typeCompte: "STAGIAIRE",
          entityDocumentId: response.data.documentId
        });

        // Envoyer une notification au stagiaire
        const compteStagiaire = await axios.get(
          `${API_BASE_URL}/comptes-utilisateurs/entity/${response.data.documentId}/type/STAGIAIRE`
        );

        if (compteStagiaire.data) {
          await axios.post(`${API_BASE_URL}/notifications/create`, {
            titre: "Bienvenue dans votre espace stagiaire",
            message: `Bonjour ${stagiaireData.prenom}, votre compte a été créé. Votre encadreur est ${user.email}.`,
            type: "COMPTE_ACTIVE",
            compteUtilisateurDocumentId: compteStagiaire.data.documentId,
            documentIdReference: response.data.documentId,
            typeReference: "STAGIAIRE"
          });
        }
      } catch (compteError) {
        console.error("Erreur création compte stagiaire:", compteError);
        // Continuer même si la création du compte échoue
      }

      toast.success("Stagiaire ajouté avec succès");
      await fetchStagiaires(); // Recharger la liste
      
      setNouveauStagiaire({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        cin: "",
        ecole: "",
        filiere: "",
        niveauEtude: "",
        dateNaissance: "",
        adresse: ""
      });
      setValidationErrors({});
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du stagiaire:", error);
      if (error.response?.status === 400) {
        toast.error("Données invalides pour l'ajout du stagiaire");
      } else {
        toast.error("Erreur lors de l'ajout du stagiaire");
      }
    }
  };

  const handleVoirDetails = (stagiaire) => {
    console.log('Voir détails stagiaire:', stagiaire);
    // Navigation vers la page de détails du stagiaire
  };

  const handleAppeler = (telephone) => {
    if (telephone) {
      window.open(`tel:${telephone}`, '_self');
    } else {
      toast.error("Aucun numéro de téléphone disponible");
    }
  };

  const handleEnvoyerEmail = (email) => {
    if (email) {
      window.open(`mailto:${email}`, '_self');
    } else {
      toast.error("Aucun email disponible");
    }
  };

  const handleActiverDesactiver = async (stagiaire) => {
    try {
      if (stagiaire.statut === 'ACTIF') {
        await axios.put(`${API_BASE_URL}/stagiaires/${stagiaire.documentId}/desactiver`);
        toast.success("Stagiaire désactivé avec succès");
      } else {
        await axios.put(`${API_BASE_URL}/stagiaires/${stagiaire.documentId}/activer`);
        toast.success("Stagiaire activé avec succès");
      }
      await fetchStagiaires(); // Recharger la liste
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      toast.error("Erreur lors du changement de statut");
    }
  };

  const handleExporterListe = () => {
    console.log('Exporter la liste des stagiaires');
    toast.success("Export en cours...");
    // Logique d'export
  };

  // Calcul des statistiques
  const stats = {
    total: stagiaires.length,
    actifs: stagiaires.filter(s => s.statut === 'ACTIF').length,
    inactifs: stagiaires.filter(s => s.statut === 'INACTIF').length,
    avecStage: stagiaires.filter(s => s.hasActiveStage).length,
    sansStage: stagiaires.filter(s => !s.hasActiveStage).length
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des stagiaires...</p>
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
              Mes Stagiaires
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Gestion et suivi de vos stagiaires en cours
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleExporterListe}
              variant="outline"
              className="gap-2 border-gray-300 dark:border-gray-600"
            >
              <Download className="h-4 w-4" />
              Exporter
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="h-4 w-4" />
                  Nouveau Stagiaire
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
                <DialogHeader>
                  <DialogTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Ajouter un Nouveau Stagiaire
                  </DialogTitle>
                  <DialogDescription>
                    Remplissez les informations pour ajouter un nouveau stagiaire à votre encadrement.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom *</Label>
                      <Input
                        id="nom"
                        value={nouveauStagiaire.nom}
                        onChange={(e) => setNouveauStagiaire({...nouveauStagiaire, nom: e.target.value})}
                        placeholder="Nom du stagiaire"
                        className={validationErrors.nom ? "border-red-500" : ""}
                      />
                      {validationErrors.nom && (
                        <p className="text-red-500 text-sm">{validationErrors.nom}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prenom">Prénom *</Label>
                      <Input
                        id="prenom"
                        value={nouveauStagiaire.prenom}
                        onChange={(e) => setNouveauStagiaire({...nouveauStagiaire, prenom: e.target.value})}
                        placeholder="Prénom du stagiaire"
                        className={validationErrors.prenom ? "border-red-500" : ""}
                      />
                      {validationErrors.prenom && (
                        <p className="text-red-500 text-sm">{validationErrors.prenom}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={nouveauStagiaire.email}
                        onChange={(e) => setNouveauStagiaire({...nouveauStagiaire, email: e.target.value})}
                        placeholder="email@exemple.com"
                        className={validationErrors.email ? "border-red-500" : ""}
                      />
                      {validationErrors.email && (
                        <p className="text-red-500 text-sm">{validationErrors.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cin">CIN *</Label>
                      <Input
                        id="cin"
                        value={nouveauStagiaire.cin}
                        onChange={(e) => setNouveauStagiaire({...nouveauStagiaire, cin: e.target.value})}
                        placeholder="Numéro CIN"
                        className={validationErrors.cin ? "border-red-500" : ""}
                      />
                      {validationErrors.cin && (
                        <p className="text-red-500 text-sm">{validationErrors.cin}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telephone">Téléphone</Label>
                      <Input
                        id="telephone"
                        value={nouveauStagiaire.telephone}
                        onChange={(e) => setNouveauStagiaire({...nouveauStagiaire, telephone: e.target.value})}
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateNaissance">Date de naissance</Label>
                      <Input
                        id="dateNaissance"
                        type="date"
                        value={nouveauStagiaire.dateNaissance}
                        onChange={(e) => setNouveauStagiaire({...nouveauStagiaire, dateNaissance: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ecole">École *</Label>
                      <Input
                        id="ecole"
                        value={nouveauStagiaire.ecole}
                        onChange={(e) => setNouveauStagiaire({...nouveauStagiaire, ecole: e.target.value})}
                        placeholder="Nom de l'école"
                        className={validationErrors.ecole ? "border-red-500" : ""}
                      />
                      {validationErrors.ecole && (
                        <p className="text-red-500 text-sm">{validationErrors.ecole}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="filiere">Filière *</Label>
                      <Input
                        id="filiere"
                        value={nouveauStagiaire.filiere}
                        onChange={(e) => setNouveauStagiaire({...nouveauStagiaire, filiere: e.target.value})}
                        placeholder="Filière d'étude"
                        className={validationErrors.filiere ? "border-red-500" : ""}
                      />
                      {validationErrors.filiere && (
                        <p className="text-red-500 text-sm">{validationErrors.filiere}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="niveauEtude">Niveau d'étude *</Label>
                    <Input
                      id="niveauEtude"
                      value={nouveauStagiaire.niveauEtude}
                      onChange={(e) => setNouveauStagiaire({...nouveauStagiaire, niveauEtude: e.target.value})}
                      placeholder="Ex: Licence 3, Master 1..."
                      className={validationErrors.niveauEtude ? "border-red-500" : ""}
                    />
                    {validationErrors.niveauEtude && (
                      <p className="text-red-500 text-sm">{validationErrors.niveauEtude}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adresse">Adresse</Label>
                    <Input
                      id="adresse"
                      value={nouveauStagiaire.adresse}
                      onChange={(e) => setNouveauStagiaire({...nouveauStagiaire, adresse: e.target.value})}
                      placeholder="Adresse complète"
                    />
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
                    onClick={handleAjouterStagiaire}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Ajouter le Stagiaire
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
            title: "Total Stagiaires",
            icon: (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Users className="h-6 w-6 text-blue-600" />
              </motion.div>
            ),
            count: stats.total,
            text: "Stagiaires encadrés",
            gradient: "from-blue-500 to-blue-600"
          },
          {
            title: "Stagiaires Actifs",
            icon: (
              <motion.div
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <UserCheck className="h-6 w-6 text-emerald-600" />
              </motion.div>
            ),
            count: stats.actifs,
            text: "En cours de formation",
            gradient: "from-emerald-500 to-emerald-600"
          },
          {
            title: "Avec Stage Actif",
            icon: (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <BookOpen className="h-6 w-6 text-purple-600" />
              </motion.div>
            ),
            count: stats.avecStage,
            text: "Stage en cours",
            gradient: "from-purple-500 to-purple-600"
          },
          {
            title: "Sans Stage",
            icon: (
              <motion.div
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <UserX className="h-6 w-6 text-amber-600" />
              </motion.div>
            ),
            count: stats.sansStage,
            text: "En attente d'affectation",
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
                    placeholder="Rechercher un stagiaire..."
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
                      <SelectItem value="ACTIF">Actifs</SelectItem>
                      <SelectItem value="INACTIF">Inactifs</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filtreStage} onValueChange={setFiltreStage}>
                    <SelectTrigger className="w-[160px] bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="Stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous</SelectItem>
                      <SelectItem value="avec_stage">Avec stage</SelectItem>
                      <SelectItem value="sans_stage">Sans stage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                {stagiairesFiltres.length} stagiaire(s) trouvé(s)
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Grille des stagiaires */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        <AnimatePresence>
          {stagiairesFiltres.map((stagiaire) => (
            <motion.div
              key={stagiaire.documentId}
              variants={cardVariants}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden h-full">
                {/* En-tête avec statut */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-white/20">
                        <AvatarImage src={stagiaire.photoUrl} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {stagiaire.prenom?.[0]}{stagiaire.nom?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {stagiaire.prenom} {stagiaire.nom}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${getStatutColor(stagiaire.statut)}`}>
                            {getStatutLabel(stagiaire.statut)}
                          </Badge>
                          {stagiaire.stageActuel && (
                            <Badge className={`text-xs ${getStageStatutColor(stagiaire.stageActuel.statutStage)}`}>
                              {getStageStatutLabel(stagiaire.stageActuel.statutStage)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informations principales */}
                  <div className="space-y-3">
                    {stagiaire.ecole && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <GraduationCap className="h-4 w-4" />
                        <span className="font-medium">{stagiaire.ecole}</span>
                      </div>
                    )}
                    
                    {stagiaire.filiere && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Building className="h-4 w-4" />
                        <span>{stagiaire.filiere}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{stagiaire.email}</span>
                    </div>

                    {stagiaire.telephone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="h-4 w-4" />
                        <span>{stagiaire.telephone}</span>
                      </div>
                    )}

                    {stagiaire.niveauEtude && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <TrendingUp className="h-4 w-4" />
                        <span>{stagiaire.niveauEtude}</span>
                      </div>
                    )}

                    {stagiaire.dateDebut && stagiaire.dateFin && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(stagiaire.dateDebut).toLocaleDateString()} - {new Date(stagiaire.dateFin).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Barre de progression du stage */}
                {stagiaire.hasActiveStage && (
                  <div className="px-6 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progression du stage</span>
                      <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {stagiaire.progression}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${getProgressionColor(stagiaire.progression)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${stagiaire.progression}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="p-6 pt-4 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-700/30">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 border-gray-300 dark:border-gray-600"
                      onClick={() => handleVoirDetails(stagiaire)}
                    >
                      <Eye className="h-4 w-4" />
                      Voir
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-gray-300 dark:border-gray-600"
                      onClick={() => handleEnvoyerEmail(stagiaire.email)}
                      title="Envoyer un email"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className={`gap-2 ${
                        stagiaire.statut === 'ACTIF' 
                          ? 'text-amber-600 border-amber-300 hover:text-amber-700' 
                          : 'text-emerald-600 border-emerald-300 hover:text-emerald-700'
                      }`}
                      onClick={() => handleActiverDesactiver(stagiaire)}
                      title={stagiaire.statut === 'ACTIF' ? 'Désactiver' : 'Activer'}
                    >
                      {stagiaire.statut === 'ACTIF' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                    </Button>
                  </div>

                  {/* Bouton d'assignation de stage pour les stagiaires sans stage */}
                  {!stagiaire.hasActiveStage && stagiaire.statut === 'ACTIF' && (
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 border-blue-300 text-blue-600 hover:text-blue-700"
                        onClick={() => handleOuvrirAssignation(stagiaire)}
                      >
                        <BookOpen className="h-4 w-4" />
                        Assigner un stage
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modal d'assignation de stage */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Assigner un Stage
            </DialogTitle>
            <DialogDescription>
              Sélectionnez un stage à assigner à {stagiaireSelectionne?.prenom} {stagiaireSelectionne?.nom}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="stage">Stage *</Label>
              <Select value={stageSelectionne} onValueChange={setStageSelectionne}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage.documentId} value={stage.documentId}>
                      <div className="flex flex-col">
                        <span className="font-medium">{stage.titre}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(stage.dateDebut).toLocaleDateString()} - {new Date(stage.dateFin).toLocaleDateString()} 
                          • {stage.statutStage === 'VALIDE' ? 'Validé' : 'En cours'}
                          • Places: {stage.stagiairesDocumentIds?.length || 0}/{stage.places || 5}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {stageSelectionne && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Stage sélectionné :</strong> {
                    stages.find(s => s.documentId === stageSelectionne)?.titre
                  }
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleAssignerStage}
              disabled={!stageSelectionne}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Assigner le Stage
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message si aucun résultat */}
      {stagiairesFiltres.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">
            {stagiaires.length === 0 ? "Aucun stagiaire" : "Aucun stagiaire trouvé"}
          </h3>
          <p className="text-gray-400 dark:text-gray-500 mb-4">
            {stagiaires.length === 0 
              ? "Commencez par ajouter votre premier stagiaire." 
              : "Aucun stagiaire ne correspond à vos critères de recherche."
            }
          </p>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="h-4 w-4" />
            Ajouter un stagiaire
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}