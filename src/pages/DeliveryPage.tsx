
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Truck, Clock, MapPin, Shield, Star, CheckCircle, Package, Zap, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DeliveryPage = () => {
  const deliveryOptions = [
    {
      name: "Livraison Standard",
      time: "2-4 jours ouvrables",
      price: "Gratuite dès 50€",
      description: "Livraison par transporteur partenaire",
      icon: Truck,
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "Livraison Express",
      time: "24-48h",
      price: "9,90€",
      description: "Livraison prioritaire garantie",
      icon: Zap,
      color: "from-orange-500 to-orange-600"
    },
    {
      name: "Retrait en magasin",
      time: "Sous 2h",
      price: "Gratuit",
      description: "Disponible dans nos boutiques partenaires",
      icon: MapPin,
      color: "from-green-500 to-green-600"
    }
  ];

  const deliverySteps = [
    {
      step: "1",
      title: "Commande confirmée",
      description: "Votre commande est validée et prise en charge",
      icon: CheckCircle
    },
    {
      step: "2", 
      title: "Préparation",
      description: "Nos équipes préparent soigneusement votre colis",
      icon: Package
    },
    {
      step: "3",
      title: "Expédition",
      description: "Votre colis est remis au transporteur",
      icon: Truck
    },
    {
      step: "4",
      title: "Livraison",
      description: "Réception de votre commande à l'adresse indiquée",
      icon: MapPin
    }
  ];

  const zones = [
    { name: "France métropolitaine", time: "2-4 jours", price: "Gratuite dès 50€" },
    { name: "Corse", time: "3-5 jours", price: "9,90€" },
    { name: "DOM-TOM", time: "5-8 jours", price: "19,90€" },
    { name: "Europe", time: "4-7 jours", price: "14,90€" },
    { name: "International", time: "7-15 jours", price: "Sur devis" }
  ];

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
                  <Truck className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Livraison
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed">
                Recevez vos commandes rapidement et en toute sécurité grâce à nos options de livraison flexibles. 
                Livraison gratuite dès 50€ d'achat partout en France métropolitaine.
              </p>
              
              <div className="flex items-center justify-center space-x-8 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span>Livraison sécurisée</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  <span>Suivi en temps réel</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-purple-500" />
                  <span>Service premium</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Delivery Options */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent">
                Nos options de livraison
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Choisissez l'option qui vous convient le mieux pour recevoir votre commande
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {deliveryOptions.map((option, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-neutral-900 hover:scale-105">
                  <CardHeader className="text-center pb-4">
                    <div className={`bg-gradient-to-r ${option.color} p-4 rounded-2xl w-fit mx-auto mb-4 group-hover:shadow-lg transition-shadow`}>
                      <option.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{option.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 rounded-xl p-4 mb-4">
                      <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                        {option.time}
                      </div>
                      <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {option.price}
                      </div>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {option.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Delivery Process */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent">
                Comment ça marche ?
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Suivez le processus de livraison de votre commande étape par étape
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {deliverySteps.map((step, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                      <step.icon className="h-8 w-8" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
                    {step.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Zones */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-2xl">
                  <Globe className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent">
                Zones de livraison
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Nous livrons dans le monde entier avec des délais et tarifs adaptés à chaque zone
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="text-left py-4 px-6 font-semibold text-neutral-900 dark:text-neutral-100">Zone</th>
                    <th className="text-left py-4 px-6 font-semibold text-neutral-900 dark:text-neutral-100">Délai</th>
                    <th className="text-left py-4 px-6 font-semibold text-neutral-900 dark:text-neutral-100">Tarif</th>
                  </tr>
                </thead>
                <tbody>
                  {zones.map((zone, index) => (
                    <tr key={index} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                      <td className="py-4 px-6 text-neutral-900 dark:text-neutral-100 font-medium">{zone.name}</td>
                      <td className="py-4 px-6 text-neutral-600 dark:text-neutral-400">{zone.time}</td>
                      <td className="py-4 px-6 text-blue-600 dark:text-blue-400 font-semibold">{zone.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DeliveryPage;
