import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Edit2,
  Eye,
  Mail,
  Phone,
  Building,
  Calendar,
  MapPin,
  UserCheck,
  Download,
  Briefcase,
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
const encadreursData = [
  {
    id: 1,
    nom: "Leroy",
    prenom: "Thomas",
    email: "thomas.leroy@entreprise.com",
    telephone: "+33 6 55 66 77 88",
    departement: "Cybersécurité",
    specialite: "Pentesting, Sécurité Réseau",
    dateEmbauche: "2018-09-05",
    statut: "Actif",
    ville: "Lille",
    superieurId: 1,
    superieurNom: "Michel Dubois",
    nombreStagiaires: 3,
    performance: 4.7,
    derniereConnexion: "2024-12-10",
    competences: ["Pentesting", "Network Security", "Cryptography"]
  },
  {
    id: 2,
    nom: "Garcia",
    prenom: "Lucas",
    email: "lucas.garcia@entreprise.com",
    telephone: "+33 6 66 77 88 99",
    departement: "Mobile Development",
    specialite: "React Native, Flutter",
    dateEmbauche: "2021-11-12",
    statut: "Actif",
    ville: "Nantes",
    superieurId: 1,
    superieurNom: "Michel Dubois",
    nombreStagiaires: 2,
    performance: 4.3,
    derniereConnexion: "2024-12-09",
    competences: ["React Native", "Flutter", "iOS", "Android"]
  },
  {
    id: 3,
    nom: "Roux",
    prenom: "Emma",
    email: "emma.roux@entreprise.com",
    telephone: "+33 6 77 88 99 00",
    departement: "Data Science",
    specialite: "Python, Machine Learning",
    dateEmbauche: "2020-03-20",
    statut: "Actif",
    ville: "Marseille",
    superieurId: 3,
    superieurNom: "Pierre Bernard",
    nombreStagiaires: 2,
    performance: 4.5,
    derniereConnexion: "2024-12-08",
    competences: ["Python", "Pandas", "Scikit-learn"]
  },
  {
    id: 4,
    nom: "Petit",
    prenom: "Sophie",
    email: "sophie.petit@entreprise.com",
    telephone: "+33 6 88 99 00 11",
    departement: "Marketing Digital",
    specialite: "SEO, Analytics",
    dateEmbauche: "2022-02-15",
    statut: "En congé",
    ville: "Toulouse",
    superieurId: 4,
    superieurNom: "Alice Moreau",
    nombreStagiaires: 1,
    performance: 4.0,
    derniereConnexion: "2024-11-28",
    competences: ["SEO", "Google Analytics", "Social Media"]
  },
  {
    id: 5,
    nom: "Blanc",
    prenom: "Nicolas",
    email: "nicolas.blanc@entreprise.com",
    telephone: "+33 6 99 00 11 22",
    departement: "Design UX/UI",
    specialite: "Figma, Prototypage",
    dateEmbauche: "2021-07-10",
    statut: "Actif",
    ville: "Lyon",
    superieurId: 2,
    superieurNom: "Sophie Martin",
    nombreStagiaires: 2,
    performance: 4.2,
    derniereConnexion: "2024-12-10",
    competences: ["Figma", "Adobe XD", "User Research"]
  }
];

const superieursData = [
  { id: 1, nom: "Dubois", prenom: "Michel", departement: "Développement Web" },
  { id: 2, nom: "Martin", prenom: "Sophie", departement: "Design UX/UI" },
  { id: 3, nom: "Bernard", prenom: "Pierre", departement: "Data Science" },
  { id: 4, nom: "Moreau", prenom: "Alice", departement: "Marketing Digital" }
];

export default function AdminEncadreur() {
  const [encadreurs, setEncadreurs] = useState(encadreursData);
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
    departement: "",
    specialite: "",
    ville: "",
    dateEmbauche: "",
    statut: "Actif",
    superieurId: "",
    notes: ""
  });

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      departement: "",
      specialite: "",
      ville: "",
      dateEmbauche: "",
      statut: "Actif",
      superieurId: "",
      notes: ""
    });
    setSelectedEncadreur(null);
  };

  // Ouvrir le dialogue pour créer/modifier
  const handleOpenDialog = (encadreur = null) => {
    if (encadreur) {
      setSelectedEncadreur(encadreur);
      setFormData({
        nom: encadreur.nom,
        prenom: encadreur.prenom,
        email: encadreur.email,
        telephone: encadreur.telephone,
        departement: encadreur.departement,
        specialite: encadreur.specialite,
        ville: encadreur.ville,
        dateEmbauche: encadreur.dateEmbauche,
        statut: encadreur.statut,
        superieurId: encadreur.superieurId?.toString() || "",
        notes: encadreur.notes || ""
      });
    } else {
      resetForm();
    }
    setOpenDialog(true);
  };

  // Sauvegarder l'encadreur
  const handleSaveEncadreur = () => {
    const selectedSuperieur = superieursData.find(s => s.id.toString() === formData.superieurId);
    
    if (selectedEncadreur) {
      // Modification
      setEncadreurs(prev => prev.map(e => 
        e.id === selectedEncadreur.id 
          ? { 
              ...e, 
              ...formData,
              superieurId: formData.superieurId ? parseInt(formData.superieurId) : null,
              superieurNom: selectedSuperieur ? `${selectedSuperieur.prenom} ${selectedSuperieur.nom}` : "Non assigné"
            }
          : e
      ));
    } else {
      // Création
      const newEncadreur = {
        ...formData,
        id: Math.max(...encadreurs.map(e => e.id)) + 1,
        superieurId: formData.superieurId ? parseInt(formData.superieurId) : null,
        superieurNom: selectedSuperieur ? `${selectedSuperieur.prenom} ${selectedSuperieur.nom}` : "Non assigné",
        nombreStagiaires: 0,
        performance: 4.0,
        derniereConnexion: new Date().toISOString().split('T')[0],
        competences: []
      };
      setEncadreurs(prev => [...prev, newEncadreur]);
    }
    setOpenDialog(false);
    resetForm();
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'Actif': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';
      case 'En congé': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800';
      case 'Inactif': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 4.5) return 'bg-emerald-100 text-emerald-700';
    if (performance >= 4.0) return 'bg-blue-100 text-blue-700';
    if (performance >= 3.5) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  // Listes uniques pour les filtres
  const departements = [...new Set(encadreurs.map(e => e.departement))];
  const superieursList = [...new Set(encadreurs.map(e => e.superieurNom).filter(Boolean))];

  const encadreursFiltres = encadreurs.filter(encadreur => {
    const correspondRecherche = 
      encadreur.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      encadreur.prenom.toLowerCase().includes(recherche.toLowerCase()) ||
      encadreur.email.toLowerCase().includes(recherche.toLowerCase()) ||
      encadreur.departement.toLowerCase().includes(recherche.toLowerCase()) ||
      encadreur.specialite.toLowerCase().includes(recherche.toLowerCase());
    
    const correspondStatut = filtreStatut === "tous" || encadreur.statut === filtreStatut;
    const correspondDepartement = filtreDepartement === "tous" || encadreur.departement === filtreDepartement;
    const correspondSuperieur = filtreSuperieur === "tous" || encadreur.superieurNom === filtreSuperieur;
    
    return correspondRecherche && correspondStatut && correspondDepartement && correspondSuperieur;
  });

  const stats = {
    total: encadreurs.length,
    actifs: encadreurs.filter(e => e.statut === 'Actif').length,
    enConge: encadreurs.filter(e => e.statut === 'En congé').length,
    totalStagiaires: encadreurs.reduce((acc, e) => acc + e.nombreStagiaires, 0),
    moyennePerformance: Math.round(encadreurs.reduce((acc, e) => acc + e.performance, 0) / encadreurs.length * 10) / 10,
    sansSuperieur: encadreurs.filter(e => !e.superieurId).length
  };

  const handleViewDetails = (encadreur) => {
    console.log('Voir détails:', encadreur);
    // Navigation vers les détails de l'encadreur
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
                      <Label htmlFor="ville" className="text-gray-700 dark:text-gray-300">Ville</Label>
                      <Input
                        id="ville"
                        value={formData.ville}
                        onChange={(e) => setFormData(prev => ({ ...prev, ville: e.target.value }))}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateEmbauche" className="text-gray-700 dark:text-gray-300">Date d'embauche</Label>
                      <Input
                        id="dateEmbauche"
                        type="date"
                        value={formData.dateEmbauche}
                        onChange={(e) => setFormData(prev => ({ ...prev, dateEmbauche: e.target.value }))}
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
                          <SelectItem value="Actif" className="text-gray-900 dark:text-white">Actif</SelectItem>
                          <SelectItem value="En congé" className="text-gray-900 dark:text-white">En congé</SelectItem>
                          <SelectItem value="Inactif" className="text-gray-900 dark:text-white">Inactif</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="superieurId" className="text-gray-700 dark:text-gray-300">Supérieur Hiérarchique</Label>
                      <Select value={formData.superieurId} onValueChange={(value) => setFormData(prev => ({ ...prev, superieurId: value }))}>
                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                          <SelectValue placeholder="Sélectionner un supérieur" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                          <SelectItem value="aucun" className="text-gray-900 dark:text-white">Aucun supérieur</SelectItem>
                          {superieursData.map(superieur => (
                            <SelectItem key={superieur.id} value={superieur.id.toString()} className="text-gray-900 dark:text-white">
                              {superieur.prenom} {superieur.nom} - {superieur.departement}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-gray-700 dark:text-gray-300">Notes</Label>
                    <Input
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Notes supplémentaires..."
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
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
            title: "Stagiaires Encadrés",
            icon: <UserCog className="h-6 w-6 text-purple-600" />,
            count: stats.totalStagiaires,
            text: "Total stagiaires supervisés",
            gradient: "from-purple-500 to-purple-600"
          },
          {
            title: "Sans Supérieur",
            icon: <UserCheck className="h-6 w-6 text-amber-600" />,
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
                      <SelectItem value="Actif">Actifs</SelectItem>
                      <SelectItem value="En congé">En congé</SelectItem>
                      <SelectItem value="Inactif">Inactifs</SelectItem>
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
                      {superieursList.map(superieur => (
                        <SelectItem key={superieur} value={superieur}>
                          {superieur}
                        </SelectItem>
                      ))}
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
                  <TableHead>Stagiaires</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {encadreursFiltres.map((encadreur) => (
                  <TableRow key={encadreur.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {encadreur.prenom[0]}{encadreur.nom[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {encadreur.prenom} {encadreur.nom}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {encadreur.ville}
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
                        {encadreur.superieurNom ? (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Link className="h-3 w-3" />
                            {encadreur.superieurNom}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-600 border-amber-300">
                            Non assigné
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {encadreur.nombreStagiaires} stagiaires
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPerformanceColor(encadreur.performance)}>
                        {encadreur.performance}/5
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatutColor(encadreur.statut)}>
                        {encadreur.statut}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(encadreur)}
                          title="Modifier et changer de supérieur"
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