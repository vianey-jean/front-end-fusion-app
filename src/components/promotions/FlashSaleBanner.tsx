
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap, ArrowRight, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useActiveFlashSale } from '@/hooks/useFlashSales';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const FlashSaleBanner: React.FC = () => {
  const { data: flashSale, isLoading } = useActiveFlashSale();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!flashSale) return;

    const calculateTimeLeft = () => {
      const difference = new Date(flashSale.endDate).getTime() - new Date().getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [flashSale]);

  if (isLoading || !flashSale || isExpired) {
    return null;
  }

  const timeUnits = [
    { label: 'Jours', value: timeLeft.days },
    { label: 'Heures', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.5 }}
        className="my-6"
      >
        <Card className="bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 text-white overflow-hidden relative">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <Flame className="h-8 w-8 text-yellow-300 animate-pulse" />
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold">{flashSale.title}</h2>
                  {flashSale.description && (
                    <p className="text-sm opacity-90 mt-1">{flashSale.description}</p>
                  )}
                </div>
                <div className="bg-yellow-400 text-black px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                  -{flashSale.discount}%
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm font-medium">Se termine dans :</span>
                </div>
                
                <div className="flex space-x-2">
                  {timeUnits.map((unit, index) => (
                    <motion.div
                      key={unit.label}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center"
                    >
                      <motion.div
                        key={unit.value}
                        initial={{ rotateX: -90 }}
                        animate={{ rotateX: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-black/30 backdrop-blur rounded-lg px-3 py-2 min-w-[50px] mb-1"
                      >
                        <div className="text-xl lg:text-2xl font-bold">
                          {unit.value.toString().padStart(2, '0')}
                        </div>
                      </motion.div>
                      <div className="text-xs opacity-80">{unit.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Link to={`/flash-sale/${flashSale.id}`}>
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="bg-white text-red-600 hover:bg-gray-100 font-bold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Voir les produits
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Animation de fond */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <motion.div
              animate={{
                background: [
                  'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 40% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)'
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            />
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default FlashSaleBanner;
