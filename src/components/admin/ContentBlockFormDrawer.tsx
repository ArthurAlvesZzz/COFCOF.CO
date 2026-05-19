import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Layout, 
  Settings, 
  Globe, 
  Eye, 
  PenTool, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  LayoutTemplate,
  Monitor,
  Hash,
  Type,
  FileSearch
} from 'lucide-react';
import { AdminPopup } from './ui/AdminPopup';
import { AdminFormSection } from './ui/AdminFormSection';
import { ContentBlock } from '../../types/admin';
import toast from 'react-hot-toast';

interface ContentBlockFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (status: 'draft' | 'published', data: Partial<ContentBlock>) => Promise<void>;
  block?: Partial<ContentBlock> | null;
}

export function ContentBlockFormDrawer({ isOpen, onClose, onSave, block }: ContentBlockFormDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState<Partial<ContentBlock>>({
    key: '',
    page: 'home',
    type: 'text_block',
    status: 'draft',
    active: true,
    title: '',
    subtitle: '',
    seo: {
      metaTitle: '',
      metaDescription: ''
    }
  });

  useEffect(() => {
    if (block) {
      setFormData({
        ...block,
        seo: block.seo || { metaTitle: '', metaDescription: '' }
      });
    } else {
      setFormData({
        key: '',
        page: 'home',
        type: 'text_block',
        status: 'draft',
        active: true,
        title: '',
        subtitle: '',
        seo: { metaTitle: '', metaDescription: '' }
      });
    }
    setHasChanges(false);
  }, [block, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setHasChanges(true);
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const setManualValue = (name: string, value: any) => {
    setHasChanges(true);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSeoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHasChanges(true);
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      seo: { ...prev.seo, [name]: value }
    }));
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!formData.key || !formData.type) {
      toast.error('Chave e tipo são obrigatórios.');
      return;
    }

    try {
      setLoading(true);
      await onSave(status, formData);
      toast.success(status === 'published' ? 'Conteúdo publicado!' : 'Rascunho salvo!');
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar o bloco');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPopup
      isOpen={isOpen}
      onClose={onClose}
      size="premium"
      title={block?.id ? "Editar Bloco de Conteúdo" : "Novo Bloco de Conteúdo"}
      subtitle="Gerencie textos, chamadas e metadados SEO das páginas do CofCof."
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
            <button onClick={onClose} className="text-gray-500 hover:text-red-600 transition-colors mr-4">
              Cancelar
            </button>
            <Clock size={14} />
            <span>Última edição: {block?.updatedAt ? new Date(block.updatedAt).toLocaleTimeString() : 'Agora'}</span>
            {hasChanges && <span className="flex items-center gap-1 text-amber-600 ml-4 font-bold"><AlertCircle size={14} /> Alterações não publicadas</span>}
          </div>
          <div className="flex gap-3">
             <button 
               onClick={() => handleSubmit('draft')} 
               disabled={loading}
               className="px-6 py-3 text-sm font-bold text-[#1C1A17] bg-white border border-gray-200 hover:border-[#1C1A17] rounded-2xl transition-all disabled:opacity-50"
             >
               Salvar Rascunho
             </button>
             <button 
               onClick={() => handleSubmit('published')} 
               disabled={loading}
               className="flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-[#1C1A17] hover:bg-[#B06A32] shadow-lg shadow-[#1C1A17]/10 rounded-2xl transition-all disabled:opacity-50 active:scale-95"
             >
               {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <PenTool size={18} />}
               {block?.id ? 'Salvar e Publicar' : 'Publicar Conteúdo'}
             </button>
          </div>
        </div>
      }
    >
      <div className="flex gap-8 relative pb-6">
        <div className="flex-1 min-w-0 space-y-4">
           <AdminFormSection 
             id="arquitetura" 
             title="Arquitetura & Chave" 
             icon={LayoutTemplate} 
             description="Onde este conteúdo aparece e como o sistema o identifica."
             defaultOpen={true}
           >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">ID Único (Chave)</label>
                    <div className="relative group">
                       <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                          <Hash size={16} />
                       </div>
                       <input 
                         name="key"
                         value={formData.key || ''}
                         onChange={(e) => setManualValue('key', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                         className="w-full pl-11 pr-4 py-3.5 border border-gray-100 bg-gray-50/10 rounded-xl focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-xs font-mono font-bold" 
                         placeholder="Ex: home_hero_title"
                         disabled={!!block?.id}
                       />
                    </div>
                    {!!block?.id && <p className="text-[10px] text-amber-600 mt-1 pl-1">Chaves de produção não podem ser alteradas.</p>}
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Página Relacionada</label>
                    <select 
                      name="page"
                      value={formData.page || 'home'}
                      onChange={handleChange}
                      className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm font-medium"
                    >
                      {['home', 'cafes', 'origem', 'empresas', 'parceiros', 'assinatura', 'checkout', 'global'].map(p => (
                        <option key={p} value={p}>{p.toUpperCase()}</option>
                      ))}
                    </select>
                 </div>

                 <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 block mb-3">Tipo de Visualização</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                       {[
                         { id: 'hero', label: 'Hero Principal', icon: Monitor },
                         { id: 'section', label: 'Seção de Corpo', icon: Layout },
                         { id: 'text_block', label: 'Bloco de Texto', icon: Type },
                         { id: 'map_copy', label: 'Mapa/Local', icon: Globe },
                         { id: 'seo', label: 'Metadados SEO', icon: FileSearch }
                       ].map(type => (
                         <button 
                           key={type.id}
                           type="button"
                           onClick={() => setManualValue('type', type.id)}
                           className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${formData.type === type.id ? 'bg-[#1C1A17] border-[#1C1A17] text-white shadow-md' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                         >
                            <type.icon size={18} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{type.label}</span>
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
           </AdminFormSection>

           {formData.type !== 'seo' ? (
             <AdminFormSection 
               id="editor" 
               title="Conteúdo Visual" 
               icon={PenTool} 
               description="O que será exibido para o consumidor final."
               defaultOpen={true}
             >
                <div className="space-y-5">
                   <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Título do Bloco</label>
                     <input 
                       name="title"
                       value={formData.title || ''}
                       onChange={handleChange}
                       className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm font-bold" 
                       placeholder="Título que aparece no site..."
                     />
                     <p className="text-[10.5px] text-gray-500 pl-1 mt-1 leading-snug">
                        <strong className="text-[#B06A32] font-semibold">Dica CRO:</strong> Este é o primeiro texto que o cliente vê. Deve explicar o diferencial e gerar desejo em até 2 linhas.
                     </p>
                   </div>
                   <div className="space-y-1.5 pt-2">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Subtítulo / Texto de Apoio</label>
                     <textarea 
                       name="subtitle"
                       value={formData.subtitle || ''}
                       onChange={handleChange}
                       rows={5}
                       className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-4 focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm leading-relaxed" 
                       placeholder="Desenvolva o conteúdo aqui..."
                     />
                     <p className="text-[10.5px] text-gray-500 pl-1 mt-1 leading-snug">
                        <strong className="text-[#B06A32] font-semibold">Dica CRO:</strong> Use palavras claras e evite blocos de texto muito grandes. Facilite a leitura rápida.
                     </p>
                   </div>
                   <div className="space-y-1.5 pt-4 border-t border-gray-100">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-2 block">CTA / Botão Principal</label>
                     <div className="flex flex-col sm:flex-row gap-3">
                       <input 
                         value={formData.ctas?.[0]?.label || ''}
                         onChange={(e) => {
                           setHasChanges(true);
                           const newCtas = [...(formData.ctas || [])];
                           if (!newCtas[0]) newCtas[0] = { label: '', url: '' };
                           newCtas[0].label = e.target.value;
                           setFormData(prev => ({ ...prev, ctas: newCtas }));
                         }}
                         className="flex-1 border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm font-bold" 
                         placeholder="Ex: Assinar Agora"
                       />
                       <input 
                         value={formData.ctas?.[0]?.url || ''}
                         onChange={(e) => {
                           setHasChanges(true);
                           const newCtas = [...(formData.ctas || [])];
                           if (!newCtas[0]) newCtas[0] = { label: '', url: '' };
                           newCtas[0].url = e.target.value;
                           setFormData(prev => ({ ...prev, ctas: newCtas }));
                         }}
                         className="flex-1 border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm text-gray-600" 
                         placeholder="Ex: /assinatura"
                       />
                     </div>
                     <p className="text-[10.5px] text-gray-500 pl-1 mt-2 leading-snug">
                        <strong className="text-[#B06A32] font-semibold">Dica CRO:</strong> Use ação direta e persuasiva no botão primário. Exemplo: "Comprar cafés premiados".
                     </p>
                   </div>
                </div>
             </AdminFormSection>
           ) : (
             <AdminFormSection 
               id="seo" 
               title="Otimização de Busca (SEO)" 
               icon={Globe} 
               description="Como este conteúdo aparece no Google e redes sociais."
               defaultOpen={true}
             >
                <div className="space-y-5">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Meta Title</label>
                      <input 
                        name="metaTitle"
                        value={formData.seo?.metaTitle || ''}
                        onChange={handleSeoChange}
                        className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm font-bold" 
                        placeholder="O título que aparece na aba do navegador"
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Meta Description</label>
                      <textarea 
                        name="metaDescription"
                        value={formData.seo?.metaDescription || ''}
                        onChange={handleSeoChange}
                        rows={4}
                        className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-4 focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm leading-relaxed" 
                        placeholder="Breve resumo para o Snippet do Google..."
                      />
                   </div>
                </div>
             </AdminFormSection>
           )}
        </div>

        <div className="hidden lg:block w-[300px] shrink-0 space-y-6">
           <div className="bg-white rounded-3xl border border-[#2A160E]/5 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                 <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Live Mockup</h4>
                 {formData.status === 'published' ? (
                   <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[8px] font-bold rounded uppercase">Publicado</span>
                 ) : (
                   <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[8px] font-bold rounded uppercase">Rascunho</span>
                 )}
              </div>

              <div className="space-y-3">
                 <div className="p-4 bg-[#FDFCFB] rounded-2xl border border-gray-50 min-h-[140px]">
                    <p className="text-[10px] font-bold text-[#B06A32] uppercase mb-1 tracking-wider">{formData.page}</p>
                    <h5 className="font-serif text-lg leading-tight mb-2 text-[#1C1A17]">{formData.title || 'Título em Branco'}</h5>
                    <p className="text-[10px] text-gray-400 line-clamp-3 leading-relaxed">{formData.subtitle || 'Corpo de texto não preenchido...'}</p>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Tipo de Bloco</span>
                    <span className="font-bold text-[#1C1A17] capitalize">{formData.type?.replace('_', ' ')}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Visibilidade</span>
                    <span className="font-bold text-green-600">Ativo</span>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                   <Settings size={14} /> Checklist
                </div>
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-xs">
                      {formData.title ? <CheckCircle2 size={14} className="text-green-600" /> : <div className="w-3.5 h-3.5 rounded border border-gray-200" />}
                      <span className={formData.title ? 'text-gray-900 font-medium' : 'text-gray-400'}>Título Presente</span>
                   </div>
                   <div className="flex items-center gap-2 text-xs">
                      {formData.subtitle && formData.subtitle.length > 10 ? <CheckCircle2 size={14} className="text-green-600" /> : <div className="w-3.5 h-3.5 rounded border border-gray-200" />}
                      <span className={formData.subtitle && formData.subtitle.length > 10 ? 'text-gray-900 font-medium' : 'text-gray-400'}>Corpo Sustentado</span>
                   </div>
                </div>
              </div>
           </div>

           <div className="p-6 bg-[#2A160E] rounded-3xl text-white shadow-xl">
             <div className="flex items-center gap-3 mb-4">
               <Eye size={18} className="text-[#B06A32]" />
               <h4 className="text-xs font-bold uppercase tracking-widest">Dica Editorial</h4>
             </div>
             <p className="text-xs opacity-70 leading-relaxed">
               Evite textos com mais de 300 caracteres para blocos de seção, isso garante que a leitura em dispositivos móveis seja fluida.
             </p>
           </div>
        </div>
      </div>
    </AdminPopup>
  );
}
