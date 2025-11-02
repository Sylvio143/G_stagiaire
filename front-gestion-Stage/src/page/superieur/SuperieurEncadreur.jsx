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
  Download,
  Star,
  Briefcase,
  Award,
  BookOpen,
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

export default function SuperieurEncadreur() {
  const [encadreurs, setEncadreurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [filtreDepartement, setFiltreDepartement] = useState("tous");
  const [recherche, setRecherche] = useState("");

  // Configuration Axios
  const API_BASE_URL = "http://localhost:9090/api";

  // Charger les encadreurs sous la supervision du supérieur
  const fetchEncadreurs = async () => {
    try {
      setLoading(true);
      
      // Récupérer l'ID du supérieur connecté
      const user = JSON.parse(localStorage.getItem("user"));
      const superieurId = user?.entityDocumentId;
      
      if (!superieurId) {
        toast.error("Impossible de récupérer les informations du supérieur");
        return;
      }

      // Récupérer tous les encadreurs
      const response = await axios.get(`${API_BASE_URL}/encadreurs/tous`);
      const tousLesEncadreurs = response.data;

      // Filtrer pour ne garder que les encadreurs sous la supervision de ce supérieur
      const encadreursFiltres = tousLesEncadreurs.filter(
        encadreur => encadreur.superieurHierarchiqueDocumentId === superieurId
      );

      // Pour chaque encadreur, récupérer le nombre de stagiaires
      const encadreursAvecStagiaires = await Promise.all(
        encadreursFiltres.map(async (encadreur) => {
          try {
            const stagiairesResponse = await axios.get(`${API_BASE_URL}/stagiaires/encadreur/${encadreur.documentId}`);
            const nombreStagiaires = stagiairesResponse.data.length;
            
            return {
              ...encadreur,
              nombreStagiaires: nombreStagiaires
            };
          } catch (error) {
            console.error(`Erreur lors du chargement des stagiaires pour ${encadreur.prenom} ${encadreur.nom}:`, error);
            return {
              ...encadreur,
              nombreStagiaires: 0
            };
          }
        })
      );

      setEncadreurs(encadreursAvecStagiaires);
    } catch (error) {
      console.error("Erreur lors du chargement des encadreurs:", error);
      toast.error("Erreur lors du chargement des encadreurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEncadreurs();
  }, []);

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

  // Calculer la performance (exemple basé sur le nombre de stagiaires)
  const calculerPerformance = (encadreur) => {
    // Logique simplifiée pour l'exemple
    const baseScore = 4.0;
    const bonusStagiaires = Math.min(encadreur.nombreStagiaires * 0.2, 1.0); // Max 1 point bonus
    
    return Math.min(baseScore + bonusStagiaires, 5.0).toFixed(1);
  };

  const getPerformanceColor = (performance) => {
    const perf = parseFloat(performance);
    if (perf >= 4.5) return 'bg-emerald-100 text-emerald-700';
    if (perf >= 4.0) return 'bg-blue-100 text-blue-700';
    if (perf >= 3.5) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  const getPerformanceText = (performance) => {
    const perf = parseFloat(performance);
    if (perf >= 4.5) return 'Excellent';
    if (perf >= 4.0) return 'Très bon';
    if (perf >= 3.5) return 'Bon';
    return 'À améliorer';
  };

  // Liste unique des départements
  const departements = [...new Set(encadreurs.map(e => e.departement).filter(Boolean))];

  const encadreursFiltres = encadreurs.filter(encadreur => {
    const correspondRecherche = 
      encadreur.nom?.toLowerCase().includes(recherche.toLowerCase()) ||
      encadreur.prenom?.toLowerCase().includes(recherche.toLowerCase()) ||
      encadreur.departement?.toLowerCase().includes(recherche.toLowerCase()) ||
      encadreur.specialite?.toLowerCase().includes(recherche.toLowerCase());
    
    const correspondStatut = filtreStatut === "tous" || encadreur.statut === filtreStatut;
    const correspondDepartement = filtreDepartement === "tous" || encadreur.departement === filtreDepartement;
    
    return correspondRecherche && correspondStatut && correspondDepartement;
  });

  // Calcul des statistiques
  const stats = {
    total: encadreurs.length,
    actifs: encadreurs.filter(e => e.statut === 'ACTIF').length,
    inactifs: encadreurs.filter(e => e.statut === 'INACTIF').length,
    totalStagiaires: encadreurs.reduce((acc, e) => acc + (e.nombreStagiaires || 0), 0),
    departements: departements.length
  };

  const handleVoirDetails = (encadreur) => {
    console.log('Voir détails encadreur:', encadreur);
    // Navigation vers la page de détails de l'encadreur
  };

  const handleContacterEncadreur = (encadreur) => {
    if (encadreur.email) {
      window.location.href = `mailto:${encadreur.email}`;
    } else {
      toast.error("Aucun email disponible pour cet encadreur");
    }
  };

  const handleAppelerEncadreur = (encadreur) => {
    if (encadreur.telephone) {
      window.location.href = `tel:${encadreur.telephone}`;
    } else {
      toast.error("Aucun numéro de téléphone disponible");
    }
  };

  const handleExporterListe = () => {
    console.log('Exporter la liste des encadreurs');
    toast.success("Export en cours...");
    // Logique d'export
  };

  const handleActiverDesactiver = async (encadreur) => {
    try {
      if (encadreur.statut === 'ACTIF') {
        await axios.put(`${API_BASE_URL}/encadreurs/${encadreur.documentId}/desactiver`);
        toast.success("Encadreur désactivé avec succès");
      } else {
        await axios.put(`${API_BASE_URL}/encadreurs/${encadreur.documentId}/activer`);
        toast.success("Encadreur activé avec succès");
      }
      await fetchEncadreurs(); // Recharger la liste
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      toast.error("Erreur lors du changement de statut");
    }
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
              Mes Encadreurs
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Gestion et supervision de votre équipe d'encadrement
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
            title: "Total Encadreurs",
            icon: (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Users className="h-6 w-6 text-blue-600" />
              </motion.div>
            ),
            count: stats.total,
            text: "Dans votre équipe",
            gradient: "from-blue-500 to-blue-600"
          },
          {
            title: "Encadreurs Actifs",
            icon: (
              <motion.div
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <UserCheck className="h-6 w-6 text-emerald-600" />
              </motion.div>
            ),
            count: stats.actifs,
            text: "Disponibles actuellement",
            gradient: "from-emerald-500 to-emerald-600"
          },
          {
            title: "Stagiaires Encadrés",
            icon: (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <GraduationCap className="h-6 w-6 text-purple-600" />
              </motion.div>
            ),
            count: stats.totalStagiaires,
            text: "Total en supervision",
            gradient: "from-purple-500 to-purple-600"
          },
          {
            title: "Départements",
            icon: (
              <motion.div
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Building className="h-6 w-6 text-amber-600" />
              </motion.div>
            ),
            count: stats.departements,
            text: "Départements différents",
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
                    placeholder="Rechercher un encadreur, département ou spécialité..."
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
                      {departements.map(departement => (
                        <SelectItem key={departement} value={departement}>
                          {departement}
                        </SelectItem>
                      ))}
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

      {/* Grille des encadreurs */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        <AnimatePresence>
          {encadreursFiltres.map((encadreur) => {
            const performance = calculerPerformance(encadreur);

            return (
              <motion.div
                key={encadreur.documentId}
                variants={cardVariants}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden h-full">
                  {/* En-tête avec statut et performance */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-white/20">
                          <AvatarImage src={encadreur.photoUrl} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {encadreur.prenom?.[0]}{encadreur.nom?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {encadreur.prenom} {encadreur.nom}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`text-xs ${getStatutColor(encadreur.statut)}`}>
                              {getStatutLabel(encadreur.statut)}
                            </Badge>
                            <Badge className={`text-xs ${getPerformanceColor(performance)}`}>
                              <Star className="h-3 w-3 mr-1 fill-current" />
                              {performance}/5
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Informations principales */}
                    <div className="space-y-3">
                      {encadreur.departement && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Briefcase className="h-4 w-4" />
                          <span className="font-medium">{encadreur.departement}</span>
                        </div>
                      )}
                      
                      {encadreur.specialite && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Award className="h-4 w-4" />
                          <span>{encadreur.specialite}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{encadreur.email}</span>
                      </div>

                      {encadreur.telephone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Phone className="h-4 w-4" />
                          <span>{encadreur.telephone}</span>
                        </div>
                      )}

                      {encadreur.fonction && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Target className="h-4 w-4" />
                          <span>{encadreur.fonction}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Statistiques de l'encadreur */}
                  <div className="px-6 pb-4">
                    <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {encadreur.nombreStagiaires || 0}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Stagiaires
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {performance}/5
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {getPerformanceText(performance)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-4 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-700/30">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 border-gray-300 dark:border-gray-600"
                        onClick={() => handleContacterEncadreur(encadreur)}
                        title="Contacter l'encadreur"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>

                      {encadreur.telephone && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 border-gray-300 dark:border-gray-600"
                          onClick={() => handleAppelerEncadreur(encadreur)}
                          title="Téléphoner"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        className={`gap-2 ${
                          encadreur.statut === 'ACTIF' 
                            ? 'text-amber-600 border-amber-300 hover:text-amber-700' 
                            : 'text-emerald-600 border-emerald-300 hover:text-emerald-700'
                        }`}
                        onClick={() => handleActiverDesactiver(encadreur)}
                        title={encadreur.statut === 'ACTIF' ? 'Désactiver' : 'Activer'}
                      >
                        {encadreur.statut === 'ACTIF' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Message si aucun résultat */}
      {encadreursFiltres.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">
            {encadreurs.length === 0 ? "Aucun encadreur dans votre équipe" : "Aucun encadreur trouvé"}
          </h3>
          <p className="text-gray-400 dark:text-gray-500">
            {encadreurs.length === 0 
              ? "Aucun encadreur n'est actuellement sous votre supervision." 
              : "Aucun encadreur ne correspond à vos critères de recherche."
            }
          </p>
        </motion.div>
      )}
    </motion.div>
    </>
  );
}