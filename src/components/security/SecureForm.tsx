
import React, { useState, FormEvent } from 'react';
import { useSecurity } from './SecurityProvider';
import { toast } from '@/components/ui/sonner';

interface SecureFormProps {
  onSubmit: (data: any) => void;
  children: React.ReactNode;
  rateLimitKey?: string;
  className?: string;
}

const SecureForm: React.FC<SecureFormProps> = ({ 
  onSubmit, 
  children, 
  rateLimitKey = 'form_submissions',
  className = ''
}) => {
  const { rateLimiter, inputSanitizer } = useSecurity();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Vérification du rate limiting
    if (!rateLimiter.isAllowed(rateLimitKey)) {
      const remainingTime = Math.ceil(rateLimiter.getRemainingTime(rateLimitKey) / 1000);
      toast.error(`Trop de tentatives. Réessayez dans ${remainingTime} secondes.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data: any = {};
      
      // Sanitisation de toutes les données du formulaire
      formData.forEach((value, key) => {
        data[key] = inputSanitizer.sanitizeString(value.toString());
      });

      // Validation supplémentaire
      const sanitizedData = inputSanitizer.sanitizeObject(data);
      
      await onSubmit(sanitizedData);
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={className}
      noValidate
      autoComplete="off"
    >
      <input type="hidden" name="_token" value={crypto.randomUUID()} />
      {children}
      {isSubmitting && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      )}
    </form>
  );
};

export default SecureForm;
