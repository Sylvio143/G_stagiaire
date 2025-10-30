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
  Upload,
  Save,
  Edit,
  Camera,
  Key,
  Trash2,
  Settings,
  Eye,
  EyeOff,
  IdCard,
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

export default function AdminParametre() {
  const [admin, setAdmin] = useState(null);
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

  // Charger les données de l'admin
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      // Récupérer le premier admin (vous devrez adapter selon votre auth)
      const response = await axios.get(`${API_BASE_URL}/admins`);
      if (response.data && response.data.length > 0) {
        setAdmin(response.data[0]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données admin:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleInputChange = (field, value) => {
    setAdmin(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSauvegarder = async () => {
    try {
      if (!admin) return;

      await axios.put(`${API_BASE_URL}/admins/${admin.documentId}`, {
        id: admin.id,
        nom: admin.nom,
        prenom: admin.prenom,
        email: admin.email,
        telephone: admin.telephone,
        cin: admin.cin,
        fonction: admin.fonction,
        statut: admin.statut
      });

      toast.success("Profil modifié avec succès");
      setModification(false);
      await fetchAdminData(); // Recharger les données
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error("Erreur lors de la modification du profil");
    }
  };

  const handleChangerMotPasse = async () => {
    try {
      if (!admin) return;

      if (changementMotPasse.nouveau !== changementMotPasse.confirmation) {
        toast.error("Les mots de passe ne correspondent pas");
        return;
      }

      if (changementMotPasse.nouveau.length < 6) {
        toast.error("Le mot de passe doit contenir au moins 6 caractères");
        return;
      }

      // Utiliser l'endpoint de changement de mot de passe des comptes
      await axios.put(`${API_BASE_URL}/comptes-utilisateurs/${admin.documentId}/password`, {
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
      if (!admin) return;

      await axios.delete(`${API_BASE_URL}/admins/${admin.documentId}`);
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

  if (!admin) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Aucune donnée admin trouvée</p>
        </div>
      </div>
    );
  }

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
              Paramètres du Compte Administrateur
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
                    fetchAdminData(); // Recharger les données originales
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
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl">
                            {admin.prenom?.[0]}{admin.nom?.[0]}
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
                          {admin.prenom} {admin.nom}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {admin.fonction}
                        </p>
                        <Badge className="mt-2 bg-gradient-to-r from-red-500 to-pink-500 text-white">
                          Administrateur
                        </Badge>
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
                      <Briefcase className="h-5 w-5" />
                      Informations Système
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        ID: {admin.documentId}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Identifiant unique
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>Créé le {formatDate(admin.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>Modifié le {formatDate(admin.updatedAt)}</span>
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
                          value={admin.prenom || ""}
                          onChange={(e) => handleInputChange('prenom', e.target.value)}
                          disabled={!modification}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nom">Nom *</Label>
                        <Input
                          id="nom"
                          value={admin.nom || ""}
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
                          value={admin.email || ""}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!modification}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telephone">Téléphone *</Label>
                        <Input
                          id="telephone"
                          value={admin.telephone || ""}
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
                          value={admin.cin || ""}
                          onChange={(e) => handleInputChange('cin', e.target.value)}
                          disabled={!modification}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fonction">Fonction *</Label>
                        <Input
                          id="fonction"
                          value={admin.fonction || ""}
                          onChange={(e) => handleInputChange('fonction', e.target.value)}
                          disabled={!modification}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="statut">Statut</Label>
                      <div className="flex items-center gap-4">
                        <Badge className={admin.statut === 'ACTIF' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-red-100 text-red-700'
                        }>
                          {admin.statut === 'ACTIF' ? 'Actif' : 'Inactif'}
                        </Badge>
                        {modification && (
                          <select
                            value={admin.statut}
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
                    id="notifications-rappels"
                    checked={true}
                    onCheckedChange={() => {}}
                    label="Rappels automatiques"
                    description="Rappels pour les échéances importantes"
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
                      <strong>Dernière connexion :</strong> {formatDate(admin.updatedAt)}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      <strong>Statut du compte :</strong>{" "}
                      <Badge className={admin.statut === 'ACTIF' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-red-100 text-red-700'
                      }>
                        {admin.statut === 'ACTIF' ? 'Actif' : 'Inactif'}
                      </Badge>
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
                    Vous pouvez demander l'export de toutes vos données personnelles stockées sur notre plateforme.
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
                      La suppression de votre compte est définitive. Toutes vos données seront supprimées de manière irréversible.
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