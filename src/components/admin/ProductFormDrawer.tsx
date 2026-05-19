import React, { useState, useEffect, useRef } from 'react';
import { ProductAdmin } from '../../types/admin';
import { 
  Image as ImageIcon, 
  FileText, 
  Settings, 
  ShieldCheck, 
  MapPin, 
  Tag, 
  PackageSearch, 
  PenTool, 
  Hash, 
  LayoutList, 
  Search, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Plus,
  Coffee,
  Globe,
  Monitor,
  Eye,
  Trash2,
  HelpCircle,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';
import { AdminPopup } from './ui/AdminPopup';
import { AdminFormSection } from './ui/AdminFormSection';

interface ProductFormDrawerProps {
  product: ProductAdmin | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ProductAdmin>) => void;
}

export function ProductFormDrawer({ product, isOpen, onClose, onSave }: ProductFormDrawerProps) {
  const [formData, setFormData] = useState<Partial<ProductAdmin>>({
    name: '',
    slug: '',
    category: 'Café',
    price: 0,
    promotionalPrice: 0,
    stock: 0,
    active: true,
    featured: false,
    format: 'Pacote 250g',
    origin: '',
    region: '',
    farm: '',
    producer: '',
    altitude: '',
    variety: '',
    process: '',
    hasTraceability: false,
    isAwardWinning: false,
    shortDescription: '',
    fullDescription: '',
    roast: 'Média',
    sensoryProfile: '',
    sensoryNotes: [],
    mainImage: '',
    gallery: [],
    score: 0,
    award: '',
    awardYear: '',
    idealFor: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        sensoryNotes: product.sensoryNotes || [],
        gallery: product.gallery || [],
        idealFor: product.idealFor || []
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        category: 'Café',
        price: 0,
        promotionalPrice: 0,
        stock: 0,
        active: true,
        featured: false,
        format: 'Pacote 250g',
        origin: '',
        region: '',
        farm: '',
        producer: '',
        altitude: '',
        variety: '',
        process: '',
        hasTraceability: false,
        isAwardWinning: false,
        shortDescription: '',
        fullDescription: '',
        roast: 'Média',
        sensoryProfile: '',
        sensoryNotes: [],
        mainImage: '',
        gallery: [],
        score: 0,
        award: '',
        awardYear: '',
        idealFor: []
      });
    }
    setHasChanges(false);
  }, [product, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setHasChanges(true);
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const setManualValue = (name: string, value: any) => {
    setHasChanges(true);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHasChanges(true);
    setFormData(prev => ({ 
      ...prev, 
      name: val,
      slug: product ? prev.slug : val.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
    }));
  };

  const getChecklist = () => [
    { label: 'Nome preenchido', status: !!formData.name, critical: true },
    { label: 'Slug válido', status: !!formData.slug, critical: true },
    { label: 'Preço definido', status: (formData.price || 0) > 0, critical: true },
    { label: 'Categoria escolhida', status: !!formData.category, critical: true },
    { label: 'Imagem principal', status: !!formData.mainImage, critical: false },
    { label: 'Descrição completa', status: (formData.fullDescription?.length || 0) > 20, critical: false },
    { label: 'Notas sensoriais', status: (formData.sensoryNotes?.length || 0) > 0, critical: false },
    { label: 'Origem/Região', status: !!formData.origin || !!formData.region, critical: false },
  ];

  const handleSubmit = async (publish: boolean = false) => {
    if (!formData.name) {
      toast.error('O nome do produto é obrigatório.');
      return;
    }

    if (publish) {
      const missing = getChecklist().filter(i => i.critical && !i.status);
      if (missing.length > 0) {
        toast.error(`Para publicar, você precisa: ${missing[0].label}`);
        return;
      }
    }

    setIsSaving(true);
    try {
      const payload = { 
        ...formData, 
        active: publish ? true : formData.active 
      };
      await onSave(payload);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao salvar as informações.');
    } finally {
      setIsSaving(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sections = [
    { id: 'essencial', title: 'Essencial', icon: FileText, desc: 'Identificação, categoria e descrições.' },
    { id: 'venda', title: 'Venda', icon: Tag, desc: 'Preços, descontos e visibilidade.' },
    { id: 'cafe', title: 'Café & Origem', icon: Coffee, desc: 'Torra, notas sensoriais e localidade.' },
    { id: 'prova', title: 'Prova & Rastreio', icon: ShieldCheck, desc: 'Lote, QR code e premiações.' },
    { id: 'midia', title: 'Mídia & Catálogo', icon: ImageIcon, desc: 'Imagem principal e galeria.' },
    { id: 'estoque-seo', title: 'Estoque & SEO', icon: LayoutList, desc: 'Controle, visibilidade e busca.' },
  ];

  const categories = ['Café', 'Kit', 'Cápsula', 'Sachê', 'B2B', 'Assinatura', 'Presente', 'Acessório'];
  const roasts = ['Clara', 'Média', 'Escura', 'Espresso', 'Filtro'];
  const formats = ['Grão', 'Moído', 'Sachê 200g', 'Pacote 250g', 'Pacote 500g', 'Pacote 1kg', 'Cápsula'];
  
  const addSensoryNote = (note: string) => {
    if (!formData.sensoryNotes?.includes(note)) {
      setManualValue('sensoryNotes', [...(formData.sensoryNotes || []), note]);
    }
  };

  const removeSensoryNote = (note: string) => {
    setManualValue('sensoryNotes', formData.sensoryNotes?.filter(n => n !== note));
  };

  const handleClose = () => {
    if (hasChanges) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  };

  return (
    <AdminPopup
      isOpen={isOpen}
      onClose={handleClose}
      size="premium"
      title={
        <div className="flex items-center gap-4">
          <span>{product ? 'Editar Produto' : 'Novo Produto'}</span>
          <div className="flex gap-2">
            {formData.active ? (
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">Ativo</span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider">Inativo</span>
            )}
            {formData.featured && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">Destaque</span>
            )}
          </div>
        </div>
      }
      subtitle="Cadastre, publique e controle como este item aparece no catálogo CofCof."
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-500 hover:text-red-600 transition-colors mr-4"
            >
              Cancelar
            </button>
            <Clock size={14} />
            <span>Última alteração: {product?.updatedAt ? new Date(product.updatedAt).toLocaleTimeString() : 'Não salvo'}</span>
            {hasChanges && <span className="flex items-center gap-1 text-amber-600 ml-4 font-bold flex items-center gap-1"><AlertCircle size={14} /> Alterações pendentes</span>}
          </div>
          
          <div className="flex gap-3">
             <button 
               type="button" 
               onClick={() => handleSubmit(false)} 
               disabled={isSaving}
               className="px-6 py-3 text-sm font-bold text-[#1C1A17] bg-white border border-gray-200 hover:border-[#1C1A17] rounded-2xl transition-all disabled:opacity-50"
             >
               Salvar Rascunho
             </button>
             <button 
               type="button" 
               onClick={() => handleSubmit(true)} 
               disabled={isSaving}
               className="flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-[#1C1A17] hover:bg-[#B06A32] shadow-lg shadow-[#1C1A17]/10 rounded-2xl transition-all disabled:opacity-50 active:scale-95"
             >
               {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <PenTool size={18} />}
               {product ? 'Salvar e Publicar' : 'Publicar Produto'}
             </button>
           </div>
        </div>
      }
    >
      <div className="flex gap-8 relative pb-10">
        {/* Main Column */}
        <div className="flex-1 min-w-0" ref={contentRef}>
          {/* Top Controls */}
          <div className="sticky top-[-24px] z-20 bg-[#FDFCFB]/90 backdrop-blur-md pb-4 mb-4 border-b border-gray-100 mt-[-24px] pt-6">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#B06A32] transition-colors">
                      <Search size={18} />
                   </div>
                   <input 
                     placeholder="Buscar campo dentro do produto..." 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#B06A32]/5 focus:border-[#B06A32] transition-all text-sm"
                   />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                   {sections.map(s => (
                     <button 
                        key={s.id} 
                        onClick={() => scrollToSection(s.id)}
                        className="px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:border-[#1C1A17] hover:text-[#1C1A17] transition-all whitespace-nowrap shadow-sm"
                     >
                       {s.title}
                     </button>
                   ))}
                </div>
             </div>
          </div>

          {/* Form Sections */}
          <div className="space-y-2">
            <AdminFormSection 
              id="essencial"
              title="Essencial" 
              icon={FileText} 
              description="Nome, categoria, slug e descrições do produto."
              defaultOpen={searchTerm.length > 0 || !product}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Nome do Produto</label>
                  <input required name="name" value={formData.name || ''} onChange={handleNameChange} className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:border-[#B06A32] focus:ring-4 focus:ring-[#B06A32]/5 transition-all text-sm font-medium" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Slug URL</label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                      <Globe size={14} />
                    </div>
                    <input name="slug" value={formData.slug || ''} onChange={handleChange} className="w-full pl-9 pr-4 py-3.5 border border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-xs font-mono" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Categoria</label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {categories.map(cat => (
                      <button 
                        key={cat} 
                        type="button"
                        onClick={() => setManualValue('category', cat)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${formData.category === cat ? 'bg-[#1C1A17] text-white' : 'bg-white border border-gray-100 text-gray-500 hover:border-gray-300'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Descrição Curta (Vitrine)</label>
                  <input name="shortDescription" value={formData.shortDescription || ''} onChange={handleChange} maxLength={120} className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Descrição Completa</label>
                   <textarea name="fullDescription" value={formData.fullDescription || ''} onChange={handleChange} rows={5} className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-4 focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm leading-relaxed" />
                </div>
              </div>
            </AdminFormSection>

            <AdminFormSection 
              id="venda"
              title="Venda" 
              icon={Tag} 
              description="Configurações financeiras e canais de venda."
              defaultOpen={searchTerm.length > 0}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Preço Principal</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">R$</div>
                      <input type="number" step="0.01" name="price" value={formData.price || 0} onChange={handleChange} className="w-full pl-10 pr-4 py-3.5 border border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm font-bold" />
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Preço Promocional</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">R$</div>
                      <input type="number" step="0.01" name="promotionalPrice" value={formData.promotionalPrice || 0} onChange={handleChange} className="w-full pl-10 pr-4 py-3.5 border border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white focus:outline-none focus:border-amber-400 transition-all text-sm font-bold text-amber-600" />
                    </div>
                 </div>
                 
                 <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <button 
                      type="button" 
                      onClick={() => setManualValue('active', !formData.active)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${formData.active ? 'bg-green-50 border-green-200 ring-2 ring-green-100' : 'bg-white border-gray-100 grayscale opacity-60'}`}
                    >
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-sm font-bold text-gray-900">Visível no Catálogo</span>
                        <span className="text-[10px] text-gray-500">Aparecer para clientes finais</span>
                      </div>
                      <div className={`w-10 h-5 rounded-full relative transition-colors ${formData.active ? 'bg-green-500' : 'bg-gray-200'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.active ? 'left-6' : 'left-1'}`} />
                      </div>
                    </button>

                    <button 
                      type="button" 
                      onClick={() => setManualValue('featured', !formData.featured)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${formData.featured ? 'bg-amber-50 border-amber-200 ring-2 ring-amber-100' : 'bg-white border-gray-100 grayscale opacity-60'}`}
                    >
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-sm font-bold text-gray-900">Destaque na Home</span>
                        <span className="text-[10px] text-gray-500">Vitrines principais do site</span>
                      </div>
                      <div className={`w-10 h-5 rounded-full relative transition-colors ${formData.featured ? 'bg-amber-500' : 'bg-gray-200'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.featured ? 'left-6' : 'left-1'}`} />
                      </div>
                    </button>
                 </div>
              </div>
            </AdminFormSection>

            <AdminFormSection 
              id="cafe"
              title="Café & Origem" 
              icon={Coffee} 
              description="Características do lote, perfil de torra e origem."
              defaultOpen={searchTerm.length > 0}
            >
              <div className="space-y-6">
                 <div>
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 block mb-3">Perfil de Torra</label>
                   <div className="grid grid-cols-5 gap-2">
                     {roasts.map(r => (
                       <button 
                         key={r}
                         type="button"
                         onClick={() => setManualValue('roast', r)}
                         className={`px-2 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${formData.roast === r ? 'bg-[#1C1A17] border-[#1C1A17] text-white shadow-md' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                       >
                         {r}
                       </button>
                     ))}
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-5">
                   <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Formato</label>
                     <select name="format" value={formData.format || ''} onChange={handleChange} className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm">
                       {formats.map(f => (
                         <option key={f} value={f}>{f}</option>
                       ))}
                     </select>
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Região de Origem</label>
                     <input name="origin" value={formData.origin || ''} onChange={handleChange} placeholder="Ex: Mogi das Cruzes" className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm" />
                   </div>
                 </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 block mb-3">Notas Sensoriais</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.sensoryNotes?.map(note => (
                      <span key={note} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F6F1EB] text-[#B06A32] rounded-full text-xs font-bold border border-[#B06A32]/10 capitalize">
                        {note}
                        <button type="button" onClick={() => removeSensoryNote(note)} className="hover:text-red-500 transition-colors">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                    <div className="relative">
                      <input 
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val) {
                              addSensoryNote(val);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                        placeholder="+ Adicionar nota" 
                        className="px-3 py-1.5 bg-gray-50 border border-dashed border-gray-300 rounded-full text-xs font-medium focus:outline-none focus:border-[#B06A32] focus:bg-white focus:border-solid transition-all min-w-[140px]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 opacity-60">
                    <span className="text-[10px] text-gray-400 font-bold uppercase mr-1 mt-1">Sugestões:</span>
                    {['Chocolate', 'Caramelo', 'Mel', 'Floral', 'Cítrico', 'Frutas Vermelhas', 'Castanhas', 'Avelã', 'Frutado'].map(suggestion => (
                      <button 
                        key={suggestion} 
                        type="button" 
                        onClick={() => addSensoryNote(suggestion)}
                        className="text-[10px] font-bold text-gray-400 hover:text-[#B06A32] transition-colors"
                      >
                        + {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-gray-50">
                   <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Variedade</label>
                     <input name="variety" value={formData.variety || ''} onChange={handleChange} placeholder="Ex: Catuaí Amarelo" className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Processo</label>
                     <input name="process" value={formData.process || ''} onChange={handleChange} placeholder="Ex: Natural" className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Altitude</label>
                     <input name="altitude" value={formData.altitude || ''} onChange={handleChange} placeholder="Ex: 1200m" className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Produtor / Fazenda</label>
                     <input name="farm" value={formData.farm || ''} onChange={handleChange} placeholder="Ex: Fazenda Santa Maria" className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm" />
                   </div>
                </div>
              </div>
            </AdminFormSection>

            <AdminFormSection 
              id="prova"
              title="Prova & Rastreabilidade" 
              icon={ShieldCheck} 
              description="Premiações, notas SCA e códigos de rastreio."
              defaultOpen={searchTerm.length > 0}
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div className={`p-5 rounded-2xl border transition-all cursor-pointer ${formData.isAwardWinning ? 'bg-amber-50 border-amber-200 ring-2 ring-amber-100' : 'bg-white border-gray-100 opacity-60'}`} onClick={() => setManualValue('isAwardWinning', !formData.isAwardWinning)}>
                      <div className="flex items-center gap-4 mb-2">
                        <div className={`p-2 rounded-lg ${formData.isAwardWinning ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-400'}`}>
                          <ShieldCheck size={20} />
                        </div>
                        <span className="text-sm font-bold text-gray-900">Lote Premiado</span>
                      </div>
                      <p className="text-[10px] text-gray-500">Exibir selo de premiação no catálogo público.</p>
                   </div>

                   <div className={`p-5 rounded-2xl border transition-all cursor-pointer ${formData.hasTraceability ? 'bg-[#1C1A17] border-[#1C1A17] ring-4 ring-[#1C1A17]/10' : 'bg-white border-gray-100 opacity-60'}`} onClick={() => setManualValue('hasTraceability', !formData.hasTraceability)}>
                      <div className="flex items-center gap-4 mb-2">
                        <div className={`p-2 rounded-lg ${formData.hasTraceability ? 'bg-white/10 text-white font-bold' : 'bg-gray-100 text-gray-400'}`}>
                          <Hash size={20} />
                        </div>
                        <span className={`text-sm font-bold ${formData.hasTraceability ? 'text-white' : 'text-gray-900'}`}>Rastreabilidade ATIVA</span>
                      </div>
                      <p className={`text-[10px] ${formData.hasTraceability ? 'text-white/60' : 'text-gray-500'}`}>Página de rastreio própria do lote.</p>
                   </div>
                </div>

                <AnimatePresence>
                  {formData.isAwardWinning && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4 overflow-hidden"
                    >
                       <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Pontuação SCA</label>
                         <input type="number" step="0.1" name="score" value={formData.score || ''} onChange={handleChange} className="w-full border border-amber-100 bg-amber-50/30 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:border-amber-400 transition-all text-sm font-bold" />
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Ano</label>
                         <input name="awardYear" value={formData.awardYear || ''} onChange={handleChange} className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm" />
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Premiação</label>
                         <input name="award" value={formData.award || ''} onChange={handleChange} placeholder="Ex: Cup of Excellence" className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm" />
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {formData.hasTraceability && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-4 pt-4 overflow-hidden"
                    >
                       <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">URL da Página de Rastreio</label>
                         <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                               < Globe size={18} />
                            </div>
                            <input name="traceabilityUrl" value={formData.traceabilityUrl || ''} onChange={handleChange} placeholder="https://cofcof.co/rastreio/XXXX" className="w-full pl-11 pr-4 py-3.5 border border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm" />
                         </div>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </AdminFormSection>

            <AdminFormSection 
              id="midia"
              title="Mídia & Catálogo" 
              icon={ImageIcon} 
              description="Imagens principais e secundárias do produto."
              defaultOpen={searchTerm.length > 0}
            >
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                   <div className="w-full md:w-48 shrink-0">
                      <div className="aspect-square w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl overflow-hidden flex flex-col items-center justify-center group hover:border-[#B06A32] hover:bg-white transition-all relative">
                         {formData.mainImage ? (
                           <>
                             <img src={formData.mainImage} alt="Preview" className="w-full h-full object-cover" />
                             <button 
                               onClick={() => setManualValue('mainImage', '')}
                               className="absolute top-2 right-2 p-1 bg-white/80 backdrop-blur rounded-lg shadow-sm text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                             >
                               <Trash2 size={14} />
                             </button>
                           </>
                         ) : (
                           <div className="text-gray-400 flex flex-col items-center gap-2">
                              <ImageIcon size={32} strokeWidth={1} />
                              <span className="text-[10px] font-bold uppercase tracking-widest text-center px-4">Img Principal</span>
                           </div>
                         )}
                      </div>
                   </div>
                   <div className="flex-1 space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">URL da Imagem Principal</label>
                        <input name="mainImage" value={formData.mainImage || ''} onChange={handleChange} placeholder="https://..." className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm" />
                      </div>
                   </div>
                </div>
              </div>
            </AdminFormSection>

            <AdminFormSection 
              id="estoque-seo"
              title="Estoque & SEO" 
              icon={LayoutList} 
              description="Controle de estoque, visibilidade em busca e metadatos."
              defaultOpen={searchTerm.length > 0}
            >
              <div className="space-y-6">
                <div className="bg-[#FDFCFB] p-5 rounded-2xl border border-gray-100">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#1C1A17] text-white rounded-lg">
                        <PackageSearch size={18} />
                      </div>
                      <span className="text-sm font-bold text-[#1C1A17]">Estoque em Tempo Real</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unidades</label>
                       <input type="number" min="0" name="stock" value={formData.stock || 0} onChange={handleChange} className="w-full border border-gray-100 bg-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#B06A32] text-sm font-bold" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status Automático</label>
                       <div className={`px-4 py-3 rounded-xl border text-sm font-bold flex items-center gap-2 ${formData.stock && formData.stock > 10 ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                         <CheckCircle2 size={16} />
                         {formData.stock && formData.stock > 10 ? 'Em Estoque' : 'Baixo / Esgotando'}
                       </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-50">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Título de Pesquisa (SEO)</label>
                    <input placeholder={formData.name || "Título otimizado para Google"} className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Snippet SEO</label>
                    <textarea rows={2} placeholder="Breve descrição que aparecerá nos resultados de busca..." className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:border-[#B06A32] transition-all text-sm leading-relaxed" />
                  </div>
                </div>
              </div>
            </AdminFormSection>
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block w-[320px] shrink-0 sticky top-0 h-fit space-y-6">
          {/* Card Preview */}
          <div className="bg-white rounded-3xl border border-[#2A160E]/10 overflow-hidden shadow-xl shadow-[#1C1A17]/5">
            <div className="bg-[#1C1A17] px-6 py-4 flex items-center justify-between">
               <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Live Preview</span>
               <div className="flex gap-1">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                 <Monitor size={14} className="text-white/40" />
               </div>
            </div>
            
            <div className="p-1">
               <div className="bg-[#F6F1EB] rounded-2xl overflow-hidden relative group">
                  <div className="aspect-[4/5] relative">
                    {formData.mainImage ? (
                      <img src={formData.mainImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-300 gap-2">
                        <ImageIcon size={40} strokeWidth={1} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Sem Imagem</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {formData.featured && <span className="px-3 py-1 bg-white text-[#B06A32] text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">Destaque</span>}
                      {formData.isAwardWinning && <span className="px-3 py-1 bg-[#C89B5A] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">Lote Especial</span>}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-[10px] font-bold text-[#B06A32] uppercase tracking-[0.1em] mb-1">{formData.category}</p>
                    <h4 className="font-serif text-xl text-[#1C1A17] mb-2 leading-tight">{formData.name || 'Nome do Produto'}</h4>
                    
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {formData.roast && <span className="px-2 py-1 bg-white border border-[#2A160E]/5 text-[9px] font-bold text-gray-500 uppercase rounded-md">{formData.roast}</span>}
                      {formData.sensoryNotes?.slice(0, 2).map(n => <span key={n} className="px-2 py-1 bg-white border border-[#2A160E]/5 text-[9px] font-bold text-gray-500 uppercase rounded-md">{n}</span>)}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-[#1C1A17]/5">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">A partir de</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold text-[#1C1A17]">R$ {formData.price || 0}</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-[#1C1A17] rounded-xl flex items-center justify-center text-white">
                        <Plus size={20} />
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Checklist Card */}
          <div className="bg-white rounded-3xl border border-[#2A160E]/5 p-6 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <h4 className="text-xs font-bold text-[#1C1A17] uppercase tracking-[0.15em]">Checklist de Saúde</h4>
                <ShieldCheck size={18} className="text-[#1C1A17]/40" />
             </div>
             
             <div className="space-y-4">
               {getChecklist().map((item, idx) => (
                 <div key={idx} className="flex items-center gap-3 group">
                   <div className={`p-1 rounded-lg transition-colors ${item.status ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-300'}`}>
                     {item.status ? <CheckCircle2 size={16} /> : item.critical ? <AlertCircle size={16} className="text-amber-300" /> : <div className="w-4 h-4" />}
                   </div>
                   <span className={`text-xs font-medium transition-colors ${item.status ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
                     {item.label}
                   </span>
                 </div>
               ))}
             </div>
             
             <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Saúde do Produto</span>
                   <span className="text-xs font-bold text-[#C89B5A]">{Math.round((getChecklist().filter(i => i.status).length / getChecklist().length) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-[#C89B5A] transition-all duration-500" 
                     style={{ width: `${(getChecklist().filter(i => i.status).length / getChecklist().length) * 100}%` }}
                   />
                </div>
                {!getChecklist().filter(i => i.critical && !i.status).length && (
                  <p className="mt-3 text-[10px] text-green-600 font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Critérios mínimos atendidos.
                  </p>
                )}
             </div>
          </div>

          <div className="p-6 bg-[#2A160E] rounded-3xl text-white shadow-xl">
             <h4 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-100">Dicas Pró</h4>
             <div className="space-y-4">
                <div className="flex gap-3 text-xs opacity-70 hover:opacity-100 transition-opacity cursor-help">
                   <HelpCircle size={16} className="shrink-0" />
                   <p>Fotos com fundo neutro aumentam em 40% a conversão no catálogo.</p>
                </div>
                <div className="flex gap-3 text-xs opacity-70 hover:opacity-100 transition-opacity cursor-help">
                   <Eye size={16} className="shrink-0" />
                   <p>Produtos com "Destaque" aparecem no topo da página inicial.</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Confirm Close Overlay */}
      <AnimatePresence>
        {showConfirmClose && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#1C1A17]/80 backdrop-blur-sm" 
              onClick={() => setShowConfirmClose(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h4 className="text-xl font-bold text-[#1C1A17] mb-2">Descartar alterações?</h4>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">Você possui alterações não salvas. Se sair agora, todo o progresso será perdido.</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={onClose}
                  className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all border-b-4 border-red-800"
                >
                  Sair sem salvar
                </button>
                <button 
                  onClick={() => setShowConfirmClose(false)}
                  className="w-full py-4 bg-white text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-all"
                >
                  Continuar editando
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminPopup>
  );
}
