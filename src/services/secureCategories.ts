
/**
 * Service pour générer et gérer des liens sécurisés pour les catégories
 * Utilise des caractères aléatoires pour protéger les vraies catégories
 */

// Mapping entre les vraies catégories et leurs identifiants sécurisés
const categorySecureMapping: Record<string, string> = {
  'perruques': 'xk9m2n8p4q',
  'maquillage': 'zr7w5l3j9s',
  'bijoux': 'ht6b4v2c8x',
  'accessoires': 'pf1g9k5m7y',
  'vetements': 'qd3h8l6n2w',
  'chaussures': 'mv4j7r9t5z',
  'sacs': 'ln8p2k6w4x',
  'parfums': 'sg5n9m3q7r',
  'soins': 'tr2h6j8k4p',
  'decoration': 'wm9l5v3n7s',
  'electromenager': 'xp4r8t6z2m',
  'informatique': 'kg7w3j9l5h',
  'sport': 'nt6m4k8p2s',
  'jouets': 'fr9z5w7l3x',
  'livres': 'hm2k6p8t4v',
  'musique': 'qr5j9n3w7l',
  'films': 'sw8m4p6t2k',
  'jeux': 'lp3r7z9j5h',
  'auto': 'tm6k2w8p4n',
  'maison': 'xt9l5m7k3p'
};

// Mapping inverse pour retrouver la vraie catégorie depuis l'ID sécurisé
const secureToRealCategory: Record<string, string> = Object.fromEntries(
  Object.entries(categorySecureMapping).map(([real, secure]) => [secure, real])
);

/**
 * Génère un ID sécurisé pour une catégorie
 */
export const getSecureCategoryId = (categoryName: string): string => {
  const normalized = categoryName.toLowerCase().trim();
  return categorySecureMapping[normalized] || generateRandomId();
};

/**
 * Récupère la vraie catégorie depuis un ID sécurisé
 */
export const getRealCategoryName = (secureId: string): string | null => {
  return secureToRealCategory[secureId] || null;
};

/**
 * Génère un ID aléatoire pour les nouvelles catégories
 */
const generateRandomId = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Vérifie si un ID sécurisé est valide
 */
export const isValidSecureCategoryId = (secureId: string): boolean => {
  return secureId in secureToRealCategory;
};

/**
 * Génère l'URL sécurisée pour une catégorie
 */
export const getSecureCategoryUrl = (categoryName: string): string => {
  const secureId = getSecureCategoryId(categoryName);
  return `/categorie/${secureId}`;
};

/**
 * Obtient toutes les catégories avec leurs IDs sécurisés
 */
export const getAllSecureCategories = (): Array<{real: string, secure: string, url: string}> => {
  return Object.entries(categorySecureMapping).map(([real, secure]) => ({
    real,
    secure,
    url: `/categorie/${secure}`
  }));
};
