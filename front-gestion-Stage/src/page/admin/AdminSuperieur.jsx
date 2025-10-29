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
  Briefcase
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
const superieursData = [
  {
    id: 1,
    nom: "Dubois",
    prenom: "Michel",
    email: "michel.dubois@entreprise.com",
    telephone: "+33 6 11 22 33 44",
    departement: "Développement Web",
    dateEmbauche: "2020-03-15",
    statut: "Actif",
    ville: "Paris",
    encadreursAssocies: 8,
    derniereConnexion: "2024-12-10",
    competences: ["Gestion d'équipe", "Planification", "Évaluation"],
    notes: "Excellent manager, très impliqué"
  },
  {
    id: 2,
    nom: "Martin",
    prenom: "Sophie",
    email: "sophie.martin@entreprise.com",
    telephone: "+33 6 22 33 44 55",
    departement: "Design UX/UI",
    dateEmbauche: "2021-06-10",
    statut: "Actif",
    ville: "Lyon",
    encadreursAssocies: 5,
    derniereConnexion: "2024-12-09",
    competences: ["Creative Thinking", "Team Leadership", "Project Management"],
    notes: "Très bon relationnel avec les équipes"
  },
  {
    id: 3,
    nom: "Bernard",
    prenom: "Pierre",
    email: "pierre.bernard@entreprise.com",
    telephone: "+33 6 33 44 55 66",
    departement: "Data Science",
    dateEmbauche: "2019-01-20",
    statut: "En congé",
    ville: "Marseille",
    encadreursAssocies: 6,
    derniereConnexion: "2024-11-28",
    competences: ["Data Analysis", "Strategic Planning", "Mentoring"],
    notes: "Expert technique, en congé jusqu'au 15/01/2025"
  },
  {
    id: 4,
    nom: "Moreau",
    prenom: "Alice",
    email: "alice.moreau@entreprise.com",
    telephone: "+33 6 44 55 66 77",
    departement: "Marketing Digital",
    dateEmbauche: "2022-02-28",
    statut: "Actif",
    ville: "Toulouse",
    encadreursAssocies: 4,
    derniereConnexion: "2024-12-10",
    competences: ["Digital Strategy", "Campaign Management", "Analytics"],
    notes: "Performance exceptionnelle cette année"
  }
];

export default function AdminSuperieur() {
  const [superieurs, setSuperieurs] = useState(superieursData);
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [filtreDepartement, setFiltreDepartement] = useState("tous");
  const [recherche, setRecherche] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSuperieur, setSelectedSuperieur] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    departement: "",
    ville: "",
    dateEmbauche: "",
    statut: "Actif",
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
      ville: "",
      dateEmbauche: "",
      statut: "Actif",
      notes: ""
    });
    setSelectedSuperieur(null);
  };

  // Ouvrir le dialogue pour créer/modifier
  const handleOpenDialog = (superieur = null) => {
    if (superieur) {
      setSelectedSuperieur(superieur);
      setFormData({
        nom: superieur.nom,
        prenom: superieur.prenom,
        email: superieur.email,
        telephone: superieur.telephone,
        departement: superieur.departement,
        ville: superieur.ville,
        dateEmbauche: superieur.dateEmbauche,
        statut: superieur.statut,
        notes: superieur.notes || ""
      });
    } else {
      resetForm();
    }
    setOpenDialog(true);
  };

  // Sauvegarder le supérieur
  const handleSaveSuperieur = () => {
    if (selectedSuperieur) {
      // Modification
      setSuperieurs(prev => prev.map(s => 
        s.id === selectedSuperieur.id 
          ? { ...s, ...formData, id: s.id }
          : s
      ));
    } else {
      // Création
      const newSuperieur = {
        ...formData,
        id: Math.max(...superieurs.map(s => s.id)) + 1,
        encadreursAssocies: 0,
        derniereConnexion: new Date().toISOString().split('T')[0],
        competences: []
      };
      setSuperieurs(prev => [...prev, newSuperieur]);
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

  // Liste unique des départements
  const departements = [...new Set(superieurs.map(s => s.departement))];

  const superieursFiltres = superieurs.filter(superieur => {
    const correspondRecherche = 
      superieur.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      superieur.prenom.toLowerCase().includes(recherche.toLowerCase()) ||
      superieur.email.toLowerCase().includes(recherche.toLowerCase()) ||
      superieur.departement.toLowerCase().includes(recherche.toLowerCase());
    
    const correspondStatut = filtreStatut === "tous" || superieur.statut === filtreStatut;
    const correspondDepartement = filtreDepartement === "tous" || superieur.departement === filtreDepartement;
    
    return correspondRecherche && correspondStatut && correspondDepartement;
  });

  const stats = {
    total: superieurs.length,
    actifs: superieurs.filter(s => s.statut === 'Actif').length,
    enConge: superieurs.filter(s => s.statut === 'En congé').length,
    totalEncadreurs: superieurs.reduce((acc, s) => acc + s.encadreursAssocies, 0),
    moyenneEncadreurs: Math.round(superieurs.reduce((acc, s) => acc + s.encadreursAssocies, 0) / superieurs.length)
  };

  const handleViewDetails = (superieur) => {
    console.log('Voir détails:', superieur);
    // Navigation vers les détails du supérieur
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
              Gestion des Supérieurs
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Administration et supervision des responsables hiérarchiques
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
                  Nouveau Supérieur
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-gray-900 dark:text-white">
                    {selectedSuperieur ? "Modifier le Supérieur" : "Créer un Nouveau Supérieur"}
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 dark:text-gray-400">
                    {selectedSuperieur 
                      ? "Modifiez les informations du supérieur hiérarchique."
                      : "Ajoutez un nouveau supérieur hiérarchique au système."
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
                      <Label htmlFor="dateEmbauche" className="text-gray-700 dark:text-gray-300">Date d'embauche</Label>
                      <Input
                        id="dateEmbauche"
                        type="date"
                        value={formData.dateEmbauche}
                        onChange={(e) => setFormData(prev => ({ ...prev, dateEmbauche: e.target.value }))}
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
                          <SelectItem value="Actif" className="text-gray-900 dark:text-white">Actif</SelectItem>
                          <SelectItem value="En congé" className="text-gray-900 dark:text-white">En congé</SelectItem>
                          <SelectItem value="Inactif" className="text-gray-900 dark:text-white">Inactif</SelectItem>
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
                    onClick={handleSaveSuperieur}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {selectedSuperieur ? "Modifier" : "Créer"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>

      {/* Le reste du code reste identique... */}
      {/* Statistiques */}
      <motion.div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {[
          {
            title: "Total Supérieurs",
            icon: <Users className="h-6 w-6 text-blue-600" />,
            count: stats.total,
            text: "Dans le système",
            gradient: "from-blue-500 to-blue-600"
          },
          {
            title: "Supérieurs Actifs",
            icon: <UserCheck className="h-6 w-6 text-emerald-600" />,
            count: stats.actifs,
            text: "Actuellement actifs",
            gradient: "from-emerald-500 to-emerald-600"
          },
          {
            title: "Encadreurs Associés",
            icon: <Briefcase className="h-6 w-6 text-purple-600" />,
            count: stats.totalEncadreurs,
            text: "Total encadreurs supervisés",
            gradient: "from-purple-500 to-purple-600"
          },
          {
            title: "Moyenne par Supérieur",
            icon: <UserCheck className="h-6 w-6 text-amber-600" />,
            count: `${stats.moyenneEncadreurs} encadreurs`,
            text: "Par responsable",
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
                    placeholder="Rechercher un supérieur..."
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
                </div>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                {superieursFiltres.length} supérieur(s) trouvé(s)
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tableau des supérieurs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle>Liste des Supérieurs</CardTitle>
            <CardDescription>
              Gestion complète des responsables hiérarchiques
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supérieur</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Encadreurs</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {superieursFiltres.map((superieur) => (
                  <TableRow key={superieur.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {superieur.prenom[0]}{superieur.nom[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {superieur.prenom} {superieur.nom}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {superieur.ville}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3" />
                          {superieur.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Phone className="h-3 w-3" />
                          {superieur.telephone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{superieur.departement}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Depuis {new Date(superieur.dateEmbauche).getFullYear()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {superieur.encadreursAssocies} encadreurs
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatutColor(superieur.statut)}>
                        {superieur.statut}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(superieur.derniereConnexion).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(superieur)}
                          title="Modifier"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(superieur)}
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
            {superieursFiltres.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  Aucun supérieur trouvé
                </h3>
                <p className="text-gray-400 dark:text-gray-500">
                  Aucun supérieur ne correspond à vos critères de recherche.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}