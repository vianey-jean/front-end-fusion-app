
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Cookie, Shield, Settings, ExternalLink, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const CookiesPage = () => {
  const cookieTypes = [
    {
      title: "Cookies strictement nécessaires",
      description: "Essentiels pour le fonctionnement du site",
      color: "from-red-500 to-red-600",
      bgColor: "from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20"
    },
    {
      title: "Cookies de performance",
      description: "Collectent des informations anonymes sur l'utilisation",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20"
    },
    {
      title: "Cookies fonctionnels",
      description: "Améliorent l'expérience utilisateur",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20"
    },
    {
      title: "Cookies publicitaires",
      description: "Diffusent des publicités pertinentes",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20"
    }
  ];

  const thirdPartyCookies = [
    { name: "Google Analytics", purpose: "Comprendre l'interaction des visiteurs" },
    { name: "Google Ads", purpose: "Mesurer l'efficacité des campagnes" },
    { name: "Facebook Pixel", purpose: "Mesurer l'efficacité des publicités Facebook" },
    { name: "Hotjar", purpose: "Analyser le comportement des utilisateurs" }
  ];

  const browserLinks = [
    { name: "Chrome", url: "https://support.google.com/chrome/answer/95647?hl=fr" },
    { name: "Firefox", url: "https://support.mozilla.org/fr/kb/activer-desactiver-cookies" },
    { name: "Edge", url: "https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" },
    { name: "Safari", url: "https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-amber-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-amber-950/30">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-4 rounded-2xl shadow-xl">
                <Cookie className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-800 to-orange-600 bg-clip-text text-transparent mb-4">
              Politique de Cookies
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              <p className="text-neutral-600 dark:text-neutral-400">Dernière mise à jour : Mai 2025</p>
            </div>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
              Découvrez comment nous utilisons les cookies pour améliorer votre expérience sur notre site
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto space-y-8">
            {/* What is a cookie */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-3 bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">
                    <Shield className="h-8 w-8 text-amber-600" />
                    Qu'est-ce qu'un cookie ?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Un cookie est un petit fichier texte qui est stocké sur votre ordinateur ou appareil mobile lorsque vous visitez un site web. Les cookies sont largement utilisés pour faire fonctionner les sites web ou les rendre plus efficaces, ainsi que pour fournir des informations aux propriétaires du site.
                  </p>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Les cookies permettent à un site web de reconnaître votre appareil et de mémoriser des informations sur votre visite, comme vos préférences de langue, la taille de la police, et d'autres paramètres d'affichage. Cela signifie que vous n'avez pas à saisir à nouveau ces informations lorsque vous revenez sur le site ou naviguez de page en page.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Types of cookies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">
                    Types de cookies que nous utilisons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {cookieTypes.map((type, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className={`p-6 rounded-xl bg-gradient-to-r ${type.bgColor} border border-neutral-200 dark:border-neutral-700`}
                      >
                        <div className="flex items-start gap-4">
                          <Badge className={`bg-gradient-to-r ${type.color} text-white border-0 px-3 py-1`}>
                            {index + 1}
                          </Badge>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                              {type.title}
                            </h3>
                            <p className="text-neutral-700 dark:text-neutral-300">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Third party cookies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">
                    Cookies tiers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
                    En plus de nos propres cookies, nous pouvons également utiliser divers cookies tiers pour signaler les statistiques d'utilisation du site, diffuser des publicités, etc. Ces cookies sont notamment :
                  </p>
                  <div className="grid gap-4">
                    {thirdPartyCookies.map((cookie, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-600"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          <span className="font-medium text-neutral-900 dark:text-neutral-100">
                            {cookie.name}
                          </span>
                        </div>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {cookie.purpose}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Managing cookies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-3 bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">
                    <Settings className="h-8 w-8 text-amber-600" />
                    Comment gérer les cookies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
                    La plupart des navigateurs web vous permettent de contrôler la plupart des cookies via leurs paramètres. Vous pouvez généralement trouver ces paramètres dans le menu "options" ou "préférences" de votre navigateur. Pour comprendre ces paramètres, les liens suivants peuvent être utiles :
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {browserLinks.map((browser, index) => (
                      <a
                        key={index}
                        href={browser.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                      >
                        <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg border border-amber-200 dark:border-amber-800 hover:shadow-lg transition-all duration-300 text-center">
                          <ExternalLink className="h-6 w-6 text-amber-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            {browser.name}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                      <strong>Note importante :</strong> La restriction des cookies peut avoir un impact sur les fonctionnalités de notre site web et de nombreux autres sites web que vous visitez. Par conséquent, il est recommandé de ne pas désactiver les cookies.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Consent and Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="grid md:grid-cols-2 gap-8"
            >
              <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-600 to-orange-600 text-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Consentement aux cookies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-amber-100 leading-relaxed">
                    Lorsque vous visitez notre site pour la première fois, nous vous demanderons de consentir à l'utilisation de cookies. Vous pouvez choisir d'accepter tous les cookies, de rejeter tous les cookies non essentiels, ou de personnaliser vos préférences.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">
                    Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
                    Si vous avez des questions concernant notre politique de cookies, veuillez nous contacter à :
                  </p>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Email :</strong>{' '}
                      <a href="mailto:cookies@rizikyboutique.fr" className="text-amber-600 hover:underline">
                        cookies@rizikyboutique.fr
                      </a>
                    </div>
                    <div>
                      <strong>Adresse :</strong> 123 Avenue de la Mode, 75001 Paris, France
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CookiesPage;
