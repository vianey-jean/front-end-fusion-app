
import { useState, useCallback } from 'react';

const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PLACEHOLDER_IMAGE = '/placeholder.svg';

export const useImageOptimization = () => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const getImageUrl = useCallback((imagePath: string) => {
    if (!imagePath) return PLACEHOLDER_IMAGE;
    if (imagePath.startsWith('http')) return imagePath;
    return `${AUTH_BASE_URL}${imagePath}`;
  }, []);

  const handleImageLoad = useCallback((imagePath: string) => {
    setLoadedImages(prev => new Set(prev).add(imagePath));
  }, []);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = PLACEHOLDER_IMAGE;
  }, []);

  const isImageLoaded = useCallback((imagePath: string) => {
    return loadedImages.has(imagePath);
  }, [loadedImages]);

  return {
    getImageUrl,
    handleImageLoad,
    handleImageError,
    isImageLoaded
  };
};
