
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Building, Users, TrendingUp, Award, Heart, Lightbulb, Globe, Send, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const CarriersPage = () => {
  const departments = [
    {
      id: 'vente',
      name: 'Vente',
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      jobs: [
        {
          title: "Responsable boutique",
          location: "Paris",
          type: "CDI",
          salary: "35-45k€",
          description: "Vous serez responsable de la gestion quotidienne de notre boutique phare à Paris. Management d'équipe, développement commercial et excellence du service client.",
          skills: ["Management", "Commerce", "Relation client"]
        },
        {
          title: "Assistant(e) commercial(e)",
          location: "Lyon",
          type: "CDI",
          salary: "28-32k€",
          description: "Support à l'équipe commerciale et gestion des relations clients. Suivi des commandes et développement de la satisfaction client.",
          skills: ["Commerce", "CRM", "Communication"]
        },
        {
          title: "Conseiller(ère) de vente",
          location: "Marseille",
          type: "CDD",
          salary: "24-28k€",
          description: "Accueillir la clientèle et conseiller sur nos collections. Expertise produit et accompagnement personnalisé des clients.",
          skills: ["Vente", "Conseil", "Mode"]
        }
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing',
      icon: Lightbulb,
      color: 'from-purple-500 to-purple-600',
      jobs: [
        {
          title: "Chef de projet digital",
          location: "Paris",
          type: "CDI",
          salary: "40-50k€",
          description: "Vous piloterez notre stratégie digitale et nos campagnes en ligne. SEO, SEA, réseaux sociaux et e-commerce.",
          skills: ["Marketing digital", "SEO/SEA", "Analytics"]
        },
        {
          title: "Content Manager",
          location: "Télétravail",
          type: "CDD",
          salary: "32-38k€",
          description: "Production et gestion de contenu pour notre site web et réseaux sociaux. Création de contenus engageants et storytelling de marque.",
          skills: ["Création de contenu", "Réseaux sociaux", "Photographie"]
        }
      ]
    },
    {
      id: 'logistique',
      name: 'Logistique',
      icon: Building,
      color: 'from-green-500 to-green-600',
      jobs: [
        {
          title: "Responsable entrepôt",
          location: "Lille",
          type: "CDI",
          salary: "38-45k€",
          description: "Gestion des opérations logistiques et supervision de l'équipe d'entrepôt. Optimisation des flux et qualité de service.",
          skills: ["Logistique", "Management", "Lean"]
        },
        {
          title: "Agent logistique",
          location: "Lille",
          type: "CDI",
          salary: "22-26k€",
          description: "Préparation des commandes et gestion des stocks. Respect des procédures qualité et délais de livraison.",
          skills: ["Préparation commandes", "Gestion stocks", "Qualité"]
        }
      ]
    },
    {
      id: 'design',
      name: 'Design',
      icon: Heart,
      color: 'from-pink-500 to-pink-600',
      jobs: [
        {
          title: "Designer textile",
          location: "Paris",
          type: "CDI",
          salary: "35-42k€",
          description: "Création de motifs et sélection de matières pour nos collections. Veille tendances et développement créatif.",
          skills: ["Design textile", "Création", "Tendances"]
        }
      ]
    },
    {
      id: 'tech',
      name: 'Technologie',
      icon: Globe,
      color: 'from-indigo-500 to-indigo-600',
      jobs: [
        {
          title: "Développeur front-end",
          location: "Paris ou Télétravail",
          type: "CDI",
          salary: "45-55k€",
          description: "Développement et maintenance de notre boutique en ligne. React, TypeScript et technologies modernes.",
          skills: ["React", "TypeScript", "CSS"]
        },
        {
          title: "UX/UI Designer",
          location: "Paris",
          type: "CDI",
          salary: "40-48k€",
          description: "Conception d'interfaces utilisateur intuitives pour notre site web et application mobile. Design system et expérience utilisateur.",
          skills: ["UI/UX", "Figma", "Design system"]
        }
      ]
    }
  ];
  
  const values = [
    {
      title: "Innovation",
      description: "Nous sommes constamment à la recherche de nouvelles idées et approches créatives.",
      icon: Lightbulb,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Durabilité",
      description: "Nous nous engageons à minimiser notre impact environnemental à chaque étape.",
      icon: Globe,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Inclusion",
      description: "Nous valorisons la diversité et cultivons un environnement où chacun peut s'épanouir.",
      icon: Users,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Excellence",
      description: "Nous visons l'excellence dans tout ce que nous faisons, des produits à l'expérience client.",
      icon: Award,
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Collaboration",
      description: "Nous croyons au pouvoir du travail d'équipe et de la communication ouverte.",
      icon: Heart,
      color: "from-pink-500 to-pink-600"
    }
  ];

  const benefits = [
    "Télétravail hybride flexible",
    "Formation continue et développement",
    "Mutuelle et prévoyance",
    "Tickets restaurant",
    "Prime de performance",
    "Congés supplémentaires",
    "Remise employé 30%",
    "Événements d'équipe"
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-indigo-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-indigo-950/30">
        {/* Hero Section */}
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
                <Users className="h-12 w-12 text-white" />
              </div>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Rejoignez notre équipe
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-8">
              Découvrez les opportunités qui vous permettront de développer votre potentiel au sein d'une entreprise dynamique et passionnée
            </p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-4 text-sm text-purple-200"
            >
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>15 boutiques en Europe</span>
              </div>
              <div className="w-1 h-1 bg-purple-300 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>100+ collaborateurs</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 py-16">
          {/* Why Join Us Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Pourquoi nous rejoindre ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Une entreprise en croissance",
                  description: "Rejoignez une entreprise en plein développement et participez à son expansion nationale et internationale.",
                  icon: TrendingUp
                },
                {
                  title: "Développement de carrière",
                  description: "Bénéficiez d'opportunités de formation continue et d'un accompagnement personnalisé pour votre évolution professionnelle.",
                  icon: Award
                },
                {
                  title: "Culture d'entreprise positive",
                  description: "Évoluez dans un environnement bienveillant qui valorise l'équilibre entre vie professionnelle et personnelle.",
                  icon: Heart
                }
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm group hover:scale-105">
                      <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
                          {item.title}
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Values Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Nos valeurs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm group hover:scale-105">
                      <CardHeader className="text-center pb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${value.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-lg text-neutral-900 dark:text-neutral-100">
                          {value.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center leading-relaxed">
                          {value.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Benefits Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-0 shadow-xl">
              <CardContent className="p-12">
                <h3 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Nos avantages
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * index }}
                      className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm p-4 rounded-lg text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        {benefit}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Job Listings */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Nos offres d'emploi
            </h2>
            
            <Tabs defaultValue="vente" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
                {departments.map(dept => {
                  const IconComponent = dept.icon;
                  return (
                    <TabsTrigger 
                      key={dept.id} 
                      value={dept.id}
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                    >
                      <IconComponent className="h-4 w-4 mr-2" />
                      {dept.name}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              
              {departments.map(dept => (
                <TabsContent key={dept.id} value={dept.id}>
                  <div className="grid gap-6">
                    {dept.jobs.map((job, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm group">
                          <CardContent className="p-8">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                              <div className="flex-1">
                                <div className="flex items-start gap-4 mb-4">
                                  <div className={`w-12 h-12 bg-gradient-to-r ${dept.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                    <dept.icon className="h-6 w-6 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                                      {job.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                      <Badge variant="outline" className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {job.location}
                                      </Badge>
                                      <Badge variant="outline" className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {job.type}
                                      </Badge>
                                      <Badge className={`bg-gradient-to-r ${dept.color} text-white`}>
                                        {job.salary}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
                                  {job.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {job.skills.map((skill, skillIndex) => (
                                    <Badge key={skillIndex} variant="secondary" className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <Button className={`bg-gradient-to-r ${dept.color} hover:shadow-lg transition-all duration-300 text-white flex-shrink-0`}>
                                <Send className="h-4 w-4 mr-2" />
                                Postuler
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.section>
          
          {/* Spontaneous Application */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-16"
          >
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-0 shadow-xl">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Candidature spontanée
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                  Vous ne trouvez pas l'offre qui vous correspond mais souhaitez rejoindre notre équipe ? 
                  N'hésitez pas à nous envoyer une candidature spontanée.
                </p>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  <Send className="h-5 w-5 mr-2" />
                  Envoyer ma candidature
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CarriersPage;
