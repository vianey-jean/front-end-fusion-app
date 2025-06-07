import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Search, BookOpen, Sparkles, TrendingUp, Heart, Star, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Données fictives pour les articles de blog
  const blogPosts = [
    {
      id: 1,
      title: "Les tendances mode printemps-été 2025",
      excerpt: "Découvrez les couleurs, matières et coupes qui feront sensation cette saison. De l'audace des tons vifs aux matières naturelles.",
      date: "2025-04-15",
      author: "Sophie Martin",
      category: "Mode",
      image: "/placeholder.svg",
      readTime: "5 min"
    },
    {
      id: 2,
      title: "Comment choisir des accessoires qui complètent votre garde-robe",
      excerpt: "Guide pratique pour sélectionner des accessoires versatiles et durables qui transformeront vos looks au quotidien.",
      date: "2025-04-10",
      author: "Marc Dupont",
      category: "Style",
      image: "/placeholder.svg",
      readTime: "7 min"
    },
    {
      id: 3,
      title: "L'importance de la mode éthique et durable",
      excerpt: "Comment nos choix vestimentaires peuvent avoir un impact positif sur l'environnement et la société.",
      date: "2025-04-05",
      author: "Léa Rousseau",
      category: "Éco-responsabilité",
      image: "/placeholder.svg",
      readTime: "6 min"
    },
    {
      id: 4,
      title: "Nos coups de cœur de la nouvelle collection",
      excerpt: "Sélection des pièces incontournables à ne pas manquer cette saison, avec nos conseils de styling.",
      date: "2025-03-28",
      author: "Thomas Bernard",
      category: "Collections",
      image: "/placeholder.svg",
      readTime: "4 min"
    },
    {
      id: 5,
      title: "Conseils pour entretenir vos vêtements plus longtemps",
      excerpt: "Astuces pratiques pour préserver la qualité de vos pièces préférées et prolonger leur durée de vie.",
      date: "2025-03-22",
      author: "Julie Moreau",
      category: "Entretien",
      image: "/placeholder.svg",
      readTime: "8 min"
    },
    {
      id: 6,
      title: "Comment créer une garde-robe capsule efficace",
      excerpt: "Minimalisme et style : les clés pour une garde-robe fonctionnelle qui simplifie votre quotidien.",
      date: "2025-03-15",
      author: "Claire Dubois",
      category: "Style",
      image: "/placeholder.svg",
      readTime: "10 min"
    }
  ];

  // Formater la date en français
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const categories = [
    { id: 'all', name: 'Tous les articles', count: blogPosts.length },
    { id: 'Mode', name: 'Mode', count: blogPosts.filter(post => post.category === 'Mode').length },
    { id: 'Style', name: 'Style', count: blogPosts.filter(post => post.category === 'Style').length },
    { id: 'Éco-responsabilité', name: 'Éco-responsabilité', count: blogPosts.filter(post => post.category === 'Éco-responsabilité').length },
    { id: 'Collections', name: 'Collections', count: blogPosts.filter(post => post.category === 'Collections').length },
    { id: 'Entretien', name: 'Entretien', count: blogPosts.filter(post => post.category === 'Entretien').length }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts[0];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-rose-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-rose-950/30">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white py-20"
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center mb-6"
            >
              <div className="relative">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <BookOpen className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-rose-200 bg-clip-text text-transparent">
              Notre Blog
            </h1>
            <p className="text-xl md:text-2xl text-rose-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Découvrez nos derniers articles sur la mode, les tendances et des conseils pour sublimer votre style au quotidien
            </p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-4 text-sm text-rose-200"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Conseils mode</span>
              </div>
              <div className="w-1 h-1 bg-rose-300 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>Inspiration quotidienne</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 py-16">
          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <Input
                  type="text"
                  placeholder="Rechercher un article..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 focus:border-rose-500 dark:focus:border-rose-400 transition-all duration-300"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg'
                        : 'hover:bg-rose-50 hover:border-rose-300 dark:hover:bg-rose-950/20'
                    }`}
                  >
                    {category.name}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Featured Article */}
          {!searchTerm && selectedCategory === 'all' && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Article à la une
              </h2>
              <Card className="border-0 shadow-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm overflow-hidden group hover:shadow-3xl transition-all duration-500">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="relative overflow-hidden">
                    <img 
                      src={featuredPost.image} 
                      alt={featuredPost.title} 
                      className="w-full h-80 lg:h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-to-r from-rose-600 to-pink-600 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        À la une
                      </Badge>
                    </div>
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant="outline" className="text-rose-600 border-rose-200">
                        {featuredPost.category}
                      </Badge>
                      <span className="text-sm text-neutral-500">{featuredPost.readTime} de lecture</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-neutral-900 dark:text-neutral-100 leading-tight">
                      {featuredPost.title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6 text-lg leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-neutral-500">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{featuredPost.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(featuredPost.date)}</span>
                        </div>
                      </div>
                      <Button className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                        Lire l'article
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.section>
          )}

          {/* Articles Grid */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                {searchTerm || selectedCategory !== 'all' ? 'Résultats' : 'Derniers articles'}
              </h2>
              <span className="text-neutral-500">
                {filteredPosts.length} article{filteredPosts.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.slice(searchTerm || selectedCategory !== 'all' ? 0 : 1).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm group overflow-hidden hover:scale-105">
                    <div className="relative overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 dark:bg-neutral-800/90 text-neutral-800 dark:text-neutral-200 backdrop-blur-sm">
                          {post.category}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="outline" className="bg-white/90 dark:bg-neutral-800/90 border-0 backdrop-blur-sm">
                          {post.readTime}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl leading-tight group-hover:text-rose-600 transition-colors duration-300">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center pt-4 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="flex items-center gap-3 text-sm text-neutral-500">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(post.date)}</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="hover:bg-rose-50 hover:text-rose-800 hover:border-rose-300 transition-all duration-300"
                      >
                        Lire
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Newsletter Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-20"
          >
            <Card className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border-0 shadow-xl">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Inscrivez-vous à notre newsletter
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-8 text-lg max-w-2xl mx-auto">
                  Recevez nos derniers articles, conseils mode et tendances directement dans votre boîte mail
                </p>
                <div className="max-w-lg mx-auto flex flex-col md:flex-row gap-4">
                  <Input 
                    type="email" 
                    placeholder="Votre adresse email" 
                    className="flex-grow h-12 bg-white/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus:border-rose-500 dark:focus:border-rose-400 transition-all duration-300"
                  />
                  <Button className="h-12 px-8 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    <Mail className="h-4 w-4 mr-2" />
                    S'abonner
                  </Button>
                </div>
                <p className="text-sm text-neutral-500 mt-4">
                  Plus de 10 000 abonnés nous font confiance
                </p>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPage;
