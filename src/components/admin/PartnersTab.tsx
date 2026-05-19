import React, { useState } from 'react';
import { AdminPageHeader } from './AdminPageHeader';
import { MapPin, Search, Edit, Trash2 } from 'lucide-react';
import { AdminPopup } from './ui/AdminPopup';
import toast from 'react-hot-toast';

interface Partner {
  id: string;
  name: string;
  type: string;
  city: string;
  contact: string;
  address: string;
  lat: number;
  lng: number;
  active: boolean;
}

export function PartnersTab() {
  const [partners, setPartners] = useState<Partner[]>([
    { id: '1', name: 'Café da Esquina', type: 'Cafeteria', city: 'São Paulo, SP', contact: '34998728882', address: 'Rua X, 123 - Centro', lat: -23.5505, lng: -46.6333, active: true },
    { id: '2', name: 'Supermercado Vida', type: 'Mercado', city: 'Campinas, SP', contact: '19988888888', address: 'Av Y, 456 - Cambuí', lat: -22.9099, lng: -47.0626, active: true },
  ]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partial<Partner> | null>(null);

  const handleOpenForm = (p?: Partner) => {
    if (p) setEditingPartner(p);
    else setEditingPartner({
      name: '', type: 'Cafeteria', city: '', contact: '', address: '', active: true, lat: 0, lng: 0
    });
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if(!editingPartner?.name) {
      toast.error('Nome é obrigatório');
      return;
    }

    if (editingPartner.id) {
      setPartners(partners.map(p => p.id === editingPartner.id ? { ...p, ...editingPartner } as Partner : p));
      toast.success('Parceiro atualizado!');
    } else {
      setPartners([{ ...editingPartner, id: Math.random().toString() } as Partner, ...partners]);
      toast.success('Parceiro criado e sincronizado com o mapa!');
    }
    setIsFormOpen(false);
  };

  const toggleActive = (id: string, current: boolean) => {
    setPartners(partners.map(p => p.id === id ? { ...p, active: !current } : p));
    toast.success(!current ? 'Parceiro agora aparece no mapa.' : 'Parceiro ocultado do mapa.');
  };

  return (
    <div className="pb-24">
       <AdminPageHeader
         title="Parceiros no Mapa"
         subtitle="Gerencie revendedores e cafeterias parceiras (Sincronizado publicamente)."
         action={{
           label: "Novo Parceiro",
           onClick: () => handleOpenForm()
         }}
       />

       <div className="bg-white border text-sm max-w-full overflow-x-auto border-gray-100 rounded-2xl shadow-sm">
         <table className="w-full text-left whitespace-nowrap min-w-[700px]">
           <thead className="bg-[#F6F1EB] border-b border-gray-200">
             <tr>
               <th className="px-6 py-4 font-medium text-[#2A160E]">Nome</th>
               <th className="px-6 py-4 font-medium text-[#2A160E]">Tipo</th>
               <th className="px-6 py-4 font-medium text-[#2A160E]">Cidade</th>
               <th className="px-6 py-4 font-medium text-[#2A160E]">Status</th>
               <th className="px-6 py-4 font-medium text-[#2A160E] text-right">Ações</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-gray-100">
             {partners.map(p => (
               <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                 <td className="px-6 py-4">
                    <div className="font-medium text-[#1C1A17]">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.contact}</div>
                 </td>
                 <td className="px-6 py-4">{p.type}</td>
                 <td className="px-6 py-4">
                   <div className="flex items-center gap-1 text-gray-600">
                     <MapPin size={14} /> {p.city}
                   </div>
                 </td>
                 <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleActive(p.id, p.active)}
                      className={`px-2 py-1 rounded text-xs font-bold uppercase ${p.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {p.active ? 'No Mapa' : 'Oculto'}
                    </button>
                 </td>
                 <td className="px-6 py-4 text-right">
                    <button onClick={() => handleOpenForm(p)} className="text-[#B06A32] font-bold text-xs hover:underline mr-4">Editar</button>
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
              <h2 className="text-xl sm:text-2xl font-serif text-[#1C1A17]">{editingPartner?.id ? "Editar Parceiro" : "Novo Parceiro"}</h2>
              <p className="text-sm text-gray-500 mt-1">Os dados ficarão disponíveis no mapa público de parceiros.</p>
            </div>
          }
          size="md"
          footer={
            <div className="flex justify-end gap-3 w-full">
              <button onClick={() => setIsFormOpen(false)} className="px-6 py-2 font-bold text-gray-500 hover:text-gray-700 transition-colors">Cancelar</button>
              <button onClick={handleSave} className="bg-[#1C1A17] text-white px-8 py-2 rounded-xl font-bold hover:bg-[#B06A32] transition-colors shadow-md">Salvar no Mapa</button>
            </div>
          }
       >
         <div className="space-y-5 animate-in fade-in py-2">
           <div>
             <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Nome do Estabelecimento *</label>
             <input className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#B06A32] focus:ring-1 focus:ring-[#B06A32] outline-none transition-colors" value={editingPartner?.name || ''} onChange={e => setEditingPartner({...editingPartner, name: e.target.value})} />
           </div>
           <div>
             <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Tipo</label>
             <select className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#B06A32] focus:ring-1 focus:ring-[#B06A32] outline-none transition-colors" value={editingPartner?.type || ''} onChange={e => setEditingPartner({...editingPartner, type: e.target.value})}>
               <option value="Cafeteria">Cafeteria</option>
               <option value="Mercado">Mercado/Empório</option>
               <option value="Restaurante">Restaurante</option>
               <option value="Outro">Outro</option>
             </select>
           </div>
           <div>
             <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Contato / WhatsApp</label>
             <input className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#B06A32] focus:ring-1 focus:ring-[#B06A32] outline-none transition-colors" value={editingPartner?.contact || ''} onChange={e => setEditingPartner({...editingPartner, contact: e.target.value})} />
           </div>
           <div>
             <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Endereço Completo</label>
             <input className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#B06A32] focus:ring-1 focus:ring-[#B06A32] outline-none transition-colors" value={editingPartner?.address || ''} onChange={e => setEditingPartner({...editingPartner, address: e.target.value})} />
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Cidade/UF</label>
               <input className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#B06A32] focus:ring-1 focus:ring-[#B06A32] outline-none transition-colors" value={editingPartner?.city || ''} onChange={e => setEditingPartner({...editingPartner, city: e.target.value})} />
             </div>
             <div>
               <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Localização Lat/Lng</label>
               <input className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#B06A32] focus:ring-1 focus:ring-[#B06A32] outline-none transition-colors" placeholder="-23.55, -46.63" />
             </div>
           </div>
         </div>
       </AdminPopup>
    </div>
  );
}
