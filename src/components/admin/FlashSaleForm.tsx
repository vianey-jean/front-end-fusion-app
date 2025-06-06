import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { flashSaleAPI } from '@/services/flashSaleAPI';
import { useToast } from '@/hooks/use-toast';
import { FlashSaleFormData } from '@/types/flashSale';
import { Product } from '@/types/product';
import { Search, Zap, Calendar, Percent, Package, Sparkles, Clock, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

interface FlashSaleFormProps {
  flashSale?: any;
  products: Product[];
  onClose: () => void;
}

export const FlashSaleForm: React.FC<FlashSaleFormProps> = ({
  flashSale,
  products,
  onClose,
}) => {
  const [formData, setFormData] = useState<FlashSaleFormData>({
    title: '',
    description: '',
    discount: 0,
    startDate: '',
    endDate: '',
    productIds: [],
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (flashSale) {
      // S'assurer que productIds est un array
      let productIds = [];
      if (Array.isArray(flashSale.productIds)) {
        productIds = flashSale.productIds;
      } else if (flashSale.productIds && typeof flashSale.productIds === 'object') {
        productIds = Object.values(flashSale.productIds);
      }

      setFormData({
        title: flashSale.title,
        description: flashSale.description,
        discount: flashSale.discount,
        startDate: flashSale.startDate.slice(0, 16),
        endDate: flashSale.endDate.slice(0, 16),
        productIds: productIds,
      });
    }
  }, [flashSale]);

  // Filtrage des produits par recherche
  useEffect(() => {
    if (searchTerm.length >= 3) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const createMutation = useMutation({
    mutationFn: flashSaleAPI.create,
    onSuccess: (response) => {
      console.log('Flash sale créée avec succès:', response.data);
      queryClient.invalidateQueries({ queryKey: ['admin-flash-sales'] });
      queryClient.invalidateQueries({ queryKey: ['active-flash-sale'] });
      toast({ title: 'Vente flash créée avec succès' });
      onClose();
    },
    onError: (error) => {
      console.error('Erreur lors de la création:', error);
      toast({ title: 'Erreur lors de la création', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FlashSaleFormData> }) =>
      flashSaleAPI.update(id, data),
    onSuccess: (response) => {
      console.log('Flash sale mise à jour avec succès:', response.data);
      queryClient.invalidateQueries({ queryKey: ['admin-flash-sales'] });
      queryClient.invalidateQueries({ queryKey: ['active-flash-sale'] });
      toast({ title: 'Vente flash mise à jour avec succès' });
      onClose();
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour:', error);
      toast({ title: 'Erreur lors de la mise à jour', variant: 'destructive' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.discount || !formData.startDate || !formData.endDate) {
      toast({ title: 'Veuillez remplir tous les champs requis', variant: 'destructive' });
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast({ title: 'La date de fin doit être après la date de début', variant: 'destructive' });
      return;
    }

    // S'assurer que les productIds sont bien inclus dans les données envoyées comme array
    const productIdsToSend = Array.isArray(formData.productIds) ? formData.productIds : [];
    
    const dataToSend = {
      title: formData.title,
      description: formData.description,
      discount: Number(formData.discount),
      startDate: formData.startDate,
      endDate: formData.endDate,
      productIds: productIdsToSend
    };

    console.log('=== ENVOI DES DONNÉES ===');
    console.log('Données complètes à envoyer:', JSON.stringify(dataToSend, null, 2));
    console.log('ProductIds sélectionnés:', productIdsToSend);
    console.log('Nombre de produits:', productIdsToSend.length);

    if (flashSale) {
      updateMutation.mutate({ id: flashSale.id, data: dataToSend });
    } else {
      createMutation.mutate(dataToSend);
    }
  };

  const handleProductToggle = (productId: string) => {
    console.log('=== TOGGLE PRODUIT ===');
    console.log('ID du produit cliqué:', productId);
    
    setFormData(prev => {
      const currentIds = Array.isArray(prev.productIds) ? prev.productIds : [];
      console.log('IDs actuels:', currentIds);
      
      let newProductIds;
      if (currentIds.includes(productId)) {
        newProductIds = currentIds.filter(id => id !== productId);
        console.log('Produit retiré. Nouveaux IDs:', newProductIds);
      } else {
        newProductIds = [...currentIds, productId];
        console.log('Produit ajouté. Nouveaux IDs:', newProductIds);
      }
      
      return {
        ...prev,
        productIds: newProductIds
      };
    });
  };

  const getSelectedProductNames = () => {
    const currentIds = Array.isArray(formData.productIds) ? formData.productIds : [];
    const selectedProducts = products.filter(product => currentIds.includes(product.id));
    return selectedProducts.map(product => product.name).join(', ');
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <DialogHeader>
            <motion.div variants={itemVariants} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                {flashSale ? 'Modifier la vente flash' : 'Créer une nouvelle vente flash'}
              </DialogTitle>
            </motion.div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-8 mt-6">
            {/* Informations principales */}
            <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800/20">
              <div className="flex items-center mb-4">
                <Tag className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400">Informations principales</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center gap-2 font-medium">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    Titre *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Vente Flash Électronique"
                    required
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount" className="flex items-center gap-2 font-medium">
                    <Percent className="h-4 w-4 text-red-500" />
                    Pourcentage de réduction *
                  </Label>
                  <Input
                    id="discount"
                    type="number"
                    min="1"
                    max="99"
                    value={formData.discount}
                    onChange={(e) => setFormData(prev => ({ ...prev, discount: parseInt(e.target.value) || 0 }))}
                    placeholder="Ex: 50"
                    required
                    className="border-red-200 focus:border-red-500 focus:ring-red-500/20 rounded-xl"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2 font-medium">
                  <Package className="h-4 w-4 text-green-500" />
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description de la vente flash..."
                  rows={3}
                  className="border-green-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl resize-none"
                />
              </div>
            </motion.div>

            {/* Période de validité */}
            <motion.div variants={itemVariants} className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-6 rounded-2xl border border-purple-200 dark:border-purple-800/20">
              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-400">Période de validité</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="flex items-center gap-2 font-medium">
                    <Calendar className="h-4 w-4 text-green-500" />
                    Date et heure de début *
                  </Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                    className="border-green-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="flex items-center gap-2 font-medium">
                    <Calendar className="h-4 w-4 text-red-500" />
                    Date et heure de fin *
                  </Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    required
                    className="border-red-200 focus:border-red-500 focus:ring-red-500/20 rounded-xl"
                  />
                </div>
              </div>
            </motion.div>

            {/* Sélection des produits */}
            <motion.div variants={itemVariants} className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-800/20">
              <div className="flex items-center mb-4">
                <Package className="h-5 w-5 text-orange-600 mr-2" />
                <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-400">Produits inclus dans la vente flash</h3>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 bg-white/50 dark:bg-gray-800/50 p-3 rounded-xl border">
                💡 Sélectionnez les produits qui bénéficieront de la réduction de <span className="font-bold text-red-600">{formData.discount}%</span>
              </p>

              {/* Barre de recherche améliorée */}
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Rechercher des produits (minimum 3 caractères)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 border-orange-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl bg-white/70 dark:bg-gray-800/70"
                />
              </div>

              {/* Message de recherche */}
              {searchTerm.length > 0 && searchTerm.length < 3 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border border-yellow-300 dark:border-yellow-700 rounded-xl p-4 mb-6"
                >
                  <p className="text-sm text-yellow-800 dark:text-yellow-400 flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Veuillez saisir au moins 3 caractères pour rechercher
                  </p>
                </motion.div>
              )}

              {/* Liste des produits */}
              <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">
                      {searchTerm.length >= 3 ? 'Aucun produit trouvé' : 'Saisissez un terme pour rechercher'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {filteredProducts.map((product) => (
                      <motion.div 
                        key={product.id} 
                        className="flex items-start space-x-3 p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 rounded-xl transition-all duration-300 border border-transparent hover:border-blue-200 dark:hover:border-blue-700"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Checkbox
                          id={`product-${product.id}`}
                          checked={Array.isArray(formData.productIds) && formData.productIds.includes(product.id)}
                          onCheckedChange={() => handleProductToggle(product.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <label
                            htmlFor={`product-${product.id}`}
                            className="text-sm font-medium cursor-pointer block truncate hover:text-blue-600 transition-colors"
                          >
                            {product.name}
                          </label>
                          <div className="flex items-center space-x-2 mt-1">
                            <p className="text-xs text-gray-500 font-medium">
                              {product.price}€
                            </p>
                            {formData.discount > 0 && (
                              <p className="text-xs text-red-600 font-bold bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
                                → {(product.price * (1 - formData.discount / 100)).toFixed(2)}€
                              </p>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 truncate mt-1 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md">
                            {product.category}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Résumé des sélections */}
              <motion.div 
                className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-4 rounded-xl mt-6 border border-blue-200 dark:border-blue-700"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-blue-800 dark:text-blue-400 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    {Array.isArray(formData.productIds) ? formData.productIds.length : 0} produit(s) sélectionné(s)
                  </p>
                  {Array.isArray(formData.productIds) && formData.productIds.length > 0 && (
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      <p className="text-right">Économies clients: jusqu'à <span className="font-bold">{formData.discount}%</span></p>
                    </div>
                  )}
                </div>
                
                {Array.isArray(formData.productIds) && formData.productIds.length > 0 && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-3 bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                    <p className="font-medium mb-1">Produits sélectionnés:</p>
                    <p className="truncate opacity-80">{getSelectedProductNames()}</p>
                    <p className="mt-2 font-mono text-xs opacity-60">IDs: {formData.productIds.join(', ')}</p>
                  </div>
                )}
              </motion.div>
            </motion.div>

            {/* Boutons d'action */}
            <motion.div 
              variants={itemVariants}
              className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="px-8 py-3 rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Enregistrement...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    {flashSale ? 'Mettre à jour' : 'Créer la vente flash'}
                  </div>
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
