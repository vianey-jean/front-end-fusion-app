
import React from 'react';
import { motion } from 'framer-motion';

const brands = [
  { id: 1, name: 'Marque 1', logo: '/placeholder.svg' },
  { id: 2, name: 'Marque 2', logo: '/placeholder.svg' },
  { id: 3, name: 'Marque 3', logo: '/placeholder.svg' },
  { id: 4, name: 'Marque 4', logo: '/placeholder.svg' },
  { id: 5, name: 'Marque 5', logo: '/placeholder.svg' },
  { id: 6, name: 'Marque 6', logo: '/placeholder.svg' },
];

const TopBrands: React.FC = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <section className="py-8 bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Marques Populaires</h2>
        
        <motion.div 
          className="grid grid-cols-3 md:grid-cols-6 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {brands.map(brand => (
            <motion.div 
              key={brand.id} 
              variants={itemVariants}
              className="flex flex-col items-center"
            >
              <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow w-full aspect-square flex items-center justify-center">
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="max-h-16 max-w-full object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
              <span className="mt-2 text-sm font-medium text-center">{brand.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TopBrands;
