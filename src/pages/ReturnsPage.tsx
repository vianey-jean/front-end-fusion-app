
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, RotateCcw, Clock, CheckCircle, AlertCircle, ArrowRight, Shield, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReturnsPage = () => {
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
                  <RotateCcw className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent mb-6">
                Retours & Échanges
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed">
                Votre satisfaction est notre priorité. Découvrez notre politique de retour simple et flexible.
              </p>
              
              <div className="flex items-center justify-center space-x-8 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <span>14 jours pour retourner</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-amber-500" />
                  <span>Retour gratuit</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-yellow-500" />
                  <span>Remboursement rapide</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Process Steps */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="shadow-lg border-0 bg-white dark:bg-neutral-900 overflow-hidden group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 rounded-full mx-auto w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">
                    1. Demande de retour
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Contactez notre service client ou utilisez votre espace personnel
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white dark:bg-neutral-900 overflow-hidden group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-4 rounded-full mx-auto w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Truck className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">
                    2. Envoi du colis
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Renvoyez le produit dans son emballage d'origine
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white dark:bg-neutral-900 overflow-hidden group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-full mx-auto w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">
                    3. Remboursement
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Remboursement sous 5-7 jours ouvrés
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Conditions de retour */}
            <Card className="shadow-xl border-0 bg-white dark:bg-neutral-900 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 p-6 border-b border-orange-200 dark:border-orange-800">
                <CardHeader className="p-0">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-2 rounded-lg">
                      <AlertCircle className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                      Conditions de retour
                    </CardTitle>
                  </div>
                </CardHeader>
              </div>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">
                      ✅ Produits éligibles au retour
                    </h4>
                    <ul className="space-y-3 text-neutral-600 dark:text-neutral-300">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Produits non ouverts et dans leur emballage d'origine</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Retour dans les 14 jours suivant la réception</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Produits en parfait état</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Facture d'achat jointe</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400">
                      ❌ Produits non éligibles
                    </h4>
                    <ul className="space-y-3 text-neutral-600 dark:text-neutral-300">
                      <li className="flex items-start space-x-2">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>Produits cosmétiques ouverts ou utilisés</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>Produits personnalisés ou sur-mesure</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>Produits en promotion spéciale (sauf défaut)</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>Produits sans emballage d'origine</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200 dark:border-orange-800">
                <CardContent className="p-8 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-3 rounded-2xl">
                      <RotateCcw className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    Faire une demande de retour
                  </h3>
                  <p className="text-orange-700 dark:text-orange-400 mb-6">
                    Connectez-vous à votre compte pour initier un retour
                  </p>
                  <Button 
                    asChild 
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg w-full"
                  >
                    <Link to="/profile">
                      Accéder à mon compte
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800">
                <CardContent className="p-8 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-2xl">
                      <Package className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Besoin d'aide ?
                  </h3>
                  <p className="text-blue-700 dark:text-blue-400 mb-6">
                    Notre équipe est là pour vous accompagner
                  </p>
                  <Button 
                    asChild 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg w-full"
                  >
                    <Link to="/contact">
                      Contacter le support
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReturnsPage;
