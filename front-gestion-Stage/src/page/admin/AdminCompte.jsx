import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Search, 
  Edit2,
  Eye,
  Mail,
  Phone,
  Calendar,
  UserCheck,
  Download,
  Shield,
  UserCog,
  Briefcase,
  GraduationCap,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Trash2
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

export default function AdminCompte() {
  const [comptes, setComptes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtreRole, setFiltreRole] = useState("tous");
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [recherche, setRecherche] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCompte, setSelectedCompte] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    typeCompte: "",
    statut: "ACTIF",
    entityDocumentId: "",
    entityType: ""
  });
  // Ajoutez après vos autres useState
const [pageActuelle, setPageActuelle] = useState(1);
const [elementsParPage, setElementsParPage] = useState(10);
  // Configuration Axios
  const API_BASE_URL = "http://localhost:9090/api";

  // Charger les comptes depuis l'API
  const fetchComptes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/comptes-utilisateurs/tous`);
      setComptes(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des comptes:", error);
      toast.error("Erreur lors du chargement des comptes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComptes();
  }, []);

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      email: "",
      typeCompte: "",
      statut: "ACTIF",
      entityDocumentId: "",
      entityType: ""
    });
    setSelectedCompte(null);
  };

  // Ouvrir le dialogue pour modifier
  const handleOpenDialog = (compte) => {
    setSelectedCompte(compte);
    setFormData({
      email: compte.email || "",
      typeCompte: compte.typeCompte || "",
      statut: compte.statut || "ACTIF",
      entityDocumentId: compte.entityDocumentId || "",
      entityType: compte.entityType || ""
    });
    setOpenDialog(true);
  };

  // Sauvegarder le compte
  const handleSaveCompte = async () => {
    try {
      if (!formData.email || !formData.typeCompte) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }

      if (selectedCompte) {
        // Modification
        await axios.put(`${API_BASE_URL}/comptes-utilisateurs/${selectedCompte.documentId}`, formData);
        toast.success("Compte modifié avec succès");
      } else {
        // Création (non implémentée dans cette vue)
        toast.error("La création de compte se fait via les entités spécifiques");
        return;
      }
      
      await fetchComptes();
      setOpenDialog(false);
      resetForm();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error("Erreur lors de la sauvegarde du compte");
    }
  };

  // Activer/Désactiver un compte
  const handleToggleStatus = async (documentId, currentStatus) => {
    try {
      if (currentStatus === "ACTIF") {
        await axios.put(`${API_BASE_URL}/comptes-utilisateurs/${documentId}/desactiver`);
        toast.success("Compte désactivé avec succès");
      } else {
        await axios.put(`${API_BASE_URL}/comptes-utilisateurs/${documentId}/activer`);
        toast.success("Compte activé avec succès");
      }
      await fetchComptes();
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      toast.error("Erreur lors du changement de statut");
    }
  };

  // Supprimer un compte
  const handleDeleteCompte = async (documentId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce compte ?")) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/comptes-utilisateurs/${documentId}`);
      toast.success("Compte supprimé avec succès");
      await fetchComptes();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression du compte");
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'SUPERIEUR_HIERARCHIQUE': return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800';
      case 'ENCADREUR': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      case 'STAGIAIRE': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';
      case 'ADMIN': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'ACTIF': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300';
      case 'INACTIF': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'SUPERIEUR_HIERARCHIQUE': return <Briefcase className="h-4 w-4" />;
      case 'ENCADREUR': return <UserCog className="h-4 w-4" />;
      case 'STAGIAIRE': return <GraduationCap className="h-4 w-4" />;
      case 'ADMIN': return <Shield className="h-4 w-4" />;
      default: return <UserCheck className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'SUPERIEUR_HIERARCHIQUE': return 'Supérieur';
      case 'ENCADREUR': return 'Encadreur';
      case 'STAGIAIRE': return 'Stagiaire';
      case 'ADMIN': return 'Administrateur';
      default: return role;
    }
  };

  const getStatutLabel = (statut) => {
    switch (statut) {
      case 'ACTIF': return 'Actif';
      case 'INACTIF': return 'Inactif';
      default: return statut;
    }
  };

  // Listes uniques pour les filtres
  const roles = [...new Set(comptes.map(c => c.typeCompte))];
  const statuts = [...new Set(comptes.map(c => c.statut))];

  const comptesFiltres = comptes.filter(compte => {
    const correspondRecherche = 
      compte.email?.toLowerCase().includes(recherche.toLowerCase()) ||
      compte.entityDocumentId?.toLowerCase().includes(recherche.toLowerCase());
    
    const correspondRole = filtreRole === "tous" || compte.typeCompte === filtreRole;
    const correspondStatut = filtreStatut === "tous" || compte.statut === filtreStatut;
    
    return correspondRecherche && correspondRole && correspondStatut;
  });

  const stats = {
    total: comptes.length,
    superieurs: comptes.filter(c => c.typeCompte === 'SUPERIEUR_HIERARCHIQUE').length,
    encadreurs: comptes.filter(c => c.typeCompte === 'ENCADREUR').length,
    stagiaires: comptes.filter(c => c.typeCompte === 'STAGIAIRE').length,
    admins: comptes.filter(c => c.typeCompte === 'ADMIN').length,
    actifs: comptes.filter(c => c.statut === 'ACTIF').length,
    inactifs: comptes.filter(c => c.statut === 'INACTIF').length
  };

  const handleViewDetails = (compte) => {
    console.log('Voir détails:', compte);
    // Navigation vers les détails du compte
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
          <p className="mt-4 text-gray-600">Chargement des comptes...</p>
        </div>
      </div>
    );
  }
  
// Calcul des données paginées
const indexDernierElement = pageActuelle * elementsParPage;
const indexPremierElement = indexDernierElement - elementsParPage;
const comptesPagination = comptesFiltres.slice(indexPremierElement, indexDernierElement);
const totalPages = Math.ceil(comptesFiltres.length / elementsParPage);

// Fonction pour changer de page
const changerPage = (page) => {
  setPageActuelle(page);
};

// Fonction pour le sélecteur d'éléments par page
const handleElementsParPageChange = (value) => {
  setElementsParPage(Number(value));
  setPageActuelle(1); // Retour à la première page
};
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Gestion des Comptes Utilisateurs
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Administration des comptes Superieurs, Encadreurs, Stagiaires et Administrateurs
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
            title: "Total Comptes",
            icon: <Users className="h-6 w-6 text-blue-600" />,
            count: stats.total,
            text: "Comptes créés",
            gradient: "from-blue-500 to-blue-600"
          },
          {
            title: "Superieurs",
            icon: <Briefcase className="h-6 w-6 text-purple-600" />,
            count: stats.superieurs,
            text: "Responsables hiérarchiques",
            gradient: "from-purple-500 to-purple-600"
          },
          {
            title: "Encadreurs",
            icon: <UserCog className="h-6 w-6 text-blue-600" />,
            count: stats.encadreurs,
            text: "Encadrants de stage",
            gradient: "from-blue-500 to-blue-600"
          },
          {
            title: "Comptes Actifs",
            icon: <CheckCircle className="h-6 w-6 text-emerald-600" />,
            count: stats.actifs,
            text: "Actuellement actifs",
            gradient: "from-emerald-500 to-emerald-600"
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
                    placeholder="Rechercher par email ou ID..."
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    className="pl-9 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                  />
                </div>

                {/* Filtres */}
                <div className="flex gap-2">
                  <Select value={filtreRole} onValueChange={setFiltreRole}>
                    <SelectTrigger className="w-[160px] bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="Rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les rôles</SelectItem>
                      {roles.map(role => (
                        <SelectItem key={role} value={role}>
                          {getRoleLabel(role)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filtreStatut} onValueChange={setFiltreStatut}>
                    <SelectTrigger className="w-[140px] bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous statuts</SelectItem>
                      {statuts.map(statut => (
                        <SelectItem key={statut} value={statut}>
                          {getStatutLabel(statut)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
  {comptesFiltres.length} encadreur(s) trouvé(s) • Page {pageActuelle}/{totalPages}
</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tableau des comptes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle>Liste des Comptes Utilisateurs</CardTitle>
            <CardDescription>
              Gestion complète des comptes - Activation, désactivation et modification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Compte</TableHead>
                  <TableHead>Rôle & Entité</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comptesPagination.map((compte) => (
                  <TableRow key={compte.documentId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {compte.email?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {compte.email}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {compte.documentId}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Badge className={getRoleColor(compte.typeCompte)}>
                          <div className="flex items-center gap-1">
                            {getRoleIcon(compte.typeCompte)}
                            {getRoleLabel(compte.typeCompte)}
                          </div>
                        </Badge>
                        {compte.entityDocumentId && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Entité: {compte.entityDocumentId}
                          </div>
                        )}
                        {compte.entityType && (
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            Type: {compte.entityType}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900 dark:text-white">
                          Créé: {compte.createdAt ? new Date(compte.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Modifié: {compte.updatedAt ? new Date(compte.updatedAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <Badge className={getStatutColor(compte.statut)}>
                          {getStatutLabel(compte.statut)}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Button
                            variant={compte.statut === "ACTIF" ? "default" : "outline"}
                            size="sm"
                            className={`h-7 px-2 text-xs ${
                              compte.statut === "ACTIF" 
                                ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                                : "border-gray-300 text-gray-600"
                            }`}
                            onClick={() => handleToggleStatus(compte.documentId, compte.statut)}
                          >
                            {compte.statut === "ACTIF" ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Activé
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Désactivé
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(compte.documentId, compte.statut)}
                          title={compte.statut === "ACTIF" ? "Désactiver" : "Activer"}
                        >
                          {compte.statut === "ACTIF" ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCompte(compte.documentId)}
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
            {/* Pagination - À ajouter après la Table */}
{comptesFiltres.length > 0 && (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 border-t border-gray-200 dark:border-gray-700">
    {/* Sélecteur d'éléments par page */}
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">Afficher</span>
      <Select value={elementsParPage.toString()} onValueChange={handleElementsParPageChange}>
        <SelectTrigger className="w-20 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="4">4</SelectItem>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="50">50</SelectItem>
        </SelectContent>
      </Select>
      <span className="text-sm text-gray-600 dark:text-gray-400">éléments par page</span>
    </div>

    {/* Informations de pagination */}
    <div className="text-sm text-gray-600 dark:text-gray-400">
      Affichage de {indexPremierElement + 1} à {Math.min(indexDernierElement, comptesFiltres.length)} sur {comptesFiltres.length} comptes
    </div>

    {/* Contrôles de pagination */}
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => changerPage(pageActuelle - 1)}
        disabled={pageActuelle === 1}
        className="border-gray-300 dark:border-gray-600"
      >
        Précédent
      </Button>

      {/* Numéros de page */}
      <div className="flex gap-1">
        {[...Array(totalPages)].map((_, index) => {
          const pageNum = index + 1;
          // Afficher seulement les pages proches de la page actuelle
          if (
            pageNum === 1 ||
            pageNum === totalPages ||
            (pageNum >= pageActuelle - 1 && pageNum <= pageActuelle + 1)
          ) {
            return (
              <Button
                key={pageNum}
                variant={pageActuelle === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => changerPage(pageNum)}
                className={`min-w-10 ${
                  pageActuelle === pageNum 
                    ? "bg-blue-600 text-white" 
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {pageNum}
              </Button>
            );
          } else if (
            pageNum === pageActuelle - 2 ||
            pageNum === pageActuelle + 2
          ) {
            return <span key={pageNum} className="px-2 text-gray-500">...</span>;
          }
          return null;
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => changerPage(pageActuelle + 1)}
        disabled={pageActuelle === totalPages}
        className="border-gray-300 dark:border-gray-600"
      >
        Suivant
      </Button>
    </div>
  </div>
)}

            {/* Message si aucun résultat */}
            {comptesFiltres.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  Aucun compte trouvé
                </h3>
                <p className="text-gray-400 dark:text-gray-500">
                  Aucun compte ne correspond à vos critères de recherche.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Dialogue de modification */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              Modifier le Compte Utilisateur
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Modifiez les informations du compte {selectedCompte?.email}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="typeCompte" className="text-gray-700 dark:text-gray-300">Rôle *</Label>
                <Select value={formData.typeCompte} onValueChange={(value) => setFormData(prev => ({ ...prev, typeCompte: value }))}>
                  <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <SelectItem value="ADMIN" className="text-gray-900 dark:text-white">Administrateur</SelectItem>
                    <SelectItem value="SUPERIEUR_HIERARCHIQUE" className="text-gray-900 dark:text-white">Supérieur</SelectItem>
                    <SelectItem value="ENCADREUR" className="text-gray-900 dark:text-white">Encadreur</SelectItem>
                    <SelectItem value="STAGIAIRE" className="text-gray-900 dark:text-white">Stagiaire</SelectItem>
                  </SelectContent>
                </Select>
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
              <Label htmlFor="entityDocumentId" className="text-gray-700 dark:text-gray-300">ID de l'Entité</Label>
              <Input
                id="entityDocumentId"
                value={formData.entityDocumentId}
                onChange={(e) => setFormData(prev => ({ ...prev, entityDocumentId: e.target.value }))}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                placeholder="ID de l'entité associée"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="entityType" className="text-gray-700 dark:text-gray-300">Type d'Entité</Label>
              <Select 
                value={formData.entityType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, entityType: value }))}
              >
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                  <SelectItem value="ADMIN" className="text-gray-900 dark:text-white">Administrateur</SelectItem>
                  <SelectItem value="SUPERIEUR_HIERARCHIQUE" className="text-gray-900 dark:text-white">Supérieur</SelectItem>
                  <SelectItem value="ENCADREUR" className="text-gray-900 dark:text-white">Encadreur</SelectItem>
                  <SelectItem value="STAGIAIRE" className="text-gray-900 dark:text-white">Stagiaire</SelectItem>
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
              onClick={handleSaveCompte}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
    </>
  );
}