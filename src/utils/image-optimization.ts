
/**
 * Utilitaires pour l'optimisation des images
 */

import { useState, useEffect } from 'react';

/**
 * URLs des différentes tailles d'images pour le responsive design
 */
interface ResponsiveImageUrls {
  small: string;   // Pour les petits écrans
  medium: string;  // Pour les écrans moyens
  large: string;   // Pour les grands écrans
  original: string; // Image originale
}

/**
 * Convertit l'URL d'une image en set de sources responsives
 * 
 * @param imageUrl URL de l'image originale
 * @returns Object contenant les URLs des différentes tailles
 */
export const getResponsiveImageUrls = (imageUrl: string): ResponsiveImageUrls => {
  // Si l'image est déjà une URL externe ou un placeholder, la retourner telle quelle
  if (imageUrl.startsWith('http') || imageUrl.includes('placeholder')) {
    return {
      small: imageUrl,
      medium: imageUrl,
      large: imageUrl,
      original: imageUrl,
    };
  }

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
  const baseUrl = imageUrl.startsWith('/') ? `${API_BASE_URL}${imageUrl}` : imageUrl;
  
  // Paramètres pour les images optimisées (simulé pour une API de redimensionnement)
  const smallSize = `?width=300`;
  const mediumSize = `?width=600`;
  const largeSize = `?width=1200`;
  
  return {
    small: `${baseUrl}${smallSize}`,
    medium: `${baseUrl}${mediumSize}`,
    large: `${baseUrl}${largeSize}`,
    original: baseUrl,
  };
};

/**
 * Génère les attributs srcSet et sizes pour le chargement d'images responsives
 * 
 * @param imageUrl URL de l'image
 * @returns Object avec srcSet et sizes
 */
export const generateSrcSet = (imageUrl: string): { srcSet: string; sizes: string } => {
  const urls = getResponsiveImageUrls(imageUrl);
  
  const srcSet = [
    `${urls.small} 300w`,
    `${urls.medium} 600w`,
    `${urls.large} 1200w`,
    `${urls.original} 2000w`,
  ].join(', ');
  
  const sizes = '(max-width: 640px) 300px, (max-width: 1024px) 600px, 1200px';
  
  return {
    srcSet,
    sizes,
  };
};

/**
 * Hook pour précharger une image
 * 
 * @param src URL de l'image à précharger
 * @returns État de chargement
 */
export const usePreloadImage = (src: string): boolean => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    if (!src) {
      setIsLoaded(false);
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      setIsLoaded(true);
    };
    img.src = src;
    
    return () => {
      img.onload = null;
    };
  }, [src]);
  
  return isLoaded;
};

/**
 * Priorise le chargement des images visibles
 * 
 * @param urls Liste d'URLs d'images à précharger
 * @param priority Priorité (1-5, 1 étant la plus élevée)
 */
export const preloadImagesWithPriority = (urls: string[], priority = 3): void => {
  if (!urls || urls.length === 0) return;
  
  // Attribuer des priorités de chargement différentes
  const importances = ['high', 'high', 'auto', 'low', 'low'];
  const importance = importances[Math.min(priority - 1, importances.length - 1)];
  
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    link.setAttribute('importance', importance);
    document.head.appendChild(link);
  });
};

/**
 * Détecte si le navigateur supporte le format d'image WebP
 */
export const useSupportsWebP = (): boolean => {
  const [supportsWebP, setSupportsWebP] = useState<boolean>(false);
  
  useEffect(() => {
    const checkWebP = async () => {
      if (!self.createImageBitmap) return false;
      
      const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
      const blob = await fetch(webpData).then(r => r.blob());
      
      try {
        await createImageBitmap(blob);
        setSupportsWebP(true);
      } catch (e) {
        setSupportsWebP(false);
      }
    };
    
    checkWebP();
  }, []);
  
  return supportsWebP;
};
