import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Filter,
  ArrowUpDown,
  Check,
  Image as ImageIcon,
  Camera,
  Video,
  Shield,
  Verified
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpful: number;
  notHelpful: number;
  images?: string[];
  videos?: string[];
  response?: {
    author: string;
    content: string;
    date: string;
  };
  tags?: string[];
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
  recommendationPercentage: number;
}

interface CustomerReviewsProps {
  productId: string;
  reviews: Review[];
  stats: ReviewStats;
  canReview?: boolean;
  onSubmitReview?: (review: Omit<Review, 'id' | 'date' | 'helpful' | 'notHelpful'>) => void;
  onVoteHelpful?: (reviewId: string, helpful: boolean) => void;
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  productId,
  reviews,
  stats,
  canReview = true,
  onSubmitReview,
  onVoteHelpful
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating' | 'helpful'>('newest');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    content: '',
    images: [] as string[],
    tags: [] as string[]
  });

  const sortedAndFilteredReviews = React.useMemo(() => {
    let filtered = reviews;
    
    if (filterRating) {
      filtered = reviews.filter(review => review.rating === filterRating);
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });
  }, [reviews, sortBy, filterRating]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSubmitReview = async () => {
    if (newReview.rating === 0 || !newReview.content.trim()) {
      toast.error('Veuillez donner une note et rédiger votre avis');
      return;
    }

    const review: Omit<Review, 'id' | 'date' | 'helpful' | 'notHelpful'> = {
      userId: 'current-user',
      userName: 'Vous',
      rating: newReview.rating,
      title: newReview.title,
      content: newReview.content,
      verified: true,
      images: newReview.images,
      tags: newReview.tags
    };

    onSubmitReview?.(review);
    setNewReview({ rating: 0, title: '', content: '', images: [], tags: [] });
    setShowReviewForm(false);
    toast.success('Votre avis a été publié avec succès !');
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClass = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    }[size];

    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Review Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Avis clients ({stats.totalReviews})</span>
            <div className="flex items-center space-x-2">
              <div className={`text-3xl font-bold ${getRatingColor(stats.averageRating)}`}>
                {stats.averageRating.toFixed(1)}
              </div>
              {renderStars(stats.averageRating, 'lg')}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-12">
                  <span className="text-sm">{rating}</span>
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                </div>
                <Progress 
                  value={(stats.ratingDistribution[rating] || 0) / stats.totalReviews * 100} 
                  className="flex-1 h-2"
                />
                <span className="text-sm text-gray-600 w-8">
                  {stats.ratingDistribution[rating] || 0}
                </span>
              </div>
            ))}
          </div>

          {/* Recommendation */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">
                {stats.recommendationPercentage}% des clients recommandent ce produit
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters & Sort */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              <Button
                variant={filterRating === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterRating(null)}
              >
                Tous les avis
              </Button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <Button
                  key={rating}
                  variant={filterRating === rating ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterRating(rating)}
                  className="flex items-center space-x-1"
                >
                  <span>{rating}</span>
                  <Star className="h-3 w-3" />
                </Button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border rounded-md bg-white text-sm"
            >
              <option value="newest">Plus récent</option>
              <option value="oldest">Plus ancien</option>
              <option value="rating">Note la plus élevée</option>
              <option value="helpful">Plus utile</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Write Review Button */}
      {canReview && !showReviewForm && (
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Partagez votre expérience</h3>
            <p className="text-gray-600 mb-4">
              Aidez les autres clients en donnant votre avis sur ce produit
            </p>
            <Button
              onClick={() => setShowReviewForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Rédiger un avis
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Review Form */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Rédiger un avis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Rating */}
                <div>
                  <Label>Votre note *</Label>
                  <div className="flex space-x-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                        className="p-1"
                      >
                        <Star
                          className={`h-6 w-6 transition-colors ${
                            star <= newReview.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 hover:text-yellow-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <Label htmlFor="title">Titre de votre avis</Label>
                  <Input
                    id="title"
                    value={newReview.title}
                    onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Résumez votre expérience..."
                  />
                </div>

                {/* Content */}
                <div>
                  <Label htmlFor="content">Votre avis détaillé *</Label>
                  <Textarea
                    id="content"
                    value={newReview.content}
                    onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Partagez votre expérience avec ce produit..."
                    rows={4}
                  />
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-4">
                  <Button
                    onClick={handleSubmitReview}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Publier mon avis
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedAndFilteredReviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={review.userAvatar} alt={review.userName} />
                        <AvatarFallback>
                          {review.userName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{review.userName}</h4>
                          {review.verified && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              <Verified className="h-3 w-3 mr-1" />
                              Achat vérifié
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          {renderStars(review.rating, 'sm')}
                          <span className="text-sm text-gray-600">
                            {formatDate(review.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  {review.title && (
                    <h5 className="font-medium text-lg">{review.title}</h5>
                  )}

                  {/* Content */}
                  <p className="text-gray-700 leading-relaxed">{review.content}</p>

                  {/* Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex space-x-2">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Avis ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
                        />
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  {review.tags && review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {review.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => onVoteHelpful?.(review.id, true)}
                        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>Utile ({review.helpful})</span>
                      </button>
                      <button
                        onClick={() => onVoteHelpful?.(review.id, false)}
                        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600"
                      >
                        <ThumbsDown className="h-4 w-4" />
                        <span>Pas utile ({review.notHelpful})</span>
                      </button>
                    </div>
                  </div>

                  {/* Merchant Response */}
                  {review.response && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800">
                          Réponse du vendeur
                        </span>
                        <span className="text-sm text-blue-600">
                          {formatDate(review.response.date)}
                        </span>
                      </div>
                      <p className="text-blue-800">{review.response.content}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      {sortedAndFilteredReviews.length < reviews.length && (
        <div className="text-center">
          <Button variant="outline">
            Voir plus d'avis
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomerReviews;