import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarOff, Plus, Trash2, Clock, CalendarDays, AlertTriangle, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import indisponibleApi, { Indisponibilite } from '@/services/api/indisponibleApi';

const IndisponibiliteSection: React.FC = () => {
  const { toast } = useToast();
  const [indisponibilites, setIndisponibilites] = useState<Indisponibilite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    heureDebut: '08:00',
    heureFin: '18:00',
    motif: '',
    journeeComplete: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await indisponibleApi.getAll();
      setIndisponibilites(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      setSaving(true);
      await indisponibleApi.create(form);
      toast({ title: '✅ Indisponibilité ajoutée', description: `Le ${form.date} a été marqué comme indisponible`, className: 'bg-green-600 text-white border-green-600' });
      setShowAddDialog(false);
      setForm({ date: new Date().toISOString().split('T')[0], heureDebut: '08:00', heureFin: '18:00', motif: '', journeeComplete: false });
      fetchData();
    } catch {
      toast({ title: 'Erreur', description: "Impossible d'ajouter l'indisponibilité", variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await indisponibleApi.delete(id);
      toast({ title: '✅ Supprimé', description: 'Indisponibilité supprimée', className: 'bg-green-600 text-white border-green-600' });
      setDeleteConfirmId(null);
      fetchData();
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de supprimer', variant: 'destructive' });
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Sort by date descending
  const sorted = [...indisponibilites].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <CalendarOff className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold text-foreground">Jours indisponibles / Congés</span>
        </div>
        <Button
          size="sm"
          onClick={() => setShowAddDialog(true)}
          className="rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-300/30 text-red-600 dark:text-red-400 hover:from-red-500/20 hover:to-orange-500/20 text-xs"
        >
          <Plus className="w-3 h-3 mr-1" /> Ajouter
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full" />
        </div>
      ) : sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">Aucun jour indisponible configuré</p>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {sorted.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between rounded-xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 border border-red-200/30 dark:border-red-800/20 p-3"
            >
              <div>
                <p className="text-sm font-semibold text-foreground capitalize">{formatDate(item.date)}</p>
                <p className="text-xs text-muted-foreground">
                  {item.journeeComplete ? '🔒 Journée complète' : `⏰ ${item.heureDebut} - ${item.heureFin}`}
                  {item.motif && ` • ${item.motif}`}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setDeleteConfirmId(item.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 p-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <CalendarOff className="w-5 h-5" /> Ajouter un jour indisponible
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Date *</Label>
              <Input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, journeeComplete: !form.journeeComplete })}
                className={`relative w-11 h-6 rounded-full transition-all duration-300 ${form.journeeComplete ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-muted'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${form.journeeComplete ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-sm text-foreground">Journée complète</span>
            </div>

            <AnimatePresence>
              {!form.journeeComplete && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 gap-3 overflow-hidden"
                >
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> De
                    </Label>
                    <Input
                      type="time"
                      value={form.heureDebut}
                      onChange={e => setForm({ ...form, heureDebut: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> À
                    </Label>
                    <Input
                      type="time"
                      value={form.heureFin}
                      onChange={e => setForm({ ...form, heureFin: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Motif (optionnel)</Label>
              <Input
                value={form.motif}
                onChange={e => setForm({ ...form, motif: e.target.value })}
                placeholder="Ex: Congé, Rendez-vous personnel..."
                className="rounded-xl"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)} className="rounded-xl">Annuler</Button>
            <Button
              onClick={handleAdd}
              disabled={!form.date || saving}
              className="rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600"
            >
              {saving ? 'Enregistrement...' : '✅ Confirmer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={v => { if (!v) setDeleteConfirmId(null); }}>
        <AlertDialogContent className="rounded-3xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" /> Supprimer ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous vraiment supprimer cette indisponibilité ? Le créneau redeviendra disponible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Annuler</AlertDialogCancel>
            <Button
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white"
            >
              Supprimer
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default IndisponibiliteSection;
