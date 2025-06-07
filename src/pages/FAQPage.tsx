
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HelpCircle, Search, MessageCircle, Phone, Mail, Clock, Star, Shield, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const faqCategories = [
    {
      title: "Commandes & Livraison",
      icon: Clock,
      questions: [
        {
          question: "Comment suivre ma commande ?",
          answer: "Vous pouvez suivre votre commande en vous connectant à votre compte client et en vous rendant dans la section \"Mes commandes\". Un numéro de suivi vous sera également envoyé par email dès que votre colis sera expédié."
        },
        {
          question: "Quels sont les délais de livraison ?",
          answer: "Nos délais de livraison standard sont de 2 à 4 jours ouvrables pour la France métropolitaine. La livraison express (24h) est disponible pour les commandes passées avant 14h."
        },
        {
          question: "Quels sont les frais de livraison ?",
          answer: "Les frais de livraison sont gratuits pour toute commande supérieure à 50€. En dessous, les frais sont de 4,90€ pour la livraison standard et 9,90€ pour la livraison express."
        }
      ]
    },
    {
      title: "Retours & Échanges",
      icon: Shield,
      questions: [
        {
          question: "Comment retourner un article ?",
          answer: "Vous disposez de 30 jours à compter de la réception de votre commande pour retourner un article. Connectez-vous à votre compte, allez dans \"Mes commandes\" et cliquez sur \"Retourner cet article\"."
        },
        {
          question: "Les retours sont-ils gratuits ?",
          answer: "Oui, les retours sont entièrement gratuits. Nous prenons en charge les frais de retour via notre partenaire transporteur."
        },
        {
          question: "Puis-je échanger un article ?",
          answer: "Bien sûr ! Vous pouvez échanger un article contre une autre taille ou couleur dans les 30 jours suivant votre achat."
        }
      ]
    },
    {
      title: "Paiement & Sécurité",
      icon: Star,
      questions: [
        {
          question: "Quels modes de paiement acceptez-vous ?",
          answer: "Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay et le paiement en 3x sans frais avec Klarna."
        },
        {
          question: "Mes données sont-elles sécurisées ?",
          answer: "Absolument ! Votre site utilise le cryptage SSL et nous ne stockons jamais vos informations de paiement. Toutes les transactions sont sécurisées."
        },
        {
          question: "Puis-je modifier ma commande après validation ?",
          answer: "Vous pouvez modifier ou annuler votre commande dans les 2 heures suivant sa validation. Passé ce délai, contactez notre service client."
        }
      ]
    },
    {
      title: "Compte Client",
      icon: Users,
      questions: [
        {
          question: "Comment créer un compte ?",
          answer: "Cliquez sur \"S'inscrire\" en haut de la page et remplissez le formulaire. Vous recevrez un email de confirmation pour activer votre compte."
        },
        {
          question: "J'ai oublié mon mot de passe",
          answer: "Cliquez sur \"Mot de passe oublié\" sur la page de connexion. Vous recevrez un email avec un lien pour réinitialiser votre mot de passe."
        },
        {
          question: "Comment modifier mes informations personnelles ?",
          answer: "Connectez-vous à votre compte et allez dans \"Mon profil\" pour modifier vos informations personnelles, adresses et préférences."
        }
      ]
    }
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const contactOptions = [
    {
      icon: MessageCircle,
      title: "Chat en direct",
      description: "Disponible 24h/7j",
      action: "Démarrer un chat",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Phone,
      title: "Téléphone",
      description: "Lun-Ven 9h-18h",
      action: "01 23 45 67 89",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Mail,
      title: "Email",
      description: "Réponse sous 2h",
      action: "contact@riziky.fr",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-indigo-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-indigo-950/30">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-20"
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center mb-6"
            >
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <HelpCircle className="h-12 w-12 text-white" />
              </div>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Centre d'Aide
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-8">
              Trouvez rapidement les réponses à toutes vos questions
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <Input
                  type="text"
                  placeholder="Rechercher dans la FAQ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border-0 text-lg shadow-xl"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 py-16">
          {/* Quick Contact Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-3 gap-6 mb-16"
          >
            {contactOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="group"
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm group-hover:scale-105">
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${option.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        {option.title}
                      </CardTitle>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        {option.description}
                      </p>
                    </CardHeader>
                    <CardContent className="text-center">
                      <Button className={`bg-gradient-to-r ${option.color} hover:shadow-lg transition-all duration-300 text-white w-full`}>
                        {option.action}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* FAQ Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid gap-8"
          >
            {(searchTerm ? filteredCategories : faqCategories).map((category, categoryIndex) => {
              const IconComponent = category.icon;
              return (
                <motion.div
                  key={categoryIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * categoryIndex }}
                  className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-neutral-200/50 dark:border-neutral-700/50 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-6 border-b border-neutral-200/50 dark:border-neutral-700/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {category.title}
                      </h2>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <Accordion type="single" collapsible className="space-y-4">
                      {category.questions.map((faq, index) => (
                        <AccordionItem 
                          key={index} 
                          value={`${categoryIndex}-${index}`}
                          className="border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl overflow-hidden bg-white/50 dark:bg-neutral-800/50"
                        >
                          <AccordionTrigger className="px-6 py-4 text-left font-semibold text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-colors">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-4 text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Still Need Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-16 text-center"
          >
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-0 shadow-xl">
              <CardContent className="p-12">
                <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Vous ne trouvez pas votre réponse ?
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-8 text-lg">
                  Notre équipe de support est là pour vous aider personnellement
                </p>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  Contacter le support
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQPage;
