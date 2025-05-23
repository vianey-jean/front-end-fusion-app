
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const banners = [
  {
    id: 1,
    title: "Offres exclusives d'été",
    description: "Jusqu'à 70% de réduction sur une sélection d'articles",
    image: "/placeholder.svg",
    color: "from-orange-500 to-amber-500",
    textColor: "text-white",
    link: "/categorie/promotions"
  },
  {
    id: 2,
    title: "Nouveautés Mode",
    description: "Découvrez les dernières tendances",
    image: "/placeholder.svg",
    color: "from-pink-500 to-purple-500",
    textColor: "text-white",
    link: "/categorie/mode"
  },
  {
    id: 3,
    title: "Tech à petits prix",
    description: "Les meilleures offres sur les produits électroniques",
    image: "/placeholder.svg",
    color: "from-blue-500 to-cyan-500",
    textColor: "text-white",
    link: "/categorie/electronique"
  }
];

const PromoBanner: React.FC = () => {
  const [current, setCurrent] = useState(0);
  
  // Auto-rotation du carrousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);
  
  const next = () => setCurrent((prev) => (prev + 1) % banners.length);
  const prev = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  
  return (
    <div className="relative h-72 sm:h-96 overflow-hidden rounded-lg mb-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className={`absolute inset-0 bg-gradient-to-r ${banners[current].color} flex items-center`}
        >
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-center md:text-left md:pr-8">
              <motion.h2 
                className={`text-3xl sm:text-4xl font-bold mb-2 ${banners[current].textColor}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {banners[current].title}
              </motion.h2>
              <motion.p
                className={`mb-4 ${banners[current].textColor}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {banners[current].description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button 
                  asChild
                  className="bg-white text-black hover:bg-gray-100"
                >
                  <a href={banners[current].link}>Découvrir</a>
                </Button>
              </motion.div>
            </div>
            <div className="md:w-1/2 mt-6 md:mt-0">
              <motion.img
                src={banners[current].image}
                alt={banners[current].title}
                className="mx-auto h-40 sm:h-64 object-contain"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <Button 
        variant="secondary" 
        size="icon"
        onClick={prev}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md z-10"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button 
        variant="secondary" 
        size="icon"
        onClick={next}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md z-10"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2.5 h-2.5 rounded-full ${current === index ? 'bg-white' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromoBanner;
