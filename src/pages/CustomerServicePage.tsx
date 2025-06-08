
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle, Clock, Star, Headphones, Shield, Zap } from 'lucide-react';

const CustomerServicePage = () => {
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
                  <Headphones className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Service Client
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed">
                Notre équipe dédiée est là pour vous accompagner à chaque étape de votre expérience shopping. 
                Contactez-nous, nous sommes ravis de vous aider !
              </p>
              
              <div className="flex items-center justify-center space-x-8 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span>Réponse sous 24h</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span>Support expert</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-purple-500" />
                  <span>Solutions rapides</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Contact Methods */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="group p-8 text-center hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 hover:scale-105">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 rounded-2xl w-fit mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Email</h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">Nous répondons sous 24h</p>
              <p className="font-semibold text-blue-700 dark:text-blue-400 text-lg">contact@Riziky-Boutic.fr</p>
            </Card>
            
            <Card className="group p-8 text-center hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 hover:scale-105">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-2xl w-fit mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Téléphone</h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">Lun-Ven 9h-18h</p>
              <p className="font-semibold text-green-700 dark:text-green-400 text-lg">01 23 45 67 89</p>
            </Card>
            
            <Card className="group p-8 text-center hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 hover:scale-105">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl w-fit mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Chat en ligne</h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">Assistance immédiate</p>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg" asChild>
                <Link to="/chat">Démarrer un chat</Link>
              </Button>
            </Card>
          </div>
          
          {/* FAQ Section */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-8 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent">
                Questions fréquemment posées
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Trouvez rapidement des réponses à vos questions les plus courantes
              </p>
            </div>
            
            <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto">
              <AccordionItem value="item-1" className="border-neutral-200 dark:border-neutral-700">
                <AccordionTrigger className="text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Comment suivre ma commande ?
                </AccordionTrigger>
                <AccordionContent className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Vous pouvez suivre votre commande en vous connectant à votre compte client et en vous rendant dans la section "Mes commandes". 
                  Un numéro de suivi vous sera également envoyé par email dès que votre colis sera expédié.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border-neutral-200 dark:border-neutral-700">
                <AccordionTrigger className="text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Quels sont les délais de livraison ?
                </AccordionTrigger>
                <AccordionContent className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Nos délais de livraison standard sont de 2 à 4 jours ouvrables pour la France métropolitaine. 
                  Pour plus d'informations, veuillez consulter notre <Link to="/livraison" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">page de livraison</Link>.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border-neutral-200 dark:border-neutral-700">
                <AccordionTrigger className="text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Comment puis-je retourner un article ?
                </AccordionTrigger>
                <AccordionContent className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Vous disposez de 30 jours à compter de la réception de votre commande pour retourner un article. 
                  Pour plus d'informations sur la procédure à suivre, consultez notre <Link to="/retours" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">politique de retours</Link>.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="border-neutral-200 dark:border-neutral-700">
                <AccordionTrigger className="text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Comment modifier ou annuler ma commande ?
                </AccordionTrigger>
                <AccordionContent className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Vous pouvez modifier ou annuler votre commande dans les 2 heures suivant sa passation en contactant notre service client. 
                  Au-delà de ce délai, il est possible que votre commande soit déjà en cours de préparation et ne puisse plus être modifiée.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5" className="border-neutral-200 dark:border-neutral-700">
                <AccordionTrigger className="text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Quels modes de paiement acceptez-vous ?
                </AccordionTrigger>
                <AccordionContent className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Nous acceptons les paiements par carte bancaire (Visa, Mastercard), PayPal, et Apple Pay. Les paiements sont sécurisés et vos données ne sont jamais stockées sur nos serveurs.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          {/* Contact Form CTA */}
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 rounded-2xl p-8 text-center border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-2xl">
                <Star className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Nous contacter
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
              Vous n'avez pas trouvé la réponse à votre question ? N'hésitez pas à nous contacter directement 
              via notre formulaire de contact. Notre équipe vous répondra dans les plus brefs délais.
            </p>
            <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg px-8 py-3 rounded-full">
              <Link to="/contact">Formulaire de contact</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerServicePage;
