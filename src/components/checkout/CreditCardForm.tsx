
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import LoadingSpinner from '@/components/ui/loading-spinner';
import CardInputField from './CardInputField';
import { 
  validateCardNumber, 
  validateExpiryDate, 
  formatCardNumber, 
  formatExpiryDate 
} from './CardValidation';

interface CreditCardFormProps {
  onSuccess: () => void;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({ onSuccess }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
    setErrors(prev => ({ ...prev, cardNumber: '' }));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(formatExpiryDate(e.target.value));
    setErrors(prev => ({ ...prev, expiryDate: '' }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardName(e.target.value);
    setErrors(prev => ({ ...prev, cardName: '' }));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvv(value);
    setErrors(prev => ({ ...prev, cvv: '' }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: ''
    };

    if (!cardName.trim()) {
      newErrors.cardName = 'Le nom du titulaire est requis';
      valid = false;
    }

    if (!validateCardNumber(cardNumber)) {
      newErrors.cardNumber = 'Numéro de carte invalide';
      valid = false;
    }

    if (!validateExpiryDate(expiryDate)) {
      newErrors.expiryDate = 'Date d\'expiration invalide';
      valid = false;
    }

    if (cvv.length < 3) {
      newErrors.cvv = 'CVV invalide';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      toast.success("Paiement accepté");
      
      if (onSuccess && typeof onSuccess === 'function') {
        console.log("Calling onSuccess after payment");
        onSuccess();
      } else {
        console.error("onSuccess callback is not properly defined");
      }
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardInputField
        id="cardName"
        label="Titulaire de la carte"
        value={cardName}
        onChange={handleNameChange}
        placeholder="John Doe"
        error={errors.cardName}
        required
      />
      
      <CardInputField
        id="cardNumber"
        label="Numéro de carte"
        value={cardNumber}
        onChange={handleCardNumberChange}
        placeholder="1234 5678 9012 3456"
        error={errors.cardNumber}
        required
      />
      
      <div className="flex space-x-4">
        <div className="w-1/2">
          <CardInputField
            id="expiryDate"
            label="Date d'expiration"
            value={expiryDate}
            onChange={handleExpiryDateChange}
            placeholder="MM/YY"
            error={errors.expiryDate}
            required
          />
        </div>
        <div className="w-1/2">
          <CardInputField
            id="cvv"
            label="CVV"
            value={cvv}
            onChange={handleCvvChange}
            placeholder="123"
            error={errors.cvv}
            type="password"
            required
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full mt-4 bg-red-800 hover:bg-red-700"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <LoadingSpinner size="sm" className="mr-2" /> Traitement en cours...
          </span>
        ) : 'Payer'}
      </Button>
    </form>
  );
};

export default CreditCardForm;
