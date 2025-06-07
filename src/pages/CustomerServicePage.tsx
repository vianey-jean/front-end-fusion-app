
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle, Headphones, Clock, Star, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const CustomerServicePage = () => {
  const contactMethods = [
    {
      icon: <Mail className="h-8 w-8" />,
      title: "Email",
      subtitle: "Nous répondons sous 24h",
      contact: "contact@Riziky-Boutic.fr",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20"
    },
    {
      icon: <Phone className="h-8 w-8" />,
      title: "Téléphone",
      subtitle: "Lun-Ven 9h-18h",
      contact: "01 23 45 67 89",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20"
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Chat en ligne",
      subtitle: "Assistance immédiate",
      contact: "Démarrer un chat",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20",
      isButton: true
    }
  ];

  const features = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Réponse rapide",
      description: "Support disponible 7j/7"
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Satisfaction garantie",
      description: "98% de clients satisfaits"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Service sécurisé",
      description: "Données protégées"
    }
  ];

  const faqItems = [
    {
      question: "Comment suivre ma commande ?",
      answer: "Vous pouvez suivre votre commande en vous connectant à votre compte client et en vous rendant dans la section \"Mes commandes\". Un numéro de suivi vous sera également envoyé par email dès que votre colis sera expédié."
    },
    {
      question: "Quels sont les délais de livraison ?",
      answer: "Nos délais de livraison standard sont de 2 à 4 jours ouvrables pour la France métropolitaine. Pour plus d'informations, veuillez consulter notre page de livraison."
    },
    {
      question: "Comment puis-je retourner un article ?",
      answer: "Vous disposez de 30 jours à compter de la réception de votre commande pour retourner un article. Pour plus d'informations sur la procédure à suivre, consultez notre politique de retours."
    },
    {
      question: "Comment modifier ou annuler ma commande ?",
      answer: "Vous pouvez modifier ou annuler votre commande dans les 2 heures suivant sa passation en contactant notre service client. Au-delà de ce délai, il est possible que votre commande soit déjà en cours de préparation et ne puisse plus être modifiée."
    },
    {
      question: "Quels modes de paiement acceptez-vous ?",
      answer: "Nous acceptons les paiements par carte bancaire (Visa, Mastercard), PayPal, et Apple Pay. Les paiements sont sécurisés et vos données ne sont jamais stockées sur nos serveurs."
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-indigo-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-indigo-950/30">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-xl">
                <Headphones className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-800 to-purple-600 bg-clip-text text-transparent mb-4">
              Service Client
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
              Notre équipe dédiée est là pour vous accompagner et répondre à toutes vos questions
            </p>
          </motion.div>

          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${method.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <div className={`text-transparent bg-gradient-to-r ${method.color} bg-clip-text`}>
                        {method.icon}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                      {method.title}
                    </CardTitle>
                    <p className="text-neutral-600 dark:text-neutral-400">{method.subtitle}</p>
                  </CardHeader>
                  <CardContent className="text-center">
                    {method.isButton ? (
                      <Button className={`bg-gradient-to-r ${method.color} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300`} asChild>
                        <Link to="/chat">{method.contact}</Link>
                      </Button>
                    ) : (
                      <div className={`text-lg font-semibold bg-gradient-to-r ${method.color} bg-clip-text text-transparent`}>
                        {method.contact}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">
              Pourquoi choisir notre service client ?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <div className="text-indigo-600 dark:text-indigo-400">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-16"
          >
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">
                  Questions fréquemment posées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {item.answer.includes('page de livraison') ? (
                          <>
                            {item.answer.split('page de livraison')[0]}
                            <Link to="/livraison" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                              page de livraison
                            </Link>
                            {item.answer.split('page de livraison')[1]}
                          </>
                        ) : item.answer.includes('politique de retours') ? (
                          <>
                            {item.answer.split('politique de retours')[0]}
                            <Link to="/retours" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                              politique de retours
                            </Link>
                            {item.answer.split('politique de retours')[1]}
                          </>
                        ) : (
                          item.answer
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <CardContent className="p-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Nous contacter</h2>
                  <p className="mb-6 text-indigo-100">
                    Vous n'avez pas trouvé la réponse à votre question ? N'hésitez pas à nous contacter directement via notre formulaire de contact.
                  </p>
                  <Button asChild className="bg-white text-indigo-600 hover:bg-neutral-100 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Link to="/contact">Formulaire de contact</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerServicePage;
