
import React from 'react';
import { format, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Appointment } from '@/services/AppointmentService';
import CalendarAppointment from './CalendarAppointment';
import { Plus, Crown, Star, Calendar } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface CalendarDayProps {
  day: Date;
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
  onDrop?: (appointment: Appointment, newDate: Date) => void;
  onDragStart?: (appointment: Appointment, e: React.DragEvent) => void;
  onCancelDrop?: () => void;
  onConfirmDrop?: (appointment: Appointment) => void;
  enableDragAndDrop?: boolean;
  onAddAppointment?: (date: Date) => void;
  onEditAppointment?: (appointment: Appointment) => void;
  onDeleteAppointment?: (appointment: Appointment) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  appointments,
  onAppointmentClick,
  onDrop,
  onDragStart,
  enableDragAndDrop = true,
  onAddAppointment,
  onEditAppointment,
  onDeleteAppointment
}) => {
  const isMobile = useIsMobile();
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const appointmentData = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (onDrop) {
        onDrop(appointmentData, day);
      }
    } catch (error) {
      console.error('Error parsing dropped data:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddAppointment) {
      onAddAppointment(day);
    }
  };

  return (
    <div
      className={`${
        isMobile 
          ? 'mb-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/20 p-4 group'
          : 'border-r border-primary/20 last:border-r-0 min-h-[400px] bg-gradient-to-b from-white/50 to-primary/5 group'
      } premium-hover transition-all duration-300 relative`}
      onDrop={enableDragAndDrop ? handleDrop : undefined}
      onDragOver={enableDragAndDrop ? handleDragOver : undefined}
    >
      {/* Header du jour */}
      <div className={`${
        isMobile 
          ? 'flex items-center justify-between mb-4 pb-3 border-b border-primary/20'
          : 'p-4 border-b border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`${
            isToday(day) 
              ? 'w-10 h-10 premium-gradient text-white' 
              : 'w-10 h-10 bg-white/60 text-primary border border-primary/30'
          } rounded-xl flex items-center justify-center font-bold text-lg premium-shadow`}>
            {format(day, 'd')}
          </div>
          <div>
            <div className={`font-bold text-lg ${
              isToday(day) ? 'luxury-text-gradient' : 'text-primary'
            }`}>
              {format(day, 'EEEE', { locale: fr })}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              {format(day, 'MMMM yyyy', { locale: fr })}
            </div>
          </div>
          {isToday(day) && (
            <div className="flex items-center gap-1 ml-2">
              <Crown className="w-4 h-4 text-primary" />
              <Star className="w-3 h-3 text-yellow-400" />
            </div>
          )}
        </div>
        
        {/* Bouton d'ajout + rouge - visible au hover */}
        <button
          onClick={handleAddClick}
          className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 premium-shadow hover:scale-110 opacity-0 group-hover:opacity-100"
          title="Ajouter un rendez-vous"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Liste des rendez-vous */}
      <div className={`${
        isMobile 
          ? 'space-y-3'
          : 'p-4 space-y-3 flex-1 overflow-y-auto premium-scroll'
      }`}>
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <CalendarAppointment
              key={appointment.id}
              appointment={appointment}
              onClick={onAppointmentClick}
              onDragStart={onDragStart}
              enableDragAndDrop={enableDragAndDrop}
              onEditAppointment={onEditAppointment}
              onDeleteAppointment={onDeleteAppointment}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">Aucun rendez-vous</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarDay;
