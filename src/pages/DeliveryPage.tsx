
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Clock, MapPin, Package, Shield, Zap, Globe, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const DeliveryPage = () => {
  const deliveryOptions = [
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Livraison standard",
      subtitle: "4-5 jours ouvrables",
      price: "3,99 € (Gratuit dès 50 €)",
      description: "Idéal pour vos achats du quotidien",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Livraison express",
      subtitle: "1-2 jours ouvrables",
      price: "7,99 €",
      description: "Pour recevoir rapidement vos commandes",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Livraison le jour même",
      subtitle: "Commande avant 11h00",
      price: "14,99 €",
      description: "Disponible dans certaines villes",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20"
    }
  ];

  const zones = [
    {
      title: "France métropolitaine",
      icon: <MapPin className="h-6 w-6" />,
      details: [
        { label: "Standard", value: "2-4 jours ouvrables" },
        { label: "Express", value: "1-2 jours ouvrables" }
      ]
    },
    {
      title: "DOM-TOM et Corse",
      icon: <Globe className="h-6 w-6" />,
      details: [
        { label: "Standard", value: "5-10 jours ouvrables" },
        { label: "Express", value: "3-5 jours ouvrables" }
      ]
    }
  ];

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Livraison sécurisée",
      description: "Tous nos colis sont assurés et trackés"
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Emballage soigné",
      description: "Vos produits arrivent en parfait état"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Support 7j/7",
      description: "Notre équipe vous accompagne"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-blue-950/30">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-xl">
                <Truck className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-800 to-indigo-600 bg-clip-text text-transparent mb-4">
              Informations de livraison
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
              Découvrez nos options de livraison flexibles et choisissez celle qui vous convient le mieux
            </p>
          </motion.div>

          {/* Delivery Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">
              Options de livraison
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {deliveryOptions.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="group"
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${option.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <div className={`text-transparent bg-gradient-to-r ${option.color} bg-clip-text`}>
                          {option.icon}
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        {option.title}
                      </CardTitle>
                      <p className="text-neutral-600 dark:text-neutral-400">{option.subtitle}</p>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className={`text-2xl font-bold bg-gradient-to-r ${option.color} bg-clip-text text-transparent mb-2`}>
                        {option.price}
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{option.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Delivery Times */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">
                  Délais de livraison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Les délais de livraison commencent à partir du moment où votre commande est confirmée et préparée
                    (vous recevrez un email de confirmation). Les délais indiqués sont des estimations et peuvent varier 
                    selon l'emplacement et les périodes de forte demande.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {zones.map((zone, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 p-6 rounded-xl border border-neutral-200 dark:border-neutral-600"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="text-blue-600 dark:text-blue-400">
                            {zone.icon}
                          </div>
                          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{zone.title}</h3>
                        </div>
                        <div className="space-y-2">
                          {zone.details.map((detail, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span className="text-neutral-600 dark:text-neutral-400">{detail.label}:</span>
                              <span className="font-medium text-neutral-900 dark:text-neutral-100">{detail.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">
              Nos garanties
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
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <div className="text-blue-600 dark:text-blue-400">
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

          {/* Tracking Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-3">
                  <Package className="h-8 w-8" />
                  Suivi de commande
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 text-center">
                  <p className="text-blue-100 leading-relaxed">
                    Dès que votre commande est expédiée, vous recevrez un email avec un numéro de suivi
                    qui vous permettra de suivre votre colis en temps réel. Vous pourrez également consulter 
                    l'état de votre commande dans votre espace client.
                  </p>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <p className="text-blue-100 mb-4">
                      Pour toute question concernant votre livraison, n'hésitez pas à contacter notre 
                      service client :
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Email:</span>
                        <span className="text-blue-200">livraison@Riziky-Boutic.fr</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span className="font-medium">Tél:</span>
                        <span className="text-blue-200">01 23 45 67 89</span>
                      </div>
                    </div>
                    <p className="text-sm text-blue-200 mt-2">
                      (du lundi au vendredi de 9h à 18h)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default DeliveryPage;
