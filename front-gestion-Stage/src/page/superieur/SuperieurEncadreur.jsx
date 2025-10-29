import { useState } from "react";
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

// Données de démonstration pour les encadreurs
const encadreursData = [
  {
    id: 1,
    nom: "Dubois",
    prenom: "Michel",
    email: "michel.dubois@entreprise.com",
    telephone: "+33 6 11 22 33 44",
    departement: "Développement Web",
    specialite: "React, Node.js, MongoDB",
    dateEmbauche: "2020-03-15",
    statut: "Actif",
    nombreStagiaires: 3,
    performance: 4.5,
    ville: "Paris",
    experience: "8 ans",
    dernierEntretien: "2024-11-15",
    competences: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
    notes: "Excellent encadreur, très pédagogue"
  },
  {
    id: 2,
    nom: "Martin",
    prenom: "Sophie",
    email: "sophie.martin@entreprise.com",
    telephone: "+33 6 22 33 44 55",
    departement: "Design UX/UI",
    specialite: "Figma, Recherche Utilisateur, Prototypage",
    dateEmbauche: "2021-06-10",
    statut: "Actif",
    nombreStagiaires: 2,
    performance: 4.8,
    ville: "Lyon",
    experience: "6 ans",
    dernierEntretien: "2024-10-20",
    competences: ["Figma", "Adobe XD", "User Research", "Prototyping", "Design System"],
    notes: "Très créative, excellente communication"
  },
  {
    id: 3,
    nom: "Bernard",
    prenom: "Pierre",
    email: "pierre.bernard@entreprise.com",
    telephone: "+33 6 33 44 55 66",
    departement: "Data Science",
    specialite: "Python, Machine Learning, Analytics",
    dateEmbauche: "2019-01-20",
    statut: "Actif",
    nombreStagiaires: 2,
    performance: 4.2,
    ville: "Marseille",
    experience: "10 ans",
    dernierEntretien: "2024-09-30",
    competences: ["Python", "Pandas", "Scikit-learn", "SQL", "Data Visualization"],
    notes: "Expert technique, bon mentor"
  },
  {
    id: 4,
    nom: "Moreau",
    prenom: "Alice",
    email: "alice.moreau@entreprise.com",
    telephone: "+33 6 44 55 66 77",
    departement: "Marketing Digital",
    specialite: "SEO, Analytics, Campagnes Social Media",
    dateEmbauche: "2022-02-28",
    statut: "En congé",
    nombreStagiaires: 1,
    performance: 4.0,
    ville: "Toulouse",
    experience: "5 ans",
    dernierEntretien: "2024-08-15",
    competences: ["SEO", "Google Analytics", "Social Media", "Content Marketing", "Growth"],
    notes: "En congé maternité jusqu'au 15/03/2025"
  },
  {
    id: 5,
    nom: "Leroy",
    prenom: "Thomas",
    email: "thomas.leroy@entreprise.com",
    telephone: "+33 6 55 66 77 88",
    departement: "Cybersécurité",
    specialite: "Pentesting, Sécurité Réseau",
    dateEmbauche: "2018-09-05",
    statut: "Actif",
    nombreStagiaires: 1,
    performance: 4.7,
    ville: "Lille",
    experience: "12 ans",
    dernierEntretien: "2024-11-10",
    competences: ["Pentesting", "Network Security", "Cryptography", "SIEM", "Incident Response"],
    notes: "Expert reconnu, très bon formateur"
  },
  {
    id: 6,
    nom: "Garcia",
    prenom: "Lucas",
    email: "lucas.garcia@entreprise.com",
    telephone: "+33 6 66 77 88 99",
    departement: "Mobile Development",
    specialite: "React Native, Flutter",
    dateEmbauche: "2021-11-12",
    statut: "Actif",
    nombreStagiaires: 2,
    performance: 4.3,
    ville: "Nantes",
    experience: "7 ans",
    dernierEntretien: "2024-10-05",
    competences: ["React Native", "Flutter", "iOS", "Android", "Firebase"],
    notes: "Dynamique, bon relationnel avec les stagiaires"
  }
];

export default function SuperieurEncadreur() {
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [filtreDepartement, setFiltreDepartement] = useState("tous");
  const [recherche, setRecherche] = useState("");
  const [encadreurs] = useState(encadreursData);

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

  const getPerformanceText = (performance) => {
    if (performance >= 4.5) return 'Excellent';
    if (performance >= 4.0) return 'Très bon';
    if (performance >= 3.5) return 'Bon';
    return 'À améliorer';
  };

  // Liste unique des départements
  const departements = [...new Set(encadreurs.map(e => e.departement))];

  const encadreursFiltres = encadreurs.filter(encadreur => {
    const correspondRecherche = 
      encadreur.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      encadreur.prenom.toLowerCase().includes(recherche.toLowerCase()) ||
      encadreur.departement.toLowerCase().includes(recherche.toLowerCase()) ||
      encadreur.specialite.toLowerCase().includes(recherche.toLowerCase());
    
    const correspondStatut = filtreStatut === "tous" || encadreur.statut === filtreStatut;
    const correspondDepartement = filtreDepartement === "tous" || encadreur.departement === filtreDepartement;
    
    return correspondRecherche && correspondStatut && correspondDepartement;
  });

  const handleVoirDetails = (encadreur) => {
    console.log('Voir détails encadreur:', encadreur);
    // Navigation vers la page de détails de l'encadreur
  };

  const handleContacterEncadreur = (encadreur) => {
    console.log('Contacter encadreur:', encadreur);
    // Logique de contact de l'encadreur
  };

  const handleExporterListe = () => {
    console.log('Exporter la liste des encadreurs');
    // Logique d'export
  };

  const stats = {
    total: encadreurs.length,
    actifs: encadreurs.filter(e => e.statut === 'Actif').length,
    enConge: encadreurs.filter(e => e.statut === 'En congé').length,
    totalStagiaires: encadreurs.reduce((acc, e) => acc + e.nombreStagiaires, 0),
    moyennePerformance: Math.round(encadreurs.reduce((acc, e) => acc + e.performance, 0) / encadreurs.length * 10) / 10,
    departements: departements.length
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
              Mes Encadreurs
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Gestion et supervision de votre équipe d'encadrement
            </p>
          </div>
          <Button 
            onClick={handleExporterListe}
            variant="outline"
            className="gap-2 border-gray-300 dark:border-gray-600"
          >
            <Download className="h-4 w-4" />
            Exporter
          </Button>
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
            title: "Performance Moyenne",
            icon: (
              <motion.div
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </motion.div>
            ),
            count: `${stats.moyennePerformance}/5`,
            text: getPerformanceText(stats.moyennePerformance),
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
                      <SelectItem value="tous">Tous les départements</SelectItem>
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
          {encadreursFiltres.map((encadreur) => (
            <motion.div
              key={encadreur.id}
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
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {encadreur.prenom[0]}{encadreur.nom[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {encadreur.prenom} {encadreur.nom}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${getStatutColor(encadreur.statut)}`}>
                            {encadreur.statut}
                          </Badge>
                          <Badge className={`text-xs ${getPerformanceColor(encadreur.performance)}`}>
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            {encadreur.performance}/5
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informations principales */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Briefcase className="h-4 w-4" />
                      <span className="font-medium">{encadreur.departement}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Award className="h-4 w-4" />
                      <span>{encadreur.specialite}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span>{encadreur.ville}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>Depuis {new Date(encadreur.dateEmbauche).getFullYear()}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Target className="h-4 w-4" />
                      <span>{encadreur.experience} d'expérience</span>
                    </div>
                  </div>
                </div>

                {/* Statistiques de l'encadreur */}
                <div className="px-6 pb-4">
                  <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {encadreur.nombreStagiaires}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Stagiaires
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {encadreur.performance}/5
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Performance
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compétences */}
                <div className="px-6 pb-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Compétences</div>
                  <div className="flex flex-wrap gap-1">
                    {encadreur.competences.slice(0, 3).map((competence, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {competence}
                      </Badge>
                    ))}
                    {encadreur.competences.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{encadreur.competences.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {encadreur.notes && (
                  <div className="px-6 pb-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                      {encadreur.notes}
                    </div>
                  </div>
                )}

                {/* Dernier entretien */}
                {encadreur.dernierEntretien && (
                  <div className="px-6 pb-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Dernier entretien</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {new Date(encadreur.dernierEntretien).toLocaleDateString()}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="p-6 pt-4 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-700/30">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 border-gray-300 dark:border-gray-600"
                      onClick={() => handleVoirDetails(encadreur)}
                    >
                      <Eye className="h-4 w-4" />
                      Détails
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-gray-300 dark:border-gray-600"
                      onClick={() => handleContacterEncadreur(encadreur)}
                      title="Contacter l'encadreur"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-gray-300 dark:border-gray-600"
                      title="Téléphoner"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Message si aucun résultat */}
      {encadreursFiltres.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">
            Aucun encadreur trouvé
          </h3>
          <p className="text-gray-400 dark:text-gray-500">
            Aucun encadreur ne correspond à vos critères de recherche.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}