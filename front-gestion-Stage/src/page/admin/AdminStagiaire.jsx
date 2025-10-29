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
  GraduationCap,
  Link,
  Briefcase,
  Target
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
const stagiairesData = [
  {
    id: 1,
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@email.com",
    telephone: "+33 6 12 34 56 78",
    formation: "Développement Web Fullstack",
    entreprise: "TechCorp Solutions",
    dateDebut: "2024-09-01",
    dateFin: "2025-02-28",
    statut: "Actif",
    progression: 75,
    ville: "Paris",
    encadreurId: 1,
    encadreurNom: "Thomas Leroy",
    specialite: "React, Node.js, MongoDB",
    note: 16,
    dernierRapport: "2024-12-01",
    universite: "Université Paris-Saclay"
  },
  {
    id: 2,
    nom: "Martin",
    prenom: "Marie",
    email: "marie.martin@email.com",
    telephone: "+33 6 23 45 67 89",
    formation: "Design UX/UI Avancé",
    entreprise: "CreativeLab Studio",
    dateDebut: "2024-10-15",
    dateFin: "2025-03-15",
    statut: "Actif",
    progression: 60,
    ville: "Lyon",
    encadreurId: 2,
    encadreurNom: "Lucas Garcia",
    specialite: "Figma, Prototypage, Recherche Utilisateur",
    note: 14,
    dernierRapport: "2024-11-28",
    universite: "Université Lyon 2"
  },
  {
    id: 3,
    nom: "Bernard",
    prenom: "Pierre",
    email: "pierre.bernard@email.com",
    telephone: "+33 6 34 56 78 90",
    formation: "Data Science & Machine Learning",
    entreprise: "DataInnov Analytics",
    dateDebut: "2024-08-20",
    dateFin: "2025-01-20",
    statut: "En pause",
    progression: 90,
    ville: "Marseille",
    encadreurId: 3,
    encadreurNom: "Emma Roux",
    specialite: "Python, Pandas, Scikit-learn",
    note: 18,
    dernierRapport: "2024-11-25",
    universite: "Aix-Marseille Université"
  },
  {
    id: 4,
    nom: "Petit",
    prenom: "Sophie",
    email: "sophie.petit@email.com",
    telephone: "+33 6 45 67 89 01",
    formation: "Marketing Digital & Growth",
    entreprise: "MarketPro Agency",
    dateDebut: "2024-11-01",
    dateFin: "2025-04-01",
    statut: "Actif",
    progression: 40,
    ville: "Toulouse",
    encadreurId: 4,
    encadreurNom: "Sophie Petit",
    specialite: "SEO, Analytics, Campagnes Social Media",
    note: 15,
    dernierRapport: "2024-11-30",
    universite: "Université Toulouse 1 Capitole"
  },
  {
    id: 5,
    nom: "Leroy",
    prenom: "Thomas",
    email: "thomas.leroy@email.com",
    telephone: "+33 6 56 78 90 12",
    formation: "Cybersécurité Offensive",
    entreprise: "SecureIT Systems",
    dateDebut: "2024-07-10",
    dateFin: "2024-12-10",
    statut: "Terminé",
    progression: 100,
    ville: "Lille",
    encadreurId: 1,
    encadreurNom: "Thomas Leroy",
    specialite: "Pentesting, Sécurité Réseau, Cryptographie",
    note: 17,
    dernierRapport: "2024-12-05",
    universite: "Université de Lille"
  }
];

const encadreursData = [
  { id: 1, nom: "Leroy", prenom: "Thomas", departement: "Cybersécurité" },
  { id: 2, nom: "Garcia", prenom: "Lucas", departement: "Mobile Development" },
  { id: 3, nom: "Roux", prenom: "Emma", departement: "Data Science" },
  { id: 4, nom: "Petit", prenom: "Sophie", departement: "Marketing Digital" },
  { id: 5, nom: "Blanc", prenom: "Nicolas", departement: "Design UX/UI" }
];

export default function AdminStagiaire() {
  const [stagiaires, setStagiaires] = useState(stagiairesData);
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [filtreFormation, setFiltreFormation] = useState("tous");
  const [filtreEncadreur, setFiltreEncadreur] = useState("tous");
  const [recherche, setRecherche] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStagiaire, setSelectedStagiaire] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    formation: "",
    entreprise: "",
    universite: "",
    dateDebut: "",
    dateFin: "",
    ville: "",
    statut: "Actif",
    encadreurId: "",
    specialite: "",
    note: "",
    progression: ""
  });

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      formation: "",
      entreprise: "",
      universite: "",
      dateDebut: "",
      dateFin: "",
      ville: "",
      statut: "Actif",
      encadreurId: "",
      specialite: "",
      note: "",
      progression: ""
    });
    setSelectedStagiaire(null);
  };

  // Ouvrir le dialogue pour créer/modifier
  const handleOpenDialog = (stagiaire = null) => {
    if (stagiaire) {
      setSelectedStagiaire(stagiaire);
      setFormData({
        nom: stagiaire.nom,
        prenom: stagiaire.prenom,
        email: stagiaire.email,
        telephone: stagiaire.telephone,
        formation: stagiaire.formation,
        entreprise: stagiaire.entreprise,
        universite: stagiaire.universite,
        dateDebut: stagiaire.dateDebut,
        dateFin: stagiaire.dateFin,
        ville: stagiaire.ville,
        statut: stagiaire.statut,
        encadreurId: stagiaire.encadreurId?.toString() || "",
        specialite: stagiaire.specialite,
        note: stagiaire.note?.toString() || "",
        progression: stagiaire.progression?.toString() || ""
      });
    } else {
      resetForm();
    }
    setOpenDialog(true);
  };

  // Sauvegarder le stagiaire
  const handleSaveStagiaire = () => {
    const selectedEncadreur = encadreursData.find(e => e.id.toString() === formData.encadreurId);
    
    if (selectedStagiaire) {
      // Modification
      setStagiaires(prev => prev.map(s => 
        s.id === selectedStagiaire.id 
          ? { 
              ...s, 
              ...formData,
              encadreurId: formData.encadreurId ? parseInt(formData.encadreurId) : null,
              encadreurNom: selectedEncadreur ? `${selectedEncadreur.prenom} ${selectedEncadreur.nom}` : "Non assigné",
              note: formData.note ? parseFloat(formData.note) : null,
              progression: formData.progression ? parseInt(formData.progression) : 0
            }
          : s
      ));
    } else {
      // Création
      const newStagiaire = {
        ...formData,
        id: Math.max(...stagiaires.map(s => s.id)) + 1,
        encadreurId: formData.encadreurId ? parseInt(formData.encadreurId) : null,
        encadreurNom: selectedEncadreur ? `${selectedEncadreur.prenom} ${selectedEncadreur.nom}` : "Non assigné",
        note: formData.note ? parseFloat(formData.note) : null,
        progression: formData.progression ? parseInt(formData.progression) : 0,
        dernierRapport: new Date().toISOString().split('T')[0]
      };
      setStagiaires(prev => [...prev, newStagiaire]);
    }
    setOpenDialog(false);
    resetForm();
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'Actif': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';
      case 'En pause': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800';
      case 'Terminé': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      case 'Abandonné': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getNoteColor = (note) => {
    if (note >= 16) return 'bg-emerald-100 text-emerald-700';
    if (note >= 14) return 'bg-blue-100 text-blue-700';
    if (note >= 12) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  const getProgressionColor = (progression) => {
    if (progression >= 80) return 'bg-emerald-500';
    if (progression >= 60) return 'bg-blue-500';
    if (progression >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Listes uniques pour les filtres
  const formations = [...new Set(stagiaires.map(s => s.formation))];
  const encadreursList = [...new Set(stagiaires.map(s => s.encadreurNom).filter(Boolean))];

  const stagiairesFiltres = stagiaires.filter(stagiaire => {
    const correspondRecherche = 
      stagiaire.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      stagiaire.prenom.toLowerCase().includes(recherche.toLowerCase()) ||
      stagiaire.email.toLowerCase().includes(recherche.toLowerCase()) ||
      stagiaire.formation.toLowerCase().includes(recherche.toLowerCase()) ||
      stagiaire.entreprise.toLowerCase().includes(recherche.toLowerCase());
    
    const correspondStatut = filtreStatut === "tous" || stagiaire.statut === filtreStatut;
    const correspondFormation = filtreFormation === "tous" || stagiaire.formation === filtreFormation;
    const correspondEncadreur = filtreEncadreur === "tous" || stagiaire.encadreurNom === filtreEncadreur;
    
    return correspondRecherche && correspondStatut && correspondFormation && correspondEncadreur;
  });

  const stats = {
    total: stagiaires.length,
    actifs: stagiaires.filter(s => s.statut === 'Actif').length,
    termines: stagiaires.filter(s => s.statut === 'Terminé').length,
    enPause: stagiaires.filter(s => s.statut === 'En pause').length,
    moyenneNotes: Math.round(stagiaires.reduce((acc, s) => acc + (s.note || 0), 0) / stagiaires.filter(s => s.note).length),
    sansEncadreur: stagiaires.filter(s => !s.encadreurId).length
  };

  const handleViewDetails = (stagiaire) => {
    console.log('Voir détails:', stagiaire);
    // Navigation vers les détails du stagiaire
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="universite" className="text-gray-700 dark:text-gray-300">Université</Label>
                      <Input
                        id="universite"
                        value={formData.universite}
                        onChange={(e) => setFormData(prev => ({ ...prev, universite: e.target.value }))}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateDebut" className="text-gray-700 dark:text-gray-300">Date de début</Label>
                      <Input
                        id="dateDebut"
                        type="date"
                        value={formData.dateDebut}
                        onChange={(e) => setFormData(prev => ({ ...prev, dateDebut: e.target.value }))}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateFin" className="text-gray-700 dark:text-gray-300">Date de fin</Label>
                      <Input
                        id="dateFin"
                        type="date"
                        value={formData.dateFin}
                        onChange={(e) => setFormData(prev => ({ ...prev, dateFin: e.target.value }))}
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
                          <SelectItem value="En pause" className="text-gray-900 dark:text-white">En pause</SelectItem>
                          <SelectItem value="Terminé" className="text-gray-900 dark:text-white">Terminé</SelectItem>
                          <SelectItem value="Abandonné" className="text-gray-900 dark:text-white">Abandonné</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="encadreurId" className="text-gray-700 dark:text-gray-300">Encadreur Assigné</Label>
                      <Select value={formData.encadreurId} onValueChange={(value) => setFormData(prev => ({ ...prev, encadreurId: value }))}>
                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                          <SelectValue placeholder="Sélectionner un encadreur" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                          <SelectItem value="aucun" className="text-gray-900 dark:text-white">Aucun encadreur</SelectItem>
                          {encadreursData.map(encadreur => (
                            <SelectItem key={encadreur.id} value={encadreur.id.toString()} className="text-gray-900 dark:text-white">
                              {encadreur.prenom} {encadreur.nom} - {encadreur.departement}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="specialite" className="text-gray-700 dark:text-gray-300">Spécialité</Label>
                      <Input
                        id="specialite"
                        value={formData.specialite}
                        onChange={(e) => setFormData(prev => ({ ...prev, specialite: e.target.value }))}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="note" className="text-gray-700 dark:text-gray-300">Note (/20)</Label>
                      <Input
                        id="note"
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={formData.note}
                        onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="progression" className="text-gray-700 dark:text-gray-300">Progression (%)</Label>
                    <Input
                      id="progression"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.progression}
                      onChange={(e) => setFormData(prev => ({ ...prev, progression: e.target.value }))}
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
            text: "En cours de formation",
            gradient: "from-emerald-500 to-emerald-600"
          },
          {
            title: "Moyenne des Notes",
            icon: <GraduationCap className="h-6 w-6 text-purple-600" />,
            count: `${stats.moyenneNotes}/20`,
            text: "Performance moyenne",
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
                      <SelectItem value="Actif">Actifs</SelectItem>
                      <SelectItem value="En pause">En pause</SelectItem>
                      <SelectItem value="Terminé">Terminés</SelectItem>
                      <SelectItem value="Abandonné">Abandonnés</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filtreFormation} onValueChange={setFiltreFormation}>
                    <SelectTrigger className="w-[160px] bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="Formation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Toutes formations</SelectItem>
                      {formations.map(formation => (
                        <SelectItem key={formation} value={formation}>
                          {formation}
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
                      {encadreursList.map(encadreur => (
                        <SelectItem key={encadreur} value={encadreur}>
                          {encadreur}
                        </SelectItem>
                      ))}
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
                  <TableHead>Formation & Entreprise</TableHead>
                  <TableHead>Encadreur</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Progression</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stagiairesFiltres.map((stagiaire) => (
                  <TableRow key={stagiaire.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {stagiaire.prenom[0]}{stagiaire.nom[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {stagiaire.prenom} {stagiaire.nom}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {stagiaire.ville}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{stagiaire.formation}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {stagiaire.entreprise}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {stagiaire.universite}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {stagiaire.encadreurNom ? (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Link className="h-3 w-3" />
                            {stagiaire.encadreurNom}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-600 border-amber-300">
                            Non assigné
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {new Date(stagiaire.dateDebut).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(stagiaire.dateFin).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getProgressionColor(stagiaire.progression)}`}
                            style={{ width: `${stagiaire.progression}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{stagiaire.progression}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {stagiaire.note ? (
                        <Badge className={getNoteColor(stagiaire.note)}>
                          {stagiaire.note}/20
                        </Badge>
                      ) : (
                        <Badge variant="outline">Non noté</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatutColor(stagiaire.statut)}>
                        {stagiaire.statut}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(stagiaire)}
                          title="Modifier et changer d'encadreur"
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