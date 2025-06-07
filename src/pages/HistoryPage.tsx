
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Clock, Users, Award, Globe, Sparkles, Heart, Star, TrendingUp } from 'lucide-react';

const HistoryPage = () => {
  const timelineEvents = [
    {
      year: "2010",
      title: "Création de l'entreprise",
      description: "Riziky Boutique est fondée par un groupe d'amis passionnés de mode avec un petit showroom à Paris.",
      icon: Sparkles,
      color: "from-blue-500 to-indigo-600"
    },
    {
      year: "2012",
      title: "Première boutique physique",
      description: "Ouverture de notre première boutique dans le Marais à Paris, spécialisée dans les accessoires de mode artisanaux.",
      icon: Award,
      color: "from-emerald-500 to-teal-600"
    },
    {
      year: "2014",
      title: "Lancement de notre première collection",
      description: "Création de notre première ligne de vêtements 'Élégance Parisienne', un succès immédiat auprès de notre clientèle.",
      icon: Star,
      color: "from-purple-500 to-pink-600"
    },
    {
      year: "2016",
      title: "Expansion nationale",
      description: "Ouverture de trois nouvelles boutiques à Lyon, Marseille et Bordeaux, marquant notre expansion sur le territoire français.",
      icon: TrendingUp,
      color: "from-orange-500 to-red-600"
    },
    {
      year: "2018",
      title: "Lancement de la boutique en ligne",
      description: "Développement de notre plateforme e-commerce pour atteindre une clientèle plus large à travers toute la France.",
      icon: Globe,
      color: "from-cyan-500 to-blue-600"
    },
    {
      year: "2020",
      title: "Engagement pour la durabilité",
      description: "Introduction de notre première collection éco-responsable et mise en place d'une charte de développement durable.",
      icon: Heart,
      color: "from-green-500 to-emerald-600"
    },
    {
      year: "2022",
      title: "Expansion internationale",
      description: "Ouverture de notre première boutique à l'international à Bruxelles, marquant le début de notre présence européenne.",
      icon: Users,
      color: "from-violet-500 to-purple-600"
    },
    {
      year: "2024",
      title: "Innovation technologique",
      description: "Lancement de notre application mobile avec des fonctionnalités de réalité augmentée pour essayer virtuellement nos vêtements.",
      icon: Clock,
      color: "from-pink-500 to-rose-600"
    },
    {
      year: "2025",
      title: "Aujourd'hui",
      description: "Riziky Boutique compte désormais 15 boutiques en France et en Europe, une équipe de plus de 100 passionnés, et poursuit son développement avec de nouveaux projets innovants.",
      icon: Sparkles,
      color: "from-indigo-500 to-blue-600"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-indigo-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-indigo-950/30">
        {/* Enhanced Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-20"
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center mb-6"
            >
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <Clock className="h-12 w-12 text-white" />
              </div>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Notre Histoire
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-4xl mx-auto leading-relaxed">
              Découvrez comment Riziky Boutique est devenue une référence dans l'univers de la mode, de ses humbles débuts à aujourd'hui.
            </p>
          </div>
        </motion.div>

        <div className="container mx-auto py-16 px-4">
          {/* Enhanced Intro Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Nos débuts
              </h2>
              <div className="space-y-4 text-neutral-700 dark:text-neutral-300 leading-relaxed">
                <p>
                  L'aventure de Riziky Boutique a commencé en 2010 lorsqu'un groupe d'amis passionnés de mode a décidé de transformer leur passion en entreprise. Avec un petit capital et beaucoup d'ambition, ils ont ouvert un showroom modeste dans le cœur de Paris.
                </p>
                <p>
                  Ce qui n'était au départ qu'une collection d'accessoires soigneusement sélectionnés est rapidement devenu une référence pour les amateurs de mode à la recherche de pièces uniques et de qualité.
                </p>
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl p-8 shadow-xl border border-neutral-200/50 dark:border-neutral-700/50">
                <img 
                  src="/placeholder.svg" 
                  alt="Les fondateurs de Riziky Boutique" 
                  className="rounded-xl shadow-lg w-full h-auto"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Timeline */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Notre parcours
            </h2>
            <div className="space-y-12">
              {timelineEvents.map((event, index) => {
                const IconComponent = event.icon;
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.6 }}
                    className="relative"
                  >
                    <div className={`flex flex-col lg:flex-row gap-8 ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
                      <div className="lg:w-1/6 flex justify-center">
                        <div className={`bg-gradient-to-r ${event.color} text-white font-bold py-3 px-6 rounded-xl shadow-lg`}>
                          {event.year}
                        </div>
                      </div>
                      <div className="hidden lg:block lg:w-1/12 relative">
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full">
                          <div className="h-full w-1 bg-gradient-to-b from-indigo-200 to-purple-200 dark:from-indigo-800 dark:to-purple-800"></div>
                        </div>
                        <div className={`absolute left-1/2 top-8 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r ${event.color} flex items-center justify-center shadow-lg`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="lg:w-5/6">
                        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-neutral-200/50 dark:border-neutral-700/50 hover:shadow-2xl transition-all duration-300">
                          <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
                            {event.title}
                          </h3>
                          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Enhanced Vision Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Notre vision
            </h2>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 p-12 rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-xl">
              <blockquote className="text-2xl text-center italic text-neutral-800 dark:text-neutral-200 mb-6 leading-relaxed">
                "Notre ambition est de créer une mode accessible, éthique et inspirante, qui permet à chacun d'exprimer sa personnalité tout en respectant notre planète."
              </blockquote>
              <p className="text-center text-neutral-600 dark:text-neutral-400 font-medium">
                - L'équipe fondatrice de Riziky Boutique
              </p>
            </div>
          </motion.div>

          {/* Enhanced Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Notre équipe dirigeante
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((person, index) => (
                <motion.div 
                  key={person}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="text-center group"
                >
                  <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-neutral-200/50 dark:border-neutral-700/50 hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
                      <img 
                        src="/placeholder.svg" 
                        alt="Photo du dirigeant" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                      Nom Prénom
                    </h3>
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-4">
                      Titre / Position
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                      Court descriptif de l'expérience et du rôle dans l'entreprise, parcours professionnel.
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default HistoryPage;
