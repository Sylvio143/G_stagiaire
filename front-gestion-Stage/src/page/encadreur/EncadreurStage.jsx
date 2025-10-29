import { useState } from "react";
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
  TrendingUp
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

// Données de démonstration pour les stages
const stagesData = [
  {
    id: 1,
    titre: "Stage Développement Fullstack",
    entreprise: "TechCorp Solutions",
    type: "Stage de fin d'études",
    duree: "6 mois",
    dateDebut: "2024-09-01",
    dateFin: "2025-02-28",
    ville: "Paris",
    statut: "Actif",
    places: 3,
    placesRestantes: 1,
    competences: ["React", "Node.js", "MongoDB", "TypeScript"],
    description: "Stage passionnant dans le développement d'applications web modernes avec les dernières technologies."
  },
  {
    id: 2,
    titre: "Stage Design UX/UI",
    entreprise: "CreativeLab Studio",
    type: "Stage professionnel",
    duree: "4 mois",
    dateDebut: "2024-10-15",
    dateFin: "2025-02-15",
    ville: "Lyon",
    statut: "Actif",
    places: 2,
    placesRestantes: 2,
    competences: ["Figma", "Prototypage", "Recherche Utilisateur", "Design System"],
    description: "Opportunité unique pour apprendre le design d'expérience utilisateur dans une agence renommée."
  },
  {
    id: 3,
    titre: "Stage Data Science",
    entreprise: "DataInnov Analytics",
    type: "Stage de recherche",
    duree: "5 mois",
    dateDebut: "2024-08-20",
    dateFin: "2025-01-20",
    ville: "Marseille",
    statut: "Terminé",
    places: 1,
    placesRestantes: 0,
    competences: ["Python", "Machine Learning", "Data Visualization", "SQL"],
    description: "Stage axé sur l'analyse de données et le machine learning pour résoudre des problèmes business complexes."
  },
  {
    id: 4,
    titre: "Stage Marketing Digital",
    entreprise: "MarketPro Agency",
    type: "Stage opérationnel",
    duree: "3 mois",
    dateDebut: "2024-11-01",
    dateFin: "2025-01-31",
    ville: "Toulouse",
    statut: "Actif",
    places: 4,
    placesRestantes: 3,
    competences: ["SEO", "Réseaux Sociaux", "Analytics", "Content Marketing"],
    description: "Plongez dans le monde du marketing digital et développez des compétences concrètes en stratégie digitale."
  }
];

export default function EncadreurStage() {
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [recherche, setRecherche] = useState("");
  const [stages, setStages] = useState(stagesData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nouveauStage, setNouveauStage] = useState({
    titre: "",
    entreprise: "",
    type: "",
    duree: "",
    dateDebut: "",
    dateFin: "",
    ville: "",
    places: "",
    competences: "",
    description: ""
  });

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'Actif': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';
      case 'Terminé': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      case 'En attente': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
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
      stage.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      stage.entreprise.toLowerCase().includes(recherche.toLowerCase()) ||
      stage.ville.toLowerCase().includes(recherche.toLowerCase());
    
    const correspondStatut = filtreStatut === "tous" || stage.statut === filtreStatut;
    
    return correspondRecherche && correspondStatut;
  });

  const handleAjouterStage = () => {
    const nouveauStageComplet = {
      id: stages.length + 1,
      ...nouveauStage,
      statut: "Actif",
      placesRestantes: parseInt(nouveauStage.places),
      competences: nouveauStage.competences.split(',').map(s => s.trim())
    };
    
    setStages([nouveauStageComplet, ...stages]);
    setNouveauStage({
      titre: "",
      entreprise: "",
      type: "",
      duree: "",
      dateDebut: "",
      dateFin: "",
      ville: "",
      places: "",
      competences: "",
      description: ""
    });
    setIsDialogOpen(false);
  };

  const handleSupprimerStage = (id) => {
    setStages(stages.filter(stage => stage.id !== id));
  };

  const handleVoirDetails = (stage) => {
    console.log('Voir détails:', stage);
    // Navigation vers la page de détails du stage
  };

  const handleModifier = (stage) => {
    console.log('Modifier:', stage);
    // Logique de modification
  };

  const stats = {
    total: stages.length,
    actifs: stages.filter(s => s.statut === 'Actif').length,
    termines: stages.filter(s => s.statut === 'Terminé').length,
    placesTotal: stages.reduce((acc, stage) => acc + stage.places, 0),
    placesRestantes: stages.reduce((acc, stage) => acc + stage.placesRestantes, 0)
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 80 }}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
      className="min-h-screen p-6 space-y-8 bg-transparent"
    >
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
            Création et gestion des offres de stage
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
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titre">Titre du stage</Label>
                  <Input
                    id="titre"
                    value={nouveauStage.titre}
                    onChange={(e) => setNouveauStage({...nouveauStage, titre: e.target.value})}
                    placeholder="Ex: Stage Développement Web"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entreprise">Entreprise</Label>
                  <Input
                    id="entreprise"
                    value={nouveauStage.entreprise}
                    onChange={(e) => setNouveauStage({...nouveauStage, entreprise: e.target.value})}
                    placeholder="Nom de l'entreprise"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type de stage</Label>
                  <Select value={nouveauStage.type} onValueChange={(value) => setNouveauStage({...nouveauStage, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Stage de fin d'études">Stage de fin d'études</SelectItem>
                      <SelectItem value="Stage professionnel">Stage professionnel</SelectItem>
                      <SelectItem value="Stage de recherche">Stage de recherche</SelectItem>
                      <SelectItem value="Stage opérationnel">Stage opérationnel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duree">Durée</Label>
                  <Input
                    id="duree"
                    value={nouveauStage.duree}
                    onChange={(e) => setNouveauStage({...nouveauStage, duree: e.target.value})}
                    placeholder="Ex: 6 mois"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateDebut">Date de début</Label>
                  <Input
                    id="dateDebut"
                    type="date"
                    value={nouveauStage.dateDebut}
                    onChange={(e) => setNouveauStage({...nouveauStage, dateDebut: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFin">Date de fin</Label>
                  <Input
                    id="dateFin"
                    type="date"
                    value={nouveauStage.dateFin}
                    onChange={(e) => setNouveauStage({...nouveauStage, dateFin: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ville">Ville</Label>
                  <Input
                    id="ville"
                    value={nouveauStage.ville}
                    onChange={(e) => setNouveauStage({...nouveauStage, ville: e.target.value})}
                    placeholder="Ville du stage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="places">Nombre de places</Label>
                  <Input
                    id="places"
                    type="number"
                    value={nouveauStage.places}
                    onChange={(e) => setNouveauStage({...nouveauStage, places: e.target.value})}
                    placeholder="Nombre de stagiaires"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="competences">Compétences requises</Label>
                <Input
                  id="competences"
                  value={nouveauStage.competences}
                  onChange={(e) => setNouveauStage({...nouveauStage, competences: e.target.value})}
                  placeholder="Ex: React, Node.js, MongoDB (séparées par des virgules)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={nouveauStage.description}
                  onChange={(e) => setNouveauStage({...nouveauStage, description: e.target.value})}
                  placeholder="Description détaillée du stage..."
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
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
            title: "Stages Actifs",
            icon: (
              <motion.div
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Target className="h-6 w-6 text-emerald-600" />
              </motion.div>
            ),
            count: stats.actifs,
            text: "En cours de recrutement",
            gradient: "from-emerald-500 to-emerald-600"
          },
          {
            title: "Places Total",
            icon: (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Users className="h-6 w-6 text-purple-600" />
              </motion.div>
            ),
            count: stats.placesTotal,
            text: "Places disponibles",
            gradient: "from-purple-500 to-purple-600"
          },
          {
            title: "Places Restantes",
            icon: (
              <motion.div
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </motion.div>
            ),
            count: stats.placesRestantes,
            text: "Encore disponibles",
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
                    <SelectItem value="Actif">Actifs</SelectItem>
                    <SelectItem value="Terminé">Terminés</SelectItem>
                    <SelectItem value="En attente">En attente</SelectItem>
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
              key={stage.id}
              variants={cardVariants}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden h-full">
                <div className="p-6">
                  {/* En-tête avec statut et type */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`text-xs ${getStatutColor(stage.statut)}`}>
                          {stage.statut}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getTypeColor(stage.type)}`}>
                          {stage.type}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                        {stage.titre}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Building className="h-4 w-4" />
                        <span className="font-medium">{stage.entreprise}</span>
                      </div>
                    </div>
                  </div>

                  {/* Informations principales */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>{stage.duree}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(stage.dateDebut).toLocaleDateString()} - {new Date(stage.dateFin).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span>{stage.ville}</span>
                    </div>

                    {/* Places disponibles */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Places disponibles
                      </span>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {stage.placesRestantes} / {stage.places}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          stagiaires
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compétences */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Compétences requises</div>
                    <div className="flex flex-wrap gap-1">
                      {stage.competences.map((competence, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                          {competence}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Description</div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                      {stage.description}
                    </p>
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
                      Voir
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-gray-300 dark:border-gray-600"
                      onClick={() => handleModifier(stage)}
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-red-300 dark:border-red-600 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      onClick={() => handleSupprimerStage(stage.id)}
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Message si aucun résultat */}
      {stagesFiltres.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">
            Aucun stage trouvé
          </h3>
          <p className="text-gray-400 dark:text-gray-500 mb-4">
            Aucun stage ne correspond à vos critères de recherche.
          </p>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="h-4 w-4" />
            Créer le premier stage
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}