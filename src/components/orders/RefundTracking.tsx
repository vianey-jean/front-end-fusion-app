
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Refund } from '@/services/api';

interface RefundTrackingProps {
  refund: Refund;
}

const RefundTracking: React.FC<RefundTrackingProps> = ({ refund }) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'vérification': return 'bg-blue-100 text-blue-800';
      case 'en étude': return 'bg-yellow-100 text-yellow-800';
      case 'traité': return refund.decision === 'accepté' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'vérification': return <Clock className="h-4 w-4" />;
      case 'en étude': return <Clock className="h-4 w-4" />;
      case 'traité': return refund.decision === 'accepté' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Suivie remboursement
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Suivi de remboursement #{refund.id.split('-')[1]}</DialogTitle>
          <DialogDescription>
            Commande #{refund.orderId.split('-')[1]} - {formatDate(refund.createdAt)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Statut actuel */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon(refund.status)}
              <span className="font-medium">Statut actuel:</span>
            </div>
            <Badge className={getStatusBadgeClass(refund.status)}>
              {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}
              {refund.status === 'traité' && refund.decision && ` - ${refund.decision}`}
            </Badge>
          </div>

          <Separator />

          {/* Détails de la demande */}
          <div>
            <h3 className="text-sm font-medium mb-2">Détails de la demande</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Raison:</span> {refund.reason}</p>
              {refund.customReason && (
                <p><span className="font-medium">Détails:</span> {refund.customReason}</p>
              )}
              <p><span className="font-medium">Montant:</span> {refund.orderTotal.toFixed(2)} €</p>
            </div>
          </div>

          {/* Photos jointes */}
          {refund.photos && refund.photos.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Photos jointes</h3>
              <div className="grid grid-cols-3 gap-2">
                {refund.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={`${AUTH_BASE_URL}${photo}`}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-20 object-cover rounded border"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Produits concernés */}
          <div>
            <h3 className="text-sm font-medium mb-2">Produits concernés</h3>
            <div className="space-y-2">
              {refund.orderItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                  <img
                    src={`${AUTH_BASE_URL}${item.image}`}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
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

          {/* Commentaires de l'admin */}
          {refund.adminComments && refund.adminComments.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Commentaires de l'équipe</h3>
              <div className="space-y-3">
                {refund.adminComments.map((comment, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium">{comment.adminName}</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.comment}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Chronologie */}
          <div>
            <h3 className="text-sm font-medium mb-2">Chronologie</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Demande créée</p>
                  <p className="text-gray-500">{formatDate(refund.createdAt)}</p>
                </div>
              </div>
              
              <div className={`flex items-center space-x-3 text-sm ${
                refund.status === 'vérification' ? 'text-blue-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  refund.status === 'vérification' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">En vérification</p>
                </div>
              </div>
              
              <div className={`flex items-center space-x-3 text-sm ${
                refund.status === 'en étude' ? 'text-yellow-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  refund.status === 'en étude' ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">En étude</p>
                </div>
              </div>
              
              <div className={`flex items-center space-x-3 text-sm ${
                refund.status === 'traité' ? (refund.decision === 'accepté' ? 'text-green-600' : 'text-red-600') : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  refund.status === 'traité' 
                    ? (refund.decision === 'accepté' ? 'bg-green-100' : 'bg-red-100')
                    : 'bg-gray-100'
                }`}>
                  {refund.status === 'traité' 
                    ? (refund.decision === 'accepté' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />)
                    : <Clock className="h-4 w-4" />
                  }
                </div>
                <div>
                  <p className="font-medium">
                    Traité {refund.status === 'traité' && refund.decision && `- ${refund.decision}`}
                  </p>
                  {refund.status === 'traité' && (
                    <p className="text-gray-500">{formatDate(refund.updatedAt)}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RefundTracking;
