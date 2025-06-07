
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { authAPI } from '@/services/api';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, User, Lock, UserPlus, Shield, Check } from 'lucide-react';
import { debounce } from 'lodash';
import PasswordStrengthIndicator from '@/components/auth/PasswordStrengthIndicator';

const formSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
    .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

const RegisterPage = () => {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const checkEmailExists = debounce(async (email: string) => {
    if (!email || !email.includes('@')) return;
    
    try {
      const response = await authAPI.checkEmail(email);
      if (response.data.exists) {
        setEmailExists(true);
        toast.error('Cet email existe déjà');
      } else {
        setEmailExists(false);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'email:', error);
    }
  }, 500);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'email') {
        checkEmailExists(value.email || '');
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (emailExists) {
      toast.error('Cet email existe déjà');
      return;
    }
    
    try {
      setIsLoading(true);
      await register(data.nom, data.email, data.password);
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    "Accès exclusif aux promotions",
    "Suivi de vos commandes en temps réel",
    "Historique d'achat personnalisé",
    "Recommandations sur mesure"
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-red-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-red-950/30">
        <div className="flex justify-center items-center min-h-screen py-12 px-4">
          <div className="w-full max-w-md">
            {/* Header avec icône */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-2xl shadow-lg">
                  <UserPlus className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-800 to-red-600 bg-clip-text text-transparent">
                Créer un compte
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                Rejoignez notre communauté beauté
              </p>
            </div>

            <Card className="shadow-2xl border-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl text-neutral-800 dark:text-neutral-200">Inscription</CardTitle>
                <CardDescription>Créez votre compte en quelques clics</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Benefits section */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-red-800 dark:text-red-300">Avantages membre</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="nom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-neutral-700 dark:text-neutral-300">Nom complet</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="Votre nom complet" 
                                {...field} 
                                className="pl-10 border-neutral-300 dark:border-neutral-700 focus:border-red-500 focus:ring-red-500"
                              />
                              <User className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-neutral-700 dark:text-neutral-300">Adresse email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="email@exemple.com" 
                                {...field} 
                                className="pl-10 border-neutral-300 dark:border-neutral-700 focus:border-red-500 focus:ring-red-500"
                              />
                              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                              {emailExists && (
                                <div className="absolute right-3 top-2.5">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-neutral-700 dark:text-neutral-300">Mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="********"
                                {...field}
                                className="pl-10 pr-10 border-neutral-300 dark:border-neutral-700 focus:border-red-500 focus:ring-red-500"
                              />
                              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-neutral-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-neutral-400" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                          <PasswordStrengthIndicator password={field.value} />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-neutral-700 dark:text-neutral-300">Confirmer le mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="********"
                                {...field}
                                className="pl-10 pr-10 border-neutral-300 dark:border-neutral-700 focus:border-red-500 focus:ring-red-500"
                              />
                              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4 text-neutral-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-neutral-400" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300" 
                      disabled={emailExists || isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Création en cours...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <UserPlus className="h-4 w-4" />
                          Créer mon compte
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              
              <CardFooter className="pt-4">
                <div className="text-sm text-neutral-600 dark:text-neutral-400 w-full text-center">
                  Déjà un compte ?{' '}
                  <Link to="/login" className="text-red-600 hover:text-red-700 font-semibold hover:underline transition-colors">
                    Se connecter
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
