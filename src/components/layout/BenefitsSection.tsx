
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Clock, CreditCard, TrendingUp, Gift } from 'lucide-react';

const benefits = [
  { icon: Shield, text: "Paiements sécurisés", description: "Toutes vos transactions sont protégées" },
  { icon: Clock, text: "Livraison rapide", description: "Expédition sous 24-48h" },
  { icon: Award, text: "Qualité garantie", description: "Des produits sélectionnés avec soin" },
  { icon: CreditCard, text: "Paiement facile", description: "Plusieurs méthodes de paiement" },
  { icon: TrendingUp, text: "Top tendances", description: "Produits à la mode" },
  { icon: Gift, text: "Offres exclusives", description: "Promotions régulières" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const iconHoverVariants = {
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

interface BenefitsSectionProps {
  hidePrompts?: boolean;
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({ hidePrompts = false }) => {
  if (hidePrompts) return null;

  return (
    <motion.section 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="relative bg-gradient-to-br from-white via-red-50/30 to-pink-50/20 dark:from-neutral-900 dark:via-red-950/20 dark:to-pink-950/10 py-16 border-t border-neutral-200/50 dark:border-neutral-800/50 overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-200/10 to-orange-200/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            Pourquoi choisir <span className="text-red-600">Riziky Boutique</span> ?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Découvrez tous les avantages qui font de nous votre boutique en ligne de confiance
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-red-500 to-pink-500 mx-auto mt-6 rounded-full"></div>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group text-center p-6 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-neutral-200/50 dark:border-neutral-700/50 transition-all duration-300 hover:border-red-200 dark:hover:border-red-800"
            >
              <motion.div
                variants={iconHoverVariants}
                whileHover="hover"
                className="relative bg-gradient-to-br from-red-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
              >
                <benefit.icon className="h-8 w-8 text-white" />
                <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-pink-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
              
              <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
                {benefit.text}
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                {benefit.description}
              </p>

              {/* Decorative elements */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-br from-red-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-2 left-2 w-1 h-1 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ transitionDelay: '100ms' }}></div>
            </motion.div>
          ))}
        </div>

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex justify-center mt-12"
        >
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default BenefitsSection;
