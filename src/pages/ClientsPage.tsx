import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useClientSync } from '@/hooks/useClientSync';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Phone, MapPin, Users, Sparkles, Crown, Star, Diamond } from 'lucide-react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Client {
  id: string;
  nom: string;
  phone: string;
  adresse: string;
  dateCreation: string;
}

const ClientsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { clients, isLoading, refetch } = useClientSync();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    phone: '',
    adresse: ''
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000';

  const resetForm = () => {
    setFormData({ nom: '', phone: '', adresse: '' });
    setEditingClient(null);
  };

  const handleAddClient = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setFormData({
      nom: client.nom,
      phone: client.phone,
      adresse: client.adresse
    });
    setEditingClient(client);
    setIsAddDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom.trim() || !formData.phone.trim() || !formData.adresse.trim()) {
      toast({
        title: "Erreur",
        description: "Tous les champs sont obligatoires",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      
      if (editingClient) {
        await axios.put(`${API_BASE_URL}/api/clients/${editingClient.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast({
          title: "Succès",
          description: "Client mis à jour avec succès",
          className: "notification-success",
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/clients`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast({
          title: "Succès", 
          description: "Client ajouté avec succès",
          className: "notification-success",
        });
      }
      
      setIsAddDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = async (client: Client) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${client.nom} ?`)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/clients/${client.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast({
        title: "Succès",
        description: "Client supprimé avec succès", 
        className: "notification-success",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin mx-auto"></div>
            <Diamond className="w-10 h-10 text-purple-600 dark:text-purple-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="mt-6 text-gray-700 dark:text-gray-200 font-semibold text-lg">Chargement de votre portefeuille premium...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-950">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 dark:from-purple-800 dark:via-violet-800 dark:to-indigo-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <Crown className="w-12 h-12 text-yellow-300" />
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                Portefeuille <span className="text-yellow-300">Premium</span>
              </h1>
              <Star className="w-12 h-12 text-yellow-300 animate-pulse" />
            </div>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Gérez vos clients avec élégance et sophistication
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
                <span className="text-white font-semibold">{clients.length} Client{clients.length > 1 ? 's' : ''} VIP</span>
              </div>
              <Button 
                onClick={handleAddClient} 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-bold px-8 py-4 rounded-full shadow-2xl hover:shadow-yellow-500/25 transform hover:-translate-y-1 transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nouveau Client VIP
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Stats Cards */}
        {/*<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-2xl hover:shadow-emerald-500/25 transform hover:-translate-y-2 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-emerald-100" />
              <h3 className="text-3xl font-bold mb-2">{clients.length}</h3>
              <p className="text-emerald-100">Clients Premium</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-violet-600 text-white border-0 shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-2 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <Diamond className="w-12 h-12 mx-auto mb-4 text-purple-100" />
              <h3 className="text-3xl font-bold mb-2">VIP</h3>
              <p className="text-purple-100">Service Excellence</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-2xl hover:shadow-orange-500/25 transform hover:-translate-y-2 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <Crown className="w-12 h-12 mx-auto mb-4 text-orange-100" />
              <h3 className="text-3xl font-bold mb-2">Premium</h3>
              <p className="text-orange-100">Gestion Luxe</p>
            </CardContent>
          </Card>
        </div>*/}

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {clients.map((client, index) => (
            <Card 
              key={client.id} 
              className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm border-0 shadow-xl hover:shadow-purple-500/20 relative overflow-hidden"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Premium Badge */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                VIP
              </div>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <CardHeader className="pb-4 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                      {client.nom}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span className="inline-flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        Depuis le {new Date(client.dateCreation).toLocaleDateString('fr-FR')}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClient(client)}
                      className="h-9 w-9 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-full"
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClient(client)}
                      className="h-9 w-9 p-0 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 font-semibold">{client.phone}</span>
                  </div>
                  
                  <div className="flex items-start gap-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full shadow-lg mt-0.5">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 leading-relaxed line-clamp-2">{client.adresse}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {clients.length === 0 && (
          <div className="text-center py-20">
            <div className="relative inline-flex items-center justify-center w-40 h-40 bg-gradient-to-br from-purple-100 via-violet-100 to-indigo-100 dark:from-purple-900/20 dark:via-violet-900/20 dark:to-indigo-900/20 rounded-full mb-12 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-violet-400/20 rounded-full animate-pulse"></div>
              <Users className="w-20 h-20 text-purple-600 dark:text-purple-400 relative z-10" />
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-xl">
                <Crown className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Votre portefeuille premium vous attend</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              Commencez à construire votre réseau de clients VIP avec notre système de gestion premium
            </p>
            <Button 
              onClick={handleAddClient} 
              className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 text-white text-lg px-12 py-6 rounded-full shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-2 transition-all duration-300"
            >
              <Plus className="w-6 h-6 mr-3" />
              Créer votre premier client VIP
            </Button>
          </div>
        )}
      </div>

      <Footer />
      
      {/* Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {editingClient ? 'Modifier le client' : 'Nouveau client'}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              {editingClient ? 'Modifiez les informations du client.' : 'Ajoutez un nouveau client à votre portefeuille.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-6">
              <div className="space-y-2">
                <Label htmlFor="nom" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nom complet</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  placeholder="Nom et prénom"
                  className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Numéro de téléphone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Ex: 0692123456"
                  className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adresse" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Adresse</Label>
                <Input
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                  placeholder="Adresse complète"
                  className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <DialogFooter className="gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                disabled={isSubmitting}
                className="border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {isSubmitting ? 'Enregistrement...' : (editingClient ? 'Mettre à jour' : 'Ajouter')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsPage;
