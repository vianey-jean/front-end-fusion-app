import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { authAPI } from '@/services/api';
import { toast } from '@/components/ui/sonner';
import { Eye, EyeOff, Mail, Lock, Shield, UserCheck, Sparkles } from 'lucide-react';
import PasswordStrengthIndicator from '@/components/auth/PasswordStrengthIndicator';
import { motion } from 'framer-motion';

// ✅ Validation schemas
const emailSchema = z.object({
  email: z.string().email('Email invalide'),
});
const passwordSchema = z.object({
  password: z.string().min(1, 'Mot de passe requis'),
});

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Formulaires
  const emailForm = useForm<{ email: string }>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const passwordForm = useForm<{ password: string }>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  });

  // ✅ Gestion soumission email
  const onEmailSubmit = async (data: { email: string }) => {
    const normalizedEmail = data.email.trim().toLowerCase();
    try {
      setIsLoading(true);
      const response = await authAPI.checkEmail(normalizedEmail);

      if (response.data.exists) {
        setUserEmail(normalizedEmail);
        setUserName(response.data.user.nom || 'Utilisateur');
        setStep('password');
        toast.success(`Bienvenue ${response.data.user.nom || 'Utilisateur'}`, {
          style: { backgroundColor: 'green', color: 'white' },
        });
      } else {
        toast.error("Cet email n'existe pas", {
          style: { backgroundColor: 'red', color: 'white' },
        });
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'email:", error);
      toast.error("Erreur lors de la vérification de l'email", {
        style: { backgroundColor: 'red', color: 'white' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Gestion soumission mot de passe
  const onPasswordSubmit = async (data: { password: string }) => {
    try {
      setIsLoading(true);
      await login(userEmail, data.password);
      // La redirection est gérée dans le contexte Auth
    } catch (error) {
      console.error("Erreur de connexion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950 dark:via-neutral-900 dark:to-indigo-950 flex items-center justify-center py-12 px-4">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-neutral-900/90 border-0 shadow-2xl">
            <CardHeader className="space-y-6 text-center pb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center"
              >
                <div className="relative">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-xl">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <Sparkles className="h-2 w-2 text-white" />
                  </div>
                </div>
              </motion.div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Connexion
                </CardTitle>
                <CardDescription className="text-lg text-neutral-600 dark:text-neutral-400 mt-3">
                  {step === 'email' ? 'Entrez votre email pour commencer' : `Bienvenue ${userName}`}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {step === 'email' ? (
                <Form {...emailForm}>
                  <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                    <FormField
                      control={emailForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Adresse email</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Input
                                {...field}
                                placeholder="email@example.com"
                                onChange={(e) => field.onChange(e.target.value.trim())}
                                className="pl-12 h-12 bg-white/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
                              />
                              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Vérification...
                        </div>
                      ) : (
                        "Continuer"
                      )}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="text-sm font-medium text-green-800 dark:text-green-200">
                            Email vérifié
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400">
                            {userEmail}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <FormField
                      control={passwordForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Input
                                {...field}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Entrez votre mot de passe"
                                className="pl-12 pr-12 h-12 bg-white/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
                              />
                              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                                onClick={togglePasswordVisibility}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                          <PasswordStrengthIndicator password={field.value} />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-3">
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Connexion...
                          </div>
                        ) : (
                          "Se connecter"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-300"
                        onClick={() => setStep('email')}
                        disabled={isLoading}
                      >
                        Modifier l'email
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-6">
              <Link 
                to="/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300 hover:underline font-medium"
              >
                Mot de passe oublié ?
              </Link>
              <div className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
                Pas encore de compte ?{" "}
                <Link 
                  to="/register" 
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300 hover:underline font-medium"
                >
                  S'inscrire
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default LoginPage;
