
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Catégories principales avec images et icônes
const categories = [
  {
    id: 'electronics',
    name: 'Électronique',
    image: '/placeholder.svg',
    color: 'bg-blue-500',
    link: '/categorie/electronique'
  },
  {
    id: 'fashion',
    name: 'Mode',
    image: '/placeholder.svg',
    color: 'bg-pink-500',
    link: '/categorie/mode'
  },
  {
    id: 'home',
    name: 'Maison',
    image: '/placeholder.svg',
    color: 'bg-amber-500',
    link: '/categorie/maison'
  },
  {
    id: 'beauty',
    name: 'Beauté',
    image: '/placeholder.svg',
    color: 'bg-purple-500',
    link: '/categorie/beaute'
  },
  {
    id: 'sports',
    name: 'Sports',
    image: '/placeholder.svg',
    color: 'bg-green-500',
    link: '/categorie/sports'
  },
  {
    id: 'toys',
    name: 'Jouets',
    image: '/placeholder.svg',
    color: 'bg-red-500',
    link: '/categorie/jouets'
  },
  {
    id: 'garden',
    name: 'Jardin',
    image: '/placeholder.svg',
    color: 'bg-emerald-500',
    link: '/categorie/jardin'
  },
  {
    id: 'auto',
    name: 'Auto',
    image: '/placeholder.svg',
    color: 'bg-slate-500',
    link: '/categorie/auto'
  },
];

const CategoryShowcase: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <section className="py-8 bg-white dark:bg-neutral-950">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Explorer par catégorie</h2>
        
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link 
                to={category.link} 
                className="flex flex-col items-center text-center group"
              >
                <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <span className="text-sm font-medium">{category.name}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
