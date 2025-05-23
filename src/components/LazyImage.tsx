
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = '/placeholder.svg' 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setLoaded(true);
      setImgSrc(src);
    };
    img.onerror = () => {
      setError(true);
      setImgSrc(fallbackSrc);
    };
    img.src = src;
    
    return () => {
      // Nettoyer
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackSrc]);
  
  if (!loaded && !error) {
    return <Skeleton className={`${className} animate-pulse`} />;
  }
  
  return (
    <img 
      src={imgSrc || fallbackSrc}
      alt={alt}
      className={className}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
};

export default LazyImage;
