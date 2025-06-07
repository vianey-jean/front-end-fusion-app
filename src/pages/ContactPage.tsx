
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { useMutation } from '@tanstack/react-query';
import { API } from '@/services/api';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const formSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  telephone: z.string().min(8, 'Numéro de téléphone invalide'),
  adresse: z.string().min(5, 'Adresse requise'),
  objet: z.string().min(3, 'Objet requis'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
});

type FormValues = z.infer<typeof formSchema>;

const ContactPage = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      adresse: '',
      objet: '',
      message: '',
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return API.post('/contacts', data);
    },
    onSuccess: () => {
      toast.success("Votre message a été envoyé avec succès");
      form.reset();
    },
    onError: () => {
      toast.error("Une erreur est survenue lors de l'envoi de votre message");
    }
  });

  const onSubmit = (data: FormValues) => {
    contactMutation.mutate(data);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Adresse",
      content: ["123 Rue du Commerce", "75015 Paris, France"],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Phone,
      title: "Téléphone",
      content: ["+33 (0)1 23 45 67 89"],
      color: "from-green-500 to-green-600"
    },
    {
      icon: Mail,
      title: "Email",
      content: ["contact@Riziky-Boutic.fr"],
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Clock,
      title: "Heures d'ouverture",
      content: ["Lundi - Vendredi: 9h00 - 18h00", "Samedi: 10h00 - 16h00", "Dimanche: Fermé"],
      color: "from-orange-500 to-orange-600"
    }
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
              <div className="relative">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <MessageCircle className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Contactez-nous
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
              Notre équipe est là pour vous accompagner et répondre à toutes vos questions
            </p>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Envoyez-nous un message
                  </CardTitle>
                  <CardDescription className="text-lg text-neutral-600 dark:text-neutral-400">
                    Remplissez ce formulaire et nous vous répondrons dans les plus brefs délais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="nom"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Nom</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Dupont" 
                                  {...field} 
                                  className="h-12 bg-white/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-300"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="prenom"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Prénom</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Jean" 
                                  {...field} 
                                  className="h-12 bg-white/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-300"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Email</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="email@example.com" 
                                  {...field} 
                                  className="h-12 bg-white/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-300"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="telephone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Téléphone</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="06 12 34 56 78" 
                                  {...field} 
                                  className="h-12 bg-white/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-300"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="adresse"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Adresse</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="123 rue des Exemples, 75000 Paris" 
                                {...field} 
                                className="h-12 bg-white/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-300"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="objet"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Objet</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Objet de votre message" 
                                {...field} 
                                className="h-12 bg-white/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-300"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Décrivez votre demande en détail..." 
                                {...field} 
                                rows={6} 
                                className="bg-white/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-300 resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium"
                        disabled={contactMutation.isPending}
                      >
                        {contactMutation.isPending ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Envoi en cours...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Send className="h-5 w-5" />
                            Envoyer le message
                          </div>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Informations de contact
                </h2>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
                  Plusieurs moyens pour nous joindre et obtenir de l'aide rapidement
                </p>
              </div>

              <div className="grid gap-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm group hover:scale-105">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                              <IconComponent className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                {info.title}
                              </h3>
                              <div className="space-y-1">
                                {info.content.map((line, lineIndex) => (
                                  <p key={lineIndex} className="text-neutral-600 dark:text-neutral-400">
                                    {line}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Besoin d'aide immédiate ?
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Consultez notre FAQ ou démarrez un chat en direct
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" className="flex-1 h-12 border-2 border-indigo-200 hover:bg-indigo-50 transition-all duration-300">
                      Consulter la FAQ
                    </Button>
                    <Button className="flex-1 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      Chat en direct
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
