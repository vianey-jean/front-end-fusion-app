
import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSecurity } from './SecurityProvider';

const SecurityMonitor: React.FC = () => {
  const { isSecure } = useSecurity();
  const [securityScore, setSecurityScore] = useState(0);
  const [checks, setChecks] = useState({
    https: false,
    csp: false,
    xframe: false,
    hsts: false
  });

  useEffect(() => {
    const performSecurityChecks = () => {
      const newChecks = {
        https: window.location.protocol === 'https:' || window.location.hostname === 'localhost',
        csp: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]'),
        xframe: window.top === window.self,
        hsts: document.querySelector('meta[http-equiv="Strict-Transport-Security"]') !== null
      };

      setChecks(newChecks);
      
      const score = Object.values(newChecks).filter(Boolean).length * 25;
      setSecurityScore(score);
    };

    performSecurityChecks();
  }, []);

  const getSecurityBadge = () => {
    if (securityScore >= 75) {
      return <Badge className="bg-green-600 text-white flex items-center gap-1">
        <CheckCircle className="h-3 w-3" /> Sécurisé
      </Badge>;
    } else if (securityScore >= 50) {
      return <Badge className="bg-yellow-600 text-white flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" /> Attention
      </Badge>;
    } else {
      return <Badge className="bg-red-600 text-white flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" /> Risque
      </Badge>;
    }
  };

  if (import.meta.env.PROD) {
    return null; // Masquer en production
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-white dark:bg-neutral-900 p-3 rounded-lg shadow-lg border max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="h-4 w-4" />
        <span className="font-medium text-sm">Sécurité</span>
        {getSecurityBadge()}
      </div>
      
      <div className="space-y-1 text-xs">
        <div className={`flex justify-between ${checks.https ? 'text-green-600' : 'text-red-600'}`}>
          <span>HTTPS</span>
          <span>{checks.https ? '✓' : '✗'}</span>
        </div>
        <div className={`flex justify-between ${checks.csp ? 'text-green-600' : 'text-red-600'}`}>
          <span>CSP</span>
          <span>{checks.csp ? '✓' : '✗'}</span>
        </div>
        <div className={`flex justify-between ${checks.xframe ? 'text-green-600' : 'text-red-600'}`}>
          <span>X-Frame</span>
          <span>{checks.xframe ? '✓' : '✗'}</span>
        </div>
        <div className={`flex justify-between ${checks.hsts ? 'text-green-600' : 'text-red-600'}`}>
          <span>HSTS</span>
          <span>{checks.hsts ? '✓' : '✗'}</span>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t text-xs text-center">
        Score: {securityScore}/100
      </div>
    </div>
  );
};

export default SecurityMonitor;
