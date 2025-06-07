
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/contexts/StoreContext';
import { Check, Truck, Package, ShoppingBag, MapPin, CreditCard, Phone, User, Calendar, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useStore();
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="mb-6">
              <Package className="h-24 w-24 text-neutral-400 mx-auto mb-4" />
            </div>
            <h1 className="text-3xl font-bold mb-6 text-neutral-800 dark:text-neutral-200">Commande non trouvée</h1>
            <p className="mb-8 text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
              La commande que vous recherchez n'existe pas ou a été supprimée.
            </p>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              <Link to="/">Retour à l'accueil</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${AUTH_BASE_URL}${imagePath}`;
  };

  const steps = [
    { name: 'Commande confirmée', icon: Check, completed: true },
    { name: 'En préparation', icon: Package, completed: order.status !== 'confirmée' },
    { name: 'En cours de livraison', icon: Truck, completed: ['en livraison', 'livrée'].includes(order.status) },
    { name: 'Livrée', icon: ShoppingBag, completed: order.status === 'livrée' }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-blue-950/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg">
                  <Award className="h-12 w-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent mb-2">
                Commande #{order.id.split('-')[1]}
              </h1>
              <div className="flex items-center justify-center gap-2 text-neutral-600 dark:text-neutral-400">
                <Calendar className="h-4 w-4" />
                <p>Passée le {formatDate(order.createdAt)}</p>
              </div>
            </motion.div>

            {/* Order Status */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold mb-8 text-center text-neutral-800 dark:text-neutral-200">
                Statut de la commande
              </h2>
              <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center relative flex-1">
                    {index > 0 && (
                      <div className={`absolute h-1 top-6 transform -translate-x-1/2 -left-1/2 w-full transition-all duration-500 ${
                        step.completed ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-neutral-200 dark:bg-neutral-700'
                      }`} />
                    )}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center z-10 shadow-lg transition-all duration-300 ${
                        step.completed 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                          : 'bg-neutral-200 text-neutral-400 dark:bg-neutral-700'
                      }`}
                    >
                      <step.icon className="h-6 w-6" />
                    </motion.div>
                    <span className={`text-sm text-center mt-3 max-w-[80px] font-medium transition-colors ${
                      step.completed ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-400'
                    }`}>
                      {step.name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Products Section */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-2"
              >
                <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                    <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                      <Package className="h-5 w-5 text-blue-600" />
                      Produits commandés
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <motion.div
                          key={item.productId}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                          className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl"
                        >
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-white dark:bg-neutral-900 shadow-sm">
                            {item.image ? (
                              <img
                                src={getImageUrl(item.image)}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = `${AUTH_BASE_URL}/uploads/placeholder.jpg`;
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                                <ShoppingBag className="h-6 w-6 text-neutral-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">{item.name}</h4>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                                Quantité: {item.quantity}
                              </span>
                              <span className="font-bold text-blue-600 dark:text-blue-400">
                                {(item.price * item.quantity).toFixed(2)} €
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-700 to-transparent" />

                  <div className="p-6 bg-gradient-to-r from-neutral-50 to-blue-50 dark:from-neutral-800/50 dark:to-blue-950/20">
                    <div className="space-y-3">
                      <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                        <span>Sous-total</span>
                        <span>{order.totalAmount.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                        <span>Livraison</span>
                        <span className="text-green-600 font-medium">Gratuite</span>
                      </div>
                      <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                        <span>TVA (20%)</span>
                        <span>{(order.totalAmount * 0.2).toFixed(2)} €</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        <span>Total</span>
                        <span className="text-blue-600 dark:text-blue-400">
                          {(order.totalAmount * 1.2).toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="space-y-6"
              >
                {/* Shipping Info */}
                <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                    <h3 className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      Adresse de livraison
                    </h3>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-neutral-400" />
                      <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {order.shippingAddress.prenom} {order.shippingAddress.nom}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 ml-6">
                      {order.shippingAddress.adresse}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 ml-6">
                      {order.shippingAddress.codePostal} {order.shippingAddress.ville}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 ml-6">
                      {order.shippingAddress.pays}
                    </p>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20">
                    <h3 className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-purple-600" />
                      Informations de paiement
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-3 rounded-lg">
                      <p className="text-sm font-medium text-green-800 dark:text-green-400">
                        ✓ Paiement confirmé
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                        Votre commande a été payée avec succès
                      </p>
                    </div>
                  </div>
                </div>

                {/* Support */}
                <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
                    <h3 className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                      <Phone className="h-5 w-5 text-orange-600" />
                      Besoin d'aide?
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    <Button variant="outline" className="w-full border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-950/20">
                      Contacter le support
                    </Button>
                    <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/20">
                      Suivre la livraison
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderPage;
