
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, Eye, Lock, FileText, Mail, Globe, Users, Database } from 'lucide-react';

const PrivacyPage = () => {
  const sections = [
    {
      id: 1,
      icon: <FileText className="h-6 w-6" />,
      title: "Introduction",
      color: "from-blue-500 to-blue-600",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-xl border border-blue-100 dark:border-blue-900/30">
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Chez Riziky Boutique, nous accordons une grande importance à la protection de votre vie privée et de vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous utilisez notre site web ou nos services.
            </p>
          </div>
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
            En utilisant notre site, vous consentez à la collecte et à l'utilisation de vos informations conformément à cette politique. Si vous n'acceptez pas les termes de cette politique, veuillez ne pas utiliser notre site.
          </p>
        </div>
      )
    },
    {
      id: 2,
      icon: <Database className="h-6 w-6" />,
      title: "Informations que nous collectons",
      color: "from-green-500 to-green-600",
      content: (
        <div className="space-y-6">
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
            Nous pouvons collecter les types d'informations suivants :
          </p>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 rounded-xl border border-green-100 dark:border-green-900/30">
            <h3 className="text-lg font-semibold mb-4 text-green-800 dark:text-green-300 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Informations personnelles identifiables
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                "Nom et prénom",
                "Adresse e-mail", 
                "Adresse postale",
                "Numéro de téléphone",
                "Informations de paiement"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-neutral-700 dark:text-neutral-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 p-6 rounded-xl border border-purple-100 dark:border-purple-900/30">
            <h3 className="text-lg font-semibold mb-4 text-purple-800 dark:text-purple-300 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Informations non-identifiables
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                "Données démographiques",
                "Comportement de navigation",
                "Préférences d'achat", 
                "Adresse IP",
                "Type de navigateur"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-neutral-700 dark:text-neutral-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      icon: <Eye className="h-6 w-6" />,
      title: "Comment nous utilisons vos informations",
      color: "from-orange-500 to-orange-600",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
            Nous utilisons les informations que nous collectons pour :
          </p>
          <div className="grid gap-3">
            {[
              "Traiter vos commandes et paiements",
              "Vous envoyer des confirmations de commande",
              "Vous fournir un service client",
              "Personnaliser votre expérience",
              "Vous envoyer des informations marketing",
              "Améliorer notre site et nos services",
              "Détecter et prévenir la fraude",
              "Se conformer à nos obligations légales"
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-neutral-700 dark:text-neutral-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 4,
      icon: <Users className="h-6 w-6" />,
      title: "Partage de vos informations", 
      color: "from-red-500 to-red-600",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 p-6 rounded-xl border border-red-100 dark:border-red-900/30">
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
              Nous ne vendons, n'échangeons ni ne louons vos informations personnelles à des tiers.
            </p>
          </div>
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
            Nous pouvons partager vos informations dans les situations suivantes :
          </p>
          <div className="space-y-3">
            {[
              "Avec des prestataires de services tiers (paiements, livraison)",
              "Pour se conformer à la loi ou procédures judiciaires", 
              "Pour protéger nos droits et votre sécurité",
              "En cas de fusion ou acquisition d'entreprise"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <Shield className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <span className="text-neutral-700 dark:text-neutral-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-blue-950/30">
        <div className="container mx-auto py-12 px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg">
                <Shield className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent mb-4">
              Politique de Confidentialité
            </h1>
            <div className="flex items-center justify-center gap-2 text-neutral-600 dark:text-neutral-400">
              <Lock className="h-4 w-4" />
              <p>Dernière mise à jour : Mai 2025</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {sections.map((section, index) => (
                <Card key={section.id} className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-12 h-12 bg-gradient-to-br ${section.color} text-white rounded-xl flex items-center justify-center font-bold shadow-lg`}>
                        {section.icon}
                      </div>
                      <div>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">Section {section.id}</span>
                        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">{section.title}</h2>
                      </div>
                    </div>
                    {section.content}
                  </div>
                  {index < sections.length - 1 && (
                    <Separator className="bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-700 to-transparent" />
                  )}
                </Card>
              ))}
            </div>

            {/* Contact Section */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800 mt-8">
              <div className="p-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Mail className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300">Nous contacter</h2>
                </div>
                <p className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
                  Pour toute question concernant cette politique de confidentialité, n'hésitez pas à nous contacter.
                </p>
                <div className="bg-white/50 dark:bg-neutral-800/50 p-4 rounded-lg inline-block">
                  <a 
                    href="mailto:privacy@rizikyboutique.fr" 
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold hover:underline transition-colors flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    privacy@rizikyboutique.fr
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPage;
