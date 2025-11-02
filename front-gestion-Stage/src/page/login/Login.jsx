// Login.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, User, Lock, Mail, Building2, Users, GraduationCap, Briefcase, Clock, Search, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [userType, setUserType] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    userType: ''
  });

  // Animations pour le conteneur principal
  const pageVariants = {
    initial: { 
      opacity: 0,
      scale: 0.95
    },
    in: { 
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    out: {
      opacity: 0,
      scale: 1.05,
      transition: {
        duration: 0.4
      }
    }
  };

  // Animation pour la section gauche
  const leftSectionVariants = {
    hidden: { 
      opacity: 0,
      x: -50 
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  // Animation pour les éléments enfants
  const itemVariants = {
    hidden: { 
      y: 20, 
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Animation pour la section droite (formulaire)
  const formVariants = {
    hidden: { 
      opacity: 0,
      x: 50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.2
      }
    }
  };

  // Animation pour les onglets
  const tabContentVariants = {
    initial: {
      opacity: 0,
      y: 10,
      scale: 0.98
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.98,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    setVerificationStatus(null);
    setUserType('');
    setUserDetails(null);
    setRegisterData({
      email: '',
      password: '',
      confirmPassword: '',
      userType: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserTypeChange = (value) => {
    setUserType(value);
    setRegisterData(prev => ({
      ...prev,
      userType: value
    }));
    setVerificationStatus(null);
    setUserDetails(null);
  };

  // Vérifier si l'utilisateur existe dans la base de données ET s'il n'a pas déjà de compte du même type
  const verifyUserExists = async () => {
    if (!registerData.email || !userType) {
      toast.error('Veuillez remplir l\'email et sélectionner un type d\'utilisateur');
      return;
    }

    setIsVerifying(true);
    setVerificationStatus(null);
    setUserDetails(null);

    try {
      // D'abord, vérifier si un compte existe déjà avec cet email
      try {
        const comptesResponse = await axios.get(`http://localhost:9090/api/comptes-utilisateurs/email/${registerData.email}`);
        
        if (comptesResponse.data) {
          const existingCompte = comptesResponse.data;
          
          // Vérifier si le compte existant a le même type
          if (existingCompte.typeCompte === userType) {
            setVerificationStatus('already_exists_same_type');
            setUserDetails({
              type: 'EXISTING_ACCOUNT_SAME_TYPE',
              message: `Un compte ${getUserTypeLabel(userType)} existe déjà avec cet email`
            });
            toast.error(`Un compte ${getUserTypeLabel(userType)} existe déjà avec cet email`);
            return;
          } else {
            // Compte existe mais avec un type différent
            setVerificationStatus('already_exists_different_type');
            setUserDetails({
              type: 'EXISTING_ACCOUNT_DIFFERENT_TYPE',
              existingType: existingCompte.typeCompte,
              message: `Un compte ${getUserTypeLabel(existingCompte.typeCompte)} existe déjà avec cet email`
            });
            toast.error(`Un compte ${getUserTypeLabel(existingCompte.typeCompte)} existe déjà avec cet email`);
            return;
          }
        }
      } catch (error) {
        // Si erreur 404, c'est qu'aucun compte n'existe - c'est ce qu'on veut
        if (error.response?.status !== 404) {
          throw error;
        }
      }

      // Ensuite, vérifier si l'utilisateur existe dans la table métier correspondante
      let endpoint = '';
      let entityLabel = '';
      switch (userType) {
        case 'SUPERIEUR_HIERARCHIQUE':
          endpoint = 'superieurs-hierarchiques';
          entityLabel = 'supérieur hiérarchique';
          break;
        case 'ENCADREUR':
          endpoint = 'encadreurs';
          entityLabel = 'encadreur';
          break;
        case 'STAGIAIRE':
          endpoint = 'stagiaires';
          entityLabel = 'stagiaire';
          break;
        default:
          throw new Error('Type d\'utilisateur invalide');
      }

      const response = await axios.get(`http://localhost:9090/api/${endpoint}/email/${registerData.email}`);
      
      if (response.data) {
        setVerificationStatus('success');
        setUserDetails({
          type: 'FOUND_IN_DATABASE',
          data: response.data,
          message: `${getUserTypeLabel(userType)} vérifié(e) - Vous pouvez créer votre compte`
        });
        toast.success(`${getUserTypeLabel(userType)} vérifié(e) ! Vous pouvez maintenant créer votre compte`);
      } else {
        setVerificationStatus('not_found');
        setUserDetails({
          type: 'NOT_FOUND',
          message: `${getUserTypeLabel(userType)} non trouvé(e) dans notre base de données`
        });
        toast.error(`${getUserTypeLabel(userType)} non trouvé(e) dans notre base de données`);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setVerificationStatus('not_found');
        setUserDetails({
          type: 'NOT_FOUND',
          message: `${getUserTypeLabel(userType)} non trouvé(e) dans notre base de données`
        });
        toast.error(`${getUserTypeLabel(userType)} non trouvé(e) dans notre base de données`);
      } else {
        setVerificationStatus('error');
        toast.error('Erreur lors de la vérification');
        console.error('Verification error:', error);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Fonction utilitaire pour obtenir le libellé du type d'utilisateur
  const getUserTypeLabel = (type) => {
    const labels = {
      'SUPERIEUR_HIERARCHIQUE': 'supérieur hiérarchique',
      'ENCADREUR': 'encadreur',
      'STAGIAIRE': 'stagiaire',
      'ADMIN': 'administrateur'
    };
    return labels[type] || type;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:9090/api/comptes-utilisateurs/authenticate', {
        email: formData.email,
        password: formData.password
      });
      
      if (response.status === 200) {
        const userData = response.data;
        
        // Stocker les informations utilisateur
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.documentId);
        
        // Toast de succès avec durée plus longue
        toast.success(`Bienvenue ${userData.email} ! Redirection en cours...`, {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#10b981',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '10px',
            padding: '12px 16px',
          },
        });
        
        // Attendre un peu pour voir le toast avant la redirection
        setTimeout(() => {
          const dashboardRoute = getDashboardRoute(userData.typeCompte);
          window.location.href = dashboardRoute;
        }, 2000);
        
      }
    } catch (error) {
      // Toasts d'erreur avec durée plus longue et meilleur style
      if (error.response?.status === 401) {
        toast.error('Email ou mot de passe incorrect', {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#ef4444',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '10px',
            padding: '12px 16px',
          },
        });
      } else if (error.response?.status === 404) {
        toast.error('Utilisateur non trouvé', {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#f59e0b',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '10px',
            padding: '12px 16px',
          },
        });
      } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network')) {
        toast.error('Impossible de joindre le serveur. Vérifiez votre connexion.', {
          duration: 5000,
          position: 'top-right',
          style: {
            background: '#6366f1',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '10px',
            padding: '12px 16px',
          },
        });
      } else {
        toast.error('Erreur de connexion au serveur', {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#6b7280',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '10px',
            padding: '12px 16px',
          },
        });
      }
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    if (!verificationStatus || verificationStatus !== 'success') {
      toast.error('Veuillez d\'abord vérifier votre email');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (registerData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);

    try {
      // Créer le compte utilisateur avec l'entityDocumentId correct
      const response = await axios.post('http://localhost:9090/api/comptes-utilisateurs/create-for-entity', {
        email: registerData.email,
        password: registerData.password,
        typeCompte: userType,
        entityDocumentId: userDetails.data.documentId
      });

      if (response.status === 200) {
        toast.success('Compte créé avec succès ! Vous pouvez maintenant vous connecter', {
          duration: 5000,
          position: 'top-right',
          style: {
            background: '#10b981',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '10px',
            padding: '12px 16px',
          },
        });
        
        // Basculer vers l'onglet de connexion
        setTimeout(() => {
          setActiveTab('login');
          setFormData(prev => ({ ...prev, email: registerData.email }));
        }, 2000);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error('Un compte existe déjà avec cet email');
        setVerificationStatus('already_exists_same_type');
      } else {
        toast.error('Erreur lors de la création du compte');
        console.error('Registration error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction utilitaire pour la redirection
  const getDashboardRoute = (userType) => {
    const routes = {
      'ADMIN': '/admin/dashboard',
      'SUPERIEUR_HIERARCHIQUE': '/superieur/dashboard', 
      'ENCADREUR': '/encadreur/dashboard',
      'STAGIAIRE': '/stagiaire/dashboard'
    };
    return routes[userType] || '/login';
  };

  // Rendu du statut de vérification
  const renderVerificationStatus = () => {
    if (!verificationStatus) return null;

    const statusConfig = {
      success: {
        icon: CheckCircle,
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        borderColor: 'border-green-200',
        message: userDetails?.message || 'Utilisateur vérifié - Vous pouvez créer votre compte'
      },
      not_found: {
        icon: XCircle,
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        borderColor: 'border-red-200',
        message: userDetails?.message || 'Utilisateur non trouvé dans notre base de données'
      },
      already_exists_same_type: {
        icon: AlertCircle,
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-700',
        borderColor: 'border-orange-200',
        message: userDetails?.message || 'Un compte existe déjà avec cet email'
      },
      already_exists_different_type: {
        icon: AlertCircle,
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200',
        message: userDetails?.message || 'Un compte existe déjà avec cet email mais avec un type différent'
      },
      error: {
        icon: XCircle,
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        borderColor: 'border-red-200',
        message: 'Erreur lors de la vérification'
      }
    };

    const config = statusConfig[verificationStatus];
    const IconComponent = config.icon;

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className={`flex items-center gap-2 text-sm p-3 rounded-lg ${config.bgColor} ${config.textColor} ${config.borderColor} border`}
      >
        <IconComponent className="w-4 h-4 flex-shrink-0" />
        <span className="flex-1">{config.message}</span>
        {(verificationStatus === 'already_exists_same_type' || verificationStatus === 'already_exists_different_type') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('login')}
            className={`${verificationStatus === 'already_exists_same_type' ? 'text-orange-700 hover:text-orange-800 hover:bg-orange-100' : 'text-blue-700 hover:text-blue-800 hover:bg-blue-100'}`}
          >
            Se connecter
          </Button>
        )}
      </motion.div>
    );
  };

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '10px',
            padding: '12px 16px',
          },
        }}
      />
      
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 xl:gap-8 items-center">
            {/* Section gauche - Illustration et texte */}
            <motion.div
              className="hidden xl:flex flex-col xl:col-span-2 space-y-4"
              initial="hidden"
              animate="visible"
              variants={leftSectionVariants}
            >
              <motion.div
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.01,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg"
                    whileHover={{ rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <GraduationCap className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">G-stagiaire</h2>
                    <p className="text-blue-600 font-semibold text-sm mt-1">Gestion de Stagiaires</p>
                  </div>
                </div>
                
                <motion.div className="space-y-3" variants={leftSectionVariants}>
                  {[
                    { text: "Suivi personnalisé des stagiaires", icon: Users },
                    { text: "Suivi des Stage", icon: Briefcase },
                    { text: "Interface professionnelle", icon: Clock }
                  ].map((feature, index) => (
                    <motion.div 
                      key={feature.text}
                      className="flex items-center space-x-3 text-gray-700 p-2 rounded-lg hover:bg-white/50 transition-colors group"
                      variants={itemVariants}
                      whileHover={{ x: 4 }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                        <feature.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium">{feature.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Section mobile - Header compact */}
            <motion.div
              className="xl:hidden flex flex-col items-center text-center mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg mb-3">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                StageManager Pro
              </h1>
              <p className="text-gray-600 text-sm mt-1">Gestion professionnelle de stagiaires</p>
            </motion.div>

            {/* Section droite - Formulaire responsive */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={formVariants}
              className="xl:col-span-3 flex justify-center"
            >
              <motion.div
                whileHover={{ 
                  scale: 1.005,
                  transition: { duration: 0.2 }
                }}
                className="w-full max-w-lg xl:max-w-2xl"
              >
                <Card className="w-full shadow-xl border-0 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"
                  />
                  
                  <CardHeader className="space-y-2 text-center pb-6 pt-6 px-6 xl:px-8">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        duration: 0.6,
                        type: "spring",
                        stiffness: 100
                      }}
                      className="mx-auto mb-4 hidden xl:block"
                    >
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg">
                        <Building2 className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="hidden xl:block"
                    >
                      <CardTitle className="text-2xl xl:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        G-stagiaire
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-sm xl:text-base mt-2">
                        Accédez à votre espace professionnel
                      </CardDescription>
                    </motion.div>
                  </CardHeader>

                  <CardContent className="pb-6 px-6 xl:px-8">
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100/50 p-1 rounded-xl h-12">
                        {['login', 'register'].map((tab) => (
                          <TabsTrigger 
                            key={tab}
                            value={tab}
                            className="rounded-lg transition-all duration-200 data-[state=active]:shadow data-[state=active]:bg-white text-sm font-semibold h-10"
                            asChild
                          >
                            <motion.div
                              whileTap={{ scale: 0.95 }}
                              className="cursor-pointer flex items-center justify-center"
                            >
                              {tab === 'login' ? 'Connexion' : 'Inscription'}
                            </motion.div>
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeTab}
                          variants={tabContentVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          <TabsContent value={activeTab} className="m-0">
                            {activeTab === 'login' ? (
                              <motion.form 
                                onSubmit={handleLoginSubmit} 
                                className="space-y-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                              >
                                <motion.div 
                                  className="space-y-2"
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.15 }}
                                >
                                  <Label htmlFor="email" className="text-sm font-semibold flex items-center">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Email professionnel
                                  </Label>
                                  <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 border h-12 rounded-lg text-sm"
                                    disabled={isLoading}
                                  />
                                </motion.div>

                                <motion.div 
                                  className="space-y-2"
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.2 }}
                                >
                                  <Label htmlFor="password" className="text-sm font-semibold flex items-center">
                                    <Lock className="w-4 h-4 mr-2" />
                                    Mot de passe
                                  </Label>
                                  <div className="relative">
                                    <Input
                                      id="password"
                                      name="password"
                                      type={showPassword ? "text" : "password"}
                                      placeholder="Votre mot de passe"
                                      value={formData.password}
                                      onChange={handleInputChange}
                                      required
                                      className="pr-12 transition-all duration-200 focus:ring-2 focus:ring-blue-500 border h-12 rounded-lg text-sm"
                                      disabled={isLoading}
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-transparent"
                                      onClick={() => setShowPassword(!showPassword)}
                                      disabled={isLoading}
                                    >
                                      <motion.div
                                        whileTap={{ scale: 0.9 }}
                                      >
                                        {showPassword ? (
                                          <EyeOff className="h-4 w-4 text-gray-500" />
                                        ) : (
                                          <Eye className="h-4 w-4 text-gray-500" />
                                        )}
                                      </motion.div>
                                    </Button>
                                  </div>
                                </motion.div>

                                <motion.div
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.25 }}
                                  className="pt-2"
                                >
                                  <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 h-12 rounded-lg text-white font-semibold text-sm shadow-md"
                                    disabled={isLoading}
                                  >
                                    {isLoading ? (
                                      <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                      />
                                    ) : (
                                      <motion.span
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center justify-center"
                                      >
                                        Se connecter
                                      </motion.span>
                                    )}
                                  </Button>
                                </motion.div>
                              </motion.form>
                            ) : (
                              <motion.form 
                                onSubmit={handleRegisterSubmit} 
                                className="space-y-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                              >
                                {/* Type d'utilisateur */}
                                <motion.div 
                                  className="space-y-2"
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.15 }}
                                >
                                  <Label htmlFor="userType" className="text-sm font-semibold flex items-center">
                                    <User className="w-4 h-4 mr-2" />
                                    Type d'utilisateur
                                  </Label>
                                  <Select value={userType} onValueChange={handleUserTypeChange}>
                                    <SelectTrigger className="h-12">
                                      <SelectValue placeholder="Sélectionnez votre profil" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                      <SelectItem value="SUPERIEUR_HIERARCHIQUE">Supérieur Hiérarchique</SelectItem>
                                      <SelectItem value="ENCADREUR">Encadreur</SelectItem>
                                      <SelectItem value="STAGIAIRE">Stagiaire</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </motion.div>

                                {/* Email avec vérification */}
                                <motion.div 
                                  className="space-y-2"
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.2 }}
                                >
                                  <Label htmlFor="register-email" className="text-sm font-semibold flex items-center">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Email professionnel
                                  </Label>
                                  <div className="flex gap-2">
                                    <Input
                                      id="register-email"
                                      name="email"
                                      type="email"
                                      placeholder="votre.email@entreprise.mg"
                                      value={registerData.email}
                                      onChange={handleRegisterInputChange}
                                      required
                                      className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-blue-500 border h-12 rounded-lg text-sm"
                                      disabled={isLoading || isVerifying}
                                    />
                                    <Button
                                      type="button"
                                      onClick={verifyUserExists}
                                      disabled={!registerData.email || !userType || isVerifying || isLoading}
                                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12 px-4"
                                    >
                                      {isVerifying ? (
                                        <motion.div
                                          animate={{ rotate: 360 }}
                                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                        />
                                      ) : (
                                        <Search className="w-4 h-4" />
                                      )}
                                    </Button>
                                  </div>
                                  
                                  {/* Statut de vérification */}
                                  {renderVerificationStatus()}
                                </motion.div>

                                {/* Mot de passe et confirmation */}
                                {verificationStatus === 'success' && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="grid grid-cols-1 xl:grid-cols-2 gap-4"
                                  >
                                    <div className="space-y-2">
                                      <Label htmlFor="register-password" className="text-sm font-semibold flex items-center">
                                        <Lock className="w-4 h-4 mr-2" />
                                        Mot de passe
                                      </Label>
                                      <div className="relative">
                                        <Input
                                          id="register-password"
                                          name="password"
                                          type={showPassword ? "text" : "password"}
                                          placeholder="Mot de passe"
                                          value={registerData.password}
                                          onChange={handleRegisterInputChange}
                                          required
                                          className="pr-12 transition-all duration-200 focus:ring-2 focus:ring-blue-500 border h-12 rounded-lg text-sm"
                                          disabled={isLoading}
                                        />
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-transparent"
                                          onClick={() => setShowPassword(!showPassword)}
                                          disabled={isLoading}
                                        >
                                          {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-500" />
                                          ) : (
                                            <Eye className="h-4 w-4 text-gray-500" />
                                          )}
                                        </Button>
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="confirm-password" className="text-sm font-semibold flex items-center">
                                        <Lock className="w-4 h-4 mr-2" />
                                        Confirmation
                                      </Label>
                                      <div className="relative">
                                        <Input
                                          id="confirm-password"
                                          name="confirmPassword"
                                          type={showConfirmPassword ? "text" : "password"}
                                          placeholder="Confirmez le mot de passe"
                                          value={registerData.confirmPassword}
                                          onChange={handleRegisterInputChange}
                                          required
                                          className="pr-12 transition-all duration-200 focus:ring-2 focus:ring-blue-500 border h-12 rounded-lg text-sm"
                                          disabled={isLoading}
                                        />
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-transparent"
                                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                          disabled={isLoading}
                                        >
                                          {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-500" />
                                          ) : (
                                            <Eye className="h-4 w-4 text-gray-500" />
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}

                                <motion.div
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.4 }}
                                  className="pt-2"
                                >
                                  <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-200 h-12 rounded-lg text-white font-semibold text-sm shadow-md"
                                    disabled={isLoading || verificationStatus !== 'success'}
                                  >
                                    {isLoading ? (
                                      <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                      />
                                    ) : (
                                      <motion.span
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center justify-center"
                                      >
                                        Créer mon compte
                                      </motion.span>
                                    )}
                                  </Button>
                                </motion.div>
                              </motion.form>
                            )}
                          </TabsContent>
                        </motion.div>
                      </AnimatePresence>
                    </Tabs>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-4 text-center text-xs text-gray-600 p-3 bg-blue-50/50 rounded-lg border border-blue-100"
                    >
                      <p className="font-semibold mb-2">Comptes de test disponibles :</p>
                      <div className="text-left space-y-1 text-[11px]">
                        <p><strong>Admin:</strong> admin@stage.mg / admin123</p>
                        <p><strong>Superieur:</strong> s.randria@entreprise.mg / superieur123</p>
                        <p><strong>Encadreur:</strong> p.rasoa@entreprise.mg / encadreur123</p>
                        <p><strong>Stagiaire:</strong> n.rabe@etudiant.mg / stagiaire123</p>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Login;