
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

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (flashSale) {
      setFormData({
        title: flashSale.title,
        description: flashSale.description,
        discount: flashSale.discount,
        startDate: flashSale.startDate.slice(0, 16),
        endDate: flashSale.endDate.slice(0, 16),
        productIds: flashSale.productIds || [],
      });
    }
  }, [flashSale]);

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

    console.log('Données du formulaire à envoyer:', formData);

    if (flashSale) {
      updateMutation.mutate({ id: flashSale.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleProductToggle = (productId: string) => {
    setFormData(prev => {
      const newProductIds = prev.productIds.includes(productId)
        ? prev.productIds.filter(id => id !== productId)
        : [...prev.productIds, productId];
      
      console.log('Produits sélectionnés:', newProductIds);
      return {
        ...prev,
        productIds: newProductIds
      };
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {flashSale ? 'Modifier la vente flash' : 'Créer une nouvelle vente flash'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Vente Flash Électronique"
                required
              />
            </div>

            <div>
              <Label htmlFor="discount">Pourcentage de réduction *</Label>
              <Input
                id="discount"
                type="number"
                min="1"
                max="99"
                value={formData.discount}
                onChange={(e) => setFormData(prev => ({ ...prev, discount: parseInt(e.target.value) || 0 }))}
                placeholder="Ex: 50"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description de la vente flash..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Date et heure de début *</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="endDate">Date et heure de fin *</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Produits inclus dans la vente flash</Label>
            <p className="text-sm text-gray-600 mb-4">
              Sélectionnez les produits qui bénéficieront de la réduction
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto border rounded-lg p-4">
              {products.map((product) => (
                <div key={product.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                  <Checkbox
                    id={`product-${product.id}`}
                    checked={formData.productIds.includes(product.id)}
                    onCheckedChange={() => handleProductToggle(product.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={`product-${product.id}`}
                      className="text-sm font-medium cursor-pointer block truncate"
                    >
                      {product.name}
                    </label>
                    <p className="text-xs text-gray-500 truncate">{product.price}€</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 p-3 rounded-lg mt-3">
              <p className="text-sm font-medium text-blue-800">
                {formData.productIds.length} produit(s) sélectionné(s)
              </p>
              {formData.productIds.length > 0 && (
                <div className="text-xs text-blue-600 mt-1">
                  IDs: {formData.productIds.join(', ')}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Enregistrement...'
                : flashSale ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
