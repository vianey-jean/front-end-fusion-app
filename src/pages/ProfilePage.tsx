
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PersonalInfoForm from '@/components/profile/PersonalInfoForm';
import PasswordForm from '@/components/profile/PasswordForm';
import PreferencesForm from '@/components/profile/PreferencesForm';
import { toast } from '@/components/ui/sonner';
import { useStore } from '@/contexts/StoreContext';
import { authAPI } from '@/services/api';
import { UpdateProfileData } from '@/types/auth';
import { User, Shield, Settings, Star } from 'lucide-react';

const ProfilePage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { orders, fetchOrders } = useStore();
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<UpdateProfileData>({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    adresse: user?.adresse || '',
    ville: user?.ville || '',
    codePostal: user?.codePostal || '',
    pays: user?.pays || '',
    telephone: user?.telephone || '',
    genre: (user?.genre as "homme" | "femme" | "autre") || 'autre',
  });
  
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
    
    if (user) {
      setProfileData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        adresse: user.adresse || '',
        ville: user.ville || '',
        codePostal: user.codePostal || '',
        pays: user.pays || '',
        telephone: user.telephone || '',
        genre: (user.genre || 'autre') as "homme" | "femme" | "autre",
      });
      
      fetchOrders();
    }
  }, [isAuthenticated, authLoading, user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'genre') {
      const genreValue = value as "homme" | "femme" | "autre";
      setProfileData(prev => ({ ...prev, [name]: genreValue }));
    } else {
      setProfileData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleGenreChange = (value: string) => {
    const genreValue = value as "homme" | "femme" | "autre";
    setProfileData(prev => ({ ...prev, genre: genreValue }));
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const updatedProfile: UpdateProfileData = {
        nom: profileData.nom,
        prenom: profileData.prenom,
        adresse: profileData.adresse,
        ville: profileData.ville,
        codePostal: profileData.codePostal,
        pays: profileData.pays,
        telephone: profileData.telephone,
        genre: profileData.genre as 'homme' | 'femme' | 'autre',
      };
      
      await authAPI.updateProfile(user.id, updatedProfile);
      
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordUpdate = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setLoading(true);
    try {
      if (!user) throw new Error('Utilisateur non connecté');
      
      await authAPI.updatePassword(user.id, currentPassword, newPassword);
      toast.success('Mot de passe mis à jour avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
      toast.error('Erreur lors de la mise à jour du mot de passe');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-blue-950/30">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl">
                  <User className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-neutral-900 flex items-center justify-center">
                  <Star className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent mb-2">
              Mon Compte
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400">
              Gérez vos informations personnelles et préférences
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="informations" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-3 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 shadow-lg">
                  <TabsTrigger 
                    value="informations" 
                    className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Informations</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security"
                    className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                  >
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">Sécurité</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="preferences"
                    className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Préférences</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="informations" className="mt-6">
                <Card className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-0 shadow-xl">
                  <PersonalInfoForm
                    profileData={profileData}
                    loading={loading}
                    handleProfileChange={handleChange}
                    handleGenreChange={handleGenreChange}
                    handleProfileSubmit={handleProfileSubmit}
                  />
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-6">
                <Card className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-0 shadow-xl">
                  <PasswordForm 
                    loading={loading}
                    onPasswordChange={handlePasswordUpdate}
                  />
                </Card>
              </TabsContent>

              <TabsContent value="preferences" className="mt-6">
                <Card className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-0 shadow-xl">
                  <PreferencesForm />
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
