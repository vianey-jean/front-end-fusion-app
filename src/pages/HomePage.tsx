
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, TrendingUp, Clock, Star, Crown, Sparkles, ArrowRight, Shield, Zap, Award } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
      {/* Background premium */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-32 h-32 premium-gradient rounded-full premium-shadow-xl mb-12 relative overflow-hidden floating-animation">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full"></div>
            <Calendar className="w-16 h-16 text-white relative z-10" />
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center premium-shadow">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-3 -left-3 w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <h1 className="text-6xl lg:text-7xl font-bold luxury-text-gradient mb-8 leading-tight">
            RDV Manager
            <span className="block text-5xl lg:text-6xl mt-2">Premium</span>
          </h1>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            <p className="text-xl lg:text-2xl text-muted-foreground font-medium max-w-3xl">
              La solution ultime pour gérer vos rendez-vous avec élégance et efficacité
            </p>
            <Sparkles className="w-6 h-6 text-primary animate-pulse delay-300" />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              onClick={() => navigate('/dashboard')}
              className="premium-gradient hover:opacity-90 text-white px-8 py-6 text-lg font-semibold rounded-2xl premium-shadow-xl transition-all duration-300 hover:scale-105 glow-effect"
            >
              Commencer maintenant
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button 
              onClick={() => navigate('/calendar')}
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg font-semibold rounded-2xl premium-shadow transition-all duration-300 hover:scale-105"
            >
              Voir le calendrier
              <Calendar className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold luxury-text-gradient mb-4">
              Fonctionnalités Premium
            </h2>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
              Découvrez les outils qui révolutionneront votre gestion de rendez-vous
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <Card className="luxury-card premium-shadow-xl border-0 premium-hover glow-effect">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 premium-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 premium-shadow">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-primary">
                  Calendrier Intelligent
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground font-medium">
                  Visualisez vos rendez-vous en vue hebdomadaire, mensuelle ou dashboard avec une interface élégante
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="luxury-card premium-shadow-xl border-0 premium-hover glow-effect">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 premium-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 premium-shadow">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-primary">
                  Gestion Clients
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground font-medium">
                  Gérez efficacement vos clients avec un système complet de fiches et d'historique
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="luxury-card premium-shadow-xl border-0 premium-hover glow-effect">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 premium-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 premium-shadow">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-primary">
                  Statistiques Avancées
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground font-medium">
                  Analysez vos performances avec des graphiques et métriques détaillées
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="luxury-card premium-shadow-xl border-0 premium-hover glow-effect">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 premium-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 premium-shadow">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-primary">
                  Rappels Automatiques
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground font-medium">
                  Ne ratez plus jamais un rendez-vous avec notre système de notifications intelligent
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 py-20 bg-gradient-to-r from-primary/5 to-purple-500/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold luxury-text-gradient mb-4">
              Pourquoi Choisir RDV Manager ?
            </h2>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
              Une solution pensée pour les professionnels exigeants
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="text-center">
              <div className="w-20 h-20 premium-gradient rounded-full flex items-center justify-center mx-auto mb-6 premium-shadow-xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">Sécurité Premium</h3>
              <p className="text-muted-foreground font-medium">
                Vos données sont protégées par les dernières technologies de sécurité
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="text-center">
              <div className="w-20 h-20 premium-gradient rounded-full flex items-center justify-center mx-auto mb-6 premium-shadow-xl">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">Performance Optimale</h3>
              <p className="text-muted-foreground font-medium">
                Interface rapide et responsive pour une expérience utilisateur exceptionnelle
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="text-center">
              <div className="w-20 h-20 premium-gradient rounded-full flex items-center justify-center mx-auto mb-6 premium-shadow-xl">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">Design Élégant</h3>
              <p className="text-muted-foreground font-medium">
                Une interface moderne et intuitive qui reflète votre professionnalisme
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold luxury-text-gradient mb-6">
              Prêt à Transformer Votre Gestion ?
            </h2>
            <p className="text-xl text-muted-foreground font-medium mb-8 max-w-2xl mx-auto">
              Rejoignez les professionnels qui ont déjà choisi l'excellence avec RDV Manager Premium
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => navigate('/dashboard')}
                className="premium-gradient hover:opacity-90 text-white px-10 py-6 text-xl font-semibold rounded-2xl premium-shadow-xl transition-all duration-300 hover:scale-105 glow-effect"
              >
                Commencer Gratuitement
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
              
              <Button 
                onClick={() => navigate('/about')}
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary/10 px-10 py-6 text-xl font-semibold rounded-2xl premium-shadow transition-all duration-300 hover:scale-105"
              >
                En Savoir Plus
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
