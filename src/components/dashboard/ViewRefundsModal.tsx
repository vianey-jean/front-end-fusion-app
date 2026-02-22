import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCcw, Euro, Package, Calendar } from 'lucide-react';
import remboursementApiService from '@/services/api/remboursementApi';
import PremiumLoading from '@/components/ui/premium-loading';

interface ViewRefundsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ViewRefundsModal: React.FC<ViewRefundsModalProps> = ({ isOpen, onClose }) => {
  const [refunds, setRefunds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadRefunds();
    }
  }, [isOpen]);

  const loadRefunds = async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      const data = await remboursementApiService.getByMonth(now.getMonth() + 1, now.getFullYear());
      setRefunds(data);
    } catch (error) {
      console.error('Erreur chargement remboursements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('fr-FR');

  const totalRefunds = refunds.reduce((sum, r) => sum + (r.totalRefundPrice || 0), 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
              <RotateCcw className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent font-black">
              Remboursements du mois
            </span>
          </DialogTitle>
          <DialogDescription>
            Liste des remboursements effectués ce mois-ci
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <PremiumLoading text="Chargement..." size="sm" variant="ventes" />
        ) : refunds.length === 0 ? (
          <div className="text-center py-8">
            <RotateCcw className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">Aucun remboursement ce mois-ci</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Total */}
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200">
              <CardContent className="p-3 flex justify-between items-center">
                <span className="font-bold text-amber-700 dark:text-amber-400">
                  Total: {refunds.length} remboursement(s)
                </span>
                <span className="font-black text-lg text-amber-700 dark:text-amber-400">
                  {formatCurrency(totalRefunds)}
                </span>
              </CardContent>
            </Card>

            {refunds.map((refund) => (
              <Card key={refund.id} className="border-0 shadow-sm">
                <CardContent className="p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">{refund.clientName || 'Client inconnu'}</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(refund.date)}
                    </div>
                  </div>
                  {refund.products?.map((p: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs bg-gray-50 dark:bg-gray-800 rounded p-2">
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3 text-blue-500" />
                        <span>{p.description}</span>
                        <span className="text-muted-foreground">x{p.quantityRefunded}</span>
                      </div>
                      <span className="font-bold text-amber-600">{formatCurrency(p.totalRefundPrice)}</span>
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <span className="font-black text-amber-700 dark:text-amber-400">
                      {formatCurrency(refund.totalRefundPrice)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewRefundsModal;
