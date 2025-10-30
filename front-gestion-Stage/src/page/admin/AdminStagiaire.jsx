import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Plus, 
  Search, 
  Edit2,
  Eye,
  Mail,
  Phone,
  UserCheck,
  Download,
  Trash2,
  UserX,
  GraduationCap,
  Link,
  Target,
  Calendar,
  MapPin,
  Building
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export default function AdminStagiaire() {
  const [stagiaires, setStagiaires] = useState([]);
  const [encadreurs, setEncadreurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [filtreEcole, setFiltreEcole] = useState("tous");
  const [filtreFiliere, setFiltreFiliere] = useState("tous");
  const [filtreEncadreur, setFiltreEncadreur] = useState("tous");
  const [recherche, setRecherche] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStagiaire, setSelectedStagiaire] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    cin: "",
    ecole: "",
    filiere: "",
    niveauEtude: "",
    dateNaissance: "",
    adresse: "",
    statut: "ACTIF",
    encadreurDocumentId: "aucun"
  });

  // Configuration Axios
  const API_BASE_URL = "http://localhost:9090/api";

  // Charger les stagiaires depuis l'API
  const fetchStagiaires = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/stagiaires/tous`);
      setStagiaires(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des stagiaires:", error);
      toast.error("Erreur lors du chargement des stagiaires");
    } finally {
      setLoading(false);
    }
  };

  // Charger les encadreurs depuis l'API
  const fetchEncadreurs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/encadreurs/tous`);
      setEncadreurs(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des encadreurs:", error);
      toast.error("Erreur lors du chargement des encadreurs");
    }
  };

  useEffect(() => {
    fetchStagiaires();
    fetchEncadreurs();
  }, []);

  // Vérifier si l'email existe déjà
  const checkEmailExists = (email, currentDocumentId = null) => {
    const stagiaireWithEmail = stagiaires.find(s => s.email === email);
    
    if (currentDocumentId && stagiaireWithEmail) {
      return stagiaireWithEmail.documentId !== currentDocumentId;
    }
    
    return !!stagiaireWithEmail;
  };

  // Vérifier si le CIN existe déjà
  const checkCinExists = (cin, currentDocumentId = null) => {
    const stagiaireWithCin = stagiaires.find(s => s.cin === cin);
    
    if (currentDocumentId && stagiaireWithCin) {
      return stagiaireWithCin.documentId !== currentDocumentId;
    }
    
    return !!stagiaireWithCin;
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      cin: "",
      ecole: "",
      filiere: "",
      niveauEtude: "",
      dateNaissance: "",
      adresse: "",
      statut: "ACTIF",
      encadreurDocumentId: "aucun"
    });
    setSelectedStagiaire(null);
  };

  // Ouvrir le dialogue pour créer/modifier
  const handleOpenDialog = (stagiaire = null) => {
    if (stagiaire) {
      setSelectedStagiaire(stagiaire);
      setFormData({
        nom: stagiaire.nom || "",
        prenom: stagiaire.prenom || "",
        email: stagiaire.email || "",
        telephone: stagiaire.telephone || "",
        cin: stagiaire.cin || "",
        ecole: stagiaire.ecole || "",
        filiere: stagiaire.filiere || "",
        niveauEtude: stagiaire.niveauEtude || "",
        dateNaissance: stagiaire.dateNaissance || "",
        adresse: stagiaire.adresse || "",
        statut: stagiaire.statut || "ACTIF",
        encadreurDocumentId: stagiaire.encadreurDocumentId || "aucun"
      });
    } else {
      resetForm();
    }
    setOpenDialog(true);
  };

  const handleSaveStagiaire = async () => {
    try {
      // Validation des champs requis
      if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone || !formData.cin) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }

      let response;
      const encadreurId = formData.encadreurDocumentId === "aucun" ? null : formData.encadreurDocumentId;

      if (selectedStagiaire) {
        const dataToSend = { 
          id: selectedStagiaire.id,
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone,
          cin: formData.cin,
          ecole: formData.ecole,
          filiere: formData.filiere,
          niveauEtude: formData.niveauEtude,
          dateNaissance: formData.dateNaissance,
          adresse: formData.adresse,
          statut: formData.statut,
          encadreurDocumentId: encadreurId
        };
        
        response = await axios.put(`${API_BASE_URL}/stagiaires/${selectedStagiaire.documentId}`, dataToSend);
        toast.success("Stagiaire modifié avec succès");
      } else {
        // Vérifications pour la création
        if (checkEmailExists(formData.email)) {
          toast.error("Cet email est déjà utilisé par un autre stagiaire");
          return;
        }
        
        if (checkCinExists(formData.cin)) {
          toast.error("Ce CIN est déjà utilisé par un autre stagiaire");
          return;
        }

        const dataToSend = {
          ...formData,
          encadreurDocumentId: encadreurId
        };
        
        response = await axios.post(`${API_BASE_URL}/stagiaires`, dataToSend);
        toast.success("Stagiaire créé avec succès");
      }
      
      await fetchStagiaires();
      setOpenDialog(false);
      resetForm();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      if (error.response?.status === 500) {
        const errorMessage = error.response.data?.message || '';
        if (errorMessage.includes('cin')) {
          toast.error("Ce CIN est déjà utilisé par un autre stagiaire");
        } else if (errorMessage.includes('email')) {
          toast.error("Cet email est déjà utilisé par un autre stagiaire");
        } else {
          toast.error("Erreur lors de la sauvegarde");
        }
      } else {
        toast.error("Erreur lors de la sauvegarde");
      }
    }
  };

  // Supprimer un stagiaire
  const handleDeleteStagiaire = async (documentId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce stagiaire ?")) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/stagiaires/${documentId}`);
      toast.success("Stagiaire supprimé avec succès");
      await fetchStagiaires();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression du stagiaire");
    }
  };

  // Activer/Désactiver un stagiaire
  const handleToggleStatus = async (documentId, currentStatus) => {
    try {
      if (currentStatus === "ACTIF") {
        await axios.put(`${API_BASE_URL}/stagiaires/${documentId}/desactiver`);
        toast.success("Stagiaire désactivé avec succès");
      } else {
        await axios.put(`${API_BASE_URL}/stagiaires/${documentId}/activer`);
        toast.success("Stagiaire activé avec succès");
      }
      await fetchStagiaires();
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      toast.error("Erreur lors du changement de statut");
    }
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

  // Obtenir le nom de l'encadreur
  const getEncadreurNom = (encadreurDocumentId) => {
    if (!encadreurDocumentId || encadreurDocumentId === "aucun") return "Non assigné";
    const encadreur = encadreurs.find(e => e.documentId === encadreurDocumentId);
    return encadreur ? `${encadreur.prenom} ${encadreur.nom}` : "Encadreur inconnu";
  };

  // Liste unique pour les filtres
  const ecoles = [...new Set(stagiaires.map(s => s.ecole).filter(Boolean))];
  const filieres = [...new Set(stagiaires.map(s => s.filiere).filter(Boolean))];
  const encadreursList = [...new Set(stagiaires.map(s => s.encadreurDocumentId).filter(Boolean))];

  const stagiairesFiltres = stagiaires.filter(stagiaire => {
    const correspondRecherche = 
      stagiaire.nom?.toLowerCase().includes(recherche.toLowerCase()) ||
      stagiaire.prenom?.toLowerCase().includes(recherche.toLowerCase()) ||
      stagiaire.email?.toLowerCase().includes(recherche.toLowerCase()) ||
      stagiaire.ecole?.toLowerCase().includes(recherche.toLowerCase()) ||
      stagiaire.filiere?.toLowerCase().includes(recherche.toLowerCase()) ||
      stagiaire.cin?.toLowerCase().includes(recherche.toLowerCase());
    
    const correspondStatut = filtreStatut === "tous" || stagiaire.statut === filtreStatut;
    const correspondEcole = filtreEcole === "tous" || stagiaire.ecole === filtreEcole;
    const correspondFiliere = filtreFiliere === "tous" || stagiaire.filiere === filtreFiliere;
    const correspondEncadreur = filtreEncadreur === "tous" || 
      (filtreEncadreur === "non_assigné" ? !stagiaire.encadreurDocumentId : stagiaire.encadreurDocumentId === filtreEncadreur);
    
    return correspondRecherche && correspondStatut && correspondEcole && correspondFiliere && correspondEncadreur;
  });

  const stats = {
    total: stagiaires.length,
    actifs: stagiaires.filter(s => s.statut === 'ACTIF').length,
    inactifs: stagiaires.filter(s => s.statut === 'INACTIF').length,
    sansEncadreur: stagiaires.filter(s => !s.encadreurDocumentId).length,
    avecStageActif: stagiaires.filter(s => s.hasActiveStage).length
  };

  const handleViewDetails = (stagiaire) => {
    console.log('Voir détails:', stagiaire);
    // Navigation vers les détails du stagiaire
  };

  const handleExport = () => {
    console.log('Exporter la liste');
    // Logique d'export
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
              Gestion des Stagiaires
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Administration et liaison des stagiaires avec les encadreurs
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleExport}
              variant="outline"
              className="gap-2 border-gray-300 dark:border-gray-600"
            >
              <Download className="h-4 w-4" />
              Exporter
            </Button>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => handleOpenDialog()}
                  className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="h-4 w-4" />
                  Nouveau Stagiaire
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-gray-900 dark:text-white">
                    {selectedStagiaire ? "Modifier le Stagiaire" : "Créer un Nouveau Stagiaire"}
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 dark:text-gray-400">
                    {selectedStagiaire 
                      ? "Modifiez les informations du stagiaire et son encadreur assigné."
                      : "Ajoutez un nouveau stagiaire au système et assignez-le à un encadreur."
                    }
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prenom" className="text-gray-700 dark:text-gray-300">Prénom *</Label>
                      <Input
                        id="prenom"
                        value={formData.prenom}
                        onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nom" className="text-gray-700 dark:text-gray-300">Nom *</Label>
                      <Input
                        id="nom"
                        value={formData.nom}
                        onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telephone" className="text-gray-700 dark:text-gray-300">Téléphone *</Label>
                      <Input
                        id="telephone"
                        value={formData.telephone}
                        onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cin" className="text-gray-700 dark:text-gray-300">CIN *</Label>
                      <Input
                        id="cin"
                        value={formData.cin}
                        onChange={(e) => setFormData(prev => ({ ...prev, cin: e.target.value }))}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="niveauEtude" className="text-gray-700 dark:text-gray-300">Niveau d'étude</Label>
                      <Input
                        id="niveauEtude"
                        value={formData.niveauEtude}
                        onChange={(e) => setFormData(prev => ({ ...prev, niveauEtude: e.target.value }))}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ecole" className="text-gray-700 dark:text-gray-300">École/Université</Label>
                      <Input
                        id="ecole"
                        value={formData.ecole}
                        onChange={(e) => setFormData(prev => ({ ...prev, ecole: e.target.value }))}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="filiere" className="text-gray-700 dark:text-gray-300">Filière</Label>
                      <Input
                        id="filiere"
                        value={formData.filiere}
                        onChange={(e) => setFormData(prev => ({ ...prev, filiere: e.target.value }))}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateNaissance" className="text-gray-700 dark:text-gray-300">Date de naissance</Label>
                      <Input
                        id="dateNaissance"
                        type="date"
                        value={formData.dateNaissance}
                        onChange={(e) => setFormData(prev => ({ ...prev, dateNaissance: e.target.value }))}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="statut" className="text-gray-700 dark:text-gray-300">Statut</Label>
                      <Select value={formData.statut} onValueChange={(value) => setFormData(prev => ({ ...prev, statut: value }))}>
                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                          <SelectItem value="ACTIF" className="text-gray-900 dark:text-white">Actif</SelectItem>
                          <SelectItem value="INACTIF" className="text-gray-900 dark:text-white">Inactif</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adresse" className="text-gray-700 dark:text-gray-300">Adresse</Label>
                    <Input
                      id="adresse"
                      value={formData.adresse}
                      onChange={(e) => setFormData(prev => ({ ...prev, adresse: e.target.value }))}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="encadreurDocumentId" className="text-gray-700 dark:text-gray-300">Encadreur Assigné</Label>
                    <Select 
                      value={formData.encadreurDocumentId} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, encadreurDocumentId: value }))}
                    >
                      <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                        <SelectValue placeholder="Sélectionner un encadreur" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                        <SelectItem value="aucun" className="text-gray-900 dark:text-white">Aucun encadreur</SelectItem>
                        {encadreurs.map(encadreur => (
                          <SelectItem key={encadreur.documentId} value={encadreur.documentId} className="text-gray-900 dark:text-white">
                            {encadreur.prenom} {encadreur.nom} - {encadreur.departement}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setOpenDialog(false)}
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                  >
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleSaveStagiaire}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {selectedStagiaire ? "Modifier" : "Créer"}
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
            icon: <Users className="h-6 w-6 text-blue-600" />,
            count: stats.total,
            text: "Dans le système",
            gradient: "from-blue-500 to-blue-600"
          },
          {
            title: "Stagiaires Actifs",
            icon: <UserCheck className="h-6 w-6 text-emerald-600" />,
            count: stats.actifs,
            text: "Actuellement actifs",
            gradient: "from-emerald-500 to-emerald-600"
          },
          {
            title: "Avec Stage Actif",
            icon: <GraduationCap className="h-6 w-6 text-purple-600" />,
            count: stats.avecStageActif,
            text: "En stage actuellement",
            gradient: "from-purple-500 to-purple-600"
          },
          {
            title: "Sans Encadreur",
            icon: <Target className="h-6 w-6 text-amber-600" />,
            count: stats.sansEncadreur,
            text: "À assigner",
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

                  <Select value={filtreEcole} onValueChange={setFiltreEcole}>
                    <SelectTrigger className="w-[160px] bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="École" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Toutes écoles</SelectItem>
                      {ecoles.map(ecole => (
                        <SelectItem key={ecole} value={ecole}>
                          {ecole}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filtreFiliere} onValueChange={setFiltreFiliere}>
                    <SelectTrigger className="w-[160px] bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="Filière" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Toutes filières</SelectItem>
                      {filieres.map(filiere => (
                        <SelectItem key={filiere} value={filiere}>
                          {filiere}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filtreEncadreur} onValueChange={setFiltreEncadreur}>
                    <SelectTrigger className="w-[180px] bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="Encadreur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les encadreurs</SelectItem>
                      {encadreursList.map(encadreurId => {
                        const encadreur = encadreurs.find(e => e.documentId === encadreurId);
                        return encadreur ? (
                          <SelectItem key={encadreurId} value={encadreurId}>
                            {encadreur.prenom} {encadreur.nom}
                          </SelectItem>
                        ) : null;
                      }).filter(Boolean)}
                      <SelectItem value="non_assigné">Non assigné</SelectItem>
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

      {/* Tableau des stagiaires */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle>Liste des Stagiaires</CardTitle>
            <CardDescription>
              Gestion complète des stagiaires et leur liaison avec les encadreurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stagiaire</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>École & Filière</TableHead>
                  <TableHead>Encadreur</TableHead>
                  <TableHead>CIN</TableHead>
                  <TableHead>Stage Actif</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stagiairesFiltres.map((stagiaire) => (
                  <TableRow key={stagiaire.documentId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={stagiaire.photoUrl} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {stagiaire.prenom?.[0]}{stagiaire.nom?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {stagiaire.prenom} {stagiaire.nom}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {stagiaire.adresse}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3" />
                          {stagiaire.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Phone className="h-3 w-3" />
                          {stagiaire.telephone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{stagiaire.ecole}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {stagiaire.filiere}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {stagiaire.niveauEtude}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {stagiaire.encadreurDocumentId ? (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Link className="h-3 w-3" />
                            {getEncadreurNom(stagiaire.encadreurDocumentId)}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-600 border-amber-300">
                            Non assigné
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-sm">{stagiaire.cin}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={stagiaire.hasActiveStage ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}>
                        {stagiaire.hasActiveStage ? "Oui" : "Non"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatutColor(stagiaire.statut)}>
                        {getStatutLabel(stagiaire.statut)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(stagiaire.documentId, stagiaire.statut)}
                          title={stagiaire.statut === "ACTIF" ? "Désactiver" : "Activer"}
                        >
                          {stagiaire.statut === "ACTIF" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(stagiaire)}
                          title="Modifier"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(stagiaire)}
                          title="Voir détails"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteStagiaire(stagiaire.documentId)}
                          title="Supprimer"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Message si aucun résultat */}
            {stagiairesFiltres.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  Aucun stagiaire trouvé
                </h3>
                <p className="text-gray-400 dark:text-gray-500">
                  Aucun stagiaire ne correspond à vos critères de recherche.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}