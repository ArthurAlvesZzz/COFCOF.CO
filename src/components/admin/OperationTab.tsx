import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Target, 
  Flame, 
  Package, 
  Layers, 
  Handshake, 
  Clock, 
  AlertTriangle,
  History,
  Search,
  RefreshCcw,
  Zap,
  Calendar,
  ChevronDown,
  TrendingDown,
  TrendingUp,
  Minus,
  Briefcase,
  DollarSign,
  Users,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminStatCard } from './AdminStatCard';
import { operationService } from '../../services/operationService';
import { useAdminAuthStore } from '../../store/adminAuthStore';
import { toast } from 'react-hot-toast';

// Sub-components
import { ProductionFlow } from './operation/ProductionFlow';
import { StockOverview } from './operation/StockOverview';
import { ConsignmentsOverview } from './operation/ConsignmentsOverview';
import { RoasterHoursControl } from './operation/RoasterHoursControl';
import { GlobalMovements } from './operation/GlobalMovements';

// Placeholder New Components (to be implemented)
import { DailyOverview } from './operation/DailyOverview';
import { FinancialOverview } from './operation/FinancialOverview';
import { AuditTrailOverview } from './operation/AuditTrailOverview';

// Modals
import { RoastModal } from './operation/modals/RoastModal';
import { PackagingModal } from './operation/modals/PackagingModal';
import { TimeEntryModal } from './operation/modals/TimeEntryModal';
import { LaunchLotModal } from './operation/modals/LaunchLotModal';
import { OperationInsightModal } from './operation/modals/OperationInsightModal';

import { NewOperationModal } from './operation/modals/NewOperationModal';
import { ConsignmentModal } from './operation/modals/ConsignmentModal';
import { SettleConsignmentModal } from './operation/modals/SettleConsignmentModal';
import { AdjustStockModal } from './operation/modals/AdjustStockModal';
import { CourtesyModal } from './operation/modals/CourtesyModal';
import { adminLogService } from '../../services/adminLogService';

import { OperationPrerequisiteModal, OperationComingSoonModal, OperationConfirmModal } from './operation/modals/OperationFeedbackModals';

type OperationMode = 'flow' | 'diario' | 'estoque' | 'consignacoes' | 'financeiro' | 'horas' | 'auditoria';
type PeriodOption = 'today' | 'yesterday' | 'last7' | 'last30' | 'thisMonth' | 'lastMonth' | 'custom';

export function OperationTab() {
  const [mode, setMode] = useState<OperationMode>('flow');
  const [period, setPeriod] = useState<PeriodOption>('today');
  const [dates, setDates] = useState<{start: Date, end: Date}>({ start: new Date(), end: new Date() });
  
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [insightModal, setInsightModal] = useState<{isOpen: boolean, type: string | null}>({ isOpen: false, type: null });
  const { user } = useAdminAuthStore();

  const [isLaunchLotModalOpen, setIsLaunchLotModalOpen] = useState(false);
  const [isRoastModalOpen, setIsRoastModalOpen] = useState(false);
  const [isPackModalOpen, setIsPackModalOpen] = useState(false);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [isOperationMenuOpen, setIsOperationMenuOpen] = useState(false);
  const [isConfirmClosePeriodOpen, setConfirmClosePeriodOpen] = useState(false);
  const [isConsignmentModalOpen, setIsConsignmentModalOpen] = useState(false);
  const [isSettleConsignmentModalOpen, setIsSettleConsignmentModalOpen] = useState(false);
  const [isAdjustStockModalOpen, setIsAdjustStockModalOpen] = useState(false);
  const [isCourtesyModalOpen, setIsCourtesyModalOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  // Modais de feedback
  const [prerequisiteModal, setPrerequisiteModal] = useState<{isOpen: boolean, actionParams: any}>({isOpen: false, actionParams: null});
  const [comingSoonModal, setComingSoonModal] = useState<{isOpen: boolean, feature: string}>({isOpen: false, feature: ''});

  const handleOperationAction = (actionType: string) => {
    // Fecha menu de operações se estiver aberto
    setIsOperationMenuOpen(false);
    
    switch(actionType) {
      case 'launch_lot':
      case 'launchLot':
        setIsLaunchLotModalOpen(true);
        break;
      case 'register_roast':
      case 'roast':
        if ((stats?.activeLotsCount || 0) === 0 && (stats?.rawKgAvailable || 0) === 0) {
           setPrerequisiteModal({
             isOpen: true,
             actionParams: {
               title: 'Você precisa lançar um lote primeiro',
               description: 'Para registrar uma torra, é necessário ter café cru disponível em pelo menos um lote ativo.',
               missingRequirements: ['Lote de café cru com estoque > 0'],
               primaryActionLabel: 'Lançar novo lote',
               onPrimaryAction: () => handleOperationAction('launch_lot')
             }
           });
        } else {
           setIsRoastModalOpen(true);
        }
        break;
      case 'package_coffee':
      case 'pack':
        if ((stats?.roastedKgAvailable || 0) <= 0) {
           setPrerequisiteModal({
             isOpen: true,
             actionParams: {
               title: 'Restrição de empacotamento',
               description: 'Para empacotar produtos, você precisa ter saldo de café torrado disponível. Registre uma torra primeiro.',
               missingRequirements: ['Café torrado aguardando empacotamento com saldo > 0kg'],
               primaryActionLabel: 'Registrar torra agora',
               onPrimaryAction: () => handleOperationAction('register_roast')
             }
           });
        } else {
           setIsPackModalOpen(true);
        }
        break;
      case 'create_consignment':
      case 'consignment':
        if ((stats?.finishedStockUnits || 0) <= 0) {
           setPrerequisiteModal({
             isOpen: true,
             actionParams: {
               title: 'Estoque insuficiente',
               description: 'Você precisa ter produtos finalizados em estoque para iniciar uma consignação.',
               missingRequirements: ['Pacotes de café disponíveis no estoque'],
               primaryActionLabel: 'Empacotar lote',
               onPrimaryAction: () => handleOperationAction('package_coffee')
             }
           });
        } else {
           setIsConsignmentModalOpen(true);
        }
        break;
      case 'settle_consignment':
      case 'settleConsignment':
        setIsSettleConsignmentModalOpen(true);
        break;
      case 'launch_hours':
      case 'timeEntry':
      case 'log_hours':
        setIsTimeModalOpen(true);
        break;
      case 'adjust_stock':
        setIsAdjustStockModalOpen(true);
        break;
      case 'close_period':
        if ((stats?.criticalAlertsCount + stats?.overdueConsignmentsCount) > 0) {
            setPrerequisiteModal({
              isOpen: true,
              actionParams: {
                title: 'Bloqueio de Fechamento',
                description: 'Existem pendências operacionais que devem ser resolvidas antes do fechamento.',
                missingRequirements: ['Resolver estocagem crítica', 'Lançar ou quitar horas pendentes', 'Verificar inconsistências na produção'],
                primaryActionLabel: 'Ver Raio-X de Pendências',
                onPrimaryAction: () => setInsightModal({ isOpen: true, type: 'alerts' })
              }
            });
        } else {
            setConfirmClosePeriodOpen(true);
        }
        break;
      case 'register_courtesy':
        setIsCourtesyModalOpen(true);
        break;
      case 'export_csv':
        if (!stats) {
            toast.error("Nenhum dado para exportar");
            return;
        }
        toast.success("Iniciando geração de CSV...");
        
        // CSV Generation Logic
        try {
          const header = "Data,Tipo,Entidade,Quantidade,Valor,Status\n";
          const rows = [];
          
          if(stats.rawLotsLaunchedInPeriod > 0) rows.push(`"${new Date().toLocaleDateString()}","Lote Cru Lançado","${stats.lastLotName}","${stats.rawKgPurchasedInPeriod} kg","R$ ${stats.rawInvestmentInPeriod}","ativo"`);
          if(stats.roastedKgInPeriod > 0) rows.push(`"${new Date().toLocaleDateString()}","Torra","Múltiplas","${stats.roastedKgInPeriod} kg","N/A","registrada"`);
          if(stats.packagedUnitsInPeriod > 0) rows.push(`"${new Date().toLocaleDateString()}","Pacotes","Vários formatos","${stats.packagedUnitsInPeriod} un","N/A","pronto"`);
          if(stats.roasterHoursInPeriod > 0) rows.push(`"${new Date().toLocaleDateString()}","Horas Totais","Mestre","${stats.roasterHoursInPeriod} h","R$ ${stats.estimatedPayrollValue}","pendente"`);
          
          const csvContent = "data:text/csv;charset=utf-8," + header + rows.join("\n");
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", `cofcof-operacao-${new Date().toISOString().split('T')[0]}.csv`);
          document.body.appendChild(link);
          
          link.click();
          document.body.removeChild(link);
          
          adminLogService.logAdminAction({
             userId: user?.id || 'user',
             userEmail: user?.email || 'admin@cofcof.co',
             action: 'EXPORT_CSV',
             entity: 'operation',
             entityId: 'period',
             after: { period, rows: rows.length }
          } as any);

          toast.success("Relatório CSV gerado e baixado com sucesso!");
        } catch(e) {
          toast.error("Falha ao gerar o CSV");
        }
        break;
      
      // View actions (from Cards, Links, Filters)
      case 'view_raw_stock':
         if (stats?.rawKgAvailable > 0) {
             setInsightModal({ isOpen: true, type: 'raw_stock' });
         } else {
             handleOperationAction('launch_lot');
         }
         break;
      case 'view_roasted':
         if (stats?.roastedKgInPeriod > 0) {
             setInsightModal({ isOpen: true, type: 'roasted' });
         } else {
             handleOperationAction('register_roast');
         }
         break;
      case 'view_packaged':
      case 'view_stock':
         if (stats?.finishedStockUnits > 0) {
             setInsightModal({ isOpen: true, type: 'finished_stock' });
         } else {
             handleOperationAction('package_coffee');
         }
         break;
      case 'view_consigned':
         setMode('consignacoes');
         break;
      case 'view_alerts':
         if ((stats?.criticalAlertsCount + stats?.overdueConsignmentsCount) > 0) {
             setInsightModal({ isOpen: true, type: 'alerts' });
         } else {
             toast.success('Tudo em ordem neste momento.');
         }
         break;
      case 'view_lots':
         setMode('estoque');
         break;
      case 'view_pending_values':
      case 'view_financial':
         setMode('financeiro');
         break;
      case 'view_new_customers':
         toast.success('Lista de clientes novos a implementar na aba Parceiros');
         break;
      case 'view_hours':
         setMode('horas');
         break;
      case 'view_movements':
         setMode('diario');
         break;

      // Filter Actions
      case 'filter_lotes':
         setMode('producao');
         break;
      case 'filter_torra':
         setMode('producao');
         break;
      case 'filter_horas':
         setMode('horas');
         break;

      case 'coming_soon':
         setComingSoonModal({isOpen: true, feature: 'Funcionalidade mapeada (Em breve)'});
         break;
      default:
        toast.error("Ação não mapeada.");
    }
  };

  useEffect(() => {
    // Reset dates based on period
    const now = new Date();
    let start = new Date(now.setHours(0,0,0,0));
    let end = new Date(now.setHours(23,59,59,999));

    if (period === 'today') {
      // already set
    } else if (period === 'yesterday') {
      start = new Date(start.setDate(start.getDate() - 1));
      end = new Date(end.setDate(end.getDate() - 1));
    } else if (period === 'last7') {
      start = new Date(start.setDate(start.getDate() - 7));
    } else if (period === 'last30') {
      start = new Date(start.setDate(start.getDate() - 30));
    } else if (period === 'thisMonth') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === 'lastMonth') {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0, 23,59,59,999);
    }
    
    setDates({ start, end });
  }, [period]);

  useEffect(() => {
    if (dates.start && dates.end) {
        loadStats();
    }
  }, [dates]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const s = await operationService.getOperationDashboard({ startDate: dates.start, endDate: dates.end });
      setStats(s);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar métricas operacionais");
    } finally {
      setLoading(false);
    }
  };

  const menuActions = [
    { label: 'Lançar Novo Lote', icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50', onClick: () => setIsLaunchLotModalOpen(true) },
    { label: 'Registrar Torra', icon: Flame, color: 'text-orange-600', bg: 'bg-orange-50', onClick: () => setIsRoastModalOpen(true) },
    { label: 'Registrar Empacotamento', icon: Package, color: 'text-amber-600', bg: 'bg-amber-50', onClick: () => setIsPackModalOpen(true) },
    { label: 'Lançar Horas Mestre', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50', onClick: () => setIsTimeModalOpen(true) },
  ];

  const getPeriodLabel = () => {
    switch (period) {
      case 'today': return 'Hoje';
      case 'yesterday': return 'Ontem';
      case 'last7': return 'Últimos 7 dias';
      case 'last30': return 'Últimos 30 dias';
      case 'thisMonth': return 'Este mês';
      case 'lastMonth': return 'Mês passado';
      default: return 'Personalizado';
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCcw className="animate-spin text-[#B06A32]" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 bg-[#fcfaf8] min-h-screen relative flex flex-col w-full min-w-0">
      {/* 1. TOPO DE COMANDO EM DUAS LINHAS */}
      <div className="bg-[#111111] text-white px-6 py-4 shadow-sm border-b border-[#c9a263]/20 flex flex-col gap-4 sticky top-0 z-40">
         {/* Linha 1 */}
         <div className="flex items-center justify-between gap-4">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1a1a1a] rounded-[1rem] flex items-center justify-center text-[#c9a263] border border-[#c9a263]/20 shadow-sm shrink-0">
                  <Zap size={20} className="drop-shadow-sm" />
                </div>
                <div>
                  <h1 className="text-xl font-serif text-white tracking-tight leading-tight">Central Operacional</h1>
                  <p className="text-xs text-[#a3a3a3] font-medium hidden sm:block">Produção, estoque, torra, consignação e rastreabilidade.</p>
                </div>
             </div>
             <button 
                onClick={() => setIsOperationMenuOpen(true)}
                className="flex items-center justify-center gap-2 bg-[#c9a263] text-[#0a0a0a] px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_15px_rgba(201,162,99,0.2)] active:scale-95 whitespace-nowrap shrink-0"
              >
                <Zap size={16} className="text-[#0a0a0a]" />
                Nova Operação
              </button>
         </div>
         {/* Linha 2 */}
         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
             <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-2 rounded-xl border border-[#c9a263]/10 flex-1 min-w-0">
                <Search size={16} className="text-[#a3a3a3] shrink-0" />
                <input type="text" placeholder="Buscar lote, torra, parceiro, horas..." className="bg-transparent border-none text-sm w-full focus:ring-0 outline-none placeholder:text-[#a3a3a3] text-white font-medium min-w-0" />
             </div>
             <div className="flex items-center gap-2 shrink-0 overflow-x-auto hide-scrollbar">
                 <div className="flex items-center gap-1 shrink-0 overflow-x-auto hide-scrollbar bg-[#1a1a1a] p-1 rounded-xl border border-[#c9a263]/10">
                     {[
                         { id: 'today', label: 'Hoje' },
                         { id: 'last7', label: '7 dias' },
                         { id: 'last30', label: '30 dias' },
                         { id: 'thisMonth', label: 'Mês' }
                     ].map(opt => (
                         <button 
                            key={opt.id}
                            onClick={() => setPeriod(opt.id as PeriodOption)}
                            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all whitespace-nowrap ${period === opt.id ? 'bg-[#111111] shadow-sm text-[#c9a263] border border-[#c9a263]/30' : 'text-[#a3a3a3] hover:text-white hover:bg-[#111111] border border-transparent'}`}
                         >
                            {opt.label}
                         </button>
                     ))}
                 </div>
                 <div className="w-px h-6 bg-[#a3a3a3]/20 hidden sm:block"></div>
                 <button onClick={() => handleOperationAction('filter_lotes')} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest ${mode === 'producao' ? 'text-[#0a0a0a] bg-[#c9a263] border-[#c9a263] border-2 -my-[1px]' : 'text-[#a3a3a3] hover:text-white border border-[#c9a263]/10 bg-[#1a1a1a]'} border rounded-xl transition-all shadow-sm shrink-0`}>Diário</button>
                 <button onClick={() => setMode('consignacoes')} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest ${mode === 'consignacoes' ? 'text-[#c9a263] bg-[#c9a263]/10 border-[#c9a263] border-2 -my-[1px]' : 'text-[#a3a3a3] hover:text-[#c9a263] hover:bg-[#c9a263]/5 border border-[#c9a263]/10 bg-[#1a1a1a]'} border rounded-xl transition-all shadow-sm shrink-0`}>Consignações</button>
                 <button onClick={() => handleOperationAction('filter_horas')} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest ${mode === 'horas' ? 'text-[#0a0a0a] bg-[#c9a263] border-[#c9a263] border-2 -my-[1px]' : 'text-[#a3a3a3] hover:text-white border border-[#c9a263]/10 bg-[#1a1a1a]'} border rounded-xl transition-all shadow-sm shrink-0`}>Horas</button>
             </div>
         </div>
      </div>

      <div className="p-4 md:p-8 w-full max-w-[1440px] mx-auto min-w-0">
         {/* GRID PRINCIPAL */}
         <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start w-full">
            
            {/* COLUNA PRINCIPAL */}
            <div className="flex flex-col gap-6 min-w-0 w-full">
               
               {/* 4 CARDS PRINCIPAIS */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                  {/* Card 1: Café Cru */}
                  <div onClick={() => (stats?.rawKgAvailable > 0) ? setInsightModal({ isOpen: true, type: 'raw_stock' }) : handleOperationAction('launch_lot')} className="group relative bg-white p-6 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#a3a3a3]/10 overflow-hidden cursor-pointer hover:shadow-lg hover:border-[#c9a263]/30 transition-all min-h-[160px] flex flex-col justify-between">
                     <div className="flex items-start justify-between mb-2">
                        <span className="text-[11px] font-bold text-[#a3a3a3] uppercase tracking-widest leading-tight">Café Cru<br/>Disponível</span>
                        <Target size={16} className="text-[#a3a3a3] group-hover:text-[#c9a263] transition-colors" />
                     </div>
                     <div>
                        <p className="text-4xl font-serif text-[#0a0a0a]">{stats?.rawKgAvailable || 0}<span className="text-base font-bold text-[#a3a3a3] ml-1">kg</span></p>
                        {stats?.rawKgAvailable > 0 ? (
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-[11px] font-bold text-[#a3a3a3]">{stats?.activeLotsCount || 0} lotes ativos</span>
                                <span className="text-[11px] font-bold text-[#c9a263]">R$ {stats?.averageRawCostPerKg?.toFixed(2) || '0.00'}/kg</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-[11px] font-bold text-[#a3a3a3]">Nenhum lote ativo</span>
                                <span className="text-[10px] font-bold uppercase text-[#c9a263] bg-[#c9a263]/10 px-2 py-0.5 rounded-md border border-[#c9a263]/20">Lançar lote</span>
                            </div>
                        )}
                     </div>
                  </div>

                  {/* Card 2: Produção */}
                  <div onClick={() => (stats?.roastedKgInPeriod > 0) ? setInsightModal({ isOpen: true, type: 'roasted' }) : handleOperationAction('register_roast')} className="group relative bg-white p-6 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#a3a3a3]/10 overflow-hidden cursor-pointer hover:shadow-lg hover:border-[#c9a263]/30 transition-all min-h-[160px] flex flex-col justify-between">
                     <div className="flex items-start justify-between mb-2">
                        <span className="text-[11px] font-bold text-[#a3a3a3] uppercase tracking-widest leading-tight">Produção<br/>(Período)</span>
                        <Flame size={16} className="text-[#a3a3a3] group-hover:text-[#c9a263] transition-colors" />
                     </div>
                     <div>
                        <p className="text-4xl font-serif text-[#0a0a0a]">{stats?.roastedKgInPeriod || 0}<span className="text-base font-bold text-[#a3a3a3] ml-1">kg</span></p>
                        {stats?.roastedKgInPeriod > 0 ? (
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-[11px] font-bold text-[#a3a3a3]">{stats?.packagedUnitsInPeriod || 0} pacotes</span>
                                <span className="text-[11px] font-bold text-[#c9a263] bg-[#c9a263]/10 px-2 py-0.5 rounded-full">Perda: {stats?.averageRoastLossPercent?.toFixed(1) || 0}%</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-[11px] font-bold text-[#a3a3a3]">Sem torras recentes</span>
                                <span className="text-[10px] font-bold uppercase text-[#c9a263] bg-[#c9a263]/10 px-2 py-0.5 rounded-md border border-[#c9a263]/20">Torrar</span>
                            </div>
                        )}
                     </div>
                  </div>

                  {/* Card 3: Estoque Pronto */}
                  <div onClick={() => (stats?.finishedStockUnits > 0) ? setInsightModal({ isOpen: true, type: 'finished_stock' }) : handleOperationAction('package_coffee')} className="group relative bg-white p-6 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#a3a3a3]/10 overflow-hidden cursor-pointer hover:shadow-lg hover:border-[#c9a263]/30 transition-all min-h-[160px] flex flex-col justify-between">
                     <div className="flex items-start justify-between mb-2">
                        <span className="text-[11px] font-bold text-[#a3a3a3] uppercase tracking-widest leading-tight">Estoque<br/>Pronto</span>
                        <Layers size={16} className="text-[#a3a3a3] group-hover:text-[#c9a263] transition-colors" />
                     </div>
                     <div>
                        <p className="text-4xl font-serif text-[#0a0a0a]">{stats?.finishedStockUnits || 0}<span className="text-base font-bold text-[#a3a3a3] ml-1">un</span></p>
                        {stats?.finishedStockUnits > 0 ? (
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-[11px] font-bold text-[#a3a3a3]">200g: {stats?.finishedStockByFormat?.['200g'] || 0}</span>
                                <span className="text-[11px] font-bold text-[#a3a3a3]">1kg: {stats?.finishedStockByFormat?.['1kg'] || 0}</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-[11px] font-bold text-[#a3a3a3]">Estoque zerado</span>
                                <span className="text-[10px] font-bold uppercase text-[#c9a263] bg-[#c9a263]/10 px-2 py-0.5 rounded-md border border-[#c9a263]/20">Empacotar</span>
                            </div>
                        )}
                     </div>
                  </div>

                  {/* Card 4: Pendências */}
                  <div onClick={() => handleOperationAction('view_alerts')} className={`group relative p-6 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border overflow-hidden cursor-pointer hover:shadow-lg transition-all min-h-[160px] flex flex-col justify-between ${(stats?.criticalAlertsCount + stats?.overdueConsignmentsCount > 0) ? 'bg-[#fff5f5] border-red-200' : 'bg-white border-[#a3a3a3]/10 hover:border-[#c9a263]/30'}`}>
                     <div className="flex items-start justify-between mb-2">
                        <span className={`text-[11px] font-bold uppercase tracking-widest leading-tight ${(stats?.criticalAlertsCount + stats?.overdueConsignmentsCount > 0) ? 'text-red-500' : 'text-[#a3a3a3]'}`}>Pendências<br/>Críticas</span>
                        <AlertTriangle size={16} className={(stats?.criticalAlertsCount + stats?.overdueConsignmentsCount > 0) ? 'text-red-500' : 'text-[#a3a3a3]'} />
                     </div>
                     <div>
                        <p className={`text-4xl font-serif ${(stats?.criticalAlertsCount + stats?.overdueConsignmentsCount > 0) ? 'text-red-600' : 'text-[#0a0a0a]'}`}>{stats?.criticalAlertsCount + stats?.overdueConsignmentsCount || 0}</p>
                        {(stats?.criticalAlertsCount + stats?.overdueConsignmentsCount) > 0 ? (
                            <div className="flex items-center justify-between mt-3">
                                <span className={`text-[11px] font-bold ${(stats?.overdueConsignmentsCount > 0) ? 'text-red-600' : 'text-[#a3a3a3]'}`}>{stats?.overdueConsignmentsCount || 0} em atraso</span>
                                <span className="text-[11px] font-bold text-[#a3a3a3]">{stats?.criticalAlertsCount || 0} sistêmicas</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-[11px] font-bold text-[#a3a3a3]">Tudo em ordem</span>
                                <span className="text-[10px] font-bold uppercase text-[#a3a3a3] bg-[#fcfaf8] px-2 py-0.5 rounded-md border border-[#a3a3a3]/10">Até o momento</span>
                            </div>
                        )}
                     </div>
                  </div>
               </div>

               {/* INDICADORES SECUNDÁRIOS */}
               <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-1 w-full snap-x">
                  {[
                      { label: 'Custo Médio/kg', val: `R$ ${stats?.averageRawCostPerKg?.toFixed(2) || '0.00'}` },
                      { label: 'Lotes Lançados', val: `${stats?.rawLotsLaunchedInPeriod || 0}` },
                      { label: 'Em Consignação', val: `R$ ${stats?.pendingConsignmentValue?.toLocaleString('pt-BR') || 0}` },
                      { label: 'Horas Reg.', val: `${stats?.roasterHoursInPeriod || 0}h` },
                      { label: 'Clientes Novos', val: `${stats?.newCustomersCount || 0}` },
                      { label: 'A Receber', val: `R$ ${stats?.totalPendingValue?.toLocaleString('pt-BR') || 0}` },
                  ].map((ind, i) => (
                      <div key={i} className="bg-white border border-[#a3a3a3]/10 rounded-[16px] px-5 py-4 flex flex-col justify-center min-w-[140px] shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.02)] snap-start h-[100px]">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-1">{ind.label}</span>
                          <span className="text-xl font-serif text-[#0a0a0a]">{ind.val}</span>
                      </div>
                  ))}
               </div>

               {/* TIMELINE - LINHA DE PRODUÇÃO */}
               <div className="bg-white border border-[#a3a3a3]/10 rounded-[24px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden w-full">
                   <h3 className="text-xl font-serif text-[#0a0a0a] mb-6">Linha de Produção & Rastreabilidade</h3>
                   <div className="relative">
                       {/* Connection Line Desktop */}
                       <div className="hidden lg:block absolute top-[28px] left-8 right-8 h-px bg-[#c9a263]/20 z-0"></div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 lg:gap-2 relative z-10 w-full min-w-0">
                           {[
                               { title: 'Compra', val: `${stats?.rawLotsLaunchedInPeriod || 0} lotes`, desc: stats?.lastLotName ? `Último: ${stats.lastLotName.substring(0, 10)}${stats.lastLotName.length > 10 ? '...' : ''}` : 'Nenhum recente', action: 'novo', onClick: () => handleOperationAction('launch_lot'), icon: Target },
                               { title: 'Café Cru', val: `${stats?.rawKgAvailable || 0}kg`, desc: `${stats?.activeLotsCount || 0} lotes ativos`, action: 'torrar', onClick: () => handleOperationAction('view_raw_stock'), icon: Layers },
                               { title: 'Torra', val: `${stats?.roastedKgInPeriod || 0}kg`, desc: `Perda ${stats?.averageRoastLossPercent?.toFixed(1) || 0}%`, action: 'empacotar', onClick: () => handleOperationAction('register_roast'), icon: Flame },
                               { title: 'Pacotes', val: `${stats?.packagedUnitsInPeriod || 0} pct`, desc: Object.keys(stats?.packagedByFormat || {}).length > 0 ? Object.keys(stats?.packagedByFormat).join(', ') : 'Sem pacotes', action: 'ver', onClick: () => handleOperationAction('package_coffee'), icon: Package },
                               { title: 'Estoque', val: `${stats?.finishedStockUnits || 0} un`, desc: stats?.finishedStockUnits > 0 ? 'Disponível' : 'Zerado', action: 'ajustar', onClick: () => handleOperationAction('view_stock'), icon: Layers },
                               { title: 'Consig.', val: `${stats?.consignedUnits || 0} fora`, desc: `R$ ${stats?.pendingConsignmentValue?.toLocaleString('pt-BR') || '0,00'}`, action: 'cobrar', onClick: () => handleOperationAction('create_consignment'), icon: Handshake },
                               { title: 'Fechamento', val: `R$ ${stats?.totalPendingValue?.toLocaleString('pt-BR') || '0,00'}`, desc: 'Pendente', action: 'finanças', onClick: () => handleOperationAction('view_financial'), icon: Zap },
                           ].map((step, i) => (
                               <div key={i} className="group bg-white lg:bg-transparent p-4 lg:p-0 rounded-2xl border border-[#a3a3a3]/10 lg:border-none shadow-sm lg:shadow-none flex flex-row lg:flex-col items-center lg:text-center gap-4 lg:gap-3 hover:-translate-y-1 transition-transform cursor-pointer min-w-0" onClick={step.onClick}>
                                   <div className="w-14 h-14 bg-[#111111] border border-[#c9a263]/20 rounded-[16px] flex items-center justify-center text-[#c9a263] group-hover:bg-[#c9a263] group-hover:text-[#111111] transition-colors shadow-sm shrink-0">
                                       <step.icon size={24} strokeWidth={1.5} />
                                   </div>
                                   <div className="flex-1 lg:flex-none min-w-0 flex flex-col justify-center items-start lg:items-center w-full">
                                       <p className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-1">{step.title}</p>
                                       <p className="text-lg font-serif text-[#0a0a0a] leading-tight mb-0.5 truncate max-w-full">{step.val}</p>
                                       <p className="text-[10px] font-bold text-[#a3a3a3] truncate max-w-full">{step.desc}</p>
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>
               </div>

               {/* CENTRO DE CONFERÊNCIA */}
               <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#a3a3a3]/10 overflow-hidden flex flex-col min-h-[600px] min-w-0">
                   <div className="bg-[#fcfaf8] px-6 py-4 flex flex-col md:flex-row md:items-center md:flex-wrap gap-4 border-b border-[#a3a3a3]/10 overflow-x-auto hide-scrollbar">
                       {[
                           { id: 'diario', label: 'Diário', group: 'Conferir' },
                           { id: 'producao', label: 'Lançamentos', group: 'Operar' },
                           { id: 'estoque', label: 'Estoque', group: 'Operar' },
                           { id: 'consignacoes', label: 'Consignações', group: 'Conferir' },
                           { id: 'financeiro', label: 'Financeiro', group: 'Conferir' },
                           { id: 'horas', label: 'Horas', group: 'Conferir' },
                           { id: 'auditoria', label: 'Auditoria', group: 'Auditar' },
                       ].reduce((acc, curr) => {
                           if (!acc.groups[curr.group]) {
                               acc.groups[curr.group] = [];
                               acc.ordered.push(curr.group);
                           }
                           acc.groups[curr.group].push(curr);
                           return acc;
                       }, { groups: {} as any, ordered: [] as string[] }).ordered.map((groupName: string) => (
                           <div key={groupName} className="flex items-center gap-2 shrink-0">
                               <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] pl-1">{groupName}</span>
                               <div className="flex bg-white rounded-xl shadow-sm border border-[#a3a3a3]/10 p-1">
                                   {([
                                       { id: 'diario', label: 'Diário', group: 'Conferir' },
                                       { id: 'producao', label: 'Lançamentos', group: 'Operar' },
                                       { id: 'estoque', label: 'Estoque', group: 'Operar' },
                                       { id: 'consignacoes', label: 'Consignações', group: 'Conferir' },
                                       { id: 'financeiro', label: 'Financeiro', group: 'Conferir' },
                                       { id: 'horas', label: 'Horas', group: 'Conferir' },
                                       { id: 'auditoria', label: 'Auditoria', group: 'Auditar' },
                                   ].filter(m => m.group === groupName)).map(m => (
                                       <button
                                           key={m.id}
                                           onClick={() => setMode(m.id as OperationMode | 'producao')}
                                           className={`relative px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${mode === m.id ? 'bg-[#111111] text-[#c9a263] shadow-sm' : 'text-[#a3a3a3] hover:text-[#0a0a0a] hover:bg-[#fcfaf8]'}`}
                                       >
                                           {m.label}
                                       </button>
                                   ))}
                               </div>
                           </div>
                       ))}
                   </div>
                   <div className="flex-1 p-6 relative bg-white min-w-0">
                      <AnimatePresence mode="wait">
                        <motion.div key={mode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="h-full">
                          {mode === 'flow' && <DailyOverview dates={dates} stats={stats} onAction={handleOperationAction} />}
                          {mode === 'diario' && <DailyOverview dates={dates} stats={stats} onAction={handleOperationAction} />}
                          {mode === 'producao' && <ProductionFlow stats={stats} onAction={handleOperationAction} />}
                          {mode === 'estoque' && <StockOverview onAction={handleOperationAction} />}
                          {mode === 'consignacoes' && <ConsignmentsOverview onAction={handleOperationAction} />}
                          {mode === 'financeiro' && <FinancialOverview stats={stats} onAction={handleOperationAction} />}
                          {mode === 'horas' && <RoasterHoursControl onAction={handleOperationAction} />}
                          {mode === 'auditoria' && <AuditTrailOverview />}
                        </motion.div>
                      </AnimatePresence>
                   </div>
               </div>
            </div>

            {/* COLUNA LATERAL (340px) */}
            <div className="flex flex-col gap-6 w-full min-w-0">
               
               {/* AÇÕES RÁPIDAS */}
               <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                   <h2 className="text-[12px] font-black uppercase tracking-[0.1em] text-[#1C1A17] mb-2">Ações Rápidas</h2>
                   <p className="text-[11px] font-medium text-gray-500 mb-6">Atalhos para operações frequentes.</p>
                   
                   <div className="grid grid-cols-2 gap-3">
                       {[
                           { id: 'launch_lot', label: 'Lote', desc: 'Comprar cru', icon: Target, bg: 'bg-[#111111]', text: 'text-white', hoverBg: 'hover:bg-[#1a1a1a] hover:border-[#c9a263]/30', hoverIcon: 'group-hover:text-[#c9a263]', isBlocked: false },
                           { id: 'register_roast', label: 'Torra', desc: 'Cerrado/etc', icon: Flame, bg: 'bg-[#111111]', text: 'text-white', hoverBg: 'hover:bg-[#1a1a1a] hover:border-[#c9a263]/30', hoverIcon: 'group-hover:text-[#c9a263]', isBlocked: (stats?.activeLotsCount || 0) === 0 && (stats?.rawKgAvailable || 0) === 0 },
                           { id: 'package_coffee', label: 'Pacote', desc: '200g e 1kg', icon: Package, bg: 'bg-[#111111]', text: 'text-white', hoverBg: 'hover:bg-[#1a1a1a] hover:border-[#c9a263]/30', hoverIcon: 'group-hover:text-[#c9a263]', isBlocked: (stats?.roastedKgAvailable || 0) <= 0 },
                           { id: 'create_consignment', label: 'Consig.', desc: 'Novo parceiro', icon: Handshake, bg: 'bg-[#111111]', text: 'text-white', hoverBg: 'hover:bg-[#1a1a1a] hover:border-[#c9a263]/30', hoverIcon: 'group-hover:text-[#c9a263]', isBlocked: (stats?.finishedStockUnits || 0) <= 0 },
                           { id: 'settle_consignment', label: 'Acerto', desc: 'Receber', icon: AlertTriangle, bg: 'bg-[#111111]', text: 'text-white', hoverBg: 'hover:bg-red-900/20 hover:border-red-500/30', hoverIcon: 'group-hover:text-red-400', isBlocked: false },
                           { id: 'launch_hours', label: 'Horas', desc: 'Mestre torra', icon: Clock, bg: 'bg-[#111111]', text: 'text-white', hoverBg: 'hover:bg-[#1a1a1a] hover:border-[#c9a263]/30', hoverIcon: 'group-hover:text-[#c9a263]', isBlocked: false },
                       ].map(action => (
                           <button
                               key={action.id}
                               onClick={() => handleOperationAction(action.id)}
                               className={`flex flex-col items-center justify-center p-4 rounded-[16px] border border-[#a3a3a3]/10 transition-all group gap-2 shadow-sm min-w-0 ${action.isBlocked ? 'opacity-60 bg-[#1a1a1a] cursor-not-allowed' : `${action.bg} ${action.hoverBg}`}`}
                               title={action.isBlocked ? 'Exige etapa anterior (ver bloqueio)' : action.label}
                           >
                               <div className={`w-10 h-10 rounded-[12px] bg-[#1a1a1a] border border-[#a3a3a3]/10 flex items-center justify-center transition-colors shadow-sm shrink-0 ${action.isBlocked ? 'text-[#a3a3a3]' : `${action.text} ${action.hoverIcon}`}`}>
                                 <action.icon size={18} strokeWidth={1.5} />
                               </div>
                               <div className="text-center min-w-0 w-full flex flex-col items-center">
                                 <span className={`block text-[11px] font-bold uppercase tracking-widest leading-none mb-1 w-full truncate relative ${action.isBlocked ? 'text-[#a3a3a3]' : 'text-white'}`}>
                                   {action.label}
                                 </span>
                                 <span className="block text-[9px] font-bold text-[#a3a3a3] truncate w-full px-1">{action.desc}</span>
                               </div>
                           </button>
                       ))}
                   </div>
               </div>

               {/* PENDÊNCIAS INTELIGENTES */}
               <div className="bg-[#111111] rounded-[24px] p-6 shadow-xl border border-[#c9a263]/20 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-48 h-48 bg-[#c9a263]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                   <h2 className="text-xl font-serif text-white mb-2 relative z-10">Inteligência Operacional</h2>
                   <p className="text-[11px] font-bold text-[#a3a3a3] uppercase tracking-widest mb-6 relative z-10">Seu raio-x de pendências.</p>
                   
                   <div className="space-y-3 relative z-10 max-h-[400px] overflow-y-auto hide-scrollbar pr-1">
                       {stats?.issues && stats.issues.length > 0 ? (
                           stats.issues.map((issue: any) => (
                               <div key={issue.id} className={`bg-[#1a1a1a] p-5 rounded-[16px] border ${issue.severity === 'critical' ? 'border-red-900/30' : issue.severity === 'warning' ? 'border-orange-900/30' : 'border-[#a3a3a3]/20'}`}>
                                  <div className={`flex items-center gap-2 mb-2 ${issue.severity === 'critical' ? 'text-red-400' : issue.severity === 'warning' ? 'text-orange-400' : 'text-blue-400'}`}>
                                      {issue.severity === 'critical' ? <AlertTriangle size={14} /> : <Flame size={14} />}
                                      <span className="text-[10px] font-bold uppercase tracking-widest">{issue.affectedArea}</span>
                                  </div>
                                  <p className="text-lg font-serif text-white">{issue.title}</p>
                                  <p className="text-[11px] text-[#a3a3a3] mb-4 mt-1 leading-snug">{issue.description}</p>
                                  {issue.actionType && (
                                     <button onClick={() => handleOperationAction(issue.actionType)} className="text-[10px] font-bold uppercase tracking-widest bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl w-full text-center transition-colors">{issue.recommendedAction}</button>
                                  )}
                               </div>
                           ))
                       ) : (
                           <div className="bg-[#1a1a1a] p-6 rounded-[16px] border border-[#a3a3a3]/10 text-center flex flex-col items-center justify-center min-h-[140px]">
                               <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3 text-[#c9a263]">
                                   <Scale size={20} />
                               </div>
                               <p className="text-[11px] font-bold uppercase tracking-widest text-white mb-1">Tudo em Ordem</p>
                               <p className="text-[11px] text-[#a3a3a3]">Nenhuma pendência crítica encontrada no período selecionado.</p>
                           </div>
                       )}
                   </div>
               </div>

            </div>
         </div>
      </div>

      <RoastModal isOpen={isRoastModalOpen} onClose={() => setIsRoastModalOpen(false)} onSave={loadStats} />
      <PackagingModal isOpen={isPackModalOpen} onClose={() => setIsPackModalOpen(false)} onSave={loadStats} />
      <TimeEntryModal isOpen={isTimeModalOpen} onClose={() => setIsTimeModalOpen(false)} onSave={loadStats} />
      <LaunchLotModal isOpen={isLaunchLotModalOpen} onClose={() => setIsLaunchLotModalOpen(false)} onSave={loadStats} />
      <OperationInsightModal isOpen={insightModal.isOpen} type={insightModal.type} dates={dates} stats={stats} onAction={handleOperationAction} onClose={() => setInsightModal({ isOpen: false, type: null })} />
      <NewOperationModal isOpen={isOperationMenuOpen} onClose={() => setIsOperationMenuOpen(false)} onAction={(id) => handleOperationAction(id)} stats={stats} />
      
      {/* New Flow Modals */}
      <ConsignmentModal isOpen={isConsignmentModalOpen} onClose={() => setIsConsignmentModalOpen(false)} onSave={loadStats} stats={stats} />
      <SettleConsignmentModal isOpen={isSettleConsignmentModalOpen} onClose={() => setIsSettleConsignmentModalOpen(false)} onSave={loadStats} />
      <AdjustStockModal isOpen={isAdjustStockModalOpen} onClose={() => setIsAdjustStockModalOpen(false)} onSave={loadStats} stats={stats} />
      <CourtesyModal isOpen={isCourtesyModalOpen} onClose={() => setIsCourtesyModalOpen(false)} onSave={loadStats} stats={stats} />

      {/* Modais de Feedback */}
      {prerequisiteModal.actionParams && (
        <OperationPrerequisiteModal 
          isOpen={prerequisiteModal.isOpen} 
          onClose={() => setPrerequisiteModal({...prerequisiteModal, isOpen: false})}
          {...prerequisiteModal.actionParams}
        />
      )}

      <OperationComingSoonModal
        isOpen={comingSoonModal.isOpen}
        onClose={() => setComingSoonModal({...comingSoonModal, isOpen: false})}
        featureName={comingSoonModal.feature}
      />

      <OperationConfirmModal
        isOpen={isConfirmClosePeriodOpen}
        onClose={() => setConfirmClosePeriodOpen(false)}
        title="Fechar Período Operacional"
        description="Você está prestes a fechar o período ativo. Isso irá congelar os lançamentos dentro desta janela e preparar os relatórios contábeis."
        primaryActionLabel="Confirmar Fechamento"
        onConfirm={async () => {
           try {
             await adminLogService.logAdminAction({
               userId: user?.id || 'user',
               userEmail: user?.email || 'admin@cofcof.co',
               action: 'CLOSE_PERIOD',
               entity: 'operation',
               entityId: period,
               after: { dates, stats: { ...stats, issues: undefined } }
             } as any);
             toast.success("Período fechado com sucesso!");
             setConfirmClosePeriodOpen(false);
           } catch(e) {
             toast.error("Erro ao fechar período");
           }
        }}
        summary={
          <div className="space-y-4">
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Período:</span>
                <span className="font-black text-[#1C1A17]">{getPeriodLabel()}</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Lotes Lançados:</span>
                <span className="font-black text-[#1C1A17]">{stats?.rawLotsLaunchedInPeriod || 0}</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Investimento Cru:</span>
                <span className="font-black text-[#1C1A17]">R$ {(stats?.rawInvestmentInPeriod || 0).toLocaleString('pt-BR')}</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Folha a Pagar (Mestre):</span>
                <span className="font-black text-[#1C1A17]">R$ {(stats?.estimatedPayrollValue || 0).toLocaleString('pt-BR')}</span>
             </div>
          </div>
        }
      />
    </div>
  );
}
