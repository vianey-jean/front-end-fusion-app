
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  Heart,
  Crown,
  Sparkles 
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

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
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 to-transparent" />
      
      {/* Floating Elements */}
      <div className="absolute top-10 left-10 animate-pulse">
        <Sparkles className="h-6 w-6 text-rose-400/30" />
      </div>
      <div className="absolute top-20 right-20 animate-bounce">
        <Crown className="h-5 w-5 text-purple-400/30" />
      </div>
      <div className="absolute bottom-1/2 left-1/4 animate-pulse">
        <Heart className="h-4 w-4 text-pink-400/30" />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="container mx-auto px-4 py-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-rose-500 to-purple-500 p-2 rounded-xl">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
                  Riziky Boutique
                </h2>
              </div>
              <p className="text-neutral-300 mb-6 leading-relaxed">
                Votre spécialiste en produits capillaires premium. Nous nous engageons à vous offrir 
                les meilleurs soins pour sublimer votre beauté naturelle.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Facebook, href: "#", color: "hover:text-blue-400" },
                  { icon: Instagram, href: "#", color: "hover:text-pink-400" },
                  { icon: Twitter, href: "#", color: "hover:text-blue-300" },
                  { icon: Youtube, href: "#", color: "hover:text-red-400" }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`text-neutral-400 ${social.color} transition-colors duration-300 p-2 rounded-full bg-white/5 hover:bg-white/10`}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-semibold mb-6 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-rose-400" />
                Liens Rapides
              </h3>
              <ul className="space-y-3">
                {[
                  { name: "Accueil", path: "/" },
                  { name: "Tous les produits", path: "/produits" },
                  { name: "Nouveautés", path: "/nouveautes" },
                  { name: "Promotions", path: "/promotions" },
                  { name: "Mon compte", path: "/profil" },
                  { name: "Mes favoris", path: "/favoris" }
                ].map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.path}
                      className="text-neutral-300 hover:text-rose-400 transition-colors duration-300 hover:translate-x-1 transform inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Customer Service */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-semibold mb-6 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-purple-400" />
                Service Client
              </h3>
              <ul className="space-y-3">
                {[
                  { name: "Centre d'aide", path: "/faq" },
                  { name: "Contact", path: "/contact" },
                  { name: "Livraison", path: "/livraison" },
                  { name: "Retours", path: "/retours" },
                  { name: "Conditions générales", path: "/conditions" },
                  { name: "Confidentialité", path: "/confidentialite" }
                ].map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.path}
                      className="text-neutral-300 hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 transform inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-semibold mb-6 flex items-center">
                <Crown className="h-5 w-5 mr-2 text-amber-400" />
                Contact
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 group">
                  <MapPin className="h-5 w-5 text-rose-400 mt-1 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-neutral-300">123 Avenue de la Mode</p>
                    <p className="text-neutral-300">75001 Paris, France</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 group">
                  <Phone className="h-5 w-5 text-purple-400 group-hover:scale-110 transition-transform" />
                  <p className="text-neutral-300">01 23 45 67 89</p>
                </div>
                <div className="flex items-center space-x-3 group">
                  <Mail className="h-5 w-5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <p className="text-neutral-300">contact@riziky-boutique.fr</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-700/50 bg-neutral-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-neutral-400">
                <Heart className="h-4 w-4 text-rose-400" />
                <p>&copy; {currentYear} Riziky Boutique. Fait avec amour pour votre beauté.</p>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <Link to="/mentions-legales" className="text-neutral-400 hover:text-rose-400 transition-colors">
                  Mentions légales
                </Link>
                <Link to="/cookies" className="text-neutral-400 hover:text-purple-400 transition-colors">
                  Cookies
                </Link>
                <Link to="/plan-du-site" className="text-neutral-400 hover:text-amber-400 transition-colors">
                  Plan du site
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
