
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
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Sparkles, Star } from 'lucide-react';

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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/5 dark:via-indigo-500/5 dark:to-purple-500/5">
          <div className="absolute inset-0 bg-grid-neutral-100/50 dark:bg-grid-neutral-800/50" />
          <div className="container mx-auto px-4 py-16 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-2xl shadow-lg">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Contactez-nous
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed">
                Notre équipe est là pour vous accompagner. N'hésitez pas à nous contacter pour toute question ou demande d'assistance.
              </p>
              
              <div className="flex items-center justify-center space-x-8 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  <span>Support 24/7</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-indigo-500" />
                  <span>Réponse rapide</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-purple-500" />
                  <span>Équipe dédiée</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulaire de contact */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-0 bg-white dark:bg-neutral-900 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 border-b border-blue-200 dark:border-blue-800">
                  <CardHeader className="p-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
                        <Send className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Formulaire de contact
                      </CardTitle>
                    </div>
                    <CardDescription className="text-blue-700 dark:text-blue-400">
                      Remplissez ce formulaire et nous vous répondrons dans les plus brefs délais.
                    </CardDescription>
                  </CardHeader>
                </div>
                
                <CardContent className="p-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="nom"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-neutral-700 dark:text-neutral-300 font-medium">Nom *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Dupont" 
                                  {...field} 
                                  className="border-neutral-300 dark:border-neutral-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-12"
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
                              <FormLabel className="text-neutral-700 dark:text-neutral-300 font-medium">Prénom *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Jean" 
                                  {...field} 
                                  className="border-neutral-300 dark:border-neutral-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-12"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-neutral-700 dark:text-neutral-300 font-medium">Email *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="email@example.com" 
                                  {...field} 
                                  className="border-neutral-300 dark:border-neutral-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-12"
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
                              <FormLabel className="text-neutral-700 dark:text-neutral-300 font-medium">Téléphone *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="06 12 34 56 78" 
                                  {...field} 
                                  className="border-neutral-300 dark:border-neutral-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-12"
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
                            <FormLabel className="text-neutral-700 dark:text-neutral-300 font-medium">Adresse *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="123 rue des Exemples, 75000 Paris" 
                                {...field} 
                                className="border-neutral-300 dark:border-neutral-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-12"
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
                            <FormLabel className="text-neutral-700 dark:text-neutral-300 font-medium">Objet *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Objet de votre message" 
                                {...field} 
                                className="border-neutral-300 dark:border-neutral-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-12"
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
                            <FormLabel className="text-neutral-700 dark:text-neutral-300 font-medium">Message *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Votre message..." 
                                {...field} 
                                rows={6} 
                                className="border-neutral-300 dark:border-neutral-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white h-12 rounded-lg shadow-lg transition-all duration-300"
                        disabled={contactMutation.isPending}
                      >
                        {contactMutation.isPending ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            <span>Envoi en cours...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Send className="h-5 w-5" />
                            <span>Envoyer le message</span>
                          </div>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            
            {/* Informations de contact */}
            <div className="space-y-6">
              <Card className="shadow-lg border-0 bg-white dark:bg-neutral-900 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 border-b border-blue-200 dark:border-blue-800">
                  <CardHeader className="p-0">
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Informations de contact
                    </CardTitle>
                  </CardHeader>
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 rounded-xl">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg flex-shrink-0">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Adresse</h3>
                      <p className="text-neutral-600 dark:text-neutral-400">123 Rue du Commerce</p>
                      <p className="text-neutral-600 dark:text-neutral-400">75015 Paris, France</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 rounded-xl">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg flex-shrink-0">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Téléphone</h3>
                      <p className="text-neutral-600 dark:text-neutral-400">+33 (0)1 23 45 67 89</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 rounded-xl">
                    <div className="bg-gradient-to-r from-red-500 to-rose-500 p-2 rounded-lg flex-shrink-0">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Email</h3>
                      <p className="text-neutral-600 dark:text-neutral-400">contact@Riziky-Boutic.fr</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 rounded-xl">
                    <div className="bg-gradient-to-r from-purple-500 to-violet-500 p-2 rounded-lg flex-shrink-0">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Heures d'ouverture</h3>
                      <div className="text-neutral-600 dark:text-neutral-400 space-y-1">
                        <p>Lundi - Vendredi: 9h00 - 18h00</p>
                        <p>Samedi: 10h00 - 16h00</p>
                        <p>Dimanche: Fermé</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section supplémentaire */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-2xl">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Besoin d'aide immédiate ?
                  </h3>
                  <p className="text-blue-700 dark:text-blue-400 mb-4">
                    Notre équipe de support est disponible pour vous aider en temps réel.
                  </p>
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Chat en direct
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
