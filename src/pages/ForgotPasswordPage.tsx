
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';

import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';
import Layout from '@/components/layout/Layout';
import { authAPI } from '@/services/api';
import PasswordStrengthIndicator from '@/components/auth/PasswordStrengthIndicator';
import { Eye, EyeOff, CheckCircle, Mail, Lock, Shield, Key, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';

const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const emailFormSchema = z.object({
  email: z.string().email('Email invalide'),
});

const resetFormSchema = z.object({
  email: z.string().email('Email invalide'),
  passwordUnique: z.string().min(1, 'Le code temporaire est requis'),
  newPassword: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .refine((val) => /[A-Z]/.test(val), 'Au moins une majuscule')
    .refine((val) => /[a-z]/.test(val), 'Au moins une minuscule')
    .refine((val) => /[0-9]/.test(val), 'Au moins un chiffre')
    .refine((val) => /[^A-Za-z0-9]/.test(val), 'Au moins un caractère spécial'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type EmailFormValues = z.infer<typeof emailFormSchema>;
type ResetFormValues = z.infer<typeof resetFormSchema>;

const ForgotPasswordPage: React.FC = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isTempPasswordValid, setIsTempPasswordValid] = useState(false);
  const [showContactAdmin, setShowContactAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { email: '' },
  });

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetFormSchema),
    defaultValues: {
      email: '', passwordUnique: '', newPassword: '', confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmitEmail = async (data: EmailFormValues) => {
    try {
      setIsLoading(true);

      const emailCheckResponse = await authAPI.checkEmail(data.email);
      if (!emailCheckResponse.data.exists) {
        toast.error(`Aucun compte trouvé avec l'email ${data.email}`, {
          style: { backgroundColor: 'red', color: 'white' },
        });
                  
        return;
      }

      setUserEmail(data.email);
      setUserId(emailCheckResponse.data.userId);

      const response = await fetch(`${AUTH_BASE_URL}/api/auth/user-temp-password?email=${encodeURIComponent(data.email)}`);
      if (!response.ok) throw new Error(`Erreur serveur: ${response.status}`);

      const userData = await response.json();
      if (!userData.passwordUnique) {
        setShowContactAdmin(true);
        toast.error("Aucun code temporaire n'a été défini pour ce compte.",{
          style: { backgroundColor: 'red', color: 'white' },
        });
      } else {
        resetForm.setValue('email', data.email);
        toast.success("Veuillez saisir le code temporaire transmis.",{
          style: { backgroundColor: 'green', color: 'white' },
        });
      }
    } catch (err) {
      console.error('Erreur dans la vérification email:', err);
      toast.error("Une erreur est survenue. Veuillez réessayer plus tard.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyTempPassword = async () => {
    const tempPassword = resetForm.getValues('passwordUnique');
    if (!userId || !userEmail || !tempPassword) return;

    try {
      setIsLoading(true);

      const res = await fetch(`${AUTH_BASE_URL}/api/auth/verify-temp-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, tempPassword }),
      });

      const result = await res.json();

      if (res.ok && result.valid) {
        setIsTempPasswordValid(true);
        toast.success("Code temporaire valide.",{
          style: { backgroundColor: 'green', color: 'white' },
        });
      } else {
        setIsTempPasswordValid(false);
        toast.error("Code temporaire invalide.",
          {
            style: { backgroundColor: 'red', color: 'white' },
          }
        );
      }
    } catch (error) {
      console.error('Erreur de vérification du code temporaire:', error);
      toast.error("Une erreur est survenue.",
        {
          style: { backgroundColor: 'red', color: 'white' },
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitReset = async (data: ResetFormValues) => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const res = await fetch(`${AUTH_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          passwordUnique: data.passwordUnique,
          newPassword: data.newPassword
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur inconnue");
      }

      toast.success("Mot de passe réinitialisé avec succès.",
        {
          style: { backgroundColor: 'green', color: 'white' },
        }
      );
      navigate('/login');
    } catch (error: any) {
      console.error('Erreur de réinitialisation:', error);
      toast.error(error.message || "Une erreur est survenue.",
        {
          style: { backgroundColor: 'red', color: 'white' },
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNewPasswordVisibility  = () => setShowNewPassword(!showNewPassword);
  const togglePasswordConfirmVisibility = () => setShowConfirmPassword(!showConfirmPassword);
  
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
                    <Key className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                    <Sparkles className="h-2 w-2 text-white" />
                  </div>
                </div>
              </motion.div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Mot de passe oublié
                </CardTitle>
                <CardDescription className="text-lg text-neutral-600 dark:text-neutral-400 mt-3">
                  {userId && !showContactAdmin
                    ? 'Entrez le code temporaire et créez un nouveau mot de passe'
                    : 'Entrez votre adresse email pour commencer'}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {!userId ? (
                <Form {...emailForm}>
                  <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-6">
                    <FormField
                      control={emailForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Adresse email</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Input 
                                placeholder="email@example.com" 
                                {...field} 
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
              ) : showContactAdmin ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/50">
                    <Mail className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <AlertTitle className="text-orange-800 dark:text-orange-200">
                      Code temporaire non trouvé
                    </AlertTitle>
                    <AlertDescription className="text-orange-700 dark:text-orange-300">
                      Aucun code temporaire n'a été défini pour votre compte. Contactez l'administrateur :
                    </AlertDescription>
                  </Alert>
                  <div className="flex items-center justify-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-xl border border-blue-200 dark:border-blue-800">
                    <a 
                      href="mailto:vianey.jean@ymail.com" 
                      className="text-blue-600 dark:text-blue-400 font-medium hover:underline text-lg transition-colors duration-300"
                    >
                      vianey.jean@ymail.com
                    </a>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full h-12 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-300"
                    onClick={() => {
                      setUserId(null);
                      setShowContactAdmin(false);
                      emailForm.reset();
                    }}
                  >
                    Retour
                  </Button>
                </motion.div>
              ) : (
                <Form {...resetForm}>
                  <form onSubmit={resetForm.handleSubmit(onSubmitReset)} className="space-y-6">
                    <FormField
                      control={resetForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Adresse email</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Input 
                                placeholder="email@example.com" 
                                disabled 
                                {...field} 
                                className="pl-12 h-12 bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                              />
                              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={resetForm.control}
                      name="passwordUnique"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Code temporaire</FormLabel>
                          <div className="flex space-x-3">
                            <FormControl>
                              <div className="relative group flex-1">
                                <Input
                                  placeholder="Code temporaire"
                                  {...field}
                                  disabled={isTempPasswordValid}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setIsTempPasswordValid(false);
                                  }}
                                  className="pl-12 h-12 bg-white/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
                                />
                                <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                              </div>
                            </FormControl>
                            {!isTempPasswordValid ? (
                              <Button
                                type="button"
                                onClick={verifyTempPassword}
                                disabled={!field.value || isLoading}
                                className="h-12 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                              >
                                {isLoading ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                  "Vérifier"
                                )}
                              </Button>
                            ) : (
                              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                              </div>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={resetForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Nouveau mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Input
                                {...field}
                                type={showNewPassword ? 'text' : 'password'}
                                placeholder="Nouveau mot de passe"
                                className="pl-12 pr-12 h-12 bg-white/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
                              />
                              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                                onClick={toggleNewPasswordVisibility}
                              >
                                {showNewPassword ? (
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

                    <FormField
                      control={resetForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Confirmer le mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Input
                                {...field}
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirmer le mot de passe"
                                className="pl-12 pr-12 h-12 bg-white/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
                              />
                              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                                onClick={togglePasswordConfirmVisibility}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
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
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={isLoading || !isTempPasswordValid}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Réinitialisation...
                        </div>
                      ) : (
                        "Réinitialiser le mot de passe"
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>

            <CardFooter className="pt-6">
              <div className="text-sm text-neutral-600 dark:text-neutral-400 w-full text-center">
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300 hover:underline font-medium"
                >
                  Retour à la connexion
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ForgotPasswordPage;
