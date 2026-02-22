import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Sale } from '@/types';
import { Search, RotateCcw, Trash2, Euro, Package, X } from 'lucide-react';
import remboursementApiService from '@/services/api/remboursementApi';

interface RefundFormProps {
  isOpen: boolean;
  onClose: () => void;
  editSale?: Sale; // If provided, refund this specific sale
}

interface RefundProduct {
  productId: string;
  description: string;
  quantitySold: number;
  maxQuantity: number;
  purchasePriceUnit: number;
  refundPriceUnit: number;
  originalSellingPriceUnit: number;
  profit: number;
}

const RefundForm: React.FC<RefundFormProps> = ({ isOpen, onClose, editSale }) => {
  const { refreshData } = useApp();
  const { toast } = useToast();

  const [clientSearch, setClientSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Sale[]>([]);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [refundProducts, setRefundProducts] = useState<RefundProduct[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Initialize from editSale if provided
  React.useEffect(() => {
    if (isOpen && editSale) {
      setSelectedSale(editSale);
      initRefundProducts(editSale);
      setClientSearch(editSale.clientName || '');
      setDate(new Date().toISOString().split('T')[0]);
    } else if (isOpen) {
      resetForm();
    }
  }, [isOpen, editSale]);

  const resetForm = () => {
    setClientSearch('');
    setSearchResults([]);
    setSelectedSale(null);
    setRefundProducts([]);
    setDate(new Date().toISOString().split('T')[0]);
  };

  const initRefundProducts = (sale: Sale) => {
    if (sale.products && sale.products.length > 0) {
      setRefundProducts(sale.products.map(p => ({
        productId: p.productId,
        description: p.description,
        quantitySold: p.quantitySold,
        maxQuantity: p.quantitySold,
        purchasePriceUnit: p.purchasePrice / (p.quantitySold || 1),
        refundPriceUnit: p.sellingPrice / (p.quantitySold || 1),
        originalSellingPriceUnit: p.sellingPrice / (p.quantitySold || 1),
        profit: p.profit
      })));
    } else if (sale.productId) {
      setRefundProducts([{
        productId: sale.productId,
        description: sale.description || '',
        quantitySold: sale.quantitySold || 1,
        maxQuantity: sale.quantitySold || 1,
        purchasePriceUnit: (sale.purchasePrice || 0) / (sale.quantitySold || 1),
        refundPriceUnit: (sale.sellingPrice || 0) / (sale.quantitySold || 1),
        originalSellingPriceUnit: (sale.sellingPrice || 0) / (sale.quantitySold || 1),
        profit: sale.profit || 0
      }]);
    }
  };

  // Search sales by client name
  const handleSearch = useCallback(async (value: string) => {
    setClientSearch(value);
    if (value.length >= 3) {
      setIsSearching(true);
      try {
        const results = await remboursementApiService.searchSalesByClient(value);
        setSearchResults(results);
      } catch (error) {
        console.error('Erreur recherche:', error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  }, []);

  // Select a sale to refund
  const handleSelectSale = (sale: Sale) => {
    setSelectedSale(sale);
    setSearchResults([]);
    setClientSearch(sale.clientName || '');
    initRefundProducts(sale);
  };

  // Remove a product from refund (keep at least 1)
  const removeProduct = (index: number) => {
    if (refundProducts.length <= 1) return;
    setRefundProducts(prev => prev.filter((_, i) => i !== index));
  };

  // Update quantity
  const updateQuantity = (index: number, value: string) => {
    const qty = Math.max(1, Math.min(Number(value) || 1, refundProducts[index].maxQuantity));
    setRefundProducts(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        quantitySold: qty,
        profit: (qty * updated[index].refundPriceUnit) - (qty * updated[index].purchasePriceUnit)
      };
      return updated;
    });
  };

  // Update refund price
  const updateRefundPrice = (index: number, value: string) => {
    const price = Number(value) || 0;
    setRefundProducts(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        refundPriceUnit: price,
        profit: (updated[index].quantitySold * price) - (updated[index].quantitySold * updated[index].purchasePriceUnit)
      };
      return updated;
    });
  };

  // Calculate totals
  const totals = refundProducts.reduce((acc, p) => ({
    totalRefundPrice: acc.totalRefundPrice + (p.quantitySold * p.refundPriceUnit),
    totalPurchasePrice: acc.totalPurchasePrice + (p.quantitySold * p.purchasePriceUnit),
    totalProfit: acc.totalProfit + p.profit
  }), { totalRefundPrice: 0, totalPurchasePrice: 0, totalProfit: 0 });

  const formatCurrency = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('fr-FR');

  // Submit refund
  const handleSubmit = async () => {
    if (!selectedSale || refundProducts.length === 0) return;
    setIsSubmitting(true);

    try {
      await remboursementApiService.create({
        originalSaleId: selectedSale.id,
        date,
        products: refundProducts.map(p => ({
          productId: p.productId,
          description: p.description,
          quantitySold: p.quantitySold,
          sellingPrice: p.quantitySold * p.refundPriceUnit,
          refundPrice: p.quantitySold * p.refundPriceUnit,
          refundPriceUnit: p.refundPriceUnit,
          purchasePrice: p.quantitySold * p.purchasePriceUnit,
          profit: p.profit
        })),
        totalRefundPrice: totals.totalRefundPrice,
        totalPurchasePrice: totals.totalPurchasePrice,
        totalProfit: totals.totalProfit,
        clientName: selectedSale.clientName,
        clientPhone: selectedSale.clientPhone,
        clientAddress: selectedSale.clientAddress
      });

      toast({
        title: "✅ Remboursement enregistré",
        description: `Remboursement de ${formatCurrency(totals.totalRefundPrice)} effectué avec succès`,
        className: "notification-success",
      });

      if (refreshData) refreshData();
      onClose();
    } catch (error) {
      console.error('Erreur remboursement:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'enregistrement du remboursement",
        variant: "destructive",
        className: "notification-erreur",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
              <RotateCcw className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent font-black">
              Remboursement
            </span>
          </DialogTitle>
          <DialogDescription>
            Recherchez un client et sélectionnez la vente à rembourser
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Date */}
          <div className="space-y-2">
            <Label>Date du remboursement</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          {/* Search client */}
          {!selectedSale && (
            <div className="space-y-2">
              <Label>Rechercher par nom du client (min. 3 caractères)</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={clientSearch}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Nom du client..."
                  className="pl-10"
                />
              </div>
              
              {isSearching && <p className="text-sm text-muted-foreground">Recherche en cours...</p>}

              {searchResults.length > 0 && (
                <div className="max-h-60 overflow-y-auto border rounded-lg divide-y">
                  {searchResults.map((sale) => (
                    <div
                      key={sale.id}
                      onClick={() => handleSelectSale(sale)}
                      className="p-3 hover:bg-accent cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-sm">{sale.clientName}</p>
                          <p className="text-xs text-muted-foreground">
                            {sale.products
                              ? sale.products.map(p => p.description).join(', ')
                              : sale.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm text-emerald-600">
                            {formatCurrency(sale.totalSellingPrice || sale.sellingPrice || 0)}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatDate(sale.date)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                  }
                </div>
              )}

              {clientSearch.length >= 3 && !isSearching && searchResults.length === 0 && (
                <p className="text-sm text-muted-foreground">Aucune vente trouvée pour ce client</p>
              )}
            </div>
          )}

          {/* Selected sale info */}
          {selectedSale && (
            <>
              <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-bold text-amber-700 dark:text-amber-400">
                      Vente sélectionnée - {selectedSale.clientName}
                    </CardTitle>
                    {!editSale && (
                      <Button variant="ghost" size="sm" onClick={resetForm}>
                        <X className="h-4 w-4" /> Changer
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Date: {formatDate(selectedSale.date)} • 
                    Total: {formatCurrency(selectedSale.totalSellingPrice || selectedSale.sellingPrice || 0)}
                  </p>
                </CardContent>
              </Card>

              {/* Products to refund */}
              <div className="space-y-3">
                <Label className="text-sm font-bold">Produits à rembourser</Label>
                {refundProducts.map((product, index) => (
                  <Card key={index} className="border-0 shadow-md bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-blue-500" />
                          <span className="font-bold text-sm">{product.description}</span>
                        </div>
                        {refundProducts.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProduct(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Quantité (max: {product.maxQuantity})</Label>
                          <Input
                            type="number"
                            min="1"
                            max={product.maxQuantity}
                            value={product.quantitySold}
                            onChange={(e) => updateQuantity(index, e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Prix remboursement unitaire (€)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={product.refundPriceUnit}
                            onChange={(e) => updateRefundPrice(index, e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Total remboursement</Label>
                          <div className="h-10 flex items-center px-3 rounded-md bg-amber-100 dark:bg-amber-900/30 font-bold text-amber-700 dark:text-amber-400">
                            {formatCurrency(product.quantitySold * product.refundPriceUnit)}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Prix d'achat unitaire: {formatCurrency(product.purchasePriceUnit)} • 
                        Bénéfice: <span className={product.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(product.profit)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Totals */}
              <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Total remboursement</p>
                      <p className="text-lg font-black text-amber-700 dark:text-amber-400">
                        {formatCurrency(totals.totalRefundPrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Coût d'achat</p>
                      <p className="text-lg font-black text-gray-600 dark:text-gray-400">
                        {formatCurrency(totals.totalPurchasePrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Impact bénéfice</p>
                      <p className="text-lg font-black text-red-600">
                        -{formatCurrency(Math.abs(totals.totalProfit))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedSale || refundProducts.length === 0}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold shadow-lg"
          >
            {isSubmitting ? 'Enregistrement...' : '✓ Valider le remboursement'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RefundForm;
