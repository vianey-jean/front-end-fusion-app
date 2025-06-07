
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Shield, Users, AlertCircle, CheckCircle, Scale } from 'lucide-react';

const TermsPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/5 dark:via-indigo-500/5 dark:to-purple-500/5">
          <div className="absolute inset-0 bg-grid-neutral-100/50 dark:bg-grid-neutral-800/50" />
          <div className="container mx-auto px-4 py-16 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-2xl shadow-lg">
                  <FileText className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Conditions Générales
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed">
                Découvrez nos conditions d'utilisation et les termes qui régissent notre relation commerciale.
              </p>
              
              <div className="flex items-center justify-center space-x-8 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span>Protection légale</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Scale className="h-5 w-5 text-indigo-500" />
                  <span>Conditions équitables</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-purple-500" />
                  <span>Transparence totale</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Section 1 */}
            <Card className="shadow-xl border-0 bg-white dark:bg-neutral-900 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 border-b border-blue-200 dark:border-blue-800">
                <CardHeader className="p-0">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      1. Objet et acceptation
                    </CardTitle>
                  </div>
                </CardHeader>
              </div>
              <CardContent className="p-8">
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                    Les présentes conditions générales de vente (CGV) régissent les relations contractuelles entre Riziky-Boutic et ses clients dans le cadre de la vente en ligne de produits cosmétiques et de beauté.
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    L'acceptation des présentes CGV est matérialisée par la validation de votre commande. Cette acceptation entraîne l'adhésion entière et sans réserve du client à l'ensemble des présentes conditions générales.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 2 */}
            <Card className="shadow-xl border-0 bg-white dark:bg-neutral-900 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 border-b border-green-200 dark:border-green-800">
                <CardHeader className="p-0">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      2. Produits et commandes
                    </CardTitle>
                  </div>
                </CardHeader>
              </div>
              <CardContent className="p-8">
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                    Nos produits sont présentés avec le maximum de précision possible. Cependant, de légères variations peuvent apparaître en raison des paramètres d'affichage de votre écran.
                  </p>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-xl border border-green-200 dark:border-green-800 mt-4">
                    <p className="text-green-700 dark:text-green-400 font-medium">
                      ✓ Tous nos produits sont authentiques et conformes aux normes européennes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 3 */}
            <Card className="shadow-xl border-0 bg-white dark:bg-neutral-900 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 p-6 border-b border-purple-200 dark:border-purple-800">
                <CardHeader className="p-0">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-purple-500 to-violet-500 p-2 rounded-lg">
                      <AlertCircle className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                      3. Responsabilités et garanties
                    </CardTitle>
                  </div>
                </CardHeader>
              </div>
              <CardContent className="p-8">
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                    Riziky-Boutic s'engage à fournir des produits de qualité et à respecter les délais de livraison annoncés. Notre responsabilité est limitée au remplacement ou au remboursement des produits défectueux.
                  </p>
                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800 mt-4">
                    <p className="text-purple-700 dark:text-purple-400 font-medium">
                      ⚠️ L'utilisation des produits cosmétiques doit respecter les indications d'usage
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 4 */}
            <Card className="shadow-xl border-0 bg-white dark:bg-neutral-900 overflow-hidden">
              <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 p-6 border-b border-red-200 dark:border-red-800">
                <CardHeader className="p-0">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-red-500 to-rose-500 p-2 rounded-lg">
                      <Scale className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                      4. Droit applicable et litiges
                    </CardTitle>
                  </div>
                </CardHeader>
              </div>
              <CardContent className="p-8">
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                    Les présentes conditions générales sont soumises au droit français. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire.
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    À défaut de résolution amiable, les tribunaux français seront seuls compétents.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact section */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-2xl">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Questions sur nos conditions ?
                </h3>
                <p className="text-blue-700 dark:text-blue-400 mb-4">
                  Notre équipe juridique est à votre disposition pour toute clarification.
                </p>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  <p>Email : legal@riziky-boutic.fr</p>
                  <p>Téléphone : +33 (0)1 23 45 67 89</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsPage;
