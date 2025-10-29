import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText,
  Download,
  Eye,
  Users,
  Calendar,
  Building,
  MapPin,
  Search,
  Filter,
  GraduationCap,
  UserCheck,
  Clock,
  Star,
  Award,
  BookOpen,
  Plus,
  Edit
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

// Données de démonstration pour les stages terminés
const stagesTerminesData = [
  {
    id: 1,
    titre: "Stage Développement Fullstack",
    entreprise: "TechCorp Solutions",
    type: "Stage de fin d'études",
    duree: "6 mois",
    dateDebut: "2024-03-01",
    dateFin: "2024-08-31",
    ville: "Paris",
    stagiaires: [
      {
        id: 1,
        nom: "Dupont",
        prenom: "Jean",
        email: "jean.dupont@email.com",
        rapport: {
          statut: "Complet",
          dateSoumission: "2024-09-05",
          note: 16,
          commentaire: "Excellent travail, très autonome et force de proposition."
        }
      },
      {
        id: 2,
        nom: "Martin",
        prenom: "Luc",
        email: "luc.martin@email.com",
        rapport: {
          statut: "En attente",
          dateSoumission: null,
          note: null,
          commentaire: null
        }
      }
    ],
    competences: ["React", "Node.js", "MongoDB", "TypeScript", "Docker"],
    description: "Développement d'une application web complète avec architecture microservices."
  },
  {
    id: 2,
    titre: "Stage Data Science",
    entreprise: "DataInnov Analytics",
    type: "Stage de recherche",
    duree: "5 mois",
    dateDebut: "2024-02-15",
    dateFin: "2024-07-15",
    ville: "Lyon",
    stagiaires: [
      {
        id: 3,
        nom: "Bernard",
        prenom: "Pierre",
        email: "pierre.bernard@email.com",
        rapport: {
          statut: "Complet",
          dateSoumission: "2024-07-20",
          note: 18,
          commentaire: "Recherche approfondie, résultats très pertinents pour l'entreprise."
        }
      }
    ],
    competences: ["Python", "Machine Learning", "Data Visualization", "SQL", "Pandas"],
    description: "Analyse prédictive et modélisation machine learning sur des données clients."
  },
  {
    id: 3,
    titre: "Stage Design UX/UI",
    entreprise: "CreativeLab Studio",
    type: "Stage professionnel",
    duree: "4 mois",
    dateDebut: "2024-04-01",
    dateFin: "2024-07-31",
    ville: "Marseille",
    stagiaires: [
      {
        id: 4,
        nom: "Petit",
        prenom: "Sophie",
        email: "sophie.petit@email.com",
        rapport: {
          statut: "Partiel",
          dateSoumission: "2024-08-10",
          note: 14,
          commentaire: "Bon travail créatif, quelques améliorations possibles sur l'ergonomie."
        }
      },
      {
        id: 5,
        nom: "Leroy",
        prenom: "Marie",
        email: "marie.leroy@email.com",
        rapport: {
          statut: "Partiel",
          dateSoumission: "2024-08-12",
          note: 15,
          commentaire: "Excellente approche utilisateur, maîtrise des outils de design."
        }
      }
    ],
    competences: ["Figma", "Prototypage", "Recherche Utilisateur", "Design System"],
    description: "Refonte complète de l'interface utilisateur d'une application mobile."
  },
  {
    id: 4,
    titre: "Stage Cybersécurité",
    entreprise: "SecureIT Systems",
    type: "Stage opérationnel",
    duree: "3 mois",
    dateDebut: "2024-05-01",
    dateFin: "2024-07-31",
    ville: "Toulouse",
    stagiaires: [
      {
        id: 6,
        nom: "Moreau",
        prenom: "Thomas",
        email: "thomas.moreau@email.com",
        rapport: {
          statut: "En attente",
          dateSoumission: null,
          note: null,
          commentaire: null
        }
      }
    ],
    competences: ["Pentesting", "Sécurité Réseau", "Cryptographie", "Audit"],
    description: "Audit de sécurité et tests d'intrusion sur l'infrastructure de l'entreprise."
  }
];

export default function EncadreurRapport() {
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [recherche, setRecherche] = useState("");
  const [stages, setStages] = useState(stagesTerminesData);
  const [selectedStage, setSelectedStage] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [evaluation, setEvaluation] = useState({
    note: "",
    commentaire: "",
    pointsForts: "",
    axesAmelioration: ""
  });

  const getStatutRapportColor = (statut) => {
    switch (statut) {
      case 'Complet': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';
      case 'Partiel': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800';
      case 'En attente': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getNoteColor = (note) => {
    if (!note) return 'bg-gray-100 text-gray-700';
    if (note >= 16) return 'bg-emerald-100 text-emerald-700';
    if (note >= 14) return 'bg-blue-100 text-blue-700';
    if (note >= 12) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  const stagesFiltres = stages.filter(stage => {
    const correspondRecherche = 
      stage.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      stage.entreprise.toLowerCase().includes(recherche.toLowerCase()) ||
      stage.stagiaires.some(s => 
        s.nom.toLowerCase().includes(recherche.toLowerCase()) ||
        s.prenom.toLowerCase().includes(recherche.toLowerCase())
      );
    
    const correspondStatut = filtreStatut === "tous" || 
      stage.stagiaires.some(s => s.rapport.statut === filtreStatut);
    
    return correspondRecherche && correspondStatut;
  });

  const handleGenererRapport = (stage, stagiaire) => {
    setSelectedStage({ stage, stagiaire });
    setEvaluation({
      note: stagiaire.rapport.note || "",
      commentaire: stagiaire.rapport.commentaire || "",
      pointsForts: "",
      axesAmelioration: ""
    });
    setIsDialogOpen(true);
  };

  const handleSoumettreEvaluation = () => {
    if (!selectedStage) return;

    const updatedStages = stages.map(stage => {
      if (stage.id === selectedStage.stage.id) {
        const updatedStagiaires = stage.stagiaires.map(stagiaire => {
          if (stagiaire.id === selectedStage.stagiaire.id) {
            return {
              ...stagiaire,
              rapport: {
                statut: "Complet",
                dateSoumission: new Date().toISOString().split('T')[0],
                note: parseInt(evaluation.note),
                commentaire: evaluation.commentaire
              }
            };
          }
          return stagiaire;
        });
        return { ...stage, stagiaires: updatedStagiaires };
      }
      return stage;
    });

    setStages(updatedStages);
    setIsDialogOpen(false);
    setSelectedStage(null);
  };

  const handleTelechargerRapport = (stage, stagiaire) => {
    console.log('Télécharger rapport pour:', stagiaire.nom, stage.titre);
    // Logique de génération et téléchargement du PDF
  };

  const handleVisualiserRapport = (stage, stagiaire) => {
    console.log('Visualiser rapport pour:', stagiaire.nom, stage.titre);
    // Navigation vers la visualisation du rapport
  };

  const stats = {
    totalStages: stages.length,
    totalStagiaires: stages.reduce((acc, stage) => acc + stage.stagiaires.length, 0),
    rapportsComplets: stages.reduce((acc, stage) => 
      acc + stage.stagiaires.filter(s => s.rapport.statut === "Complet").length, 0
    ),
    rapportsEnAttente: stages.reduce((acc, stage) => 
      acc + stage.stagiaires.filter(s => s.rapport.statut === "En attente").length, 0
    )
  };

  const progressionGenerale = stats.totalStagiaires > 0 
    ? (stats.rapportsComplets / stats.totalStagiaires) * 100 
    : 0;

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
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Rapports de Fin de Stage
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Gestion et génération des rapports d'évaluation pour les stages terminés
        </p>
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
            title: "Stages Terminés",
            icon: (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <BookOpen className="h-6 w-6 text-blue-600" />
              </motion.div>
            ),
            count: stats.totalStages,
            text: "Stages achevés",
            gradient: "from-blue-500 to-blue-600"
          },
          {
            title: "Stagiaires",
            icon: (
              <motion.div
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Users className="h-6 w-6 text-emerald-600" />
              </motion.div>
            ),
            count: stats.totalStagiaires,
            text: "Étudiants à évaluer",
            gradient: "from-emerald-500 to-emerald-600"
          },
          {
            title: "Rapports Complétés",
            icon: (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <FileText className="h-6 w-6 text-purple-600" />
              </motion.div>
            ),
            count: stats.rapportsComplets,
            text: "Évaluations finalisées",
            gradient: "from-purple-500 to-purple-600"
          },
          {
            title: "En Attente",
            icon: (
              <motion.div
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Clock className="h-6 w-6 text-amber-600" />
              </motion.div>
            ),
            count: stats.rapportsEnAttente,
            text: "Rapports à compléter",
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

      {/* Barre de progression générale */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Progression des Rapports</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stats.rapportsComplets} sur {stats.totalStagiaires} rapports complétés
                </p>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {Math.round(progressionGenerale)}%
              </span>
            </div>
            {/* Barre de progression personnalisée */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <motion.div
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressionGenerale}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filtres et Recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
                {/* Barre de recherche */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un stage ou stagiaire..."
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    className="pl-9 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                  />
                </div>

                {/* Filtre par statut */}
                <Select value={filtreStatut} onValueChange={setFiltreStatut}>
                  <SelectTrigger className="w-[180px] bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                    <SelectValue placeholder="Statut rapport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les statuts</SelectItem>
                    <SelectItem value="Complet">Complets</SelectItem>
                    <SelectItem value="Partiel">Partiels</SelectItem>
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

      {/* Liste des stages terminés */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <AnimatePresence>
          {stagesFiltres.map((stage) => (
            <motion.div
              key={stage.id}
              variants={cardVariants}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
                <div className="p-6">
                  {/* En-tête du stage */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                          <Building className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white text-xl">
                            {stage.titre}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {stage.entreprise} • {stage.ville}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(stage.dateDebut).toLocaleDateString()} - {new Date(stage.dateFin).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{stage.duree}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{stage.stagiaires.length} stagiaire(s)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Liste des stagiaires */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      Stagiaires concernés par ce stage
                    </h4>
                    
                    {stage.stagiaires.map((stagiaire) => (
                      <div key={stagiaire.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                              {stagiaire.prenom[0]}{stagiaire.nom[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {stagiaire.prenom} {stagiaire.nom}
                              </span>
                              <Badge className={`text-xs ${getStatutRapportColor(stagiaire.rapport.statut)}`}>
                                {stagiaire.rapport.statut}
                              </Badge>
                              {stagiaire.rapport.note && (
                                <Badge className={`text-xs ${getNoteColor(stagiaire.rapport.note)}`}>
                                  Note: {stagiaire.rapport.note}/20
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {stagiaire.email}
                            </p>
                            {stagiaire.rapport.dateSoumission && (
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Soumis le {new Date(stagiaire.rapport.dateSoumission).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {stagiaire.rapport.statut === "Complet" ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 border-gray-300 dark:border-gray-600"
                                onClick={() => handleVisualiserRapport(stage, stagiaire)}
                              >
                                <Eye className="h-4 w-4" />
                                Voir
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 border-emerald-300 dark:border-emerald-600 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                                onClick={() => handleTelechargerRapport(stage, stagiaire)}
                              >
                                <Download className="h-4 w-4" />
                                PDF
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                              onClick={() => handleGenererRapport(stage, stagiaire)}
                            >
                              <FileText className="h-4 w-4" />
                              {stagiaire.rapport.statut === "Partiel" ? "Compléter" : "Générer"}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
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
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">
            Aucun stage terminé trouvé
          </h3>
          <p className="text-gray-400 dark:text-gray-500">
            Aucun stage terminé ne correspond à vos critères de recherche.
          </p>
        </motion.div>
      )}

      {/* Modal d'évaluation */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Évaluation du Stage
            </DialogTitle>
            <DialogDescription>
              {selectedStage && `Rapport de fin de stage pour ${selectedStage.stagiaire.prenom} ${selectedStage.stagiaire.nom}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedStage && (
            <div className="space-y-6 py-4">
              {/* Informations du stage */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {selectedStage.stage.titre}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedStage.stage.entreprise} • {selectedStage.stage.ville}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedStage.stage.duree} • {new Date(selectedStage.stage.dateDebut).toLocaleDateString()} - {new Date(selectedStage.stage.dateFin).toLocaleDateString()}
                </p>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="note">Note sur 20</Label>
                  <Input
                    id="note"
                    type="number"
                    min="0"
                    max="20"
                    value={evaluation.note}
                    onChange={(e) => setEvaluation({...evaluation, note: e.target.value})}
                    placeholder="Note finale"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commentaire">Commentaire général</Label>
                  <Textarea
                    id="commentaire"
                    value={evaluation.commentaire}
                    onChange={(e) => setEvaluation({...evaluation, commentaire: e.target.value})}
                    placeholder="Commentaire sur le travail réalisé..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pointsForts">Points forts</Label>
                  <Textarea
                    id="pointsForts"
                    value={evaluation.pointsForts}
                    onChange={(e) => setEvaluation({...evaluation, pointsForts: e.target.value})}
                    placeholder="Les points forts du stagiaire..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="axesAmelioration">Axes d'amélioration</Label>
                  <Textarea
                    id="axesAmelioration"
                    value={evaluation.axesAmelioration}
                    onChange={(e) => setEvaluation({...evaluation, axesAmelioration: e.target.value})}
                    placeholder="Les points à améliorer..."
                    rows={2}
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleSoumettreEvaluation}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              Générer le Rapport
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}