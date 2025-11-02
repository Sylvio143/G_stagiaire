import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Phone, 
  Eye, 
  Mail, 
  Calendar,
  MapPin,
  BadgeCheck,
  Clock,
  Search,
  Filter,
  GraduationCap,
  Building,
  UserCheck,
  UserX,
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

export default function SuperieurStagiaire() {
  const [stagiaires, setStagiaires] = useState([]);
  const [encadreurs, setEncadreurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [filtreEncadreur, setFiltreEncadreur] = useState("tous");
  const [recherche, setRecherche] = useState("");

  // Configuration Axios
  const API_BASE_URL = "http://localhost:9090/api";

  // Charger tous les stagiaires sous la supervision du supérieur
  const fetchStagiaires = async () => {
    try {
      setLoading(true);
      
      // Récupérer l'ID du supérieur connecté
      const user = JSON.parse(localStorage.getItem("user"));
      const superieurId = user?.entityDocumentId;
      
      if (!superieurId) {
        toast.error("Impossible de récupérer les informations du supérieur");
        return;
      }

      // 1. Récupérer tous les encadreurs sous la supervision de ce supérieur
      const encadreursResponse = await axios.get(`${API_BASE_URL}/encadreurs/tous`);
      const encadreursSuperieur = encadreursResponse.data.filter(
        encadreur => encadreur.superieurHierarchiqueDocumentId === superieurId
      );

      setEncadreurs(encadreursSuperieur);

      // 2. Pour chaque encadreur, récupérer ses stagiaires
      const stagiairesPromises = encadreursSuperieur.map(async (encadreur) => {
        try {
          const stagiairesResponse = await axios.get(`${API_BASE_URL}/stagiaires/encadreur/${encadreur.documentId}`);
          return stagiairesResponse.data.map(stagiaire => ({
            ...stagiaire,
            encadreurNom: `${encadreur.prenom} ${encadreur.nom}`,
            encadreurDocumentId: encadreur.documentId
          }));
        } catch (error) {
          console.error(`Erreur lors du chargement des stagiaires pour ${encadreur.prenom} ${encadreur.nom}:`, error);
          return [];
        }
      });

      const stagiairesArrays = await Promise.all(stagiairesPromises);
      const tousLesStagiaires = stagiairesArrays.flat();

      // 3. Pour chaque stagiaire, récupérer les informations de stage
      const stagiairesAvecStages = await Promise.all(
        tousLesStagiaires.map(async (stagiaire) => {
          try {
            const stagesResponse = await axios.get(`${API_BASE_URL}/stages/stagiaire/${stagiaire.documentId}`);
            const stagesActifs = stagesResponse.data.filter(stage => 
              stage.statutStage === 'EN_COURS' || stage.statutStage === 'EN_ATTENTE_VALIDATION'
            );
            
            const stageActuel = stagesActifs[0]; // Prendre le premier stage actif
            
            return {
              ...stagiaire,
              stageActuel: stageActuel,
              hasActiveStage: stagesActifs.length > 0,
              progression: stageActuel ? calculerProgression(stageActuel) : 0,
              dateDebut: stageActuel?.dateDebut,
              dateFin: stageActuel?.dateFin
            };
          } catch (error) {
            console.error(`Erreur lors du chargement du stage pour ${stagiaire.prenom} ${stagiaire.nom}:`, error);
            return {
              ...stagiaire,
              stageActuel: null,
              hasActiveStage: false,
              progression: 0
            };
          }
        })
      );

      setStagiaires(stagiairesAvecStages);
    } catch (error) {
      console.error("Erreur lors du chargement des stagiaires:", error);
      toast.error("Erreur lors du chargement des stagiaires");
    } finally {
      setLoading(false);
    }
  };

  // Calculer la progression du stage
  const calculerProgression = (stage) => {
    if (!stage.dateDebut || !stage.dateFin) return 0;
    
    const debut = new Date(stage.dateDebut);
    const fin = new Date(stage.dateFin);
    const aujourdhui = new Date();
    
    if (aujourdhui < debut) return 0;
    if (aujourdhui > fin) return 100;
    
    const total = fin.getTime() - debut.getTime();
    const ecoule = aujourdhui.getTime() - debut.getTime();
    
    return Math.min(Math.round((ecoule / total) * 100), 100);
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

  const getProgressionColor = (progression) => {
    if (progression >= 80) return 'bg-emerald-500';
    if (progression >= 60) return 'bg-blue-500';
    if (progression >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getStageStatutColor = (statutStage) => {
    switch (statutStage) {
      case 'EN_COURS': return 'bg-emerald-100 text-emerald-700';
      case 'EN_ATTENTE_VALIDATION': return 'bg-amber-100 text-amber-700';
      case 'VALIDE': return 'bg-blue-100 text-blue-700';
      case 'TERMINE': return 'bg-gray-100 text-gray-700';
      case 'REFUSE': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStageStatutLabel = (statutStage) => {
    switch (statutStage) {
      case 'EN_COURS': return 'En cours';
      case 'EN_ATTENTE_VALIDATION': return 'En attente';
      case 'VALIDE': return 'Validé';
      case 'TERMINE': return 'Terminé';
      case 'REFUSE': return 'Refusé';
      default: return statutStage;
    }
  };

  useEffect(() => {
    fetchStagiaires();
  }, []);

  // Liste unique des encadreurs pour les filtres
  const encadreursList = [...new Set(stagiaires.map(s => s.encadreurDocumentId))];

  const stagiairesFiltres = stagiaires.filter(stagiaire => {
    const correspondRecherche = 
      stagiaire.nom?.toLowerCase().includes(recherche.toLowerCase()) ||
      stagiaire.prenom?.toLowerCase().includes(recherche.toLowerCase()) ||
      stagiaire.ecole?.toLowerCase().includes(recherche.toLowerCase()) ||
      stagiaire.filiere?.toLowerCase().includes(recherche.toLowerCase()) ||
      stagiaire.encadreurNom?.toLowerCase().includes(recherche.toLowerCase());
    
    const correspondStatut = filtreStatut === "tous" || stagiaire.statut === filtreStatut;
    const correspondEncadreur = filtreEncadreur === "tous" || stagiaire.encadreurDocumentId === filtreEncadreur;
    
    return correspondRecherche && correspondStatut && correspondEncadreur;
  });

  const handleVoirDetails = (stagiaire) => {
    console.log('Voir détails stagiaire:', stagiaire);
    // Navigation vers la page de détails du stagiaire
  };

  const handleContacterEncadreur = (encadreurEmail) => {
    if (encadreurEmail) {
      window.location.href = `mailto:${encadreurEmail}`;
    } else {
      toast.error("Aucun email disponible pour cet encadreur");
    }
  };

  const handleContacterStagiaire = (stagiaireEmail) => {
    if (stagiaireEmail) {
      window.location.href = `mailto:${stagiaireEmail}`;
    } else {
      toast.error("Aucun email disponible pour ce stagiaire");
    }
  };

  const handleExporterListe = () => {
    console.log('Exporter la liste des stagiaires');
    toast.success("Export en cours...");
    // Logique d'export
  };

  const handleActiverDesactiver = async (stagiaire) => {
    try {
      if (stagiaire.statut === 'ACTIF') {
        await axios.put(`${API_BASE_URL}/stagiaires/${stagiaire.documentId}/desactiver`);
        toast.success("Stagiaire désactivé avec succès");
      } else {
        await axios.put(`${API_BASE_URL}/stagiaires/${stagiaire.documentId}/activer`);
        toast.success("Stagiaire activé avec succès");
      }
      await fetchStagiaires(); // Recharger la liste
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      toast.error("Erreur lors du changement de statut");
    }
  };

  // Calcul des statistiques
  const stats = {
    total: stagiaires.length,
    actifs: stagiaires.filter(s => s.statut === 'ACTIF').length,
    inactifs: stagiaires.filter(s => s.statut === 'INACTIF').length,
    avecStage: stagiaires.filter(s => s.hasActiveStage).length,
    encadreurs: encadreurs.length
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
              Tous les Stagiaires
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Supervision de l'ensemble des stagiaires encadrés par votre équipe
            </p>
          </div>
        </div>
      </motion.div>

      {/* Statistiques consolidées */}
      <motion.div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {[
          {
            title: "Total Stagiaires",
            icon: (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Users className="h-6 w-6 text-blue-600" />
              </motion.div>
            ),
            count: stats.total,
            text: "Sur l'ensemble des encadreurs",
            gradient: "from-blue-500 to-blue-600"
          },
          {
            title: "Stagiaires Actifs",
            icon: (
              <motion.div
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <UserCheck className="h-6 w-6 text-emerald-600" />
              </motion.div>
            ),
            count: stats.actifs,
            text: "En cours de formation",
            gradient: "from-emerald-500 to-emerald-600"
          },
          {
            title: "Avec Stage Actif",
            icon: (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <BadgeCheck className="h-6 w-6 text-purple-600" />
              </motion.div>
            ),
            count: stats.avecStage,
            text: "Stage en cours",
            gradient: "from-purple-500 to-purple-600"
          },
          {
            title: "Encadreurs",
            icon: (
              <motion.div
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <UserCheck className="h-6 w-6 text-amber-600" />
              </motion.div>
            ),
            count: stats.encadreurs,
            text: "Équipe d'encadrement",
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
                    placeholder="Rechercher un stagiaire, école, filière ou encadreur..."
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

                  <Select value={filtreEncadreur} onValueChange={setFiltreEncadreur}>
                    <SelectTrigger className="w-[160px] bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="Encadreur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les encadreurs</SelectItem>
                      {encadreurs.map(encadreur => (
                        <SelectItem key={encadreur.documentId} value={encadreur.documentId}>
                          {encadreur.prenom} {encadreur.nom}
                        </SelectItem>
                      ))}
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

      {/* Grille des stagiaires */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        <AnimatePresence>
          {stagiairesFiltres.map((stagiaire) => (
            <motion.div
              key={stagiaire.documentId}
              variants={cardVariants}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden h-full">
                {/* En-tête avec statut et encadreur */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-white/20">
                        <AvatarImage src={stagiaire.photoUrl} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {stagiaire.prenom?.[0]}{stagiaire.nom?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {stagiaire.prenom} {stagiaire.nom}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${getStatutColor(stagiaire.statut)}`}>
                            {getStatutLabel(stagiaire.statut)}
                          </Badge>
                          {stagiaire.stageActuel && (
                            <Badge className={`text-xs ${getStageStatutColor(stagiaire.stageActuel.statutStage)}`}>
                              {getStageStatutLabel(stagiaire.stageActuel.statutStage)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Encadreur */}
                  <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-3">
                    <UserCheck className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {stagiaire.encadreurNom}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Encadreur référent
                      </p>
                    </div>
                  </div>

                  {/* Informations principales */}
                  <div className="space-y-3">
                    {stagiaire.ecole && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <GraduationCap className="h-4 w-4" />
                        <span className="font-medium">{stagiaire.ecole}</span>
                      </div>
                    )}
                    
                    {stagiaire.filiere && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Building className="h-4 w-4" />
                        <span>{stagiaire.filiere}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{stagiaire.email}</span>
                    </div>

                    {stagiaire.telephone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="h-4 w-4" />
                        <span>{stagiaire.telephone}</span>
                      </div>
                    )}

                    {stagiaire.dateDebut && stagiaire.dateFin && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(stagiaire.dateDebut).toLocaleDateString()} - {new Date(stagiaire.dateFin).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Niveau d'étude */}
                {stagiaire.niveauEtude && (
                  <div className="px-6 pb-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Niveau d'étude</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {stagiaire.niveauEtude}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="p-6 pt-4 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-700/30">
                  <div className="flex gap-2">
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-gray-300 dark:border-gray-600"
                      onClick={() => handleContacterStagiaire(stagiaire.email)}
                      title="Contacter le stagiaire"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className={`gap-2 ${
                        stagiaire.statut === 'ACTIF' 
                          ? 'text-amber-600 border-amber-300 hover:text-amber-700' 
                          : 'text-emerald-600 border-emerald-300 hover:text-emerald-700'
                      }`}
                      onClick={() => handleActiverDesactiver(stagiaire)}
                      title={stagiaire.statut === 'ACTIF' ? 'Désactiver' : 'Activer'}
                    >
                      {stagiaire.statut === 'ACTIF' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Message si aucun résultat */}
      {stagiairesFiltres.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">
            {stagiaires.length === 0 ? "Aucun stagiaire dans votre équipe" : "Aucun stagiaire trouvé"}
          </h3>
          <p className="text-gray-400 dark:text-gray-500">
            {stagiaires.length === 0 
              ? "Aucun stagiaire n'est actuellement encadré par votre équipe." 
              : "Aucun stagiaire ne correspond à vos critères de recherche."
            }
          </p>
        </motion.div>
      )}
    </motion.div>
    </>
  );
}