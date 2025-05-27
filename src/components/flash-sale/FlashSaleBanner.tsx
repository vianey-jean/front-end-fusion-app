
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Zap, ArrowRight, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { flashSaleAPI } from '@/services/flashSaleAPI';
import { getSecureRoute } from '@/services/secureIds';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const FlashSaleBanner: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  const { data: activeFlashSale, isLoading } = useQuery({
    queryKey: ['active-flash-sale'],
    queryFn: async () => {
      try {
        const response = await flashSaleAPI.getActive();
        return response.data;
      } catch (error) {
        return null;
      }
    },
    refetchInterval: 30000,
    staleTime: 30000,
  });

  useEffect(() => {
    if (!activeFlashSale) return;

    const calculateTimeLeft = () => {
      const endTime = new Date(activeFlashSale.endDate).getTime();
      const difference = endTime - new Date().getTime();
      
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
  }, [activeFlashSale]);

  if (isLoading || !activeFlashSale || isExpired) {
    return null;
  }

  const timeUnits = [
    { label: 'Jours', value: timeLeft.days },
    { label: 'Heures', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds }
  ];

  // Générer l'URL sécurisée pour la page flash sale
  const secureFlashSaleUrl = getSecureRoute('/flash-sale/:id').replace(':id', activeFlashSale.id);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="my-6"
    >
      <Card className="bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 text-white overflow-hidden relative">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-4">
                <Flame className="h-6 w-6 text-yellow-300 animate-pulse" />
                <h2 className="text-2xl font-bold">{activeFlashSale.title}</h2>
                <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                  -{activeFlashSale.discount}%
                </span>
              </div>
              
              <p className="text-lg mb-4 opacity-90">{activeFlashSale.description}</p>
              
              <Button 
                variant="secondary" 
                className="bg-white text-red-600 hover:bg-gray-100 font-bold px-6 py-3 rounded-full"
                asChild
              >
                <Link to={secureFlashSaleUrl}>
                  Voir les produits
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-medium">Se termine dans:</span>
              </div>
              
              <div className="flex space-x-2">
                {timeUnits.map((time, index) => (
                  <motion.div
                    key={time.label}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <motion.div
                      key={time.value}
                      initial={{ rotateX: -90 }}
                      animate={{ rotateX: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-black/30 backdrop-blur rounded-lg px-3 py-2 min-w-[50px] mb-1"
                    >
                      <div className="text-xl font-bold">
                        {time.value.toString().padStart(2, '0')}
                      </div>
                    </motion.div>
                    <div className="text-xs opacity-80">{time.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Animation de fond */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 40% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          />
        </div>
      </Card>
    </motion.div>
  );
};

export default FlashSaleBanner;
