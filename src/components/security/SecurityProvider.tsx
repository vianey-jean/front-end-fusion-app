
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { RateLimiter } from '@/services/security/rateLimiter';
import { InputSanitizer } from '@/services/security/inputSanitizer';
import { EncryptionService } from '@/services/security/encryptionService';

interface SecurityContextType {
  rateLimiter: RateLimiter;
  inputSanitizer: InputSanitizer;
  encryptionService: EncryptionService;
  isSecure: boolean;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const rateLimiter = RateLimiter.getInstance();
  const inputSanitizer = InputSanitizer.getInstance();
  const encryptionService = EncryptionService.getInstance();

  useEffect(() => {
    // Configuration des règles de rate limiting
    rateLimiter.createRule('login_attempts', 5, 15 * 60 * 1000); // 5 tentatives par 15 min
    rateLimiter.createRule('api_calls', 100, 60 * 1000); // 100 appels par minute
    rateLimiter.createRule('form_submissions', 10, 60 * 1000); // 10 soumissions par minute
    
    // Vérification de la sécurité du contexte
    const isHTTPS = window.location.protocol === 'https:';
    const hasCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    
    if (!isHTTPS && window.location.hostname !== 'localhost') {
      console.warn('Site non sécurisé - HTTPS requis en production');
    }
    
    // Protection contre le clickjacking
    if (window.top !== window.self) {
      window.top.location = window.self.location;
    }
    
    // Désactivation du clic droit et des outils de développement en production
    if (import.meta.env.PROD) {
      document.addEventListener('contextmenu', (e) => e.preventDefault());
      document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.shiftKey && e.key === 'C') ||
            (e.ctrlKey && e.key === 'U')) {
          e.preventDefault();
        }
      });
    }
  }, [rateLimiter]);

  const value: SecurityContextType = {
    rateLimiter,
    inputSanitizer,
    encryptionService,
    isSecure: window.location.protocol === 'https:' || window.location.hostname === 'localhost'
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
