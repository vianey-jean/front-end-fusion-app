import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Camera, 
  Send,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Flag,
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
  images?: string[];
  date: string;
  verified: boolean;
  helpful: number;
  notHelpful: number;
  userVote?: 'helpful' | 'not-helpful' | null;
}

interface CustomerReviewsProps {
  productId: string;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  onAddReview?: (review: Omit<Review, 'id' | 'userId' | 'date'>) => void;
  onVoteReview?: (reviewId: string, vote: 'helpful' | 'not-helpful') => void;
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  productId,
  reviews,
  averageRating,
  totalReviews,
  onAddReview,
  onVoteReview
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    content: '',
    images: [] as string[]
  });
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating-high' | 'rating-low' | 'helpful'>('newest');
  const [filterBy, setFilterBy] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'rating-high':
        return b.rating - a.rating;
      case 'rating-low':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      case 'newest':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  }).filter(review => {
    if (filterBy === 'all') return true;
    return review.rating === parseInt(filterBy);
  });

  const handleSubmitReview = () => {
    if (!newReview.title.trim() || !newReview.content.trim()) {
      toast.error('Veuillez remplir le titre et le contenu de votre avis');
      return;
    }

    onAddReview?.({
      userName: 'Utilisateur actuel',
      rating: newReview.rating,
      title: newReview.title,
      content: newReview.content,
      images: newReview.images,
      verified: true,
      helpful: 0,
      notHelpful: 0
    });

    setNewReview({ rating: 5, title: '', content: '', images: [] });
    setShowReviewForm(false);
    toast.success('Votre avis a été publié avec succès !');
  };

  const handleVote = (reviewId: string, vote: 'helpful' | 'not-helpful') => {
    onVoteReview?.(reviewId, vote);
    toast.success('Merci pour votre retour !');
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Avis clients ({totalReviews})</span>
            <Button onClick={() => setShowReviewForm(!showReviewForm)}>
              Écrire un avis
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rating Summary */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
                <div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(averageRating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">Basé sur {totalReviews} avis</p>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <span className="text-sm w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${totalReviews > 0 ? (ratingDistribution[rating as keyof typeof ratingDistribution] / totalReviews) * 100 : 0}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">
                    {ratingDistribution[rating as keyof typeof ratingDistribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

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
                <CardTitle>Écrire un avis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Rating Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">Note</label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            rating <= newReview.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">Titre de votre avis</label>
                  <Input
                    value={newReview.title}
                    onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Résumez votre expérience en quelques mots"
                  />
                </div>

                {/* Content Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">Votre avis détaillé</label>
                  <Textarea
                    value={newReview.content}
                    onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Partagez votre expérience avec ce produit..."
                    rows={4}
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <Button variant="outline" className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    Ajouter des photos (optionnel)
                  </Button>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button onClick={handleSubmitReview} className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Publier mon avis
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowReviewForm(false)}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters and Sort */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filtrer :</span>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="all">Tous les avis</option>
                <option value="5">5 étoiles</option>
                <option value="4">4 étoiles</option>
                <option value="3">3 étoiles</option>
                <option value="2">2 étoiles</option>
                <option value="1">1 étoile</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <ArrowUpDown className="h-4 w-4" />
              <span className="text-sm font-medium">Trier par :</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="newest">Plus récents</option>
                <option value="oldest">Plus anciens</option>
                <option value="rating-high">Note croissante</option>
                <option value="rating-low">Note décroissante</option>
                <option value="helpful">Plus utiles</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={review.userAvatar} alt={review.userName} />
                      <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{review.userName}</h4>
                        {review.verified && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            <Verified className="h-3 w-3 mr-1" />
                            Vérifié
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                {/* Content */}
                <div>
                  <h5 className="font-medium mb-2">{review.title}</h5>
                  <p className="text-gray-700">{review.content}</p>
                </div>

                {/* Images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex space-x-2">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Photo ${index + 1}`}
                        className="w-16 h-16 object-cover rounded border"
                      />
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleVote(review.id, 'helpful')}
                      className={`flex items-center space-x-1 text-sm ${
                        review.userVote === 'helpful' ? 'text-green-600' : 'text-gray-600'
                      } hover:text-green-600`}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>Utile ({review.helpful})</span>
                    </button>
                    <button
                      onClick={() => handleVote(review.id, 'not-helpful')}
                      className={`flex items-center space-x-1 text-sm ${
                        review.userVote === 'not-helpful' ? 'text-red-600' : 'text-gray-600'
                      } hover:text-red-600`}
                    >
                      <ThumbsDown className="h-4 w-4" />
                      <span>Pas utile ({review.notHelpful})</span>
                    </button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    <Flag className="h-4 w-4 mr-1" />
                    Signaler
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CustomerReviews;
