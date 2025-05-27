
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { flashSalesAPI } from '@/services/flashSalesAPI';
import { productsAPI } from '@/services/productsAPI';
import { FlashSale, FlashSaleFormData } from '@/types/flashSale';
import { Product } from '@/types/product';
import { Plus, Edit, Trash2, Clock, Flame } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminFlashSalesPage: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFlashSale, setEditingFlashSale] = useState<FlashSale | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Queries
  const { data: flashSales = [], isLoading: isLoadingFlashSales } = useQuery({
    queryKey: ['flash-sales'],
    queryFn: async () => {
      const response = await flashSalesAPI.getAll();
      return response.data;
    }
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await productsAPI.getAll();
      return response.data;
    }
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: FormData) => flashSalesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flash-sales'] });
      toast({ title: 'Flash sale créée avec succès' });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: 'Erreur lors de la création', variant: 'destructive' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => 
      flashSalesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flash-sales'] });
      toast({ title: 'Flash sale mise à jour avec succès' });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: 'Erreur lors de la mise à jour', variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => flashSalesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flash-sales'] });
      toast({ title: 'Flash sale supprimée avec succès' });
    },
    onError: () => {
      toast({ title: 'Erreur lors de la suppression', variant: 'destructive' });
    }
  });

  const resetForm = () => {
    setEditingFlashSale(null);
    setSelectedProducts([]);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append('productIds', JSON.stringify(selectedProducts));

    if (editingFlashSale) {
      updateMutation.mutate({ id: editingFlashSale.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (flashSale: FlashSale) => {
    setEditingFlashSale(flashSale);
    setSelectedProducts(flashSale.productIds);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette flash sale ?')) {
      deleteMutation.mutate(id);
    }
  };

  const isFlashSaleActive = (flashSale: FlashSale) => {
    const now = new Date();
    return flashSale.isActive && 
           new Date(flashSale.startDate) <= now && 
           new Date(flashSale.endDate) > now;
  };

  const getTimeRemaining = (endDate: string) => {
    const difference = new Date(endDate).getTime() - new Date().getTime();
    if (difference <= 0) return 'Expiré';
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}j ${hours}h`;
    return `${hours}h`;
  };

  if (isLoadingFlashSales) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-6"></div>
        <h2 className="text-xl font-semibold mb-2">Chargement...</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestion des Flash Sales</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Flash Sale
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingFlashSale ? 'Modifier la Flash Sale' : 'Créer une Flash Sale'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingFlashSale?.title}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="discount">Réduction (%) *</Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    min="1"
                    max="99"
                    defaultValue={editingFlashSale?.discount}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingFlashSale?.description}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Date de début *</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="datetime-local"
                    defaultValue={editingFlashSale?.startDate ? 
                      new Date(editingFlashSale.startDate).toISOString().slice(0, 16) : 
                      new Date().toISOString().slice(0, 16)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Date de fin *</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="datetime-local"
                    defaultValue={editingFlashSale?.endDate ? 
                      new Date(editingFlashSale.endDate).toISOString().slice(0, 16) : 
                      ''
                    }
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label>Produits *</Label>
                <div className="max-h-48 overflow-y-auto border rounded p-2 mt-1">
                  {products.map(product => (
                    <div key={product.id} className="flex items-center space-x-2 p-2">
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedProducts([...selectedProducts, product.id]);
                          } else {
                            setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                          }
                        }}
                      />
                      <span className="text-sm">{product.name} - {product.price}€</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="bannerImage">Image de bannière</Label>
                <Input
                  id="bannerImage"
                  name="bannerImage"
                  type="file"
                  accept="image/*"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  {editingFlashSale ? 'Mettre à jour' : 'Créer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {flashSales.map(flashSale => (
          <Card key={flashSale.id} className={isFlashSaleActive(flashSale) ? 'border-red-500' : ''}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-3">
                <Flame className="h-6 w-6 text-red-600" />
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{flashSale.title}</span>
                    <Badge variant="secondary">-{flashSale.discount}%</Badge>
                    {isFlashSaleActive(flashSale) && (
                      <Badge className="bg-green-500">Actif</Badge>
                    )}
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    {flashSale.productIds.length} produit(s)
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(flashSale)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDelete(flashSale.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium">Début</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(flashSale.startDate), 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Fin</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(flashSale.endDate), 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {isFlashSaleActive(flashSale) 
                      ? `Se termine dans ${getTimeRemaining(flashSale.endDate)}`
                      : new Date(flashSale.endDate) < new Date() 
                        ? 'Expiré' 
                        : `Démarre le ${format(new Date(flashSale.startDate), 'dd/MM', { locale: fr })}`
                    }
                  </span>
                </div>
              </div>
              {flashSale.description && (
                <p className="text-sm text-gray-600 mt-3">{flashSale.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
        
        {flashSales.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Flame className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune flash sale</h3>
              <p className="text-gray-600 mb-4">Créez votre première vente flash pour booster vos ventes.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminFlashSalesPage;
