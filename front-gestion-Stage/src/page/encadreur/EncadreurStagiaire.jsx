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
  UserX
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

// Données de démonstration pour les stagiaires
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
    image: null,
    specialite: "React, Node.js, MongoDB"
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
    image: null,
    specialite: "Figma, Prototypage, Recherche Utilisateur"
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
    image: null,
    specialite: "Python, Pandas, Scikit-learn"
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
    image: null,
    specialite: "SEO, Analytics, Campagnes Social Media"
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
    image: null,
    specialite: "Pentesting, Sécurité Réseau, Cryptographie"
  },
  {
    id: 6,
    nom: "Moreau",
    prenom: "Alice",
    email: "alice.moreau@email.com",
    telephone: "+33 6 67 89 01 23",
    formation: "Cloud & DevOps",
    entreprise: "CloudNative Tech",
    dateDebut: "2024-09-20",
    dateFin: "2025-03-20",
    statut: "Actif",
    progression: 55,
    ville: "Bordeaux",
    image: null,
    specialite: "AWS, Docker, Kubernetes, Terraform"
  }
];

export default function EncadreurStagiaire() {
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [recherche, setRecherche] = useState("");
  const [stagiaires] = useState(stagiairesData);

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'Actif': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';
      case 'En pause': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800';
      case 'Terminé': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getProgressionColor = (progression) => {
    if (progression >= 80) return 'bg-emerald-500';
    if (progression >= 60) return 'bg-blue-500';
    if (progression >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const stagiairesFiltres = stagiaires.filter(stagiaire => {
    const correspondRecherche = 
      stagiaire.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      stagiaire.prenom.toLowerCase().includes(recherche.toLowerCase()) ||
      stagiaire.formation.toLowerCase().includes(recherche.toLowerCase()) ||
      stagiaire.entreprise.toLowerCase().includes(recherche.toLowerCase());
    
    const correspondStatut = filtreStatut === "tous" || stagiaire.statut === filtreStatut;
    
    return correspondRecherche && correspondStatut;
  });

  const handleVoirDetails = (stagiaire) => {
    console.log('Voir détails:', stagiaire);
    // Navigation vers la page de détails du stagiaire
  };

  const handleAppeler = (telephone) => {
    console.log('Appeler:', telephone);
    window.open(`tel:${telephone}`, '_self');
  };

  const handleEnvoyerEmail = (email) => {
    console.log('Envoyer email:', email);
    window.open(`mailto:${email}`, '_self');
  };

  const stats = {
    total: stagiaires.length,
    actifs: stagiaires.filter(s => s.statut === 'Actif').length,
    termines: stagiaires.filter(s => s.statut === 'Terminé').length,
    enPause: stagiaires.filter(s => s.statut === 'En pause').length
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
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Mes Stagiaires
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Gestion et suivi de vos stagiaires en cours
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
            text: "Stagiaires encadrés",
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
            title: "Stages Terminés",
            icon: (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <BadgeCheck className="h-6 w-6 text-purple-600" />
              </motion.div>
            ),
            count: stats.termines,
            text: "Parcours accomplis",
            gradient: "from-purple-500 to-purple-600"
          },
          {
            title: "En Pause",
            icon: (
              <motion.div
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <UserX className="h-6 w-6 text-amber-600" />
              </motion.div>
            ),
            count: stats.enPause,
            text: "Stages interrompus",
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

                {/* Filtre par statut */}
                <Select value={filtreStatut} onValueChange={setFiltreStatut}>
                  <SelectTrigger className="w-[180px] bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les statuts</SelectItem>
                    <SelectItem value="Actif">Actifs</SelectItem>
                    <SelectItem value="En pause">En pause</SelectItem>
                    <SelectItem value="Terminé">Terminés</SelectItem>
                  </SelectContent>
                </Select>
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
              key={stagiaire.id}
              variants={cardVariants}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden h-full">
                {/* En-tête avec statut */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-white/20">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {stagiaire.prenom[0]}{stagiaire.nom[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {stagiaire.prenom} {stagiaire.nom}
                        </h3>
                        <Badge className={`mt-1 text-xs ${getStatutColor(stagiaire.statut)}`}>
                          {stagiaire.statut}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Informations principales */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <GraduationCap className="h-4 w-4" />
                      <span className="font-medium">{stagiaire.formation}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Building className="h-4 w-4" />
                      <span>{stagiaire.entreprise}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span>{stagiaire.ville}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(stagiaire.dateDebut).toLocaleDateString()} - {new Date(stagiaire.dateFin).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Barre de progression */}
                <div className="px-6 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progression</span>
                    <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {stagiaire.progression}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${getProgressionColor(stagiaire.progression)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${stagiaire.progression}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>

                {/* Spécialité */}
                <div className="px-6 pb-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Spécialité</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                    {stagiaire.specialite}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 pt-4 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-700/30">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 border-gray-300 dark:border-gray-600"
                      onClick={() => handleVoirDetails(stagiaire)}
                    >
                      <Eye className="h-4 w-4" />
                      Voir
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-gray-300 dark:border-gray-600"
                      onClick={() => handleAppeler(stagiaire.telephone)}
                      title="Appeler"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-gray-300 dark:border-gray-600"
                      onClick={() => handleEnvoyerEmail(stagiaire.email)}
                      title="Envoyer un email"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Message si aucun résultat */}
      {stagiairesFiltres.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">
            Aucun stagiaire trouvé
          </h3>
          <p className="text-gray-400 dark:text-gray-500">
            Aucun stagiaire ne correspond à vos critères de recherche.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}