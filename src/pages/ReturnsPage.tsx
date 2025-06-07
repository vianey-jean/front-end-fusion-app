
import React from 'react';
import Layout from '@/components/layout/Layout';
import { RotateCcw, Package, Truck, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';

const ReturnsPage = () => {
  const steps = [
    {
      number: 1,
      title: "Contactez-nous",
      description: "Contactez notre service client par email à retours@Riziky-Boutic.fr ou par téléphone au 01 23 45 67 89 pour nous informer de votre souhait de retourner un article. Nous vous fournirons un numéro de retour.",
      icon: <Package className="h-6 w-6" />,
      color: "from-blue-500 to-blue-600"
    },
    {
      number: 2,
      title: "Préparez votre colis",
      description: "Emballez soigneusement l'article à retourner dans son emballage d'origine si possible. Joignez le numéro de retour et votre justificatif d'achat.",
      icon: <Package className="h-6 w-6" />,
      color: "from-green-500 to-green-600"
    },
    {
      number: 3,
      title: "Expédiez le colis",
      description: "Envoyez le colis à l'adresse que nous vous communiquerons. Nous vous recommandons d'utiliser un service d'expédition avec suivi.",
      icon: <Truck className="h-6 w-6" />,
      color: "from-purple-500 to-purple-600"
    },
    {
      number: 4,
      title: "Remboursement",
      description: "Une fois votre retour reçu et inspecté, nous vous informerons de l'approbation ou du rejet de votre remboursement. Si approuvé, votre remboursement sera traité dans les 5 jours ouvrables.",
      icon: <CreditCard className="h-6 w-6" />,
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-blue-950/30">
        <div className="container mx-auto py-12 px-4">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-2xl shadow-lg">
                <RotateCcw className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-800 to-red-600 bg-clip-text text-transparent mb-4">
              Politique de retour
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400">
              Votre satisfaction est notre priorité
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Section des conditions */}
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-0">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">Conditions de retour</h2>
              </div>
              
              <div className="space-y-6">
                <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Chez Riziky-Boutic, nous voulons que vous soyez entièrement satisfait de votre achat. 
                  Si vous n'êtes pas satisfait pour quelque raison que ce soit, vous pouvez retourner votre article 
                  dans les <span className="font-bold text-red-600">30 jours</span> suivant la réception.
                </p>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                  <h3 className="font-bold mb-4 text-green-800 dark:text-green-300 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Pour être éligible à un retour, votre article doit :
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      "Être dans son état d'origine",
                      "Ne pas avoir été utilisé ou porté",
                      "Avoir toutes les étiquettes attachées",
                      "Être dans son emballage d'origine",
                      "Être accompagné du justificatif d'achat"
                    ].map((condition, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">{condition}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Section procédure */}
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-0">
              <h2 className="text-2xl font-bold mb-8 text-neutral-800 dark:text-neutral-200 text-center">
                Procédure de retour en 4 étapes simples
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {steps.map((step, index) => (
                  <div key={index} className="relative group">
                    <div className="bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${step.color} text-white rounded-xl flex items-center justify-center font-bold text-lg mr-4 shadow-lg`}>
                          {step.number}
                        </div>
                        <div className={`p-2 bg-gradient-to-br ${step.color} text-white rounded-lg shadow-md`}>
                          {step.icon}
                        </div>
                      </div>
                      <h3 className="font-bold text-lg mb-3 text-neutral-800 dark:text-neutral-200">{step.title}</h3>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Section remboursements */}
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-0">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="h-8 w-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">Remboursements</h2>
              </div>
              
              <div className="space-y-6">
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Une fois votre retour reçu et inspecté, nous procéderons au remboursement sur votre moyen de paiement initial. 
                  En fonction de la politique de votre banque, le remboursement peut prendre de 5 à 10 jours ouvrables pour apparaître sur votre compte.
                </p>
                
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-l-4 border-yellow-400 p-6 rounded-r-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <h3 className="font-bold text-yellow-800 dark:text-yellow-300">Remboursement partiel</h3>
                  </div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Dans certains cas, un remboursement partiel peut être accordé (par exemple, si l'article présente des signes d'utilisation
                    ou si certains articles d'un lot retourné manquent).
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    <strong>Note importante :</strong> Les frais de livraison pour le retour sont à la charge du client, sauf si l'article reçu est défectueux ou ne correspond
                    pas à la description.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReturnsPage;
