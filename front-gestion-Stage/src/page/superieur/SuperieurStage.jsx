import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen,
  Clock,
  Calendar,
  MapPin,
  Building,
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  UserCheck,
  AlertCircle,
  TrendingUp,
  Download
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

// Données de démonstration pour les stages à valider
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
    statut: "en_attente",
    places: 3,
    placesRestantes: 3,
    competences: ["React", "Node.js", "MongoDB", "TypeScript"],
    description: "Développement d'une application web complète avec architecture microservices.",
    encadreur: "Michel Dubois",
    dateCreation: "2024-12-08",
    motif: "",
    candidatures: 2
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
    statut: "en_attente",
    places: 2,
    placesRestantes: 2,
    competences: ["Figma", "Prototypage", "Recherche Utilisateur", "Design System"],
    description: "Opportunité unique pour apprendre le design d'expérience utilisateur dans une agence renommée.",
    encadreur: "Sophie Martin",
    dateCreation: "2024-12-07",
    motif: "",
    candidatures: 0
  },
  {
    id: 3,
    titre: "Stage Data Science Avancé",
    entreprise: "DataInnov Analytics",
    type: "Stage de recherche",
    duree: "5 mois",
    dateDebut: "2024-08-20",
    dateFin: "2025-01-20",
    ville: "Marseille",
    statut: "valide",
    places: 1,
    placesRestantes: 0,
    competences: ["Python", "Machine Learning", "Data Visualization", "SQL"],
    description: "Stage axé sur l'analyse de données et le machine learning pour résoudre des problèmes business complexes.",
    encadreur: "Pierre Bernard",
    dateCreation: "2024-12-05",
    dateValidation: "2024-12-06",
    motif: "",
    candidatures: 3
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
    statut: "refuse",
    places: 4,
    placesRestantes: 4,
    competences: ["SEO", "Réseaux Sociaux", "Analytics", "Content Marketing"],
    description: "Plongez dans le monde du marketing digital et développez des compétences concrètes en stratégie digitale.",
    encadreur: "Alice Moreau",
    dateCreation: "2024-12-04",
    dateValidation: "2024-12-05",
    motif: "Durée trop courte pour un stage opérationnel"
  },
  {
    id: 5,
    titre: "Stage Cybersécurité",
    entreprise: "SecureIT Systems",
    type: "Stage opérationnel",
    duree: "6 mois",
    dateDebut: "2024-09-01",
    dateFin: "2025-02-28",
    ville: "Lille",
    statut: "en_attente",
    places: 2,
    placesRestantes: 2,
    competences: ["Pentesting", "Sécurité Réseau", "Cryptographie", "Audit"],
    description: "Audit de sécurité et tests d'intrusion sur l'infrastructure de l'entreprise.",
    encadreur: "Thomas Leroy",
    dateCreation: "2024-12-09",
    motif: "",
    candidatures: 1
  }
];

export default function SuperieurStage() {
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [filtreEncadreur, setFiltreEncadreur] = useState("tous");
  const [recherche, setRecherche] = useState("");
  const [stages, setStages] = useState(stagesData);
  const [motifRefus, setMotifRefus] = useState("");
  const [stageSelectionne, setStageSelectionne] = useState(null);

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'valide': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';
      case 'refuse': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      case 'en_attente': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getStatutLabel = (statut) => {
    switch (statut) {
      case 'valide': return 'Validé';
      case 'refuse': return 'Refusé';
      case 'en_attente': return 'En attente';
      default: return 'Inconnu';
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'valide': return <CheckCircle className="h-4 w-4" />;
      case 'refuse': return <XCircle className="h-4 w-4" />;
      case 'en_attente': return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
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

  // Liste unique des encadreurs
  const encadreurs = [...new Set(stages.map(s => s.encadreur))];

  const stagesFiltres = stages.filter(stage => {
    const correspondRecherche = 
      stage.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      stage.entreprise.toLowerCase().includes(recherche.toLowerCase()) ||
      stage.encadreur.toLowerCase().includes(recherche.toLowerCase());
    
    const correspondStatut = filtreStatut === "tous" || stage.statut === filtreStatut;
    const correspondEncadreur = filtreEncadreur === "tous" || stage.encadreur === filtreEncadreur;
    
    return correspondRecherche && correspondStatut && correspondEncadreur;
  });

  const handleValiderStage = (stageId) => {
    setStages(stages.map(stage => 
      stage.id === stageId 
        ? { 
            ...stage, 
            statut: 'valide',
            dateValidation: new Date().toISOString().split('T')[0],
            motif: ''
          }
        : stage
    ));
  };

  const handleRefuserStage = (stageId) => {
    if (!motifRefus.trim()) {
      alert("Veuillez saisir un motif de refus");
      return;
    }

    setStages(stages.map(stage => 
      stage.id === stageId 
        ? { 
            ...stage, 
            statut: 'refuse',
            dateValidation: new Date().toISOString().split('T')[0],
            motif: motifRefus
          }
        : stage
    ));
    
    setMotifRefus("");
    setStageSelectionne(null);
  };

  const handleOuvrirModalRefus = (stage) => {
    setStageSelectionne(stage);
    setMotifRefus(stage.motif || "");
  };

  const handleFermerModal = () => {
    setStageSelectionne(null);
    setMotifRefus("");
  };

  const handleExporterRapport = () => {
    console.log('Export du rapport de validation des stages');
    // Logique d'export
  };

  const stats = {
    total: stages.length,
    enAttente: stages.filter(s => s.statut === 'en_attente').length,
    valides: stages.filter(s => s.statut === 'valide').length,
    refuses: stages.filter(s => s.statut === 'refuse').length,
    totalCandidatures: stages.reduce((acc, stage) => acc + (stage.candidatures || 0), 0)
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
              Validation des Stages
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Gestion et validation des stages proposés par les encadreurs
            </p>
          </div>
          <Button 
            onClick={handleExporterRapport}
            variant="outline"
            className="gap-2 border-gray-300 dark:border-gray-600"
          >
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </motion.div>

      {/* Statistiques de validation */}
      <motion.div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {[
          {
            title: "Stages à Valider",
            icon: (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <BookOpen className="h-6 w-6 text-amber-600" />
              </motion.div>
            ),
            count: stats.enAttente,
            text: "En attente de décision",
            gradient: "from-amber-500 to-amber-600"
          },
          {
            title: "Stages Validés",
            icon: (
              <motion.div
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </motion.div>
            ),
            count: stats.valides,
            text: "Approuvés et actifs",
            gradient: "from-emerald-500 to-emerald-600"
          },
          {
            title: "Stages Refusés",
            icon: (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <XCircle className="h-6 w-6 text-red-600" />
              </motion.div>
            ),
            count: stats.refuses,
            text: "Non approuvés",
            gradient: "from-red-500 to-red-600"
          },
          {
            title: "Candidatures",
            icon: (
              <motion.div
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </motion.div>
            ),
            count: stats.totalCandidatures,
            text: "Total des candidatures",
            gradient: "from-blue-500 to-blue-600"
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
                    placeholder="Rechercher un stage, entreprise ou encadreur..."
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    className="pl-9 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                  />
                </div>

                {/* Filtres */}
                <div className="flex gap-2">
                  <Select value={filtreStatut} onValueChange={setFiltreStatut}>
                    <SelectTrigger className="w-[160px] bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="Statut validation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les statuts</SelectItem>
                      <SelectItem value="en_attente">En attente</SelectItem>
                      <SelectItem value="valide">Validés</SelectItem>
                      <SelectItem value="refuse">Refusés</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filtreEncadreur} onValueChange={setFiltreEncadreur}>
                    <SelectTrigger className="w-[160px] bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="Encadreur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les encadreurs</SelectItem>
                      {encadreurs.map(encadreur => (
                        <SelectItem key={encadreur} value={encadreur}>
                          {encadreur}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                {stagesFiltres.length} stage(s) trouvé(s)
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Liste des stages */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2"
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
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden h-full">
                <div className="p-6">
                  {/* En-tête avec statut et encadreur */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={`text-xs ${getStatutColor(stage.statut)} flex items-center gap-1`}>
                          {getStatutIcon(stage.statut)}
                          {getStatutLabel(stage.statut)}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getTypeColor(stage.type)}`}>
                          {stage.type}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                        {stage.titre}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Building className="h-4 w-4" />
                        <span className="font-medium">{stage.entreprise}</span>
                      </div>
                    </div>
                  </div>

                  {/* Encadreur et date */}
                  <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {stage.encadreur}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Créé le {new Date(stage.dateCreation).toLocaleDateString()}
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

                    {/* Places et candidatures */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Places disponibles
                        </span>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {stage.placesRestantes} / {stage.places} places
                        </div>
                      </div>
                      {stage.candidatures !== undefined && (
                        <div className="text-right">
                          <div className="text-sm font-bold text-gray-900 dark:text-white">
                            {stage.candidatures}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            candidature(s)
                          </div>
                        </div>
                      )}
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

                  {/* Motif de refus */}
                  {stage.statut === 'refuse' && stage.motif && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">
                        Motif de refus
                      </div>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {stage.motif}
                      </p>
                    </div>
                  )}

                  {/* Actions selon le statut */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 border-gray-300 dark:border-gray-600"
                      onClick={() => console.log('Voir détails:', stage)}
                    >
                      <Eye className="h-4 w-4" />
                      Détails
                    </Button>
                    
                    {stage.statut === 'en_attente' && (
                      <>
                        <Button
                          size="sm"
                          className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleValiderStage(stage.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Valider
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2 border-red-300 text-red-600 hover:text-red-700 dark:border-red-600 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => handleOuvrirModalRefus(stage)}
                        >
                          <XCircle className="h-4 w-4" />
                          Refuser
                        </Button>
                      </>
                    )}
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
          <p className="text-gray-400 dark:text-gray-500">
            Aucun stage ne correspond à vos critères de recherche.
          </p>
        </motion.div>
      )}

      {/* Modal de refus */}
      {stageSelectionne && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mx-4 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Refuser le stage
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {stageSelectionne.titre} - {stageSelectionne.encadreur}
            </p>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Motif de refus *
              </label>
              <textarea
                value={motifRefus}
                onChange={(e) => setMotifRefus(e.target.value)}
                placeholder="Saisissez le motif de refus..."
                className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={handleFermerModal}
                  className="flex-1 border-gray-300 dark:border-gray-600"
                >
                  Annuler
                </Button>
                <Button
                  onClick={() => handleRefuserStage(stageSelectionne.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Confirmer le refus
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}