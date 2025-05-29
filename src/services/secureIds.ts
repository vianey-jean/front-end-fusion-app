
import { StorageManager } from './security/storageManager';
import { EntityType, generateRandomId, generateSecureRoute, extractEntityType } from './security/idGeneration';

const storageManager = StorageManager.getInstance();

export type { EntityType };

export const generateSecureId = (realId: string, type: EntityType = 'product'): string => {
  const secureId = generateRandomId(type);
  storageManager.setMapping(realId, secureId);
  return secureId;
};

export const getRealId = (secureId: string): string | undefined => {
  return storageManager.getRealId(secureId);
};

export const getSecureId = (realId: string, type: EntityType = 'product'): string => {
  const existingId = storageManager.getSecureId(realId);
  
  if (existingId && existingId.startsWith(`${type}_`)) {
    return existingId;
  }
  
  return generateSecureId(realId, type);
};

export const getSecureProductId = (productId: string, type: EntityType = 'product'): string => {
  return getSecureId(productId, type);
};

export const resetSecureIds = (): void => {
  storageManager.clearAll();
  console.log("IDs sécurisés réinitialisés, routes statiques conservées");
};

export const isValidSecureId = (secureId: string): boolean => {
  if (!secureId) return false;
  return storageManager.hasSecureId(secureId);
};

export const getEntityType = (secureId: string): EntityType | undefined => {
  return extractEntityType(secureId);
};

export const getSecureRoute = (routePath: string): string => {
  const existingRoute = storageManager.getStaticSecureRoute(routePath);
  if (existingRoute) {
    return existingRoute;
  }
  
  const secureRoute = generateSecureRoute();
  storageManager.setStaticRoute(routePath, secureRoute);
  return secureRoute;
};

export const getRealRoute = (secureRoute: string): string | undefined => {
  return storageManager.getRealId(secureRoute);
};

export const initSecureRoutes = () => {
  const routesToInit = [
    '/admin', '/admin/produits', '/admin/utilisateurs', '/admin/messages',
    '/admin/parametres', '/admin/commandes', '/admin/service-client',
    '/admin/pub-layout', '/admin/remboursements', '/admin/flash-sales',
    '/flash-sale/:id', '/profil', '/commandes', '/panier', '/favoris',
    '/paiement', '/login', '/register', '/forgot-password', '/tous-les-produits'
  ];
  
  let hasNewRoutes = false;
  
  routesToInit.forEach(route => {
    if (!storageManager.getStaticSecureRoute(route)) {
      const secureRoute = generateSecureRoute();
      storageManager.setStaticRoute(route, secureRoute);
      hasNewRoutes = true;
    }
  });
  
  if (hasNewRoutes) {
    storageManager.saveMappings();
  }
  
  return new Map(routesToInit.map(route => [route, storageManager.getStaticSecureRoute(route)]));
};
