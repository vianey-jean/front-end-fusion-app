
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import StarRating from './StarRating';
import axios from 'axios';
import { Avatar } from '@/components/ui/avatar';
import { Quote, Star, Users, ThumbsUp } from 'lucide-react';

interface ReviewData {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  productRating: number;
  deliveryRating: number;
  comment: string;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 40, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  }
};

const TestimonialSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${AUTH_BASE_URL}/api/reviews/best`);
        
        // Si l'API ne renvoie pas de données, utiliser l'approche de secours
        if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
          const allReviewsResponse = await axios.get(`${AUTH_BASE_URL}/api/reviews`);
          
          if (allReviewsResponse.data && Array.isArray(allReviewsResponse.data)) {
            const sortedReviews = [...allReviewsResponse.data].sort((a, b) => {
              const avgRatingA = (a.productRating + a.deliveryRating) / 2;
              const avgRatingB = (b.productRating + b.deliveryRating) / 2;
              
              if (avgRatingB !== avgRatingA) {
                return avgRatingB - avgRatingA;
              }
              
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            
            setTestimonials(sortedReviews.slice(0, 3));
          }
        } else {
          setTestimonials(response.data.slice(0, 3));
        }
        
      } catch (error) {
        console.error("Erreur lors de la récupération des témoignages:", error);
        
        try {
          const allReviewsResponse = await axios.get(`${AUTH_BASE_URL}/api/reviews`);
          if (allReviewsResponse.data && Array.isArray(allReviewsResponse.data)) {
            const sortedReviews = [...allReviewsResponse.data].sort((a, b) => {
              const avgRatingA = (a.productRating + a.deliveryRating) / 2;
              const avgRatingB = (b.productRating + b.deliveryRating) / 2;
              
              if (avgRatingB !== avgRatingA) {
                return avgRatingB - avgRatingA;
              }
              
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            
            setTestimonials(sortedReviews.slice(0, 3));
          }
        } catch (e) {
          console.error("Erreur lors de la récupération de tous les commentaires:", e);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [AUTH_BASE_URL]);

  // Calcule la note moyenne (produit et livraison)
  const getAverageRating = (review: ReviewData) => {
    return Math.round((review.productRating + review.deliveryRating) / 2);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <motion.section 
      className="relative mb-20 py-16 bg-gradient-to-br from-purple-50 via-pink-50/30 to-blue-50/20 dark:from-purple-950/20 dark:via-pink-950/10 dark:to-blue-950/20 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-tl from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-br from-yellow-200/15 to-orange-200/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg"
            >
              <Users className="h-6 w-6 text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Ce Que Nos Clients Disent
            </h2>
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full shadow-lg"
            >
              <ThumbsUp className="h-6 w-6 text-white" />
            </motion.div>
          </div>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Découvrez les expériences authentiques de notre communauté de clients satisfaits
          </p>
          
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
              <span className="ml-3 text-lg font-semibold text-gray-700 dark:text-gray-300">
                4.9/5 • Plus de 1000 avis
              </span>
            </div>
          </div>
          
          <div className="h-1 w-32 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mx-auto mt-8 rounded-full"></div>
        </motion.div>
        
        {loading ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {[1, 2, 3].map((item) => (
              <motion.div 
                key={item} 
                variants={itemVariants}
                className="relative bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-neutral-200/50 dark:border-neutral-700/50 animate-pulse overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-pink-100/20 dark:from-purple-900/20 dark:to-pink-900/20"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-6 h-5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl mb-6"></div>
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full mr-4"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded-full w-2/3 mb-3"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-1/3"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : testimonials.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {testimonials.map((review, index) => (
              <motion.div
                key={review.id}
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group relative bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl border border-neutral-200/50 dark:border-neutral-700/50 transition-all duration-500 hover:border-purple-200 dark:hover:border-purple-800 overflow-hidden"
              >
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-pink-100/20 to-blue-100/30 dark:from-purple-900/30 dark:via-pink-900/20 dark:to-blue-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Quote icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Quote className="h-6 w-6 text-white" />
                </motion.div>

                <div className="relative z-10">
                  {/* Rating stars */}
                  <div className="flex items-center text-yellow-400 mb-6 space-x-1">
                    <StarRating rating={getAverageRating(review)} readOnly size={20} />
                    <span className="ml-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {getAverageRating(review)}/5
                    </span>
                  </div>

                  {/* Review comment */}
                  <div className="relative mb-8">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg line-clamp-4 min-h-[100px] italic">
                      « {review.comment} »
                    </p>
                  </div>

                  {/* User info */}
                  <div className="flex items-center">
                    <div className="relative mr-4">
                      {review.photos && review.photos[0] ? (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Avatar className="w-16 h-16 ring-4 ring-purple-200 dark:ring-purple-800 shadow-lg">
                            <img 
                              src={`${AUTH_BASE_URL}${review.photos[0]}`}
                              alt={review.userName}
                              className="w-full h-full object-cover"
                            />
                          </Avatar>
                        </motion.div>
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Avatar className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 text-white text-lg font-bold ring-4 ring-purple-200 dark:ring-purple-800 shadow-lg">
                            <span>{getInitials(review.userName)}</span>
                          </Avatar>
                        </motion.div>
                      )}
                      
                      {/* Verified badge */}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-bold text-lg text-gray-800 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                        {review.userName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        Client{review.userName.endsWith('e') ? 'e' : ''} vérifié{review.userName.endsWith('e') ? 'e' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute bottom-4 left-4 w-3 h-3 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-1/2 left-2 w-1 h-8 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ transitionDelay: '100ms' }}></div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-20"
            variants={itemVariants}
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full mx-auto mb-8"
              ></motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">
              Aucun témoignage disponible
            </h3>
            <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">
              Soyez le premier à partager votre expérience avec notre communauté !
            </p>
          </motion.div>
        )}

        {/* Bottom stats section */}
        <motion.div
          variants={itemVariants}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { icon: Star, value: "4.9/5", label: "Note moyenne" },
            { icon: Users, value: "1,000+", label: "Clients satisfaits" },
            { icon: ThumbsUp, value: "98%", label: "Recommandations" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-lg"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{stat.value}</div>
              <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TestimonialSection;
