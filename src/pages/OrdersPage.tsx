import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Truck, Package, ShoppingBag, Trash2, RefreshCw, Eye, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import { Separator } from '@/components/ui/separator';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import { ordersAPI, remboursementsAPI, type Remboursement } from '@/services/api';
import RefundForm from '@/components/orders/RefundForm';
import RefundTracking from '@/components/orders/RefundTracking';
import { motion } from 'framer-motion';

const OrdersPage = () => {
  const { orders, loadingOrders, fetchOrders } = useStore();
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [processingOrder, setProcessingOrder] = useState<string | null>(null);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [userRemboursements, setUserRemboursements] = useState<Remboursement[]>([]);
  const [selectedRemboursement, setSelectedRemboursement] = useState<Remboursement | null>(null);

  useEffect(() => {
    fetchOrders();
    fetchUserRemboursements();
    console.log("Chargement des commandes depuis la page des commandes");
  }, []);

  const fetchUserRemboursements = async () => {
    try {
      const response = await remboursementsAPI.getUserRemboursements();
      setUserRemboursements(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des remboursements:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmée': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'en préparation': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'en livraison': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'livrée': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${AUTH_BASE_URL}${imagePath}`;
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      setProcessingOrder(orderId);
      
      console.log('Suppression complète de la commande:', orderId);
      
      const response = await ordersAPI.cancelOrder(orderId, []);
      
      toast.success('Commande supprimée avec succès');
      
      await fetchOrders();
      
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de la commande');
    } finally {
      setProcessingOrder(null);
    }
  };

  const canDeleteOrder = (order: any) => {
    return order.status === 'confirmée';
  };

  const canRequestRefund = (order: any) => {
    return ['en préparation', 'en livraison', 'livrée'].includes(order.status);
  };

  const getOrderRemboursement = (orderId: string) => {
    return userRemboursements.find(r => r.orderId === orderId);
  };

  const handleRefundRequest = (orderId: string) => {
    setSelectedOrderId(orderId);
    setRefundDialogOpen(true);
  };

  const handleRefundSuccess = () => {
    setRefundDialogOpen(false);
    setSelectedOrderId('');
    fetchUserRemboursements();
    toast.success('Demande de remboursement envoyée avec succès');
  };

  const handleTrackRefund = (orderId: string) => {
    const remboursement = getOrderRemboursement(orderId);
    if (remboursement) {
      setSelectedRemboursement(remboursement);
      setTrackingDialogOpen(true);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-blue-950/30">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg">
                <ShoppingBag className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent mb-4">
              Mes Commandes
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400">
              Suivez et gérez toutes vos commandes en un coup d'œil
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            {loadingOrders ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-neutral-200 dark:border-neutral-700">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-neutral-700 dark:text-neutral-300">Chargement des commandes...</span>
                </div>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order, index) => {
                  const remboursement = getOrderRemboursement(order.id);
                  
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <CardHeader className="pb-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <CardTitle className="flex items-center gap-3">
                                <Award className="h-5 w-5 text-blue-600" />
                                Commande #{order.id.split('-')[1]}
                              </CardTitle>
                              <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {formatDate(order.createdAt)}
                                </div>
                                <span>•</span>
                                <span>{order.items.length} produit{order.items.length > 1 ? 's' : ''}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                              {remboursement && (
                                <span className="inline-block px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                                  Remboursement: {remboursement.status}
                                </span>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-6">
                          {/* Products */}
                          <div className="space-y-3">
                            {order.items.slice(0, 3).map((item) => (
                              <div key={item.productId} className="flex items-center gap-4 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-white dark:bg-neutral-900 shadow-sm">
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
                                  <p className="font-medium text-neutral-900 dark:text-neutral-100">{item.name}</p>
                                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    Quantité: {item.quantity} × {item.price.toFixed(2)} €
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                                    {(item.quantity * item.price).toFixed(2)} €
                                  </p>
                                </div>
                              </div>
                            ))}

                            {order.items.length > 3 && (
                              <div className="flex items-center justify-center p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                  +{order.items.length - 3} autre{order.items.length - 3 > 1 ? 's' : ''} produit{order.items.length - 3 > 1 ? 's' : ''}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Order Status Steps */}
                          <div className="bg-white/50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl p-6">
                            <div className="flex justify-between items-center">
                              <div className="flex flex-col items-center relative flex-1">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500 text-white z-10 shadow-lg">
                                  <Check className="h-5 w-5" />
                                </div>
                                <span className="text-xs text-center mt-2 font-medium text-blue-600">Confirmée</span>
                              </div>

                              <div className="flex-1 h-1 bg-neutral-200 dark:bg-neutral-700 relative">
                                <div className={`absolute inset-0 bg-blue-500 transition-all duration-300 ${
                                  order.status !== 'confirmée' ? 'w-full' : 'w-0'
                                }`} />
                              </div>

                              <div className="flex flex-col items-center relative flex-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 shadow-lg transition-all duration-300 ${
                                  order.status !== 'confirmée' ? 'bg-blue-500 text-white' : 'bg-neutral-200 text-neutral-400 dark:bg-neutral-700'
                                }`}>
                                  <Package className="h-5 w-5" />
                                </div>
                                <span className={`text-xs text-center mt-2 font-medium ${
                                  order.status !== 'confirmée' ? 'text-blue-600' : 'text-neutral-400'
                                }`}>En préparation</span>
                              </div>

                              <div className="flex-1 h-1 bg-neutral-200 dark:bg-neutral-700 relative">
                                <div className={`absolute inset-0 bg-blue-500 transition-all duration-300 ${
                                  ['en livraison', 'livrée'].includes(order.status) ? 'w-full' : 'w-0'
                                }`} />
                              </div>

                              <div className="flex flex-col items-center relative flex-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 shadow-lg transition-all duration-300 ${
                                  ['en livraison', 'livrée'].includes(order.status) ? 'bg-blue-500 text-white' : 'bg-neutral-200 text-neutral-400 dark:bg-neutral-700'
                                }`}>
                                  <Truck className="h-5 w-5" />
                                </div>
                                <span className={`text-xs text-center mt-2 font-medium ${
                                  ['en livraison', 'livrée'].includes(order.status) ? 'text-blue-600' : 'text-neutral-400'
                                }`}>En livraison</span>
                              </div>

                              <div className="flex-1 h-1 bg-neutral-200 dark:bg-neutral-700 relative">
                                <div className={`absolute inset-0 bg-blue-500 transition-all duration-300 ${
                                  order.status === 'livrée' ? 'w-full' : 'w-0'
                                }`} />
                              </div>

                              <div className="flex flex-col items-center relative flex-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 shadow-lg transition-all duration-300 ${
                                  order.status === 'livrée' ? 'bg-green-500 text-white' : 'bg-neutral-200 text-neutral-400 dark:bg-neutral-700'
                                }`}>
                                  <ShoppingBag className="h-5 w-5" />
                                </div>
                                <span className={`text-xs text-center mt-2 font-medium ${
                                  order.status === 'livrée' ? 'text-green-600' : 'text-neutral-400'
                                }`}>Livrée</span>
                              </div>
                            </div>
                          </div>

                          <Separator className="bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-700 to-transparent" />

                          {/* Order Total and Actions */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-lg">
                              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Total de la commande</p>
                              <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                                {order.totalAmount.toFixed(2)} €
                              </p>
                            </div>
                            
                            <div className="flex gap-3 flex-wrap">
                              {canDeleteOrder(order) && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="destructive" 
                                      size="sm"
                                      disabled={processingOrder === order.id}
                                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Supprimer
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="max-w-md bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Supprimer la commande</AlertDialogTitle>
                                      <AlertDialogDescription className="text-neutral-600 dark:text-neutral-400">
                                        Êtes-vous sûr de vouloir supprimer complètement cette commande ? 
                                        Tous les produits seront remis en stock et la commande sera définitivement supprimée.
                                        Cette action est irréversible.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteOrder(order.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        {processingOrder === order.id ? 'Suppression...' : 'Confirmer la suppression'}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}

                              {canRequestRefund(order) && !remboursement && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleRefundRequest(order.id)}
                                  className="border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-950/20"
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Remboursement
                                </Button>
                              )}

                              {remboursement && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleTrackRefund(order.id)}
                                  className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-950/20"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Suivre remboursement
                                </Button>
                              )}
                              
                              <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                <Link to={`/commande/${order.id}`}>
                                  Voir les détails
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="text-center py-20"
              >
                <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-12 border border-neutral-200 dark:border-neutral-700 max-w-md mx-auto shadow-xl">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="h-10 w-10 text-neutral-400" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                    Aucune commande pour le moment
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
                    Commencez vos achats pour créer votre première commande et profiter de nos produits exceptionnels.
                  </p>
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                    <Link to="/">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Explorer nos produits
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Dialogs */}
          <Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
            <DialogContent className="max-w-lg bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle>Demande de remboursement</DialogTitle>
              </DialogHeader>
              {selectedOrderId && (
                <RefundForm
                  orderId={selectedOrderId}
                  onSuccess={handleRefundSuccess}
                  onCancel={() => setRefundDialogOpen(false)}
                />
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={trackingDialogOpen} onOpenChange={setTrackingDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle>Suivi de remboursement</DialogTitle>
              </DialogHeader>
              {selectedRemboursement && (
                <RefundTracking
                  remboursement={selectedRemboursement}
                  order={orders.find(o => o.id === selectedRemboursement.orderId)}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};

export default OrdersPage;
