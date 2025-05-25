
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { refundsAPI, Refund } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, CheckCircle, XCircle, Eye, MessageSquare } from 'lucide-react';
import AdminLayout from './AdminLayout';

const AdminRefundsPage = () => {
  const queryClient = useQueryClient();
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null);
  const [statusComment, setStatusComment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDecision, setSelectedDecision] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: refunds = [], isLoading } = useQuery({
    queryKey: ['admin-refunds'],
    queryFn: async () => {
      const response = await refundsAPI.getAll();
      return response.data;
    }
  });

  const updateRefundStatus = useMutation({
    mutationFn: async ({ refundId, status, comment, decision }: { 
      refundId: string, 
      status: string, 
      comment?: string,
      decision?: string 
    }) => {
      await refundsAPI.updateStatus(refundId, status, comment, decision);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-refunds'] });
      toast.success('Statut mis à jour avec succès');
      setIsDialogOpen(false);
      setStatusComment('');
      setSelectedStatus('');
      setSelectedDecision('');
      setSelectedRefund(null);
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour du statut');
    }
  });

  const handleStatusUpdate = () => {
    if (!selectedRefund || !selectedStatus) return;
    
    if (selectedStatus === 'traité' && (!statusComment || !selectedDecision)) {
      toast.error('Commentaire et décision sont obligatoires pour le statut traité');
      return;
    }

    updateRefundStatus.mutate({
      refundId: selectedRefund.id,
      status: selectedStatus,
      comment: statusComment || undefined,
      decision: selectedDecision || undefined
    });
  };

  const openStatusDialog = (refund: Refund) => {
    setSelectedRefund(refund);
    setSelectedStatus(refund.status);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr });
  };

  const getStatusBadgeClass = (status: string, decision?: string) => {
    switch (status) {
      case 'vérification': return 'bg-blue-100 text-blue-800';
      case 'en étude': return 'bg-yellow-100 text-yellow-800';
      case 'traité': return decision === 'accepté' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string, decision?: string) => {
    switch (status) {
      case 'vérification': return <Clock className="h-4 w-4" />;
      case 'en étude': return <Clock className="h-4 w-4" />;
      case 'traité': return decision === 'accepté' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Chargement des demandes de remboursement...</div>;
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Gestion des Remboursements</h1>

        {refunds.length === 0 ? (
          <div className="text-center py-10 border rounded-md">
            <p>Aucune demande de remboursement trouvée.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {refunds.map((refund: Refund) => (
              <Card key={refund.id}>
                <CardHeader className="pb-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Remboursement #{refund.id.split('-')[1]}
                        {getStatusIcon(refund.status, refund.decision)}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Commande #{refund.orderId.split('-')[1]} - {formatDate(refund.createdAt)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Client: {refund.userName} ({refund.userEmail})
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0 flex flex-col items-end gap-2">
                      <Badge className={getStatusBadgeClass(refund.status, refund.decision)}>
                        {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}
                        {refund.status === 'traité' && refund.decision && ` - ${refund.decision}`}
                      </Badge>
                      <p className="font-bold">{refund.orderTotal.toFixed(2)} €</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Détails de la demande */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Détails de la demande</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Raison:</span> {refund.reason}</p>
                        {refund.customReason && (
                          <p><span className="font-medium">Détails:</span> {refund.customReason}</p>
                        )}
                      </div>

                      {/* Photos jointes */}
                      {refund.photos && refund.photos.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Photos jointes</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {refund.photos.map((photo, index) => (
                              <img
                                key={index}
                                src={`${AUTH_BASE_URL}${photo}`}
                                alt={`Photo ${index + 1}`}
                                className="w-full h-20 object-cover rounded border cursor-pointer hover:opacity-80"
                                onClick={() => window.open(`${AUTH_BASE_URL}${photo}`, '_blank')}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Produits */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Produits concernés</h3>
                      <div className="space-y-2">
                        {refund.orderItems.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                            <img
                              src={`${AUTH_BASE_URL}${item.image}`}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-gray-500">
                                {item.quantity} × {item.price.toFixed(2)} €
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Commentaires admin */}
                  {refund.adminComments && refund.adminComments.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Historique des commentaires</h3>
                      <div className="space-y-2">
                        {refund.adminComments.map((comment, index) => (
                          <div key={index} className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-sm font-medium">{comment.adminName}</span>
                              <span className="text-xs text-gray-500">
                                {formatDate(comment.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm">{comment.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={() => openStatusDialog(refund)}
                      disabled={updateRefundStatus.isPending}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Mettre à jour le statut
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog pour mettre à jour le statut */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Mettre à jour le statut</DialogTitle>
              <DialogDescription>
                Remboursement #{selectedRefund?.id.split('-')[1]}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Nouveau statut</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vérification">Vérification</SelectItem>
                    <SelectItem value="en étude">En étude</SelectItem>
                    <SelectItem value="traité">Traité</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedStatus === 'traité' && (
                <div>
                  <Label htmlFor="decision">Décision *</Label>
                  <Select value={selectedDecision} onValueChange={setSelectedDecision}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une décision" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accepté">Accepté</SelectItem>
                      <SelectItem value="refusé">Refusé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="comment">
                  Commentaire {selectedStatus === 'traité' ? '*' : '(optionnel)'}
                </Label>
                <Textarea
                  id="comment"
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                  placeholder="Ajoutez un commentaire..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleStatusUpdate}
                disabled={updateRefundStatus.isPending || !selectedStatus}
              >
                {updateRefundStatus.isPending ? 'Mise à jour...' : 'Mettre à jour'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminRefundsPage;
