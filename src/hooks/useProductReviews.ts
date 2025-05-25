
import { useState, useEffect } from 'react';
import { reviewsAPI } from '@/services/api';

export const useProductReviews = (productId: string) => {
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProductReviews = async () => {
      if (!productId) return;
      
      setLoading(true);
      try {
        const response = await reviewsAPI.getProductReviews(productId);
        const reviews = response.data;
        
        if (reviews && reviews.length > 0) {
          const totalRating = reviews.reduce((sum, review) => {
            return sum + ((review.productRating + review.deliveryRating) / 2);
          }, 0);
          
          setAverageRating(totalRating / reviews.length);
          setReviewCount(reviews.length);
        } else {
          setAverageRating(0);
          setReviewCount(0);
        }
      } catch (error) {
        console.error("Error fetching reviews for product:", productId, error);
        setAverageRating(0);
        setReviewCount(0);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductReviews();
  }, [productId]);

  return { averageRating, reviewCount, loading };
};
