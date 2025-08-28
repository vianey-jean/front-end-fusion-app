import React, { useState, useEffect } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/sonner';
import { Shield, Lock, CreditCard, CheckCircle, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';

// Configuration Stripe - Remplacez par votre clé publique
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51...'; // À remplacer par votre vraie clé

interface StripePaymentFormProps {
  amount: number;
  currency?: string;
  description?: string;
  onSuccess: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  currency = 'eur',
  description = 'Achat',
  onSuccess,
  onError
}) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    name: '',
    phone: ''
  });

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(STRIPE_PUBLISHABLE_KEY);
        setStripe(stripeInstance);
      } catch (error) {
        console.error('Erreur lors du chargement de Stripe:', error);
        toast.error('Erreur lors du chargement du système de paiement');
      }
    };

    initializeStripe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe) {
      toast.error('Système de paiement non disponible');
      return;
    }

    if (!customerInfo.email || !customerInfo.name) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setProcessing(true);

    try {
      // Créer une session de checkout Stripe
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Stripe utilise les centimes
          currency,
          description,
          customer_email: customerInfo.email,
          customer_name: customerInfo.name,
          customer_phone: customerInfo.phone,
          save_card: saveCard,
          payment_method_types: ['card'],
          mode: 'payment'
        }),
      });

      const session = await response.json();

      if (session.error) {
        throw new Error(session.error);
      }

      // Rediriger vers Stripe Checkout (avec 3D Secure automatique)
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        throw new Error(error.message);
      }

    } catch (error: any) {
      console.error('Erreur de paiement:', error);
      toast.error(`Erreur: ${error.message}`);
      onError?.(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  if (!stripe) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <LoadingSpinner size="sm" />
            <span>Chargement du système de paiement...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Paiement sécurisé
        </CardTitle>
        <p className="text-gray-600">
          Propulsé par Stripe • SSL 256-bit
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Résumé du montant */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Total à payer:</span>
            <span className="text-2xl font-bold text-blue-600">
              {formatAmount(amount)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>

        {/* Badges de sécurité */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <Lock className="h-3 w-3 mr-1" />
            SSL sécurisé
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            <Shield className="h-3 w-3 mr-1" />
            3D Secure
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            PCI DSS
          </Badge>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Informations client */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="flex items-center">
                <span className="text-red-500 mr-1">*</span>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="name" className="flex items-center">
                <span className="text-red-500 mr-1">*</span>
                Nom complet
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="phone">Téléphone (optionnel)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+33 6 12 34 56 78"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Option sauvegarde carte */}
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <Checkbox
              id="saveCard"
              checked={saveCard}
              onCheckedChange={(checked) => setSaveCard(checked === true)}
            />
            <Label htmlFor="saveCard" className="text-sm text-gray-700">
              Enregistrer ma carte pour les prochains achats
            </Label>
          </div>

          {/* Informations de sécurité */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Paiement 100% sécurisé</p>
                <p>
                  Vos données bancaires sont chiffrées et traitées directement par Stripe. 
                  Nous ne stockons aucune information bancaire sur nos serveurs.
                </p>
              </div>
            </div>
          </div>

          {/* Bouton de paiement */}
          <Button
            type="submit"
            disabled={processing || !customerInfo.email || !customerInfo.name}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg transition-all duration-200 transform hover:scale-105"
          >
            {processing ? (
              <div className="flex items-center justify-center space-x-2">
                <LoadingSpinner size="sm" />
                <span>Redirection vers Stripe...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payer {formatAmount(amount)}</span>
                <Lock className="h-4 w-4" />
              </div>
            )}
          </Button>
        </form>

        {/* Footer de confiance */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>Paiement traité par Stripe</p>
          <div className="flex justify-center space-x-4">
            <span>🔒 SSL</span>
            <span>🛡️ 3D Secure</span>
            <span>✅ PCI DSS</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StripePaymentForm;