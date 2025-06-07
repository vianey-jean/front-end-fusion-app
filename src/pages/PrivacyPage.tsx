
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, Database, UserCheck, Settings, AlertTriangle, Mail } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 dark:from-blue-500/5 dark:via-cyan-500/5 dark:to-teal-500/5">
          <div className="absolute inset-0 bg-grid-neutral-100/50 dark:bg-grid-neutral-800/50" />
          <div className="container mx-auto px-4 py-16 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-2xl shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-6">
                Politique de Confidentialité
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed">
                Votre vie privée est notre priorité. Découvrez comment nous protégeons et utilisons vos données personnelles.
              </p>
              
              <div className="flex items-center justify-center space-x-8 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-blue-500" />
                  <span>Sécurité renforcée</span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5 text-cyan-500" />
                  <span>RGPD conforme</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-teal-500" />
                  <span>Transparence totale</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Collecte des données */}
            <Card className="shadow-xl border-0 bg-white dark:bg-neutral-900 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-6 border-b border-blue-200 dark:border-blue-800">
                <CardHeader className="p-0">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
                      <Database className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      Collecte des données
                    </CardTitle>
                  </div>
                </CardHeader>
              </div>
              <CardContent className="p-8">
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <h4 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
                    Données que nous collectons :
                  </h4>
                  <ul className="space-y-3 text-neutral-600 dark:text-neutral-300">
                    <li className="flex items-start space-x-2">
                      <UserCheck className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Informations personnelles :</strong> nom, prénom, adresse email, numéro de téléphone</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <UserCheck className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Données de commande :</strong> historique d'achats, préférences produits</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <UserCheck className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Données techniques :</strong> adresse IP, cookies, données de navigation</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <UserCheck className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Communications :</strong> messages, avis, commentaires</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Utilisation des données */}
            <Card className="shadow-xl border-0 bg-white dark:bg-neutral-900 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 border-b border-green-200 dark:border-green-800">
                <CardHeader className="p-0">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
                      <Settings className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      Utilisation des données
                    </CardTitle>
                  </div>
                </CardHeader>
              </div>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">
                      🎯 Finalités principales
                    </h4>
                    <ul className="space-y-2 text-neutral-600 dark:text-neutral-300">
                      <li>• Traitement et suivi des commandes</li>
                      <li>• Service client et support</li>
                      <li>• Personnalisation de l'expérience</li>
                      <li>• Recommandations produits</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">
                      📧 Communication marketing
                    </h4>
                    <ul className="space-y-2 text-neutral-600 dark:text-neutral-300">
                      <li>• Newsletters (avec consentement)</li>
                      <li>• Offres promotionnelles</li>
                      <li>• Nouveautés et actualités</li>
                      <li>• Programmes de fidélité</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Protection des données */}
            <Card className="shadow-xl border-0 bg-white dark:bg-neutral-900 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 p-6 border-b border-purple-200 dark:border-purple-800">
                <CardHeader className="p-0">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-purple-500 to-violet-500 p-2 rounded-lg">
                      <Lock className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                      Protection et sécurité
                    </CardTitle>
                  </div>
                </CardHeader>
              </div>
              <CardContent className="p-8">
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                    Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre tout accès non autorisé, toute divulgation, altération ou destruction.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                      <h5 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">🔒 Chiffrement SSL</h5>
                      <p className="text-sm text-purple-600 dark:text-purple-300">Toutes les données sont cryptées</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                      <h5 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">🛡️ Serveurs sécurisés</h5>
                      <p className="text-sm text-purple-600 dark:text-purple-300">Infrastructure protégée 24/7</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                      <h5 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">👥 Accès limité</h5>
                      <p className="text-sm text-purple-600 dark:text-purple-300">Personnel autorisé uniquement</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vos droits */}
            <Card className="shadow-xl border-0 bg-white dark:bg-neutral-900 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 p-6 border-b border-orange-200 dark:border-orange-800">
                <CardHeader className="p-0">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-2 rounded-lg">
                      <UserCheck className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                      Vos droits RGPD
                    </CardTitle>
                  </div>
                </CardHeader>
              </div>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-orange-600 dark:text-orange-400">
                      ✅ Droits d'accès et de contrôle
                    </h4>
                    <ul className="space-y-3 text-neutral-600 dark:text-neutral-300">
                      <li className="flex items-start space-x-2">
                        <Eye className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span>Droit d'accès à vos données</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Settings className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span>Droit de rectification</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span>Droit à l'effacement</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Lock className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span>Droit à la portabilité</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-orange-600 dark:text-orange-400">
                      📝 Comment exercer vos droits
                    </h4>
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
                      <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                        Pour exercer vos droits, contactez-nous :
                      </p>
                      <div className="space-y-2 text-sm">
                        <p className="text-orange-700 dark:text-orange-400">
                          📧 privacy@riziky-boutic.fr
                        </p>
                        <p className="text-orange-700 dark:text-orange-400">
                          📞 +33 (0)1 23 45 67 89
                        </p>
                        <p className="text-orange-700 dark:text-orange-400">
                          ⏰ Réponse sous 48h maximum
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-800">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-2xl">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Questions sur la confidentialité ?
                </h3>
                <p className="text-blue-700 dark:text-blue-400 mb-4">
                  Notre délégué à la protection des données est à votre disposition.
                </p>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  <p>Email : dpo@riziky-boutic.fr</p>
                  <p>Réponse garantie sous 72h</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPage;
