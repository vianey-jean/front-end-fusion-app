
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMessages } from '@/hooks/use-messages';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    expediteurNom: '',
    expediteurEmail: '',
    expediteurTelephone: '',
    sujet: '',
    contenu: '',
    destinataireId: '1' // ID de l'utilisateur par défaut (admin)
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { toast } = useToast();
  const { sendMessage } = useMessages();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.expediteurNom || !formData.expediteurEmail || !formData.sujet || !formData.contenu) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await sendMessage(formData);
      
      setIsSubmitted(true);
      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
      });

      // Reset form
      setFormData({
        expediteurNom: '',
        expediteurEmail: '',
        expediteurTelephone: '',
        sujet: '',
        contenu: '',
        destinataireId: '1'
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">Message envoyé !</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
            </p>
            <Button onClick={() => setIsSubmitted(false)} className="w-full">
              Envoyer un autre message
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Contactez-nous
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Une question ? Un besoin ? N'hésitez pas à nous contacter. Notre équipe vous répondra dans les plus brefs délais.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Formulaire de contact */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-purple-600" />
                Envoyez-nous un message
              </CardTitle>
              <CardDescription>
                Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expediteurNom">Nom complet *</Label>
                    <Input
                      id="expediteurNom"
                      name="expediteurNom"
                      value={formData.expediteurNom}
                      onChange={handleChange}
                      placeholder="Votre nom complet"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="expediteurEmail">Email *</Label>
                    <Input
                      id="expediteurEmail"
                      name="expediteurEmail"
                      type="email"
                      value={formData.expediteurEmail}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="expediteurTelephone">Téléphone</Label>
                  <Input
                    id="expediteurTelephone"
                    name="expediteurTelephone"
                    value={formData.expediteurTelephone}
                    onChange={handleChange}
                    placeholder="Votre numéro de téléphone"
                  />
                </div>

                <div>
                  <Label htmlFor="sujet">Sujet *</Label>
                  <Select onValueChange={(value) => handleSelectChange('sujet', value)} value={formData.sujet}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisissez un sujet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Demande d'information">Demande d'information</SelectItem>
                      <SelectItem value="Support technique">Support technique</SelectItem>
                      <SelectItem value="Partenariat">Partenariat</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="contenu">Message *</Label>
                  <Textarea
                    id="contenu"
                    name="contenu"
                    value={formData.contenu}
                    onChange={handleChange}
                    placeholder="Décrivez votre demande en détail..."
                    rows={5}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Envoi en cours...</>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Informations de contact */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nos coordonnées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-600">contact@gestionvente.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-sm text-gray-600">+262 692 XX XX XX</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Adresse</p>
                    <p className="text-sm text-gray-600">La Réunion, France</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Horaires d'ouverture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Lundi - Vendredi</span>
                    <span>8h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samedi</span>
                    <span>9h00 - 12h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimanche</span>
                    <span>Fermé</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
