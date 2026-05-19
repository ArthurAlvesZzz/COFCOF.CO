import React, { useState } from 'react';
import { AdminPopup } from '../../ui/AdminPopup';
import { operationService } from '../../../../services/operationService';
import { useAdminAuthStore } from '../../../../store/adminAuthStore';
import { Clock, Calendar, User, Zap, Coffee, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface TimeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function TimeEntryModal({ isOpen, onClose, onSave }: TimeEntryModalProps) {
  const { user } = useAdminAuthStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '17:00',
    breakMinutes: 60,
    activity: 'torra' as any,
    notes: ''
  });

  const calculateHours = () => {
    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    let diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    diff -= formData.breakMinutes / 60;
    return Math.max(0, diff);
  };

  const totalHours = calculateHours();

  const formatTimeStr = (decimalHours: number) => {
    const hrs = Math.floor(decimalHours);
    const mins = Math.round((decimalHours - hrs) * 60);
    if (mins === 0) return `${hrs}h`;
    return `${hrs}h${mins.toString().padStart(2, '0')}`;
  };

  const missingFields = [];
  if (!formData.date) missingFields.push('Data');
  if (!formData.startTime) missingFields.push('Entrada');
  if (!formData.endTime) missingFields.push('Saída');
  if (totalHours <= 0) missingFields.push('Horário válido');

  const canSave = missingFields.length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    setLoading(true);
    try {
      await operationService.registerTimeEntry({
        roasterId: user?.id || 'anonymous',
        roasterName: user?.name || 'Mestre',
        totalHours,
        ...formData
      } as any);
      
      toast.success("Horas lançadas com sucesso!");
      onSave();
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const activities = [
    { label: 'Torra', value: 'torra' },
    { label: 'Empacotamento', value: 'empacotamento' },
    { label: 'Separação', value: 'separacao' },
    { label: 'Limpeza', value: 'limpeza' },
    { label: 'Entrega', value: 'entrega' },
    { label: 'Outro', value: 'outro' },
  ];

  return (
    <AdminPopup 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Lançar Horas de Trabalho" 
      subtitle="Registre sua atividade para fechamento semanal"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6 py-2">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Data</label>
          <input 
            type="date" 
            value={formData.date}
            onChange={e => setFormData({...formData, date: e.target.value})}
            className="w-full bg-white border border-[#a3a3a3]/20 focus:border-[#c9a263]/50 focus:ring-2 focus:ring-[#c9a263]/20 rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Entrada</label>
              <input 
                type="time" 
                value={formData.startTime}
                onChange={e => setFormData({...formData, startTime: e.target.value})}
                className="w-full bg-white border border-[#a3a3a3]/20 focus:border-[#c9a263]/50 focus:ring-2 focus:ring-[#c9a263]/20 rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all"
              />
           </div>
           <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Saída</label>
              <input 
                type="time" 
                value={formData.endTime}
                onChange={e => setFormData({...formData, endTime: e.target.value})}
                className="w-full bg-white border border-[#a3a3a3]/20 focus:border-[#c9a263]/50 focus:ring-2 focus:ring-[#c9a263]/20 rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all"
              />
           </div>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Pausa (Minutos)</label>
          <input 
            type="number" 
            value={formData.breakMinutes}
            onChange={e => setFormData({...formData, breakMinutes: Number(e.target.value)})}
            className="w-full bg-white border border-[#a3a3a3]/20 focus:border-[#c9a263]/50 focus:ring-2 focus:ring-[#c9a263]/20 rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Tipo de Atividade</label>
          <div className="flex flex-wrap gap-2">
              {activities.map(a => (
               <button
                  key={a.value}
                  type="button"
                  onClick={() => setFormData({...formData, activity: a.value})}
                  className={`px-4 py-2.5 rounded-xl text-[9px] border font-bold uppercase tracking-widest transition-all ${formData.activity === a.value ? 'bg-[#111111] text-[#c9a263] border-[#111111] shadow-[0_0_15px_rgba(201,162,99,0.1)]' : 'bg-white border-[#a3a3a3]/20 text-[#a3a3a3] hover:border-[#a3a3a3]/50'}`}
               >
                  {a.label}
               </button>
             ))}
          </div>
        </div>

        <div className="bg-[#111111] p-6 rounded-[2rem] border border-[#a3a3a3]/10 flex items-center justify-between relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a263]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
           <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-[#1a1a1a] border border-[#c9a263]/20 rounded-2xl flex items-center justify-center text-[#c9a263] shadow-inner">
                 <Clock size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-[#a3a3a3] uppercase tracking-widest">Total Calculado</p>
                 <p className="text-xl font-serif text-white">{formatTimeStr(totalHours)}</p>
              </div>
           </div>
           <Zap size={24} className="text-[#c9a263]/30 relative z-10" />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Notas</label>
          <textarea 
            rows={2}
            value={formData.notes}
            onChange={e => setFormData({...formData, notes: e.target.value})}
            className="w-full bg-white border border-[#a3a3a3]/20 focus:border-[#c9a263]/50 focus:ring-2 focus:ring-[#c9a263]/20 transition-all outline-none resize-none placeholder:text-[#a3a3a3]/50 rounded-2xl px-5 py-4 text-sm font-bold"
            placeholder="Opcional..."
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#a3a3a3]/10 mt-6 pt-6">
           <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] hover:text-[#111111] transition-colors">Cancelar</button>
           <div className="relative group">
              <button 
                type="submit"
                disabled={!canSave || loading}
                className="bg-[#111111] border border-[#a3a3a3]/10 text-[#c9a263] px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/5 active:scale-95"
              >
                {loading ? 'Lançando...' : 'Lançar Horas'}
              </button>
              {!canSave && (
                 <div className="absolute bottom-full mb-2 right-0 w-max max-w-xs whitespace-normal bg-black text-white text-[10px] font-bold py-2 px-3 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                     Obrigatório: {missingFields.join(', ')}
                 </div>
              )}
           </div>
        </div>
      </form>
    </AdminPopup>
  );
}
