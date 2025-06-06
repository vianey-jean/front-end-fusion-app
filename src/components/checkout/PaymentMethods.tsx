
import React from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, CreditCardIcon, Banknote } from 'lucide-react';
import { motion } from 'framer-motion';
import visaLogo from '@/assets/visa.png';
import mastercardLogo from '@/assets/mastercard.png';
import paypalLogo from '@/assets/paypal.png';
import applepayLogo from '@/assets/applepay.png';

interface PaymentMethodsProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  isDisabled?: boolean;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ 
  selectedMethod, 
  onMethodChange,
  isDisabled = false 
}) => {
  const paymentOptions = [
    {
      id: 'card',
      icon: CreditCard,
      title: 'Carte bancaire',
      description: 'Paiement sécurisé par carte',
      logos: [visaLogo, mastercardLogo],
      gradient: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      selectedGradient: 'from-blue-100 to-indigo-100',
      selectedBorder: 'border-blue-500'
    },
    {
      id: 'paypal',
      icon: null,
      title: 'PayPal',
      description: 'Paiement rapide et sécurisé',
      logos: [paypalLogo],
      gradient: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-200',
      selectedGradient: 'from-yellow-100 to-orange-100',
      selectedBorder: 'border-yellow-500'
    },
    {
      id: 'applepay',
      icon: null,
      title: 'Apple Pay',
      description: 'Paiement avec Touch ID/Face ID',
      logos: [applepayLogo],
      gradient: 'from-gray-50 to-slate-50',
      borderColor: 'border-gray-200',
      selectedGradient: 'from-gray-100 to-slate-100',
      selectedBorder: 'border-gray-500'
    },
    {
      id: 'cash',
      icon: Banknote,
      title: 'Paiement à la livraison',
      description: 'Payez en espèces ou par carte',
      logos: [],
      gradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      selectedGradient: 'from-green-100 to-emerald-100',
      selectedBorder: 'border-green-500'
    }
  ];

  const getPaymentInfo = (methodId: string) => {
    const infoMap = {
      card: 'Vous serez redirigé vers notre page de paiement sécurisé',
      paypal: 'Vous serez redirigé vers PayPal pour finaliser votre paiement',
      applepay: 'Paiement sécurisé avec Apple Pay',
      cash: 'Vous paierez à la livraison. Préparez le montant exact si possible.'
    };
    return infoMap[methodId as keyof typeof infoMap] || '';
  };

  return (
    <motion.div 
      className="bg-gradient-to-br from-white via-gray-50 to-white p-8 rounded-2xl shadow-lg border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
          <CreditCard className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Mode de paiement
        </h2>
      </div>
      
      <RadioGroup value={selectedMethod} onValueChange={onMethodChange} disabled={isDisabled}>
        <div className="space-y-4">
          {paymentOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                selectedMethod === option.id 
                  ? `${option.selectedBorder} bg-gradient-to-r ${option.selectedGradient} shadow-sm` 
                  : `${option.borderColor} bg-gradient-to-r ${option.gradient} hover:shadow-sm`
              }`}
            >
              <div className="flex items-center p-4">
                <RadioGroupItem value={option.id} id={option.id} className="text-red-600" />
                <Label htmlFor={option.id} className="flex-grow cursor-pointer ml-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {option.icon && (
                        <option.icon className="mr-3 h-5 w-5 text-gray-600" />
                      )}
                      <div>
                        <span className="font-semibold text-gray-800">{option.title}</span>
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      </div>
                    </div>
                    
                    {option.logos.length > 0 && (
                      <div className="flex items-center space-x-2">
                        {option.logos.map((logo, logoIndex) => (
                          <motion.img 
                            key={logoIndex}
                            src={logo} 
                            alt="Payment logo" 
                            className="h-7 transition-transform duration-200 group-hover:scale-105" 
                            whileHover={{ scale: 1.1 }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </Label>
              </div>
              
              {/* Effet de brillance au hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
            </motion.div>
          ))}
        </div>
      </RadioGroup>

      {selectedMethod && (
        <motion.div 
          className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
            <p className="text-sm text-blue-800 leading-relaxed">
              {getPaymentInfo(selectedMethod)}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PaymentMethods;
