import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Lock,
  Bell,
  Shield,
  Download,
  Save,
  Edit,
  Camera,
  Key,
  Trash2,
  Settings,
  Eye,
  EyeOff,
  Users,
  Target,
  Briefcase
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

// Composant Switch personnalisé
const CustomSwitch = ({ checked, onCheckedChange, id, label, description }) => (
  <div className="flex items-center justify-between">
    <div className="space-y-0.5">
      <Label htmlFor={id} className="text-sm font-medium cursor-pointer">
        {label}
      </Label>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        ${checked 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
          : 'bg-gray-200 dark:bg-gray-700'
        }
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  </div>
);

export default function EncadreurParametre() {
  const [encadreur, setEncadreur] = useState(null);
  const [modification, setModification] = useState(false);
  const [loading, setLoading] = useState(true);
  const [changementMotPasse, setChangementMotPasse] = useState({
    actuel: "",
    nouveau: "",
    confirmation: ""
  });
  const [showPassword, setShowPassword] = useState({
    actuel: false,
    nouveau: false,
    confirmation: false
  });

  // Configuration Axios
  const API_BASE_URL = "http://localhost:9090/api";

  // Charger les données de l'encadreur
  const fetchEncadreurData = async () => {
    try {
      setLoading(true);
      
      // Récupérer l'ID de l'encadreur connecté
      const user = JSON.parse(localStorage.getItem("user"));
      const encadreurId = user?.entityDocumentId;
      
      if (!encadreurId) {
        toast.error("Impossible de récupérer les informations de l'encadreur");
        return;
      }

      // Récupérer les données de l'encadreur
      const response = await axios.get(`${API_BASE_URL}/encadreurs/${encadreurId}`);
      if (response.data) {
        setEncadreur(response.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données encadreur:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEncadreurData();
  }, []);

  const handleInputChange = (field, value) => {
    setEncadreur(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSauvegarder = async () => {
    try {
      if (!encadreur) return;

      await axios.put(`${API_BASE_URL}/encadreurs/${encadreur.documentId}`, {
        id: encadreur.id,
        nom: encadreur.nom,
        prenom: encadreur.prenom,
        email: encadreur.email,
        telephone: encadreur.telephone,
        cin: encadreur.cin,
        fonction: encadreur.fonction,
        departement: encadreur.departement,
        specialite: encadreur.specialite,
        statut: encadreur.statut
      });

      toast.success("Profil modifié avec succès");
      setModification(false);
      await fetchEncadreurData(); // Recharger les données
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error("Erreur lors de la modification du profil");
    }
  };

  const handleChangerMotPasse = async () => {
    try {
      if (!encadreur) return;

      if (changementMotPasse.nouveau !== changementMotPasse.confirmation) {
        toast.error("Les mots de passe ne correspondent pas");
        return;
      }

      if (changementMotPasse.nouveau.length < 6) {
        toast.error("Le mot de passe doit contenir au moins 6 caractères");
        return;
      }

      // Utiliser l'endpoint de changement de mot de passe des comptes
      await axios.put(`${API_BASE_URL}/comptes-utilisateurs/${encadreur.documentId}/password`, {
        newPassword: changementMotPasse.nouveau
      });

      toast.success("Mot de passe modifié avec succès");
      setChangementMotPasse({
        actuel: "",
        nouveau: "",
        confirmation: ""
      });
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);
      toast.error("Erreur lors du changement de mot de passe");
    }
  };

  const handleExportDonnees = () => {
    console.log('Export des données');
    toast.success("Export des données en cours...");
    // Logique d'export des données
  };

  const handleSupprimerCompte = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      return;
    }

    try {
      if (!encadreur) return;

      await axios.delete(`${API_BASE_URL}/encadreurs/${encadreur.documentId}`);
      toast.success("Compte supprimé avec succès");
      // Redirection vers la page de login ou autre
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression du compte");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const getInitials = (prenom, nom) => {
    if (!prenom && !nom) return "E";
    const firstInitial = prenom ? prenom.charAt(0).toUpperCase() : "";
    const lastInitial = nom ? nom.charAt(0).toUpperCase() : "";
    return firstInitial + lastInitial;
  };

  const getAvatarColor = (name) => {
    const colors = [
      "bg-gradient-to-r from-blue-600 to-purple-600",
      "bg-gradient-to-r from-indigo-600 to-purple-600",
      "bg-gradient-to-r from-blue-600 to-indigo-600",
      "bg-gradient-to-r from-purple-600 to-blue-600",
    ];
    if (!name) return colors[0];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  if (!encadreur) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Aucune donnée encadreur trouvée</p>
        </div>
      </div>
    );
  }

  const initials = getInitials(encadreur.prenom, encadreur.nom);
  const avatarColor = getAvatarColor(encadreur.nom);

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 80 }}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
      className="min-h-screen p-6 space-y-8 bg-transparent"
    >
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
              Paramètres du Compte Encadreur
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Gérez vos informations personnelles et préférences
            </p>
          </div>
          <div className="flex gap-2">
            {modification ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setModification(false);
                    fetchEncadreurData(); // Recharger les données originales
                  }}
                  className="border-gray-300 dark:border-gray-600"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSauvegarder}
                  className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Save className="h-4 w-4" />
                  Sauvegarder
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setModification(true)}
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Edit className="h-4 w-4" />
                Modifier le profil
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="profil" className="space-y-8">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-xl">
          <TabsTrigger value="profil" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
            <User className="h-4 w-4 mr-2" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="securite" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
            <Shield className="h-4 w-4 mr-2" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="avance" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
            <Settings className="h-4 w-4 mr-2" />
            Avancé
          </TabsTrigger>
        </TabsList>

        {/* Onglet Profil */}
        <TabsContent value="profil">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-8 lg:grid-cols-3"
          >
            {/* Colonne de gauche - Photo et stats */}
            <div className="space-y-6">
              <motion.div variants={cardVariants}>
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      {/* Photo de profil */}
                      <div className="relative">
                        <Avatar className="h-24 w-24 border-4 border-white/20 shadow-lg">
                          <AvatarImage src={encadreur.photoUrl} />
                          <AvatarFallback className={`${avatarColor} text-white text-xl`}>
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        {modification && (
                          <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-700 transition-colors">
                            <Camera className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {encadreur.prenom} {encadreur.nom}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {encadreur.fonction}
                        </p>
                        <Badge className="mt-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          Encadreur
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Informations professionnelles */}
              <motion.div variants={cardVariants}>
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <Briefcase className="h-5 w-5" />
                      Informations Professionnelles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {encadreur.departement || "Non spécifié"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Département
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Target className="h-4 w-4" />
                      <span>{encadreur.specialite || "Non spécifié"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4" />
                      <span>Stagiaires encadrés</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>Créé le {formatDate(encadreur.createdAt)}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Colonne de droite - Formulaire d'édition */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informations personnelles */}
              <motion.div variants={cardVariants}>
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <User className="h-5 w-5" />
                      Informations Personnelles
                    </CardTitle>
                    <CardDescription>
                      Vos informations de contact et personnelles
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="prenom">Prénom *</Label>
                        <Input
                          id="prenom"
                          value={encadreur.prenom || ""}
                          onChange={(e) => handleInputChange('prenom', e.target.value)}
                          disabled={!modification}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nom">Nom *</Label>
                        <Input
                          id="nom"
                          value={encadreur.nom || ""}
                          onChange={(e) => handleInputChange('nom', e.target.value)}
                          disabled={!modification}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={encadreur.email || ""}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!modification}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telephone">Téléphone *</Label>
                        <Input
                          id="telephone"
                          value={encadreur.telephone || ""}
                          onChange={(e) => handleInputChange('telephone', e.target.value)}
                          disabled={!modification}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cin">CIN *</Label>
                        <Input
                          id="cin"
                          value={encadreur.cin || ""}
                          onChange={(e) => handleInputChange('cin', e.target.value)}
                          disabled={!modification}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fonction">Fonction *</Label>
                        <Input
                          id="fonction"
                          value={encadreur.fonction || ""}
                          onChange={(e) => handleInputChange('fonction', e.target.value)}
                          disabled={!modification}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="statut">Statut</Label>
                      <div className="flex items-center gap-4">
                        <Badge className={encadreur.statut === 'ACTIF' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-red-100 text-red-700'
                        }>
                          {encadreur.statut === 'ACTIF' ? 'Actif' : 'Inactif'}
                        </Badge>
                        {modification && (
                          <select
                            value={encadreur.statut}
                            onChange={(e) => handleInputChange('statut', e.target.value)}
                            className="px-3 py-1 border rounded-md"
                          >
                            <option value="ACTIF">Actif</option>
                            <option value="INACTIF">Inactif</option>
                          </select>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Informations professionnelles détaillées */}
              <motion.div variants={cardVariants}>
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <Building className="h-5 w-5" />
                      Informations Professionnelles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="departement">Département</Label>
                        <Input
                          id="departement"
                          value={encadreur.departement || ""}
                          onChange={(e) => handleInputChange('departement', e.target.value)}
                          disabled={!modification}
                          placeholder="Votre département"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="specialite">Spécialité</Label>
                        <Input
                          id="specialite"
                          value={encadreur.specialite || ""}
                          onChange={(e) => handleInputChange('specialite', e.target.value)}
                          disabled={!modification}
                          placeholder="Votre domaine de spécialisation"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Informations système */}
              <motion.div variants={cardVariants}>
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <Settings className="h-5 w-5" />
                      Informations Système
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ID Document</p>
                        <p className="text-sm text-gray-900 dark:text-white font-mono">
                          {encadreur.documentId}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ID Technique</p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {encadreur.id}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date de création</p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {formatDate(encadreur.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Dernière modification</p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {formatDate(encadreur.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </TabsContent>

        {/* Onglet Notifications */}
        <TabsContent value="notifications">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-6"
          >
            <motion.div variants={cardVariants}>
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Bell className="h-5 w-5" />
                    Préférences de Notification
                  </CardTitle>
                  <CardDescription>
                    Contrôlez comment et quand vous recevez les notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <CustomSwitch
                    id="notifications-email"
                    checked={true}
                    onCheckedChange={() => {}}
                    label="Notifications par email"
                    description="Recevoir les notifications importantes par email"
                  />

                  <CustomSwitch
                    id="notifications-push"
                    checked={true}
                    onCheckedChange={() => {}}
                    label="Notifications push"
                    description="Notifications en temps réel sur la plateforme"
                  />

                  <CustomSwitch
                    id="notifications-stagiaires"
                    checked={true}
                    onCheckedChange={() => {}}
                    label="Activités des stagiaires"
                    description="Suivi des activités de vos stagiaires"
                  />

                  <CustomSwitch
                    id="notifications-taches"
                    checked={true}
                    onCheckedChange={() => {}}
                    label="Nouvelles tâches"
                    description="Alertes pour les nouvelles tâches assignées"
                  />

                  <CustomSwitch
                    id="notifications-rapports"
                    checked={true}
                    onCheckedChange={() => {}}
                    label="Rapports et statistiques"
                    description="Rapports périodiques sur vos stagiaires"
                  />

                  <CustomSwitch
                    id="notifications-nouveautes"
                    checked={false}
                    onCheckedChange={() => {}}
                    label="Nouvelles fonctionnalités"
                    description="Être informé des nouvelles fonctionnalités"
                  />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        {/* Onglet Sécurité */}
        <TabsContent value="securite">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-6"
          >
            {/* Changement de mot de passe */}
            <motion.div variants={cardVariants}>
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Key className="h-5 w-5" />
                    Changement de Mot de Passe
                  </CardTitle>
                  <CardDescription>
                    Mettez à jour votre mot de passe régulièrement pour la sécurité de votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="motPasseActuel">Mot de passe actuel</Label>
                    <div className="relative">
                      <Input
                        id="motPasseActuel"
                        type={showPassword.actuel ? "text" : "password"}
                        value={changementMotPasse.actuel}
                        onChange={(e) => setChangementMotPasse(prev => ({
                          ...prev,
                          actuel: e.target.value
                        }))}
                        placeholder="Votre mot de passe actuel"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword(prev => ({
                          ...prev,
                          actuel: !prev.actuel
                        }))}
                      >
                        {showPassword.actuel ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nouveauMotPasse">Nouveau mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="nouveauMotPasse"
                        type={showPassword.nouveau ? "text" : "password"}
                        value={changementMotPasse.nouveau}
                        onChange={(e) => setChangementMotPasse(prev => ({
                          ...prev,
                          nouveau: e.target.value
                        }))}
                        placeholder="Nouveau mot de passe (min. 6 caractères)"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword(prev => ({
                          ...prev,
                          nouveau: !prev.nouveau
                        }))}
                      >
                        {showPassword.nouveau ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmationMotPasse">Confirmation</Label>
                    <div className="relative">
                      <Input
                        id="confirmationMotPasse"
                        type={showPassword.confirmation ? "text" : "password"}
                        value={changementMotPasse.confirmation}
                        onChange={(e) => setChangementMotPasse(prev => ({
                          ...prev,
                          confirmation: e.target.value
                        }))}
                        placeholder="Confirmez le nouveau mot de passe"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword(prev => ({
                          ...prev,
                          confirmation: !prev.confirmation
                        }))}
                      >
                        {showPassword.confirmation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleChangerMotPasse}
                    className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={!changementMotPasse.nouveau || !changementMotPasse.confirmation}
                  >
                    <Lock className="h-4 w-4" />
                    Changer le mot de passe
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Informations de sécurité */}
            <motion.div variants={cardVariants}>
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Shield className="h-5 w-5" />
                    Sécurité du Compte
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>Dernière connexion :</strong> {formatDate(encadreur.updatedAt)}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      <strong>Statut du compte :</strong>{" "}
                      <Badge className={encadreur.statut === 'ACTIF' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-red-100 text-red-700'
                      }>
                        {encadreur.statut === 'ACTIF' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      <strong>Rôle :</strong> Encadreur
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        {/* Onglet Avancé */}
        <TabsContent value="avance">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-6"
          >
            {/* Export des données */}
            <motion.div variants={cardVariants}>
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Download className="h-5 w-5" />
                    Export des Données
                  </CardTitle>
                  <CardDescription>
                    Téléchargez une copie de vos données personnelles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Vous pouvez demander l'export de toutes vos données personnelles stockées sur notre plateforme, y compris vos informations de profil, historique d'encadrement et données professionnelles.
                  </p>
                  <Button
                    onClick={handleExportDonnees}
                    variant="outline"
                    className="gap-2 border-gray-300 dark:border-gray-600"
                  >
                    <Download className="h-4 w-4" />
                    Exporter mes données
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Suppression du compte */}
            <motion.div variants={cardVariants}>
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-red-200 dark:border-red-800 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <Trash2 className="h-5 w-5" />
                    Zone Dangereuse
                  </CardTitle>
                  <CardDescription className="text-red-600 dark:text-red-400">
                    Actions irréversibles - Soyez certain de vos choix
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      La suppression de votre compte est définitive. Toutes vos données, y compris les informations d'encadrement des stagiaires, seront supprimées de manière irréversible.
                    </p>
                    <Button
                      onClick={handleSupprimerCompte}
                      variant="outline"
                      className="gap-2 border-red-300 dark:border-red-600 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                      Supprimer mon compte
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}