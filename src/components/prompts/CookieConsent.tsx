
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Cookie, X, ExternalLink, Shield, Lock, Eye, Target, Zap } from 'lucide-react';
import { toast } from "sonner";

// Interface pour les préférences de cookies
interface CookiePreferences {
  essential: boolean;
  performance: boolean;
  functional: boolean;
  targeting: boolean;
  consentDate: string;
  version: string;
}

const COOKIE_POLICY_VERSION = "1.0";

const CookieConsent: React.FC = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    performance: false,
    functional: false,
    targeting: false,
    consentDate: new Date().toISOString(),
    version: COOKIE_POLICY_VERSION
  });
  
  // Vérifier si l'utilisateur a déjà donné son consentement
  useEffect(() => {
    const consentGiven = localStorage.getItem('cookie-consent');
    if (!consentGiven) {
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      try {
        const savedPreferences = JSON.parse(consentGiven);
        
        if (typeof savedPreferences === 'object' && savedPreferences.version !== COOKIE_POLICY_VERSION) {
          setShowConsent(true);
        } else if (typeof savedPreferences === 'object') {
          setPreferences(savedPreferences);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des préférences de cookies:', error);
        setShowConsent(true);
      }
    }
  }, []);
  
  const savePreferences = (prefs: CookiePreferences) => {
    const prefsToSave = {
      ...prefs,
      consentDate: new Date().toISOString(),
      version: COOKIE_POLICY_VERSION
    };
    
    localStorage.setItem('cookie-consent', JSON.stringify(prefsToSave));
    setPreferences(prefsToSave);
    setShowConsent(false);
    
    applyConsentPreferences(prefsToSave);
    
    toast.success("Vos préférences de cookies ont été enregistrées", {
      description: "Vous pouvez les modifier à tout moment via l'icône cookie en bas de page",
      duration: 5000,
    });
  };
  
  const applyConsentPreferences = (prefs: CookiePreferences) => {
    console.log("Applying consent preferences:", prefs);
    
    if (prefs.performance) {
      console.log("Google Analytics enabled");
    } else {
      console.log("Google Analytics disabled");
    }
    
    if (prefs.targeting) {
      console.log("Facebook Pixel enabled");
    } else {
      console.log("Facebook Pixel disabled");
    }
  };
  
  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      performance: true,
      functional: true,
      targeting: true,
      consentDate: new Date().toISOString(),
      version: COOKIE_POLICY_VERSION
    };
    savePreferences(allAccepted);
  };
  
  const acceptEssential = () => {
    const essentialOnly = {
      essential: true,
      performance: false,
      functional: false,
      targeting: false,
      consentDate: new Date().toISOString(),
      version: COOKIE_POLICY_VERSION
    };
    savePreferences(essentialOnly);
  };
  
  const saveCustomPreferences = () => {
    savePreferences({
      ...preferences,
      essential: true,
      consentDate: new Date().toISOString(),
      version: COOKIE_POLICY_VERSION
    });
  };
  
  const togglePreference = (type: keyof Omit<CookiePreferences, 'consentDate' | 'version'>) => {
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  const dismiss = () => {
    setShowConsent(false);
  };

  const cookieTypes = [
    {
      key: 'essential' as const,
      title: 'Cookies essentiels',
      description: 'Nécessaires au fonctionnement du site',
      icon: Lock,
      disabled: true,
      gradient: 'from-gray-100 to-slate-100',
      iconColor: 'text-gray-600'
    },
    {
      key: 'performance' as const,
      title: 'Cookies de performance',
      description: 'Analyse des visites pour améliorer le site',
      icon: Eye,
      disabled: false,
      gradient: 'from-blue-100 to-cyan-100',
      iconColor: 'text-blue-600'
    },
    {
      key: 'functional' as const,
      title: 'Cookies fonctionnels',
      description: 'Se souvenir de vos préférences',
      icon: Zap,
      disabled: false,
      gradient: 'from-green-100 to-emerald-100',
      iconColor: 'text-green-600'
    },
    {
      key: 'targeting' as const,
      title: 'Cookies de publicité',
      description: 'Personnalisation des publicités',
      icon: Target,
      disabled: false,
      gradient: 'from-purple-100 to-violet-100',
      iconColor: 'text-purple-600'
    }
  ];
  
  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border-2 border-gray-200 dark:border-neutral-800 overflow-hidden"
            initial={{ y: 100, scale: 0.9, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 100, scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, type: "spring", damping: 20 }}
          >
            {/* Header avec gradient */}
            <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Cookie className="h-8 w-8" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">🍪 Gestion des cookies</h3>
                    <motion.div
                      className="flex items-center gap-2 text-sm bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Shield className="h-4 w-4" />
                      <span>Conforme au RGPD et à la directive ePrivacy</span>
                    </motion.div>
                  </div>
                </div>
                <motion.button 
                  onClick={dismiss} 
                  className="text-white/80 hover:text-white bg-white/20 rounded-full p-2 backdrop-blur-sm transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>
              
              {/* Particules décoratives */}
              <div className="absolute top-4 right-20 opacity-30">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨
                </motion.div>
              </div>
            </div>
            
            <div className="p-6">
              <motion.p 
                className="text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Nous utilisons des cookies pour améliorer votre expérience de navigation, 
                personnaliser le contenu et les publicités, fournir des fonctionnalités de 
                médias sociaux et analyser notre trafic. Vous avez le droit de contrôler vos données personnelles.
              </motion.p>
              
              {showDetails && (
                <motion.div 
                  className="mb-6 space-y-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.4 }}
                >
                  {cookieTypes.map((cookieType, index) => (
                    <motion.div
                      key={cookieType.key}
                      className={`flex items-center justify-between p-4 bg-gradient-to-r ${cookieType.gradient} rounded-xl border border-gray-200 dark:border-neutral-700`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 bg-white rounded-lg shadow-sm`}>
                          <cookieType.icon className={`h-5 w-5 ${cookieType.iconColor}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">{cookieType.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{cookieType.description}</p>
                        </div>
                      </div>
                      <motion.input 
                        type="checkbox" 
                        checked={preferences[cookieType.key]} 
                        disabled={cookieType.disabled}
                        onChange={() => !cookieType.disabled && togglePreference(cookieType.key)} 
                        className="h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500 disabled:opacity-50"
                        whileHover={!cookieType.disabled ? { scale: 1.1 } : {}}
                        aria-label={`Accepter les ${cookieType.title.toLowerCase()}`}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg" 
                    onClick={acceptAll}
                  >
                    ✅ Accepter tous les cookies
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto border-2 hover:bg-gray-50 dark:hover:bg-neutral-800" 
                    onClick={showDetails ? saveCustomPreferences : acceptEssential}
                  >
                    {showDetails ? '💾 Enregistrer mes préférences' : '🔒 Cookies essentiels uniquement'}
                  </Button>
                </motion.div>
                
                <Button
                  variant="link"
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold"
                >
                  {showDetails ? '👆 Masquer les détails' : '⚙️ Personnaliser'}
                </Button>
              </div>
              
              <motion.div 
                className="flex flex-wrap gap-4 text-xs text-neutral-500 justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Link 
                  to="/politique-cookies" 
                  className="flex items-center hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  📋 Politique de cookies <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
                <span>•</span>
                <Link 
                  to="/politique-confidentialite" 
                  className="flex items-center hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  🔐 Politique de confidentialité <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
                <span>•</span>
                <Link 
                  to="/mentions-legales" 
                  className="flex items-center hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  ⚖️ Mentions légales <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
