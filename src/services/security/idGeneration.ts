
import { nanoid } from 'nanoid';

export type EntityType = 'product' | 'admin' | 'profile' | 'orders';

export const generateRandomId = (type: EntityType): string => {
  return `${type}_${nanoid(16)}_${Date.now().toString(36)}`;
};

export const generateSecureRoute = (): string => {
  return `/${nanoid(24)}`;
};

export const isValidIdFormat = (id: string): boolean => {
  if (!id) return false;
  const parts = id.split('_');
  return parts.length >= 3;
};

export const extractEntityType = (secureId: string): EntityType | undefined => {
  if (!secureId) return undefined;
  const parts = secureId.split('_');
  if (parts.length < 2) return undefined;
  
  return parts[0] as EntityType;
};
