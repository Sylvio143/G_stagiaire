import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Search, 
  Filter,
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
  XCircle
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
const comptesData = [
  {
    id: 1,
    nom: "Dubois",
    prenom: "Michel",
    email: "michel.dubois@entreprise.com",
    telephone: "+33 6 11 22 33 44",
    role: "Superieur",
    dateCreation: "2023-03-15",
    dateDerniereConnexion: "2024-12-10",
    statut: "Actif",
    actif: true,
    departement: "Développement Web",
    ville: "Paris",
    dernierAcces: "Il y a 2 heures",
    permissions: ["Gestion équipe", "Validation rapports", "Supervision"]
  },
  {
    id: 2,
    nom: "Martin",
    prenom: "Sophie",
    email: "sophie.martin@entreprise.com",
    telephone: "+33 6 22 33 44 55",
    role: "Superieur",
    dateCreation: "2023-06-10",
    dateDerniereConnexion: "2024-12-09",
    statut: "Actif",
    actif: true,
    departement: "Design UX/UI",
    ville: "Lyon",
    dernierAcces: "Il y a 5 heures",
    permissions: ["Gestion équipe", "Validation rapports"]
  },
  {
    id: 3,
    nom: "Leroy",
    prenom: "Thomas",
    email: "thomas.leroy@entreprise.com",
    telephone: "+33 6 55 66 77 88",
    role: "Encadreur",
    dateCreation: "2023-09-05",
    dateDerniereConnexion: "2024-12-10",
    statut: "Actif",
    actif: true,
    departement: "Cybersécurité",
    ville: "Lille",
    dernierAcces: "Il y a 30 minutes",
    permissions: ["Encadrement stagiaires", "Évaluation", "Rapports"]
  },
  {
    id: 4,
    nom: "Garcia",
    prenom: "Lucas",
    email: "lucas.garcia@entreprise.com",
    telephone: "+33 6 66 77 88 99",
    role: "Encadreur",
    dateCreation: "2023-11-12",
    dateDerniereConnexion: "2024-12-09",
    statut: "Actif",
    actif: true,
    departement: "Mobile Development",
    ville: "Nantes",
    dernierAcces: "Il y a 1 heure",
    permissions: ["Encadrement stagiaires", "Évaluation"]
  },
  {
    id: 5,
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@email.com",
    telephone: "+33 6 12 34 56 78",
    role: "Stagiaire",
    dateCreation: "2024-08-01",
    dateDerniereConnexion: "2024-12-10",
    statut: "Actif",
    actif: true,
    formation: "Développement Web Fullstack",
    entreprise: "TechCorp Solutions",
    ville: "Paris",
    dernierAcces: "Il y a 15 minutes",
    permissions: ["Consultation", "Soumission rapports"]
  },
  {
    id: 6,
    nom: "Bernard",
    prenom: "Pierre",
    email: "pierre.bernard@email.com",
    telephone: "+33 6 34 56 78 90",
    role: "Stagiaire",
    dateCreation: "2024-07-20",
    dateDerniereConnexion: "2024-11-28",
    statut: "Inactif",
    actif: false,
    formation: "Data Science & Machine Learning",
    entreprise: "DataInnov Analytics",
    ville: "Marseille",
    dernierAcces: "Il y a 2 semaines",
    permissions: ["Consultation", "Soumission rapports"]
  },
  {
    id: 7,
    nom: "Moreau",
    prenom: "Alice",
    email: "alice.moreau@entreprise.com",
    telephone: "+33 6 44 55 66 77",
    role: "Superieur",
    dateCreation: "2023-02-28",
    dateDerniereConnexion: "2024-12-08",
    statut: "Suspendu",
    actif: false,
    departement: "Marketing Digital",
    ville: "Toulouse",
    dernierAcces: "Il y a 3 jours",
    permissions: ["Gestion équipe", "Validation rapports"]
  },
  {
    id: 8,
    nom: "Roux",
    prenom: "Emma",
    email: "emma.roux@entreprise.com",
    telephone: "+33 6 77 88 99 00",
    role: "Encadreur",
    dateCreation: "2023-03-20",
    dateDerniereConnexion: "2024-12-10",
    statut: "Actif",
    actif: true,
    departement: "Data Science",
    ville: "Marseille",
    dernierAcces: "Il y a 45 minutes",
    permissions: ["Encadrement stagiaires", "Évaluation", "Rapports"]
  }
];

export default function AdminCompte() {
  const [comptes, setComptes] = useState(comptesData);
  const [filtreRole, setFiltreRole] = useState("tous");
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [filtreActif, setFiltreActif] = useState("tous");
  const [recherche, setRecherche] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCompte, setSelectedCompte] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    role: "",
    statut: "Actif",
    actif: true,
    departement: "",
    formation: "",
    entreprise: "",
    ville: ""
  });

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      role: "",
      statut: "Actif",
      actif: true,
      departement: "",
      formation: "",
      entreprise: "",
      ville: ""
    });
    setSelectedCompte(null);
  };

  // Ouvrir le dialogue pour modifier
  const handleOpenDialog = (compte) => {
    setSelectedCompte(compte);
    setFormData({
      nom: compte.nom,
      prenom: compte.prenom,
      email: compte.email,
      telephone: compte.telephone,
      role: compte.role,
      statut: compte.statut,
      actif: compte.actif,
      departement: compte.departement || "",
      formation: compte.formation || "",
      entreprise: compte.entreprise || "",
      ville: compte.ville
    });
    setOpenDialog(true);
  };

  // Sauvegarder le compte
  const handleSaveCompte = () => {
    if (selectedCompte) {
      // Modification seulement
      setComptes(prev => prev.map(c => 
        c.id === selectedCompte.id 
          ? { ...c, ...formData }
          : c
      ));
    }
    setOpenDialog(false);
    resetForm();
  };

  // Basculer l'état actif/inactif
  const handleToggleActif = (compteId) => {
    setComptes(prev => prev.map(compte => 
      compte.id === compteId 
        ? { ...compte, actif: !compte.actif, statut: !compte.actif ? "Actif" : "Inactif" }
        : compte
    ));
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Superieur': return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800';
      case 'Encadreur': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      case 'Stagiaire': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'Actif': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300';
      case 'Inactif': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300';
      case 'Suspendu': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Superieur': return <Briefcase className="h-4 w-4" />;
      case 'Encadreur': return <UserCog className="h-4 w-4" />;
      case 'Stagiaire': return <GraduationCap className="h-4 w-4" />;
      default: return <UserCheck className="h-4 w-4" />;
    }
  };

  // Listes uniques pour les filtres
  const roles = [...new Set(comptes.map(c => c.role))];
  const statuts = [...new Set(comptes.map(c => c.statut))];

  const comptesFiltres = comptes.filter(compte => {
    const correspondRecherche = 
      compte.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      compte.prenom.toLowerCase().includes(recherche.toLowerCase()) ||
      compte.email.toLowerCase().includes(recherche.toLowerCase());
    
    const correspondRole = filtreRole === "tous" || compte.role === filtreRole;
    const correspondStatut = filtreStatut === "tous" || compte.statut === filtreStatut;
    const correspondActif = filtreActif === "tous" || 
      (filtreActif === "actif" && compte.actif) || 
      (filtreActif === "inactif" && !compte.actif);
    
    return correspondRecherche && correspondRole && correspondStatut && correspondActif;
  });

  const stats = {
    total: comptes.length,
    superieurs: comptes.filter(c => c.role === 'Superieur').length,
    encadreurs: comptes.filter(c => c.role === 'Encadreur').length,
    stagiaires: comptes.filter(c => c.role === 'Stagiaire').length,
    actifs: comptes.filter(c => c.actif).length,
    inactifs: comptes.filter(c => !c.actif).length
  };

  const handleViewDetails = (compte) => {
    console.log('Voir détails:', compte);
    // Navigation vers les détails du compte
  };

  const handleExport = () => {
    console.log('Exporter la liste');
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
              Gestion des Comptes Utilisateurs
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Consultation et modification des comptes Superieurs, Encadreurs et Stagiaires
            </p>
          </div>
          <Button 
            onClick={handleExport}
            variant="outline"
            className="gap-2 border-gray-300 dark:border-gray-600"
          >
            <Download className="h-4 w-4" />
            Exporter
          </Button>
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
                    placeholder="Rechercher un compte..."
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    className="pl-9 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                  />
                </div>

                {/* Filtres */}
                <div className="flex gap-2">
                  <Select value={filtreRole} onValueChange={setFiltreRole}>
                    <SelectTrigger className="w-[140px] bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="Rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les rôles</SelectItem>
                      {roles.map(role => (
                        <SelectItem key={role} value={role}>
                          {role}
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
                          {statut}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filtreActif} onValueChange={setFiltreActif}>
                    <SelectTrigger className="w-[140px] bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="État" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous états</SelectItem>
                      <SelectItem value="actif">Actifs</SelectItem>
                      <SelectItem value="inactif">Inactifs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                {comptesFiltres.length} compte(s) trouvé(s)
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
              Consultation et gestion des comptes - Modification possible mais pas de suppression
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Rôle & Informations</TableHead>
                  <TableHead>Date Création</TableHead>
                  <TableHead>Dernier Accès</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comptesFiltres.map((compte) => (
                  <TableRow key={compte.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {compte.prenom[0]}{compte.nom[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {compte.prenom} {compte.nom}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getRoleColor(compte.role)}>
                              <div className="flex items-center gap-1">
                                {getRoleIcon(compte.role)}
                                {compte.role}
                              </div>
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3" />
                          {compte.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Phone className="h-3 w-3" />
                          {compte.telephone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {compte.departement && (
                          <div className="text-sm font-medium">{compte.departement}</div>
                        )}
                        {compte.formation && (
                          <div className="text-sm">{compte.formation}</div>
                        )}
                        {compte.entreprise && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {compte.entreprise}
                          </div>
                        )}
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {compte.ville}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {new Date(compte.dateCreation).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(compte.dateCreation).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {new Date(compte.dateDerniereConnexion).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {compte.dernierAcces}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <Badge className={getStatutColor(compte.statut)}>
                          {compte.statut}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Button
                            variant={compte.actif ? "default" : "outline"}
                            size="sm"
                            className={`h-7 px-2 text-xs ${
                              compte.actif 
                                ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                                : "border-gray-300 text-gray-600"
                            }`}
                            onClick={() => handleToggleActif(compte.id)}
                          >
                            {compte.actif ? (
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
                          onClick={() => handleOpenDialog(compte)}
                          title="Modifier le compte"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(compte)}
                          title="Voir détails"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

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
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              Modifier le Compte Utilisateur
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Modifiez les informations du compte {selectedCompte?.prenom} {selectedCompte?.nom}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom" className="text-gray-700 dark:text-gray-300">Prénom</Label>
                <Input
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom" className="text-gray-700 dark:text-gray-300">Nom</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone" className="text-gray-700 dark:text-gray-300">Téléphone</Label>
                <Input
                  id="telephone"
                  value={formData.telephone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-gray-700 dark:text-gray-300">Rôle</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <SelectItem value="Superieur" className="text-gray-900 dark:text-white">Superieur</SelectItem>
                    <SelectItem value="Encadreur" className="text-gray-900 dark:text-white">Encadreur</SelectItem>
                    <SelectItem value="Stagiaire" className="text-gray-900 dark:text-white">Stagiaire</SelectItem>
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
                    <SelectItem value="Actif" className="text-gray-900 dark:text-white">Actif</SelectItem>
                    <SelectItem value="Inactif" className="text-gray-900 dark:text-white">Inactif</SelectItem>
                    <SelectItem value="Suspendu" className="text-gray-900 dark:text-white">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ville" className="text-gray-700 dark:text-gray-300">Ville</Label>
              <Input
                id="ville"
                value={formData.ville}
                onChange={(e) => setFormData(prev => ({ ...prev, ville: e.target.value }))}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>

            {formData.role === 'Superieur' || formData.role === 'Encadreur' ? (
              <div className="space-y-2">
                <Label htmlFor="departement" className="text-gray-700 dark:text-gray-300">Département</Label>
                <Input
                  id="departement"
                  value={formData.departement}
                  onChange={(e) => setFormData(prev => ({ ...prev, departement: e.target.value }))}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
            ) : formData.role === 'Stagiaire' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="formation" className="text-gray-700 dark:text-gray-300">Formation</Label>
                  <Input
                    id="formation"
                    value={formData.formation}
                    onChange={(e) => setFormData(prev => ({ ...prev, formation: e.target.value }))}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entreprise" className="text-gray-700 dark:text-gray-300">Entreprise</Label>
                  <Input
                    id="entreprise"
                    value={formData.entreprise}
                    onChange={(e) => setFormData(prev => ({ ...prev, entreprise: e.target.value }))}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Button
                variant={formData.actif ? "default" : "outline"}
                size="sm"
                onClick={() => setFormData(prev => ({ ...prev, actif: !prev.actif }))}
                className={formData.actif ? "bg-emerald-500 hover:bg-emerald-600" : ""}
              >
                {formData.actif ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Compte activé
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-1" />
                    Compte désactivé
                  </>
                )}
              </Button>
              <Label htmlFor="actif" className="text-gray-700 dark:text-gray-300">
                {formData.actif ? 'Le compte est activé' : 'Le compte est désactivé'}
              </Label>
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
  );
}