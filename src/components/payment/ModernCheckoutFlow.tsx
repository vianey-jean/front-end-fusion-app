import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Shield, 
  Clock, 
  Truck, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  Lock,
  Smartphone,
  Globe,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StripePaymentForm from './StripePaymentForm';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ModernCheckoutFlowProps {
  cartItems: CartItem[];
  totalAmount: number;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onBack?: () => void;
}

const ModernCheckoutFlow: React.FC<ModernCheckoutFlowProps> = ({
  cartItems,
  totalAmount,
  onPaymentSuccess,
  onBack
}) => {
  const [currentStep, setCurrentStep] = useState<'review' | 'payment' | 'processing'>('review');

  const steps = [
    { id: 'review', name: 'Révision', icon: CheckCircle },
    { id: 'payment', name: 'Paiement', icon: CreditCard },
    { id: 'processing', name: 'Traitement', icon: Clock },
  ];

  const handleContinueToPayment = () => {
    setCurrentStep('payment');
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    setCurrentStep('processing');
    setTimeout(() => {
      onPaymentSuccess(paymentIntentId);
    }, 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Progress Steps */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
              const StepIcon = step.icon;

              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : isCompleted 
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'bg-gray-200 border-gray-300 text-gray-500'
                  }`}>
                    <StepIcon className="h-5 w-5" />
                  </div>
                  <span className={`ml-2 font-medium ${
                    isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`ml-4 w-12 h-0.5 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {/* Step 1: Order Review */}
        {currentStep === 'review' && (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Order Summary */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    Révision de votre commande
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        )}
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Trust Indicators */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-600" />
                    Vos garanties
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Livraison rapide</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Paiement sécurisé</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Garantie qualité</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">Support 24/7</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Total & Actions */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Récapitulatif</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Sous-total</span>
                      <span>{formatPrice(totalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Livraison</span>
                      <span className="text-green-600">Gratuite</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(totalAmount)}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleContinueToPayment}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                  >
                    Continuer vers le paiement
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>

                  {onBack && (
                    <Button 
                      variant="outline" 
                      onClick={onBack}
                      className="w-full"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Retour au panier
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Security Badges */}
              <Card>
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <h4 className="font-medium text-sm">Paiement 100% sécurisé</h4>
                    <div className="flex justify-center space-x-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <Lock className="h-3 w-3 mr-1" />
                        SSL
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        <Shield className="h-3 w-3 mr-1" />
                        3DS
                      </Badge>
                    </div>
                    <div className="flex justify-center space-x-4 text-2xl">
                      💳 🔒 🛡️
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Step 2: Payment */}
        {currentStep === 'payment' && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2">
              <StripePaymentForm
                amount={totalAmount}
                currency="eur"
                description={`Commande de ${cartItems.length} article(s)`}
                onSuccess={handlePaymentSuccess}
              />
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Résumé de commande</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{cartItems.length} article(s)</span>
                      <span>{formatPrice(totalAmount)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(totalAmount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                variant="outline" 
                onClick={() => setCurrentStep('review')}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la révision
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Processing */}
        {currentStep === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-12"
          >
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                    <Clock className="h-8 w-8 text-white animate-spin" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Traitement en cours...
                  </h2>
                  <p className="text-gray-600">
                    Veuillez patienter pendant que nous traitons votre paiement.
                  </p>
                  <div className="flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModernCheckoutFlow;