
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Users, TrendingUp, Clock, Crown, Star, Sparkles } from 'lucide-react';
import DashboardCalendar from '@/components/DashboardCalendar';
import AppointmentForm from '@/components/AppointmentForm';
import AppointmentModal from '@/components/AppointmentModal';
import AppointmentStatsDisplay from '@/components/AppointmentStatsDisplay';
import { Appointment } from '@/services/AppointmentService';
import { toast } from 'sonner';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddAppointment = (date: Date, hour: string) => {
    setSelectedDate(date);
    setSelectedHour(hour);
    setShowAddModal(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowEditModal(true);
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
    setSelectedDate(null);
    setSelectedHour('');
    setRefreshKey(prev => prev + 1);
    toast.success('Rendez-vous ajouté avec succès');
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setSelectedAppointment(null);
    setRefreshKey(prev => prev + 1);
    toast.success('Rendez-vous modifié avec succès');
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setSelectedDate(null);
    setSelectedHour('');
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 mt-[80px]">
      {/* Background premium */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-28 h-28 premium-gradient rounded-3xl premium-shadow-xl mb-8 relative overflow-hidden floating-animation">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-3xl"></div>
            <Calendar className="w-14 h-14 text-white relative z-10" />
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center premium-shadow">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold luxury-text-gradient mb-4">
            Tableau de bord Premium
          </h1>
          <div className="flex items-center justify-center gap-3 max-w-2xl mx-auto">
            <Sparkles className="w-5 h-5 text-primary" />
            <p className="text-xl text-muted-foreground font-medium">
              Bienvenue {user?.nom} {user?.prenom}, gérez vos rendez-vous avec style
            </p>
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          </div>
        </div>

        {/* Stats Section */}
        <AppointmentStatsDisplay refreshTrigger={refreshKey} />

        {/* Calendar Section */}
        <div className="mb-12">
          <DashboardCalendar 
            key={refreshKey}
            onAddAppointment={handleAddAppointment}
            onEditAppointment={handleEditAppointment}
          />
        </div>

        {/* Modal d'ajout */}
        {showAddModal && (
          <AppointmentModal 
            isOpen={showAddModal}
            onClose={handleCloseAddModal}
            title="Ajouter un rendez-vous"
            mode="add"
            onSuccess={handleAddSuccess}
          >
            <AppointmentForm 
              onSuccess={handleAddSuccess}
              onCancel={handleCloseAddModal}
              defaultDate={selectedDate || undefined}
              defaultTime={selectedHour}
            />
          </AppointmentModal>
        )}

        {/* Modal de modification */}
        {showEditModal && selectedAppointment && (
          <AppointmentModal 
            isOpen={showEditModal}
            onClose={handleCloseEditModal}
            title="Modifier le rendez-vous"
            mode="edit"
            onSuccess={handleEditSuccess}
          >
            <AppointmentForm 
              appointment={selectedAppointment}
              onSuccess={handleEditSuccess}
              onCancel={handleCloseEditModal}
            />
          </AppointmentModal>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
