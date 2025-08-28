import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Lock, 
  CheckCircle, 
  Star, 
  Truck, 
  Phone, 
  Award,
  Globe,
  CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SecurityBadgesProps {
  variant?: 'default' | 'compact' | 'detailed';
  showStats?: boolean;
}

const SecurityBadges: React.FC<SecurityBadgesProps> = ({ 
  variant = 'default',
  showStats = false 
}) => {
  const securityFeatures = [
    {
      icon: Shield,
      title: 'SSL 256-bit',
      description: 'Chiffrement de niveau bancaire',
      color: 'bg-green-100 text-green-700'
    },
    {
      icon: Lock,
      title: '3D Secure',
      description: 'Authentification renforcée',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      icon: CreditCard,
      title: 'PCI DSS',
      description: 'Conformité bancaire',
      color: 'bg-purple-100 text-purple-700'
    },
    {
      icon: CheckCircle,
      title: 'Certifié ISO',
      description: 'Norme internationale',
      color: 'bg-orange-100 text-orange-700'
    }
  ];

  const trustIndicators = [
    {
      icon: Star,
      value: '4.9/5',
      label: 'Satisfaction client',
      color: 'text-yellow-600'
    },
    {
      icon: Truck,
      value: '24-48h',
      label: 'Livraison rapide',
      color: 'text-blue-600'
    },
    {
      icon: Phone,
      value: '24/7',
      label: 'Support client',
      color: 'text-green-600'
    },
    {
      icon: Award,
      value: '99.9%',
      label: 'Disponibilité',
      color: 'text-purple-600'
    }
  ];

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {securityFeatures.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Badge 
              key={index}
              variant="secondary" 
              className={feature.color}
            >
              <IconComponent className="h-3 w-3 mr-1" />
              {feature.title}
            </Badge>
          );
        })}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className="space-y-6">
        {/* Security Features */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-600" />
              Sécurité & Certifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {securityFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${feature.color}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{feature.title}</h4>
                      <p className="text-xs text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        {showStats && (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-600" />
                Nos garanties
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {trustIndicators.map((indicator, index) => {
                  const IconComponent = indicator.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center p-3 bg-white border rounded-lg shadow-sm"
                    >
                      <IconComponent className={`h-6 w-6 mx-auto mb-2 ${indicator.color}`} />
                      <div className="font-bold text-lg">{indicator.value}</div>
                      <div className="text-xs text-gray-600">{indicator.label}</div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Methods */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
              Moyens de paiement acceptés
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                <img src="/src/assets/visa.png" alt="Visa" className="h-6" />
                <span className="text-sm font-medium">Visa</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                <img src="/src/assets/mastercard.png" alt="Mastercard" className="h-6" />
                <span className="text-sm font-medium">Mastercard</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                <img src="/src/assets/american.png" alt="American Express" className="h-6" />
                <span className="text-sm font-medium">Amex</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                <img src="/src/assets/paypal.png" alt="PayPal" className="h-6" />
                <span className="text-sm font-medium">PayPal</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <Shield className="h-6 w-6 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <h4 className="font-medium mb-1">Protection de vos données</h4>
              <p>
                Toutes vos informations sont chiffrées avec le protocole SSL 256-bit, 
                le même niveau de sécurité que les banques. Nous ne stockons jamais 
                vos données bancaires sur nos serveurs.
              </p>
              <div className="flex items-center mt-2 text-xs">
                <Globe className="h-3 w-3 mr-1" />
                <span>Certifié par Stripe • Conforme RGPD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-center space-y-3">
          <h4 className="font-medium">Paiement 100% sécurisé</h4>
          <div className="flex justify-center space-x-2">
            {securityFeatures.slice(0, 3).map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className={feature.color}
                >
                  <IconComponent className="h-3 w-3 mr-1" />
                  {feature.title}
                </Badge>
              );
            })}
          </div>
          <div className="flex justify-center space-x-3 text-2xl">
            🔒 🛡️ ✅
          </div>
          <p className="text-xs text-gray-600">
            Propulsé par Stripe • Conforme PCI DSS
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityBadges;