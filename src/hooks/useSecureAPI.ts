
import { useSecurity } from '@/components/security/SecurityProvider';
import { toast } from '@/components/ui/sonner';

export const useSecureAPI = () => {
  const { rateLimiter, inputSanitizer } = useSecurity();

  const secureAPICall = async (
    apiFunction: () => Promise<any>,
    rateLimitKey: string = 'api_calls'
  ) => {
    // Vérification du rate limiting
    if (!rateLimiter.isAllowed(rateLimitKey)) {
      const remainingTime = Math.ceil(rateLimiter.getRemainingTime(rateLimitKey) / 1000);
      toast.error(`Trop de requêtes. Réessayez dans ${remainingTime} secondes.`);
      throw new Error('Rate limit exceeded');
    }

    try {
      const result = await apiFunction();
      return result;
    } catch (error) {
      console.error('Erreur API sécurisée:', error);
      throw error;
    }
  };

  return { secureAPICall, inputSanitizer };
};
