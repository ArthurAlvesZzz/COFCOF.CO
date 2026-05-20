import React, { useState } from 'react';
import { AdminPageHeader } from './AdminPageHeader';
import { MapPin, Search, Edit, Trash2, ExternalLink, Plus, CheckCircle2, XCircle, Store } from 'lucide-react';
import { AdminPopup } from './ui/AdminPopup';
import toast from 'react-hot-toast';
import { Partner } from '../../types';
import { mockPartners } from '../../data/seed';

export function PartnersTab() {
  const [partners, setPartners] = useState<Partner[]>(mockPartners);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partial<Partner> | null>(null);

  const filteredPartners = partners.filter(p => 
    (p.publicName || p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category || p.type || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenForm = (p?: Partner) => {
    if (p) {
      setEditingPartner(p);
    } else {
      setEditingPartner({
        publicName: '', category: 'Cafeteria', city: '', state: 'SP', neighborhood: '', address: '', active: true, lat: 0, lng: 0, status: 'published', isPendingValidation: false
      });
    }
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if(!editingPartner?.publicName && !editingPartner?.name) {
      toast.error('Nome é obrigatório');
      return;
    }

    if (editingPartner.id) {
      setPartners(partners.map(p => p.id === editingPartner.id ? { ...p, ...editingPartner } as Partner : p));
      toast.success('Parceiro atualizado!');
    } else {
      const newId = Math.random().toString();
      const name = editingPartner.publicName || editingPartner.name || '';
      setPartners([{ ...editingPartner, id: newId, slug: name.toLowerCase().replace(/\s+/g, '-') } as Partner, ...partners]);
      toast.success('Parceiro criado!');
    }
    setIsFormOpen(false);
  };

  const toggleActive = (id: string, currentActive: boolean) => {
    setPartners(partners.map(p => p.id === id ? { ...p, active: !currentActive, status: !currentActive ? 'published' : 'inactive' } : p));
    toast.success(!currentActive ? 'Parceiro reativado.' : 'Parceiro desativado.');
  };

  return (
    <div className="pb-24">
       <AdminPageHeader
         title="Parceiros no Mapa"
         subtitle="Gerencie os parceiros e a rede CofCof exibidos na página Onde Encontrar."
         action={{
           label: "Novo Parceiro",
           onClick: () => handleOpenForm()
         }}
       />

       {/* Filters */}
       <div className="flex flex-col sm:flex-row gap-4 mb-6">
         <div className="relative flex-1 max-w-md">
           <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3a3a3]" />
           <input 
             type="text" 
             placeholder="Buscar por nome, cidade ou categoria..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full bg-[#111111] border border-[#a3a3a3]/20 pl-10 pr-4 py-2.5 rounded-xl text-white focus:outline-none focus:border-[#c9a263]/50 text-sm"
           />
         </div>
       </div>

       <div className="bg-[#111111] border text-sm max-w-full overflow-x-auto border-[#c9a263]/20 rounded-2xl shadow-xl">
         <table className="w-full text-left whitespace-nowrap min-w-[900px]">
           <thead className="bg-[#1a1a1a] border-b border-white/10">
             <tr>
               <th className="px-6 py-4 font-medium text-[#a3a3a3] uppercase tracking-widest text-[10px]">Nome</th>
               <th className="px-6 py-4 font-medium text-[#a3a3a3] uppercase tracking-widest text-[10px]">Categoria</th>
               <th className="px-6 py-4 font-medium text-[#a3a3a3] uppercase tracking-widest text-[10px]">Localização</th>
               <th className="px-6 py-4 font-medium text-[#a3a3a3] uppercase tracking-widest text-[10px]">Status</th>
               <th className="px-6 py-4 font-medium text-[#a3a3a3] uppercase tracking-widest text-[10px] text-right">Ações</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-white/5">
             {filteredPartners.map(p => (
               <tr key={p.id} className="hover:bg-[#1a1a1a] transition-colors">
                 <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       {p.coverImage ? (
                         <div className="w-10 h-10 rounded overflow-hidden shrink-0 bg-[#0a0a0a]">
                            <img src={p.coverImage} alt={p.publicName || p.name} className="w-full h-full object-cover" />
                         </div>
                       ) : (
                         <div className="w-10 h-10 rounded shrink-0 bg-[#1a1a1a] border border-white/10 flex items-center justify-center">
                            <Store size={18} className="text-[#a3a3a3]" />
                         </div>
                       )}
                       <div>
                         <div className="font-bold text-white flex items-center gap-2">
                           {p.publicName || p.name}
                           {p.featured && <span className="text-[#c9a263] text-[9px] uppercase tracking-widest bg-[#c9a263]/10 px-1.5 py-0.5 rounded border border-[#c9a263]/20">Destaque</span>}
                         </div>
                         <div className="text-[11px] text-[#a3a3a3] truncate max-w-[200px]">{p.shortDescription || 'Sem preview'}</div>
                       </div>
                    </div>
                 </td>
                 <td className="px-6 py-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] bg-[#0a0a0a] px-2 py-1 rounded border border-[#a3a3a3]/10">
                      {p.category || p.type}
                    </span>
                 </td>
                 <td className="px-6 py-4">
                   <div className="flex flex-col">
                     <span className="text-white text-sm flex items-center gap-1"><MapPin size={12} className="text-[#c9a263]" /> {p.city}, {p.state}</span>
                     <span className="text-[11px] text-[#a3a3a3]">{p.neighborhood}</span>
                   </div>
                 </td>
                 <td className="px-6 py-4">
                    {p.isPendingValidation ? (
                      <span className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                        Pendente
                      </span>
                    ) : p.active ? (
                      <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-500 border border-green-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                        <CheckCircle2 size={12} /> Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-500 border border-red-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                        <XCircle size={12} /> Inativo
                      </span>
                    )}
                 </td>
                 <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <a href={`/parceiros/${p.slug}`} target="_blank" rel="noreferrer" className="p-2 text-[#a3a3a3] hover:text-[#c9a263] transition-colors rounded-lg hover:bg-[#0a0a0a]" title="Ver Página Pública">
                         <ExternalLink size={16} />
                       </a>
                       <button onClick={() => toggleActive(p.id, !!p.active)} className="p-2 text-[#a3a3a3] hover:text-white transition-colors rounded-lg hover:bg-[#0a0a0a]" title={p.active ? 'Desativar' : 'Ativar'}>
                         {p.active ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                       </button>
                       <button onClick={() => handleOpenForm(p)} className="p-2 text-[#a3a3a3] hover:text-white transition-colors rounded-lg hover:bg-[#0a0a0a]" title="Editar">
                         <Edit size={16} />
                       </button>
                    </div>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>

       <AdminPopup
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title={
            <div>
              <h2 className="text-xl sm:text-2xl font-serif text-[#0a0a0a]">{editingPartner?.id ? "Editar Parceiro" : "Novo Parceiro"}</h2>
              <p className="text-sm text-gray-500 mt-1">Atualizar perfil e presença no mapa.</p>
            </div>
          }
          size="lg"
          footer={
            <div className="flex justify-end gap-3 w-full">
              <button onClick={() => setIsFormOpen(false)} className="px-6 py-2 font-bold text-gray-500 hover:text-gray-700 transition-colors">Cancelar</button>
              <button onClick={handleSave} className="bg-[#111111] text-white px-8 py-2 rounded-xl font-bold hover:bg-[#c9a263] hover:text-[#0a0a0a] transition-all shadow-md">Salvar Parceiro</button>
            </div>
          }
       >
         <div className="space-y-6 py-2 h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
           
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Nome Público *</label>
               <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#c9a263] focus:ring-1 focus:ring-[#c9a263] outline-none transition-colors text-black" value={editingPartner?.publicName || editingPartner?.name || ''} onChange={e => setEditingPartner({...editingPartner, publicName: e.target.value})} />
             </div>
             <div>
               <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Categoria *</label>
               <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#c9a263] focus:ring-1 focus:ring-[#c9a263] outline-none transition-colors text-black" value={editingPartner?.category || editingPartner?.type || ''} onChange={e => setEditingPartner({...editingPartner, category: e.target.value})}>
                 <option value="Cafeteria">Cafeteria</option>
                 <option value="Empório">Empório</option>
                 <option value="Restaurante">Restaurante</option>
                 <option value="Hotel">Hotel</option>
                 <option value="Padaria">Padaria</option>
                 <option value="Posto">Posto</option>
                 <option value="Conveniência">Conveniência</option>
                 <option value="Revenda">Revenda</option>
               </select>
             </div>
             <div className="col-span-2">
                 <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Sub Categoria / Tipo (Ex: Cafeteria e Torrefação)</label>
                 <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#c9a263] focus:ring-1 focus:ring-[#c9a263] outline-none transition-colors text-black" value={editingPartner?.type || ''} onChange={e => setEditingPartner({...editingPartner, type: e.target.value})} />
             </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
             <div className="col-span-2">
               <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Resumo Curto (Aparece no card flutuante do mapa)</label>
               <textarea rows={2} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#c9a263] focus:ring-1 focus:ring-[#c9a263] outline-none transition-colors text-black resize-none" value={editingPartner?.shortDescription || ''} onChange={e => setEditingPartner({...editingPartner, shortDescription: e.target.value})} maxLength={120} />
             </div>
             
             <div className="col-span-2">
               <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Descrição Longa (Aparece na página do parceiro)</label>
               <textarea rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#c9a263] focus:ring-1 focus:ring-[#c9a263] outline-none transition-colors text-black resize-none" value={editingPartner?.longDescription || ''} onChange={e => setEditingPartner({...editingPartner, longDescription: e.target.value})} />
             </div>
           </div>
           
           <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-bold text-[#0a0a0a] mb-4">Localização</h3>
              <div className="grid grid-cols-2 gap-4">
                 <div className="col-span-2">
                   <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Endereço Completo</label>
                   <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#c9a263] outline-none transition-colors text-black" value={editingPartner?.address || ''} onChange={e => setEditingPartner({...editingPartner, address: e.target.value})} />
                 </div>
                 <div>
                   <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Cidade</label>
                   <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#c9a263] outline-none transition-colors text-black" value={editingPartner?.city || ''} onChange={e => setEditingPartner({...editingPartner, city: e.target.value})} />
                 </div>
                 <div>
                   <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Bairro</label>
                   <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#c9a263] outline-none transition-colors text-black" value={editingPartner?.neighborhood || ''} onChange={e => setEditingPartner({...editingPartner, neighborhood: e.target.value})} />
                 </div>
                 <div>
                   <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Latitude</label>
                   <input type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#c9a263] outline-none transition-colors text-black" value={editingPartner?.lat || 0} onChange={e => setEditingPartner({...editingPartner, lat: parseFloat(e.target.value) || 0})} />
                 </div>
                 <div>
                   <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Longitude</label>
                   <input type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#c9a263] outline-none transition-colors text-black" value={editingPartner?.lng || 0} onChange={e => setEditingPartner({...editingPartner, lng: parseFloat(e.target.value) || 0})} />
                 </div>
              </div>
           </div>

           <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-bold text-[#0a0a0a] mb-4">Informações e Horários</h3>
              <div className="grid grid-cols-2 gap-4">
                 <div className="col-span-2">
                   <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Horário Simplificado</label>
                   <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#c9a263] outline-none transition-colors text-black" value={editingPartner?.openingHours || ''} onChange={e => setEditingPartner({...editingPartner, openingHours: e.target.value})} placeholder="Ex: Seg-Sex: 8h as 18h" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Instagram</label>
                   <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#c9a263] outline-none transition-colors text-black" value={editingPartner?.instagram || ''} onChange={e => setEditingPartner({...editingPartner, instagram: e.target.value})} placeholder="@nomedolocal" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">WhatsApp</label>
                   <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#c9a263] outline-none transition-colors text-black" value={editingPartner?.whatsapp || ''} onChange={e => setEditingPartner({...editingPartner, whatsapp: e.target.value})} placeholder="551199999999" />
                 </div>
              </div>
           </div>

           <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-bold text-[#0a0a0a] mb-4">Flags de Sistema</h3>
              
              <div className="flex flex-col gap-3 ml-2">
                <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={editingPartner?.featured || false} onChange={e => setEditingPartner({...editingPartner, featured: e.target.checked})} className="w-4 h-4 accent-[#c9a263]" />
                  <span>Destaque no Mapa (Pin Maior)</span>
                </label>
                <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={editingPartner?.isPendingValidation || false} onChange={e => setEditingPartner({...editingPartner, isPendingValidation: e.target.checked})} className="w-4 h-4 accent-[#c9a263]" />
                  <span className="text-yellow-600">Pendente de Validação (Ocultar do mapa público temporariamente)</span>
                </label>
                <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={editingPartner?.isOpen24h || false} onChange={e => setEditingPartner({...editingPartner, isOpen24h: e.target.checked})} className="w-4 h-4 accent-[#c9a263]" />
                  <span className="text-green-600">Aberto 24 horas</span>
                </label>
                <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={editingPartner?.isRoutePartner || false} onChange={e => setEditingPartner({...editingPartner, isRoutePartner: e.target.checked})} className="w-4 h-4 accent-[#c9a263]" />
                  <span>Faz parte da "Rota CofCof"</span>
                </label>
              </div>
           </div>

         </div>
       </AdminPopup>
    </div>
  );
}
