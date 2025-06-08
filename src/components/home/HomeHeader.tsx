
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Crown, Heart } from 'lucide-react';

const HomeHeader: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-rose-950/20 dark:via-pink-950/20 dark:to-purple-950/20 py-12 md:py-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-neutral-100/50 dark:bg-grid-neutral-800/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-neutral-900/50" />
      
      {/* Floating Elements */}
      <div className="absolute top-10 left-10 animate-bounce">
        <Heart className="h-6 w-6 text-rose-400" />
      </div>
      <div className="absolute top-20 right-20 animate-pulse">
        <Sparkles className="h-8 w-8 text-purple-400" />
      </div>
      <div className="absolute bottom-10 left-1/4 animate-bounce delay-1000">
        <Crown className="h-5 w-5 text-amber-400" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-medium mb-6 shadow-lg"
          >
            <Crown className="h-4 w-4" />
            <span>Boutique Premium</span>
            <Sparkles className="h-4 w-4" />
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Bienvenue chez 
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-800 via-rose-800 to-pink-800 bg-clip-text text-transparent">
              Riziky Boutique
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed max-w-3xl mx-auto"
          >
            Spécialiste des produits capillaires premium pour sublimer votre beauté naturelle. 
            Découvrez notre collection exclusive de soins haut de gamme.
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-500 dark:text-neutral-400"
          >
            <div className="flex items-center space-x-2 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Livraison gratuite dès 50€</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Produits authentiques</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Expertise capillaire</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomeHeader;
