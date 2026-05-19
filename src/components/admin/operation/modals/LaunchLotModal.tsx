import React, { useState, useEffect } from 'react';
import { AdminPopup } from '../../ui/AdminPopup';
import { operationService } from '../../../../services/operationService';
import { useAdminAuthStore } from '../../../../store/adminAuthStore';
import { Target, DollarSign, MapPin, Search, Globe, ChevronRight, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface LaunchLotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function LaunchLotModal({ isOpen, onClose, onSave }: LaunchLotModalProps) {
  const { user } = useAdminAuthStore();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // FormData State
  const [formData, setFormData] = useState({
    name: '',
    code: `COF-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    status: 'active',
    harvest: `${new Date().getFullYear()}/${new Date().getFullYear()+1}`,
    country: 'Brasil',
    state: 'Minas Gerais',
    region: 'Cerrado Mineiro',
    city: '',
    farm: '',
    producer: '',
    altitude: '',
    score: 0,
    scoreScale: 'SCA',
    sensoryNotes: '', 
    totalPaid: 0,
    purchasedKg: 0,
    freightCost: 0,
    taxes: 0,
    traceabilityCode: '',
    story: '',
    publicVisible: false,
  });

  const costPerKg = formData.purchasedKg > 0 ? formData.totalPaid / formData.purchasedKg : 0;
  const finalTotalCost = formData.totalPaid + formData.freightCost + formData.taxes;
  const finalCostPerKg = formData.purchasedKg > 0 ? finalTotalCost / formData.purchasedKg : 0;

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        code: `COF-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        name: '', purchasedKg: 0, totalPaid: 0
      }));
      setCurrentStep(1);
    }
  }, [isOpen]);

  // Step Validations
  const getStepValidation = (step: number) => {
    switch (step) {
      case 1:
        const missing1 = [];
        if (!formData.name) missing1.push('Nome do lote');
        if (!formData.code) missing1.push('Código interno');
        if (!formData.producer && !formData.farm) missing1.push('Identificação de origem (Produtor ou Fazenda)');
        return { isValid: missing1.length === 0, missing: missing1 };
      case 2:
        const missing2 = [];
        if (formData.purchasedKg <= 0) missing2.push('Kg comprados');
        if (formData.totalPaid <= 0) missing2.push('Valor pago');
        return { isValid: missing2.length === 0, missing: missing2 };
      default:
        return { isValid: true, missing: [] };
    }
  };

  const handleNextStep = () => {
    const validation = getStepValidation(currentStep);
    if (!validation.isValid) {
      toast.error(`Para avançar, preencha: ${validation.missing.join(', ')}`);
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const missingFields = [
      ...getStepValidation(1).missing,
      ...getStepValidation(2).missing
  ];
  
  const canSave = missingFields.length === 0;

  const handleSubmit = async () => {
    if (!canSave) return;
    setLoading(true);
    try {
      const lotPayload = {
        name: formData.name,
        code: formData.code,
        status: formData.status as any,
        harvest: formData.harvest,
        tags: [],
        origin: {
          country: formData.country,
          state: formData.state,
          region: formData.region,
          city: formData.city,
          farm: formData.farm,
          producer: formData.producer,
          altitude: formData.altitude,
        },
        quality: {
          score: formData.score,
          scoreScale: formData.scoreScale as any,
          isSpecialty: true,
          sensoryNotes: formData.sensoryNotes ? formData.sensoryNotes.split(',').map(s => s.trim()) : [],
        },
        purchase: {
          totalPaid: formData.totalPaid,
          currency: "BRL" as any,
          purchasedKg: formData.purchasedKg,
          costPerKg, freightCost: formData.freightCost, taxes: formData.taxes, finalTotalCost, finalCostPerKg,
          purchaseDate: new Date().toISOString()
        },
        stock: {
          purchasedKg: formData.purchasedKg, availableKg: formData.purchasedKg,
          reservedKg: 0, usedKg: 0, lowStockThresholdKg: 10,
        },
        traceability: {
          code: formData.traceabilityCode, story: formData.story, publicVisible: formData.publicVisible
        },
        notes: [],
      };

      await operationService.launchNewLot(lotPayload, user?.id || 'admin', user?.email || 'admin@admin.com');
      toast.success('Lote lançado com sucesso!');
      onSave();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao lançar lote');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: 'Identificação e Produtor', icon: MapPin },
    { id: 2, title: 'Compra e Custos', icon: DollarSign },
    { id: 3, title: 'Qualidade Sensorial', icon: Search },
    { id: 4, title: 'Rastreabilidade', icon: Globe },
    { id: 5, title: 'Revisão Final', icon: CheckCircle2 }
  ];

  return (
    <AdminPopup 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Lançar Novo Lote" 
      subtitle="Cadastro operacional e ficha de rastreabilidade"
      size="operation"
    >
      <div className="flex flex-col lg:flex-row gap-0 xl:gap-8 bg-[#0a0a0a] min-h-[500px]">
         
         {/* Área Principal - Formulário Único Scrollável */}
         <div className="flex-1 flex flex-col p-4 sm:p-6 xl:pr-0 overflow-y-auto max-h-[75vh] hide-scrollbar">
            
            <div className="space-y-6">
                
                {/* 1. Origem e Identificação */}
                <div className="bg-[#111111] p-6 rounded-[24px] border border-[#a3a3a3]/10">
                    <div className="flex items-center gap-3 mb-6 border-b border-[#a3a3a3]/10 pb-4">
                        <MapPin size={20} className="text-[#c9a263]" />
                        <h2 className="text-lg font-serif text-white">Identificação e Origem</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Nome Comercial do Lote *</label>
                            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#a3a3a3]/10 focus:border-[#c9a263]/50 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#c9a263]/10 outline-none transition-all placeholder:text-[#a3a3a3]/40" placeholder="Ex: Lote 87 - Frutas Vermelhas" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Código Interno *</label>
                            <input type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#a3a3a3]/10 focus:border-[#c9a263]/50 rounded-xl px-4 py-3 text-sm text-[#c9a263] font-mono focus:ring-2 focus:ring-[#c9a263]/10 outline-none uppercase transition-all" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Safra</label>
                            <input type="text" value={formData.harvest} onChange={e => setFormData({...formData, harvest: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#a3a3a3]/10 focus:border-[#c9a263]/50 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#c9a263]/10 outline-none transition-all" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Produtor</label>
                            <input type="text" value={formData.producer} onChange={e => setFormData({...formData, producer: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#a3a3a3]/10 focus:border-[#c9a263]/50 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#c9a263]/10 outline-none transition-all" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Fazenda / Terroir</label>
                            <input type="text" value={formData.farm} onChange={e => setFormData({...formData, farm: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#a3a3a3]/10 focus:border-[#c9a263]/50 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#c9a263]/10 outline-none transition-all" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Região</label>
                            <input type="text" value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#a3a3a3]/10 focus:border-[#c9a263]/50 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#c9a263]/10 outline-none transition-all" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Altitude (m)</label>
                            <input type="number" value={formData.altitude} onChange={e => setFormData({...formData, altitude: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#a3a3a3]/10 focus:border-[#c9a263]/50 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#c9a263]/10 outline-none transition-all placeholder:text-[#a3a3a3]/40" placeholder="Ex: 1100" />
                        </div>
                    </div>
                </div>

                {/* 2. Compra e Custos */}
                <div className="bg-[#111111] p-6 rounded-[24px] border border-[#a3a3a3]/10">
                    <div className="flex items-center gap-3 mb-6 border-b border-[#a3a3a3]/10 pb-4">
                        <DollarSign size={20} className="text-[#c9a263]" />
                        <h2 className="text-lg font-serif text-white">Compra e Custos</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Qtd Comprada (Kg) *</label>
                            <input type="number" min="0" value={formData.purchasedKg || ''} onChange={e => setFormData({...formData, purchasedKg: Number(e.target.value)})} className="w-full bg-[#1a1a1a] border border-[#a3a3a3]/10 focus:border-[#c9a263]/50 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#c9a263]/10 outline-none transition-all" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Valor Total Pago (R$) *</label>
                            <input type="number" min="0" value={formData.totalPaid || ''} onChange={e => setFormData({...formData, totalPaid: Number(e.target.value)})} className="w-full bg-[#1a1a1a] border border-[#a3a3a3]/10 focus:border-[#c9a263]/50 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#c9a263]/10 outline-none transition-all" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Frete (R$)</label>
                            <input type="number" min="0" value={formData.freightCost || ''} onChange={e => setFormData({...formData, freightCost: Number(e.target.value)})} className="w-full bg-[#1a1a1a] border border-[#a3a3a3]/10 focus:border-[#c9a263]/50 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#c9a263]/10 outline-none transition-all" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Taxas Extras (R$)</label>
                            <input type="number" min="0" value={formData.taxes || ''} onChange={e => setFormData({...formData, taxes: Number(e.target.value)})} className="w-full bg-[#1a1a1a] border border-[#a3a3a3]/10 focus:border-[#c9a263]/50 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#c9a263]/10 outline-none transition-all" />
                        </div>
                    </div>
                </div>

                {/* 3. Qualidade Sensorial */}
                <div className="bg-[#111111] p-6 rounded-[24px] border border-[#a3a3a3]/10">
                    <div className="flex items-center justify-between mb-6 border-b border-[#a3a3a3]/10 pb-4">
                        <div className="flex items-center gap-3">
                            <Search size={20} className="text-[#c9a263]" />
                            <h2 className="text-lg font-serif text-white">Qualidade Sensorial</h2>
                        </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#c9a263]/20 flex flex-col items-center justify-center relative overflow-hidden shrink-0 w-full md:w-auto">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-[#c9a263]/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block relative z-10">Score SCA</label>
                            <input type="number" step="0.25" value={formData.score === 0 ? '' : formData.score} onChange={e => setFormData({...formData, score: Number(e.target.value)})} className="w-32 bg-transparent border-b-2 border-[#c9a263]/50 focus:border-[#c9a263] px-2 py-2 text-3xl text-center font-serif text-[#c9a263] outline-none transition-all relative z-10" placeholder="00.0" />
                        </div>

                        <div className="flex-1 w-full">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Notas Sensoriais</label>
                            <input type="text" value={formData.sensoryNotes} onChange={e => setFormData({...formData, sensoryNotes: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#a3a3a3]/10 focus:border-[#c9a263]/50 rounded-xl px-4 py-4 text-sm text-white focus:ring-2 focus:ring-[#c9a263]/10 outline-none transition-all placeholder:text-[#a3a3a3]/40" placeholder="Chocolate, Caramelo..." />
                            <p className="text-[9px] text-[#a3a3a3] mt-2">Separe por vírgulas.</p>
                        </div>
                    </div>
                </div>

                {/* 4. Rastreabilidade */}
                <div className="bg-[#111111] p-6 rounded-[24px] border border-[#a3a3a3]/10">
                    <div className="flex items-center gap-3 mb-6 border-b border-[#a3a3a3]/10 pb-4">
                        <Globe size={20} className="text-[#c9a263]" />
                        <h2 className="text-lg font-serif text-white">Rastreabilidade Visual</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-2 block">Por que escolhemos este café?</label>
                            <textarea rows={3} value={formData.story} onChange={e => setFormData({...formData, story: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#a3a3a3]/10 focus:border-[#c9a263]/50 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#c9a263]/10 outline-none resize-none transition-all placeholder:text-[#a3a3a3]/40" placeholder="Conte a história por trás deste lote..."></textarea>
                        </div>
                        <label className="flex items-center gap-3 p-4 bg-[#1a1a1a] border border-[#a3a3a3]/10 hover:border-[#c9a263]/30 rounded-xl cursor-pointer transition-colors group w-max">
                            <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-colors ${formData.publicVisible ? 'bg-[#c9a263] border-[#c9a263] text-[#0a0a0a]' : 'bg-[#111111] border-[#a3a3a3]/30 group-hover:border-[#c9a263]/50'}`}>
                                {formData.publicVisible && <CheckCircle2 size={14} />}
                            </div>
                            <input type="checkbox" checked={formData.publicVisible} onChange={e => setFormData({...formData, publicVisible: e.target.checked})} className="hidden" />
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-widest text-white block">Tornar público no QR Code</span>
                            </div>
                        </label>
                    </div>
                </div>

            </div>
            
            {/* Navigation Footer */}
            <div className="pt-6 mt-6 border-t border-[#a3a3a3]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] hover:text-white transition-colors">
                    Cancelar
                </button>

                <button 
                  type="button" 
                  disabled={!canSave || loading} 
                  onClick={handleSubmit} 
                  className="flex items-center justify-center gap-2 bg-[#c9a263] text-[#0a0a0a] px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_15px_rgba(201,162,99,0.2)] active:scale-95 w-full sm:w-auto disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed group relative"
                >
                    {loading ? 'Processando...' : 'Lançar Lote na Produção'}
                    {!canSave && (
                        <div className="absolute bottom-full right-0 mb-3 w-48 bg-black text-white text-[9px] p-2 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Preencha: {missingFields.join(', ')}
                        </div>
                    )}
                </button>
            </div>
         </div>

         {/* Lado Direito - Ficha Contextual do Lote */}
         <div className="hidden lg:flex w-80 bg-[#111111] border-l border-[#a3a3a3]/10 p-8 flex-col justify-between">
            <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-8 border-b border-[#a3a3a3]/10 pb-2">Resumo Operacional</h3>
                
                <div className="space-y-6">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-1">Lote</p>
                        <p className="text-sm font-medium text-white">{formData.name || <span className="text-[#a3a3a3]/50 italic">A preencher</span>}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-1">Cod</p>
                            <p className="text-xs font-mono font-bold text-[#c9a263] bg-[#1a1a1a] border border-[#c9a263]/20 px-2 py-1 rounded inline-block">{formData.code}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-1">Score</p>
                            {formData.score > 0 ? (
                               <p className="text-sm font-serif text-[#c9a263]">{formData.score} <span className="text-[9px] text-[#a3a3a3] block font-sans uppercase tracking-widest">SCA</span></p>
                            ) : (
                               <p className="text-[10px] font-medium text-[#a3a3a3]/50 italic mt-1.5">Pendente</p>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-[#a3a3a3]/10 pt-6">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-1">Estoque Previsto</p>
                        <p className="text-xl font-serif text-white">{formData.purchasedKg || 0} <span className="text-sm font-sans text-[#a3a3a3] font-medium">kg</span></p>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-1">Custo Total Previsto</p>
                        <p className="text-lg font-serif text-white">R$ {finalTotalCost.toFixed(2)}</p>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-1">Custo / Kg</p>
                        <p className="text-lg font-serif text-[#c9a263]">R$ {finalCostPerKg.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <div className="border-t border-[#a3a3a3]/10 pt-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-3">Status de Validação</p>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest border border-[#a3a3a3]/10 rounded-lg p-3 bg-[#1a1a1a]">
                            <span className={formData.name ? 'text-white' : 'text-[#a3a3a3]'}>Identificação</span>
                            {formData.name ? <CheckCircle2 size={14} className="text-[#c9a263]" /> : <span className="w-1.5 h-1.5 rounded-full bg-[#333]"></span>}
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest border border-[#a3a3a3]/10 rounded-lg p-3 bg-[#1a1a1a]">
                            <span className={formData.purchasedKg > 0 && formData.totalPaid > 0 ? 'text-white' : 'text-[#a3a3a3]'}>Custos / Estoque</span>
                            {formData.purchasedKg > 0 && formData.totalPaid > 0 ? <CheckCircle2 size={14} className="text-[#c9a263]" /> : <span className="w-1.5 h-1.5 rounded-full bg-[#333]"></span>}
                        </div>
                    </div>
                </div>

                {!canSave && (
                    <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-xl flex items-start gap-3 w-full mt-4">
                        <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-red-500 mb-1.5">Preencha obrigatórios</p>
                        </div>
                    </div>
                )}
            </div>
         </div>
      </div>
    </AdminPopup>
  );
}
