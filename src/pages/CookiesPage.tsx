
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, Cookie, Settings, Info, CheckCircle } from 'lucide-react';

const CookiesPage = () => {
  const cookieTypes = [
    {
      name: "Cookies strictement nécessaires",
      description: "Essentiels pour le fonctionnement du site",
      icon: Shield,
      color: "from-green-500 to-emerald-500",
      required: true
    },
    {
      name: "Cookies de performance",
      description: "Nous aident à améliorer notre site",
      icon: Settings,
      color: "from-blue-500 to-indigo-500",
      required: false
    },
    {
      name: "Cookies fonctionnels",
      description: "Améliorent votre expérience utilisateur",
      icon: CheckCircle,
      color: "from-purple-500 to-pink-500",
      required: false
    },
    {
      name: "Cookies publicitaires",
      description: "Permettent la personnalisation des publicités",
      icon: Info,
      color: "from-orange-500 to-red-500",
      required: false
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10 dark:from-orange-500/5 dark:via-amber-500/5 dark:to-yellow-500/5">
          <div className="absolute inset-0 bg-grid-neutral-100/50 dark:bg-grid-neutral-800/50" />
          <div className="container mx-auto px-4 py-16 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-3 rounded-2xl shadow-lg">
                  <Cookie className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent mb-6">
                Politique de Cookies
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">
                Découvrez comment nous utilisons les cookies pour améliorer votre expérience sur notre site
              </p>
              
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-full px-6 py-3 w-fit mx-auto border border-orange-200 dark:border-orange-800">
                <p className="text-orange-700 dark:text-orange-400 font-medium">
                  Dernière mise à jour : Mai 2025
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Cookie Types Overview */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent">
                Types de cookies utilisés
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Voici un aperçu des différents types de cookies que nous utilisons et leur finalité
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {cookieTypes.map((type, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-white dark:bg-neutral-900">
                  <div className="flex items-start space-x-4">
                    <div className={`bg-gradient-to-r ${type.color} p-3 rounded-xl flex-shrink-0`}>
                      <type.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                          {type.name}
                        </h3>
                        {type.required && (
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs px-2 py-1 rounded-full">
                            Requis
                          </span>
                        )}
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Detailed Policy */}
          <Card className="p-8 md:p-12 border-0 bg-white dark:bg-neutral-900 shadow-sm">
            <div className="prose max-w-none dark:prose-invert">
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">1. Qu'est-ce qu'un cookie ?</h2>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <p className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
                    Un cookie est un petit fichier texte qui est stocké sur votre ordinateur ou appareil mobile lorsque vous visitez un site web. Les cookies sont largement utilisés pour faire fonctionner les sites web ou les rendre plus efficaces, ainsi que pour fournir des informations aux propriétaires du site.
                  </p>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Les cookies permettent à un site web de reconnaître votre appareil et de mémoriser des informations sur votre visite, comme vos préférences de langue, la taille de la police, et d'autres paramètres d'affichage. Cela signifie que vous n'avez pas à saisir à nouveau ces informations lorsque vous revenez sur le site ou naviguez de page en page.
                  </p>
                </div>
              </section>

              <Separator className="my-8" />

              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">2. Types de cookies que nous utilisons</h2>
                
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                    <h3 className="text-xl font-semibold mb-3 text-green-800 dark:text-green-300">2.1. Cookies strictement nécessaires</h3>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      Ces cookies sont essentiels pour vous permettre de naviguer sur notre site web et d'utiliser ses fonctionnalités, telles que l'accès aux zones sécurisées du site. Sans ces cookies, les services que vous avez demandés, comme les achats en ligne, ne peuvent pas être fournis.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                    <h3 className="text-xl font-semibold mb-3 text-blue-800 dark:text-blue-300">2.2. Cookies de performance</h3>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      Ces cookies collectent des informations sur la façon dont les visiteurs utilisent un site web, par exemple quelles pages ils visitent le plus souvent, et s'ils reçoivent des messages d'erreur. Ces cookies ne collectent pas d'informations qui identifient un visiteur. Toutes les informations collectées par ces cookies sont agrégées et donc anonymes. Elles ne sont utilisées que pour améliorer le fonctionnement du site.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                    <h3 className="text-xl font-semibold mb-3 text-purple-800 dark:text-purple-300">2.3. Cookies fonctionnels</h3>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      Ces cookies permettent au site web de se souvenir des choix que vous faites (comme votre nom d'utilisateur, votre langue ou la région dans laquelle vous vous trouvez) et de fournir des fonctionnalités améliorées et plus personnelles. Par exemple, un site web peut vous fournir des informations locales si il stocke dans un cookie la région dans laquelle vous vous trouvez actuellement.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
                    <h3 className="text-xl font-semibold mb-3 text-orange-800 dark:text-orange-300">2.4. Cookies de ciblage ou publicitaires</h3>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      Ces cookies sont utilisés pour diffuser des publicités plus pertinentes pour vous et vos intérêts. Ils sont également utilisés pour limiter le nombre de fois que vous voyez une publicité et pour aider à mesurer l'efficacité des campagnes publicitaires. Ils se souviennent que vous avez visité un site web et cette information est partagée avec d'autres organisations, comme les annonceurs.
                    </p>
                  </div>
                </div>
              </section>

              <Separator className="my-8" />

              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">3. Cookies tiers</h2>
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
                  <p className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
                    En plus de nos propres cookies, nous pouvons également utiliser divers cookies tiers pour signaler les statistiques d'utilisation du site, diffuser des publicités, etc. Ces cookies sont notamment :
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-neutral-700 dark:text-neutral-300">
                    <li><strong>Google Analytics</strong> : pour comprendre comment les visiteurs interagissent avec notre site</li>
                    <li><strong>Google Ads</strong> : pour mesurer l'efficacité de nos campagnes publicitaires</li>
                    <li><strong>Facebook Pixel</strong> : pour mesurer l'efficacité de nos publicités sur Facebook</li>
                    <li><strong>Hotjar</strong> : pour comprendre le comportement des utilisateurs sur notre site</li>
                  </ul>
                </div>
              </section>

              <Separator className="my-8" />

              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">4. Comment gérer les cookies</h2>
                <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 rounded-xl p-6 border border-neutral-200 dark:border-neutral-600">
                  <p className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
                    La plupart des navigateurs web vous permettent de contrôler la plupart des cookies via leurs paramètres. Vous pouvez généralement trouver ces paramètres dans le menu "options" ou "préférences" de votre navigateur. Pour comprendre ces paramètres, les liens suivants peuvent être utiles :
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-neutral-700 dark:text-neutral-300 mb-4">
                    <li><a href="https://support.google.com/chrome/answer/95647?hl=fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">Paramètres de cookies dans Chrome</a></li>
                    <li><a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">Paramètres de cookies dans Firefox</a></li>
                    <li><a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">Paramètres de cookies dans Edge</a></li>
                    <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">Paramètres de cookies dans Safari</a></li>
                  </ul>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Veuillez noter que la restriction des cookies peut avoir un impact sur les fonctionnalités de notre site web et de nombreux autres sites web que vous visitez. Par conséquent, il est recommandé de ne pas désactiver les cookies.
                  </p>
                </div>
              </section>

              <Separator className="my-8" />

              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">5. Consentement aux cookies</h2>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Lorsque vous visitez notre site pour la première fois, nous vous demanderons de consentir à l'utilisation de cookies. Vous pouvez choisir d'accepter tous les cookies, de rejeter tous les cookies non essentiels, ou de personnaliser vos préférences. Vous pouvez modifier vos préférences à tout moment en utilisant notre outil de gestion des cookies accessible via un lien dans le pied de page de notre site.
                  </p>
                </div>
              </section>

              <Separator className="my-8" />

              <section>
                <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">6. Contact</h2>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <p className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
                    Si vous avez des questions concernant notre politique de cookies, veuillez nous contacter à :
                  </p>
                  <div className="text-neutral-700 dark:text-neutral-300">
                    Email : <a href="mailto:cookies@rizikyboutique.fr" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">cookies@rizikyboutique.fr</a><br />
                    Adresse : 123 Avenue de la Mode, 75001 Paris, France
                  </div>
                </div>
              </section>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CookiesPage;
