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
  User,
  Link,
  UserCog
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

export default function AdminEncadreur() {
  const [encadreurs, setEncadreurs] = useState([]);
  const [superieurs, setSuperieurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [filtreDepartement, setFiltreDepartement] = useState("tous");
  const [filtreSuperieur, setFiltreSuperieur] = useState("tous");
  const [recherche, setRecherche] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEncadreur, setSelectedEncadreur] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    cin: "",
    fonction: "",
    departement: "",
    specialite: "",
    statut: "ACTIF",
    superieurHierarchiqueDocumentId: "aucun"
  });

  // Configuration Axios
  const API_BASE_URL = "http://localhost:9090/api";

  // Charger les encadreurs depuis l'API
  const fetchEncadreurs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/encadreurs/tous`);
      setEncadreurs(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des encadreurs:", error);
      toast.error("Erreur lors du chargement des encadreurs");
    } finally {
      setLoading(false);
    }
  };

  // Charger les supérieurs depuis l'API
  const fetchSuperieurs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/superieurs-hierarchiques/tous`);
      setSuperieurs(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des supérieurs:", error);
      toast.error("Erreur lors du chargement des supérieurs");
    }
  };

  useEffect(() => {
    fetchEncadreurs();
    fetchSuperieurs();
  }, []);

  // Vérifier si l'email existe déjà
  const checkEmailExists = (email, currentDocumentId = null) => {
    const encadreurWithEmail = encadreurs.find(e => e.email === email);
    
    if (currentDocumentId && encadreurWithEmail) {
      return encadreurWithEmail.documentId !== currentDocumentId;
    }
    
    return !!encadreurWithEmail;
  };

  // Vérifier si le CIN existe déjà
  const checkCinExists = (cin, currentDocumentId = null) => {
    const encadreurWithCin = encadreurs.find(e => e.cin === cin);
    
    if (currentDocumentId && encadreurWithCin) {
      return encadreurWithCin.documentId !== currentDocumentId;
    }
    
    return !!encadreurWithCin;
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      cin: "",
      fonction: "",
      departement: "",
      specialite: "",
      statut: "ACTIF",
      superieurHierarchiqueDocumentId: "aucun"
    });
    setSelectedEncadreur(null);
  };

  // Ouvrir le dialogue pour créer/modifier
  const handleOpenDialog = (encadreur = null) => {
    if (encadreur) {
      setSelectedEncadreur(encadreur);
      setFormData({
        nom: encadreur.nom || "",
        prenom: encadreur.prenom || "",
        email: encadreur.email || "",
        telephone: encadreur.telephone || "",
        cin: encadreur.cin || "",
        fonction: encadreur.fonction || "",
        departement: encadreur.departement || "",
        specialite: encadreur.specialite || "",
        statut: encadreur.statut || "ACTIF",
        superieurHierarchiqueDocumentId: encadreur.superieurHierarchiqueDocumentId || "aucun"
      });
    } else {
      resetForm();
    }
    setOpenDialog(true);
  };

  const handleSaveEncadreur = async () => {
    try {
      // Validation des champs requis
      if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone || !formData.cin || !formData.fonction) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }

      let response;
      const superieurId = formData.superieurHierarchiqueDocumentId === "aucun" ? null : formData.superieurHierarchiqueDocumentId;

      if (selectedEncadreur) {
        const dataToSend = { 
          id: selectedEncadreur.id,
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone,
          cin: formData.cin,
          fonction: formData.fonction,
          departement: formData.departement,
          specialite: formData.specialite,
          statut: formData.statut,
          superieurHierarchiqueDocumentId: superieurId
        };
        
        response = await axios.put(`${API_BASE_URL}/encadreurs/${selectedEncadreur.documentId}`, dataToSend);
        toast.success("Encadreur modifié avec succès");
      } else {
        // Vérifications pour la création
        if (checkEmailExists(formData.email)) {
          toast.error("Cet email est déjà utilisé par un autre encadreur");
          return;
        }
        
        if (checkCinExists(formData.cin)) {
          toast.error("Ce CIN est déjà utilisé par un autre encadreur");
          return;
        }

        const dataToSend = {
          ...formData,
          superieurHierarchiqueDocumentId: superieurId
        };
        
        response = await axios.post(`${API_BASE_URL}/encadreurs`, dataToSend);
        toast.success("Encadreur créé avec succès");
      }
      
      await fetchEncadreurs();
      setOpenDialog(false);
      resetForm();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      if (error.response?.status === 500) {
        const errorMessage = error.response.data?.message || '';
        if (errorMessage.includes('cin')) {
          toast.error("Ce CIN est déjà utilisé par un autre encadreur");
        } else if (errorMessage.includes('email')) {
          toast.error("Cet email est déjà utilisé par un autre encadreur");
        } else {
          toast.error("Erreur lors de la sauvegarde");
        }
      } else {
        toast.error("Erreur lors de la sauvegarde");
      }
    }
  };

  // Supprimer un encadreur
  const handleDeleteEncadreur = async (documentId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet encadreur ?")) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/encadreurs/${documentId}`);
      toast.success("Encadreur supprimé avec succès");
      await fetchEncadreurs();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression de l'encadreur");
    }
  };

  // Activer/Désactiver un encadreur
  const handleToggleStatus = async (documentId, currentStatus) => {
    try {
      if (currentStatus === "ACTIF") {
        await axios.put(`${API_BASE_URL}/encadreurs/${documentId}/desactiver`);
        toast.success("Encadreur désactivé avec succès");
      } else {
        await axios.put(`${API_BASE_URL}/encadreurs/${documentId}/activer`);
        toast.success("Encadreur activé avec succès");
      }
      await fetchEncadreurs();
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

  // Obtenir le nom du supérieur
  const getSuperieurNom = (superieurDocumentId) => {
    if (!superieurDocumentId || superieurDocumentId === "aucun") return "Non assigné";
    const superieur = superieurs.find(s => s.documentId === superieurDocumentId);
    return superieur ? `${superieur.prenom} ${superieur.nom}` : "Supérieur inconnu";
  };

  // Liste unique des départements
  const departements = [...new Set(encadreurs.map(e => e.departement).filter(Boolean))];
  const superieursList = [...new Set(encadreurs.map(e => e.superieurHierarchiqueDocumentId).filter(Boolean))];

  const encadreursFiltres = encadreurs.filter(encadreur => {
    const correspondRecherche = 
      encadreur.nom?.toLowerCase().includes(recherche.toLowerCase()) ||
      encadreur.prenom?.toLowerCase().includes(recherche.toLowerCase()) ||
      encadreur.email?.toLowerCase().includes(recherche.toLowerCase()) ||
      encadreur.departement?.toLowerCase().includes(recherche.toLowerCase()) ||
      encadreur.specialite?.toLowerCase().includes(recherche.toLowerCase()) ||
      encadreur.cin?.toLowerCase().includes(recherche.toLowerCase());
    
    const correspondStatut = filtreStatut === "tous" || encadreur.statut === filtreStatut;
    const correspondDepartement = filtreDepartement === "tous" || encadreur.departement === filtreDepartement;
    const correspondSuperieur = filtreSuperieur === "tous" || 
      (filtreSuperieur === "non_assigné" ? !encadreur.superieurHierarchiqueDocumentId : encadreur.superieurHierarchiqueDocumentId === filtreSuperieur);
    
    return correspondRecherche && correspondStatut && correspondDepartement && correspondSuperieur;
  });

  const stats = {
    total: encadreurs.length,
    actifs: encadreurs.filter(e => e.statut === 'ACTIF').length,
    inactifs: encadreurs.filter(e => e.statut === 'INACTIF').length,
    sansSuperieur: encadreurs.filter(e => !e.superieurHierarchiqueDocumentId).length
  };

  const handleViewDetails = (encadreur) => {
    console.log('Voir détails:', encadreur);
    // Navigation vers les détails de l'encadreur
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
          <p className="mt-4 text-gray-600">Chargement des encadreurs...</p>
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
              Gestion des Encadreurs
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Administration et liaison des encadreurs avec les supérieurs
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
                  Nouvel Encadreur
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-gray-900 dark:text-white">
                    {selectedEncadreur ? "Modifier l'Encadreur" : "Créer un Nouvel Encadreur"}
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 dark:text-gray-400">
                    {selectedEncadreur 
                      ? "Modifiez les informations de l'encadreur et son supérieur hiérarchique."
                      : "Ajoutez un nouvel encadreur au système et assignez-le à un supérieur."
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
                      <Label htmlFor="fonction" className="text-gray-700 dark:text-gray-300">Fonction *</Label>
                      <Input
                        id="fonction"
                        value={formData.fonction}
                        onChange={(e) => setFormData(prev => ({ ...prev, fonction: e.target.value }))}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="departement" className="text-gray-700 dark:text-gray-300">Département</Label>
                      <Input
                        id="departement"
                        value={formData.departement}
                        onChange={(e) => setFormData(prev => ({ ...prev, departement: e.target.value }))}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialite" className="text-gray-700 dark:text-gray-300">Spécialité</Label>
                      <Input
                        id="specialite"
                        value={formData.specialite}
                        onChange={(e) => setFormData(prev => ({ ...prev, specialite: e.target.value }))}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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
                    <div className="space-y-2">
                      <Label htmlFor="superieurHierarchiqueDocumentId" className="text-gray-700 dark:text-gray-300">Supérieur Hiérarchique</Label>
                      <Select 
                        value={formData.superieurHierarchiqueDocumentId} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, superieurHierarchiqueDocumentId: value }))}
                      >
                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                          <SelectValue placeholder="Sélectionner un supérieur" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                          <SelectItem value="aucun" className="text-gray-900 dark:text-white">Aucun supérieur</SelectItem>
                          {superieurs.map(superieur => (
                            <SelectItem key={superieur.documentId} value={superieur.documentId} className="text-gray-900 dark:text-white">
                              {superieur.prenom} {superieur.nom} - {superieur.departement}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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
                    onClick={handleSaveEncadreur}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {selectedEncadreur ? "Modifier" : "Créer"}
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
            title: "Total Encadreurs",
            icon: <Users className="h-6 w-6 text-blue-600" />,
            count: stats.total,
            text: "Dans le système",
            gradient: "from-blue-500 to-blue-600"
          },
          {
            title: "Encadreurs Actifs",
            icon: <UserCheck className="h-6 w-6 text-emerald-600" />,
            count: stats.actifs,
            text: "Actuellement actifs",
            gradient: "from-emerald-500 to-emerald-600"
          },
          {
            title: "Encadreurs Inactifs",
            icon: <UserX className="h-6 w-6 text-red-600" />,
            count: stats.inactifs,
            text: "Actuellement inactifs",
            gradient: "from-red-500 to-red-600"
          },
          {
            title: "Sans Supérieur",
            icon: <UserCog className="h-6 w-6 text-amber-600" />,
            count: stats.sansSuperieur,
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
                    placeholder="Rechercher un encadreur..."
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

                  <Select value={filtreDepartement} onValueChange={setFiltreDepartement}>
                    <SelectTrigger className="w-[160px] bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="Département" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous départements</SelectItem>
                      {departements.map(dept => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filtreSuperieur} onValueChange={setFiltreSuperieur}>
                    <SelectTrigger className="w-[180px] bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="Supérieur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les supérieurs</SelectItem>
                      {superieursList.map(superieurId => {
                        const superieur = superieurs.find(s => s.documentId === superieurId);
                        return superieur ? (
                          <SelectItem key={superieurId} value={superieurId}>
                            {superieur.prenom} {superieur.nom}
                          </SelectItem>
                        ) : null;
                      }).filter(Boolean)}
                      <SelectItem value="non_assigné">Non assigné</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                {encadreursFiltres.length} encadreur(s) trouvé(s)
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tableau des encadreurs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle>Liste des Encadreurs</CardTitle>
            <CardDescription>
              Gestion complète des encadreurs et leur liaison avec les supérieurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Encadreur</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Département & Spécialité</TableHead>
                  <TableHead>Supérieur</TableHead>
                  <TableHead>CIN</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {encadreursFiltres.map((encadreur) => (
                  <TableRow key={encadreur.documentId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={encadreur.photoUrl} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {encadreur.prenom?.[0]}{encadreur.nom?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {encadreur.prenom} {encadreur.nom}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {encadreur.fonction}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3" />
                          {encadreur.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Phone className="h-3 w-3" />
                          {encadreur.telephone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{encadreur.departement}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {encadreur.specialite}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {encadreur.superieurHierarchiqueDocumentId ? (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Link className="h-3 w-3" />
                            {getSuperieurNom(encadreur.superieurHierarchiqueDocumentId)}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-600 border-amber-300">
                            Non assigné
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-sm">{encadreur.cin}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatutColor(encadreur.statut)}>
                        {getStatutLabel(encadreur.statut)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(encadreur.documentId, encadreur.statut)}
                          title={encadreur.statut === "ACTIF" ? "Désactiver" : "Activer"}
                        >
                          {encadreur.statut === "ACTIF" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(encadreur)}
                          title="Modifier"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(encadreur)}
                          title="Voir détails"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEncadreur(encadreur.documentId)}
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
            {encadreursFiltres.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  Aucun encadreur trouvé
                </h3>
                <p className="text-gray-400 dark:text-gray-500">
                  Aucun encadreur ne correspond à vos critères de recherche.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}