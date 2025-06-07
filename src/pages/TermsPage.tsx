import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, Shield, Clock, Mail } from 'lucide-react';

const TermsPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-red-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-red-950/30">
        <div className="container mx-auto py-12 px-4">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-2xl shadow-lg">
                <FileText className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-800 to-red-600 bg-clip-text text-transparent mb-4">
              Conditions Générales d'Utilisation
            </h1>
            <div className="flex items-center justify-center gap-2 text-neutral-600 dark:text-neutral-400">
              <Clock className="h-4 w-4" />
              <p>Dernière mise à jour : Mai 2025</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-8 md:p-12 shadow-xl border-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
              <div className="prose max-w-none">
                <section className="mb-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-0">Introduction</h2>
                  </div>
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-6 rounded-xl border border-red-100 dark:border-red-900/30 mb-6">
                    <p className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
                      Bienvenue sur Riziky Boutique. Les présentes Conditions Générales d'Utilisation régissent l'utilisation de notre site web et de tous les services associés. En accédant à notre site, vous acceptez de vous conformer à ces conditions et de les respecter. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site.
                    </p>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Riziky Boutique se réserve le droit de modifier ces conditions à tout moment. Vous serez informé des changements importants, mais il est de votre responsabilité de consulter régulièrement cette page pour vous tenir informé des mises à jour.
                  </p>
                </section>

                <Separator className="my-8 bg-gradient-to-r from-transparent via-red-200 to-transparent" />

                <section className="mb-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-0">Utilisation du Site</h2>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
                    En utilisant notre site, vous vous engagez à :
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {[
                      "Fournir des informations exactes et complètes lors de la création d'un compte ou lors d'une commande",
                      "Maintenir la confidentialité de votre mot de passe et assumer l'entière responsabilité de toutes les activités effectuées sous votre compte",
                      "Ne pas utiliser le site d'une manière qui pourrait l'endommager ou compromettre sa sécurité",
                      "Ne pas tenter d'accéder à des sections restreintes du site sans autorisation",
                      "Ne pas utiliser le site pour des activités illégales ou non autorisées"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">{item}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Nous nous réservons le droit de refuser le service, de fermer des comptes ou de supprimer ou modifier du contenu à notre seule discrétion.
                  </p>
                </section>

                <Separator className="my-8 bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

                <section className="mb-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-0">Comptes Utilisateur</h2>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 rounded-xl border border-green-100 dark:border-green-900/30 mb-6">
                    <p className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
                      Lorsque vous créez un compte sur notre site, vous devez fournir des informations exactes, complètes et à jour. Le non-respect de cette obligation constitue une violation des Conditions Générales d'Utilisation et peut entraîner la résiliation immédiate de votre compte.
                    </p>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Vous êtes responsable de la protection de votre mot de passe et de votre compte. Vous acceptez de ne pas révéler votre mot de passe à des tiers. Vous devez nous informer immédiatement de toute utilisation non autorisée de votre compte ou de toute autre violation de sécurité.
                  </p>
                </section>

                <Separator className="my-8 bg-gradient-to-r from-transparent via-green-200 to-transparent" />

                <section className="mb-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                      4
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-0">Produits et Services</h2>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-lime-50 dark:from-yellow-950/20 dark:to-lime-950/20 p-6 rounded-xl border border-yellow-100 dark:border-yellow-900/30 mb-6">
                    <p className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
                      Tous les produits et services sont soumis à disponibilité. Les descriptions des produits et leurs prix sont susceptibles d'être modifiés à tout moment sans préavis, à notre seule discrétion.
                    </p>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Nous nous réservons le droit de limiter les quantités de produits commandés. Nous nous réservons également le droit de refuser une commande à notre seule discrétion.
                  </p>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Les couleurs des produits affichés sur le site peuvent varier légèrement des couleurs réelles en raison des paramètres d'affichage de votre écran.
                  </p>
                </section>

                <Separator className="my-8 bg-gradient-to-r from-transparent via-yellow-200 to-transparent" />

                <section className="mb-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                      5
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-0">Commandes et Paiements</h2>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 p-6 rounded-xl border border-purple-100 dark:border-purple-900/30 mb-6">
                    <p className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
                      Lorsque vous passez une commande, vous vous engagez à fournir des informations actuelles, complètes et exactes pour toutes les commandes passées sur notre site.
                    </p>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Tous les paiements sont traités de manière sécurisée par nos prestataires de services de paiement. En passant une commande, vous acceptez les conditions générales de ces prestataires.
                  </p>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Nous nous réservons le droit d'annuler une commande en cas de problème de paiement ou si nous soupçonnons une fraude.
                  </p>
                </section>

                <Separator className="my-8 bg-gradient-to-r from-transparent via-purple-200 to-transparent" />

                <section className="mb-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                      6
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-0">Livraison</h2>
                  </div>
                  <div className="bg-gradient-to-r from-pink-50 to-fuchsia-50 dark:from-pink-950/20 dark:to-fuchsia-950/20 p-6 rounded-xl border border-pink-100 dark:border-pink-900/30 mb-6">
                    <p className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
                      Les délais de livraison sont donnés à titre indicatif et ne constituent pas une garantie. Nous ne sommes pas responsables des retards de livraison causés par des événements indépendants de notre contrôle.
                    </p>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Les risques liés aux produits sont transférés à l'acheteur au moment de la livraison. Il est de la responsabilité de l'acheteur de vérifier l'état des produits à la réception et de signaler tout problème dans les délais spécifiés dans notre politique de retour.
                  </p>
                </section>

                <Separator className="my-8 bg-gradient-to-r from-transparent via-pink-200 to-transparent" />

                <section className="mb-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                      7
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-0">Propriété Intellectuelle</h2>
                  </div>
                  <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 p-6 rounded-xl border border-rose-100 dark:border-rose-900/30 mb-6">
                    <p className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
                      Le contenu du site, y compris mais sans s'y limiter, les textes, graphiques, images, logos, icônes, logiciels et tout autre matériel, est la propriété de Riziky Boutique ou de ses fournisseurs et est protégé par les lois nationales et internationales sur le droit d'auteur.
                    </p>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Vous ne pouvez pas reproduire, modifier, distribuer ou afficher publiquement tout contenu du site sans notre autorisation écrite préalable.
                  </p>
                </section>

                <Separator className="my-8 bg-gradient-to-r from-transparent via-rose-200 to-transparent" />

                <section className="mb-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-violet-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                      8
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-0">Limitation de Responsabilité</h2>
                  </div>
                  <div className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20 p-6 rounded-xl border border-violet-100 dark:border-violet-900/30 mb-6">
                    <p className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
                      Riziky Boutique ne sera pas responsable des dommages indirects, spéciaux, consécutifs ou punitifs résultant de l'utilisation ou de l'incapacité d'utiliser nos services ou produits.
                    </p>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Notre responsabilité totale pour toutes réclamations liées à nos produits et services ne dépassera en aucun cas le montant que vous avez payé pour l'achat spécifique qui a donné lieu à la réclamation.
                  </p>
                </section>

                <Separator className="my-8 bg-gradient-to-r from-transparent via-violet-200 to-transparent" />

                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                      9
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-0">Contact</h2>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 rounded-xl border border-green-100 dark:border-green-900/30">
                    <div className="flex items-center gap-3 mb-3">
                      <Mail className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">Besoin d'aide ?</span>
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      Pour toute question ou préoccupation concernant ces Conditions Générales d'Utilisation, veuillez nous contacter à{' '}
                      <a href="mailto:contact@rizikyboutique.fr" className="text-green-600 hover:text-green-800 font-semibold hover:underline transition-colors">
                        contact@rizikyboutique.fr
                      </a>
                    </p>
                  </div>
                </section>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsPage;
