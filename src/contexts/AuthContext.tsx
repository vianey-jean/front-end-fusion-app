import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authAPI, User } from '../services/api';
import { UpdateProfileData } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { maintenanceAPI } from '@/services/maintenanceAPI';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (nom: string, email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const validateToken = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
      return false;
    }
    
    try {
      const response = await authAPI.verifyToken();
      if (response.data && response.data.valid) {
        setUser(response.data.user);
        return true;
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.log("Token expiré ou invalide, nettoyage automatique");
        localStorage.removeItem('authToken');
        setUser(null);
      } else {
        console.error("Erreur de vérification du token:", error);
      }
    }
    
    setLoading(false);
    return false;
  };

  useEffect(() => {
    const verifyToken = async () => {
      await validateToken();
      setLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log("Tentative de connexion avec:", { email });
      
      // Vérifier d'abord le mode maintenance
      let maintenanceMode = false;
      try {
        const maintenanceResponse = await maintenanceAPI.getMaintenanceStatus();
        maintenanceMode = maintenanceResponse.maintenance;
      } catch (maintenanceError) {
        console.log("Impossible de vérifier le mode maintenance, on continue...");
      }

      // Si en mode maintenance, vérifier d'abord si l'email est admin avant la connexion
      if (maintenanceMode) {
        try {
          const emailCheckResponse = await authAPI.checkEmail(email);
          if (!emailCheckResponse.data.exists || emailCheckResponse.data.user.role !== 'admin') {
            toast({
              title: 'Accès refusé : Site en maintenance. Seuls les administrateurs peuvent se connecter.',
              variant: 'destructive',
            });
            throw new Error('Accès refusé en mode maintenance pour les non-administrateurs');
          }
        } catch (emailError: any) {
          if (emailError.message.includes('Accès refusé')) {
            throw emailError;
          }
          console.error("Erreur lors de la vérification de l'email:", emailError);
          toast({
            title: 'Erreur lors de la vérification. Veuillez réessayer.',
            variant: 'destructive',
          });
          throw emailError;
        }
      }

      // Procéder à la connexion
      const response = await authAPI.login({ email, password });
      localStorage.setItem('authToken', response.data.token);
      setUser(response.data.user);
      
      toast({
        title: 'Connexion réussie',
        variant: 'default',
      });

      // Logique de redirection améliorée
      if (maintenanceMode) {
        // En mode maintenance, seuls les admins peuvent se connecter et sont redirigés vers admin
        if (response.data.user.role === 'admin') {
          window.location.href = '/admin';
        } else {
          // Ne devrait pas arriver grâce à la vérification préalable, mais par sécurité
          window.location.href = '/maintenance';
        }
      } else {
        // Pas en mode maintenance
        if (response.data.user.role === 'admin') {
          window.location.href = '/admin';
        } else {
          // Pour les utilisateurs normaux, redirection intelligente
          const currentPath = window.location.pathname;
          if (currentPath === '/login' || currentPath.includes('/login')) {
            window.location.href = '/';
          }
          // Sinon, rester sur la page actuelle
        }
      }
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      
      const errorMessage = error.response?.data?.message || error.message || "Erreur de connexion";
      toast({
        title: errorMessage,
        variant: 'destructive',
      });

      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    toast({
      title: 'Vous êtes déconnecté',
      variant: 'destructive',
    });

    window.location.href = '/login';
  };

  const register = async (nom: string, email: string, password: string) => {
    try {
      const response = await authAPI.register({ nom, email, password });
      localStorage.setItem('authToken', response.data.token);
      setUser(response.data.user);
      toast({
        title: 'Inscription réussie',
        variant: 'default',
      });

      if (response.data.user.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/';
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'inscription';
      toast({
        title: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await authAPI.forgotPassword(email);
    } catch (error) {
      console.error("Erreur de demande de réinitialisation:", error);
      toast({
        title: 'Une erreur est survenue',
        variant: 'destructive',
      });
     
      throw error;
    }
  };

  const resetPassword = async (email: string, code: string, newPassword: string) => {
    try {
      await authAPI.resetPassword({ email, passwordUnique: code, newPassword });
    } catch (error) {
      console.error("Erreur de réinitialisation de mot de passe:", error);
      toast({
        title: 'Une erreur est survenue',
        variant: 'destructive',
      });
      
      throw error;
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      if (!user) throw new Error('Utilisateur non connecté');
      
      const isTokenValid = await validateToken();
      if (!isTokenValid) {
        toast({
          title: 'Votre session a expiré, veuillez vous reconnecter',
          variant: 'destructive',
        });
        window.location.href = '/login';
        throw new Error('Session expirée');
      }
      
      const response = await authAPI.updateProfile(user.id, data);
      setUser(prev => prev ? { ...prev, ...response.data } : null);
      toast({
        title: 'Profil mis à jour avec succès',
        variant: 'default',
      });
     
    } catch (error: any) {
      console.error("Erreur de mise à jour du profil:", error);
      toast({
        title: error.response?.data?.message || 'Erreur lors de la mise à jour du profil',
        variant: 'destructive',
      });
     
      throw error;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      if (!user) throw new Error('Utilisateur non connecté');
      
      const isTokenValid = await validateToken();
      if (!isTokenValid) {
        toast({
          title: 'Votre session a expiré, veuillez vous reconnecter',
          variant: 'destructive',
        });
        window.location.href = '/login';
        throw new Error('Session expirée');
      }
      
      await authAPI.updatePassword(user.id, currentPassword, newPassword);
      toast({
        title: 'Mot de passe mis à jour avec succès',
        variant: 'default',
      });
      
    } catch (error: any) {
      console.error("Erreur de mise à jour du mot de passe:", error);
      toast({
        title: error.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe',
        variant: 'destructive',
      });
     
      throw error;
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    updateProfile,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé avec AuthProvider');
  }
  return context;
};
