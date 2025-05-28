
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onDrag'> {
  placeholderUrl?: string;
  aspectRatio?: number;
  blurhash?: string;
  loadingBehavior?: 'eager' | 'lazy';
  onLoad?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt = 'Image',
  className = '',
  placeholderUrl = '/placeholder.svg',
  aspectRatio,
  blurhash,
  loadingBehavior = 'lazy',
  onLoad,
  ...htmlProps
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!imgRef.current || loadingBehavior === 'eager') return;

    const loadImage = () => {
      const img = imgRef.current;
      if (!img || !src) return;

      img.src = src;
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        loadImage();
        observerRef.current?.disconnect();
      }
    }, {
      rootMargin: '200px 0px', // Charge l'image quand elle est à 200px de la vue
    });

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [src, loadingBehavior]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    console.error(`Failed to load image: ${src}`);
    setIsError(true);
    if (imgRef.current) {
      imgRef.current.src = placeholderUrl;
    }
  };

  const containerStyle = aspectRatio 
    ? { paddingBottom: `${(1 / aspectRatio) * 100}%` } 
    : undefined;

  const imageProps = loadingBehavior === 'eager'
    ? { src }
    : {};

  // Extract HTML props and exclude any conflicting ones
  const { onDrag, ...safeHtmlProps } = htmlProps;

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={containerStyle}
    >
      {/* Squelette de chargement ou image de faible qualité */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          {blurhash ? (
            <div 
              className="w-full h-full bg-cover"
              style={{ backgroundImage: `url(${blurhash})` }}
            />
          ) : (
            <Skeleton className="w-full h-full" />
          )}
        </div>
      )}

      {/* Image réelle */}
      <motion.img
        ref={imgRef}
        alt={alt}
        {...imageProps}
        {...safeHtmlProps}
        className={`w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading={loadingBehavior}
        onLoad={handleImageLoad}
        onError={handleImageError}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};

export default LazyImage;
