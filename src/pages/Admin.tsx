import { useState } from 'react';
import { LayoutDashboard, ShoppingCart, Users, PackageOpen, Tag, Menu, LogOut, X, MapPin, Coffee, Type, Settings, Shield, Scale, Target, Flame, Package, Layers, Handshake, DollarSign, Clock, BarChart } from 'lucide-react';
import { mockProducts } from '../data/seed';
import { Product } from '../types';
import { useAdminAuthStore } from '../store/adminAuthStore';
import { useNavigate } from 'react-router-dom';
import { ProductsTab } from '../components/admin/ProductsTab';
import { OrdersTab } from '../components/admin/OrdersTab';
import { CustomersTab } from '../components/admin/CustomersTab';
import { B2BLeadsTab } from '../components/admin/B2BLeadsTab';
import { PartnersTab } from '../components/admin/PartnersTab';
import { SubscriptionsTab } from '../components/admin/SubscriptionsTab';
import { CouponsTab } from '../components/admin/CouponsTab';
import { ContentTab } from '../components/admin/ContentTab';
import { OperationTab } from '../components/admin/OperationTab';
import { StockTab } from '../components/admin/StockTab';
import { ConsignmentsTab } from '../components/admin/ConsignmentsTab';
import { SellersTab } from '../components/admin/SellersTab';
import { CommissionsTab } from '../components/admin/CommissionsTab';
import { ReportsTab } from '../components/admin/ReportsTab';
import { RoastsTab } from '../components/admin/RoastsTab';
import { PackagingTab } from '../components/admin/PackagingTab';
import { HoursTab } from '../components/admin/HoursTab';
import { canAccessModule } from '../lib/permissions';
import { AdminEmptyState } from '../components/admin/AdminEmptyState';
import { BrandLogo } from '../components/brand/BrandLogo';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAdminAuthStore();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const allNavItems = [
    { id: 'operation', label: 'Operação CofCof', icon: Scale },
    { divider: 'Gestão E-commerce' },
    { id: 'dashboard', label: 'Resumo Vendas', icon: LayoutDashboard },
    { id: 'products', label: 'Produtos', icon: PackageOpen },
    { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
    { id: 'customers', label: 'Clientes', icon: Users },
    { divider: 'B2B & Parceiros' },
    { id: 'leads', label: 'Leads B2B', icon: Users },
    { id: 'partners', label: 'Parceiros', icon: MapPin },
    { id: 'subscriptions', label: 'Assinaturas', icon: Coffee },
    { id: 'op_sellers', label: 'Vendedores', icon: Users },
    { id: 'op_commissions', label: 'Comissões', icon: DollarSign },
    { divider: 'Marketing & Conteúdo' },
    { id: 'coupons', label: 'Cupons', icon: Tag },
    { id: 'content', label: 'Conteúdo', icon: Type },
    { divider: 'Configurações' },
    { id: 'settings', label: 'Sistema', icon: Settings },
    { id: 'staff', label: 'Funcionários', icon: Shield },
  ];

  const getEmptyStateDescription = (id: string) => {
     switch(id) {
       case 'op_stock': return 'O estoque será gerado automaticamente a partir de lotes, torras, empacotamentos e vendas.';
       case 'op_consignments': return 'Nenhuma consignação registrada. Escolha um parceiro para iniciar.';
       case 'op_sellers': return 'Nenhum vendedor cadastrado no sistema.';
       case 'op_commissions': return 'Comissões são geradas automaticamente a partir das vendas finalizadas.';
       case 'op_reports': return 'Os relatórios de produção, estoque e vendas aparecerão aqui.';
       default: return 'A área selecionada para a operação estará disponível na próxima atualização do sistema.';
     }
  };

  const renderContent = () => {
    return (
      <div className={`flex-1 min-w-0 w-full ${activeTab === 'operation' ? '' : 'p-4 md:p-8'}`}>
        <header className="flex md:hidden justify-between items-center p-4 border-b border-[#a3a3a3]/10 bg-[#fcfaf8] sticky top-0 z-40">
           <h2 className="text-xl font-serif cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2" onClick={() => navigate('/')}>
             Admin <BrandLogo size="admin" className="text-[#0a0a0a]" asLink={false} />
           </h2>
           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><Menu /></button>
        </header>

        {activeTab === 'operation' && (
           <OperationTab />
        )}

        {activeTab === 'dashboard' && (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-serif mb-8 text-[#0a0a0a]">Resumo Vendas</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-[#c9a263]/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#c9a263] mb-2">Vendas (Mês)</p>
                <p className="text-3xl font-serif text-[#0a0a0a]">R$ 4.520</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-[#c9a263]/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#c9a263] mb-2">Pedidos Pendentes</p>
                <p className="text-3xl font-serif text-[#0a0a0a]">12</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-[#c9a263]/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#c9a263] mb-2">Total Produtos</p>
                <p className="text-3xl font-serif text-[#0a0a0a]">{mockProducts.length}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-[#c9a263]/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#c9a263] mb-2">Leads B2B (Novos)</p>
                <p className="text-3xl font-serif text-[#0a0a0a]">3</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-[#0a0a0a] to-[#1a110a] p-8 text-center sm:text-left rounded-2xl border border-[#c9a263]/20 shadow-xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl mb-1 flex items-center justify-center sm:justify-start gap-2">Bem-vindo(a), {user?.name}</h3>
                <p className="text-[#a3a3a3] text-sm">Seu nível de acesso é: <strong className="text-[#c9a263] tracking-widest uppercase text-xs">{user?.role}</strong></p>
              </div>
              <button onClick={() => setActiveTab('operation')} className="px-6 py-3 bg-[#c9a263] text-[#0a0a0a] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-colors">
                Ir para Operação
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'orders' && (
          <OrdersTab />
        )}
        
        {activeTab === 'products' && (
          <ProductsTab />
        )}

        {activeTab === 'customers' && (
          <CustomersTab />
        )}

        {activeTab === 'leads' && (
          <B2BLeadsTab />
        )}

        {activeTab === 'partners' && (
          <PartnersTab />
        )}

        {activeTab === 'subscriptions' && (
          <SubscriptionsTab />
        )}

        {activeTab === 'coupons' && (
          <CouponsTab />
        )}

        {activeTab === 'content' && (
          <ContentTab />
        )}

        {['settings', 'staff'].includes(activeTab) && (
          <AdminEmptyState 
            title={allNavItems.find(i => i.id === activeTab)?.label || 'Em breve'}
            description={getEmptyStateDescription(activeTab)}
            action={{ label: "Criar primeiro registro", onClick: () => console.log('Init') }}
          />
        )}

        {activeTab === 'op_reports' && (
           <ReportsTab />
        )}

        {activeTab === 'op_stock' && (
           <StockTab />
        )}

        {activeTab === 'op_consignments' && (
           <ConsignmentsTab />
        )}

        {activeTab === 'op_sellers' && (
           <SellersTab />
        )}

        {activeTab === 'op_commissions' && (
           <CommissionsTab />
        )}

        {/* Legacy tabs kept for safety but removed from sidebar */}
        {activeTab === 'op_roasts' && <RoastsTab />}
        {activeTab === 'op_packaging' && <PackagingTab />}
        {activeTab === 'op_hours_payroll' && <HoursTab />}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col md:grid md:grid-cols-[260px_minmax(0,1fr)] min-h-screen bg-[#fcfaf8] bg-gradient-to-br from-[#fcfaf8] to-[#f5f0eb] font-sans w-full relative">
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 h-screen inset-y-0 left-0 bg-[#0a0a0a] text-white border-r border-[#c9a263]/20 w-[260px] flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#c9a263]/5 mix-blend-overlay"></div>
          <div onClick={() => navigate('/')} className="cursor-pointer hover:opacity-80 transition-opacity min-w-0 relative z-10 w-full flex flex-col items-start gap-1">
            <h2 className="text-2xl font-serif text-white truncate flex items-baseline gap-2">Admin <span className="text-[#c9a263] text-sm">/</span></h2>
            <BrandLogo size="admin" className="text-[#c9a263]" asLink={false} />
          </div>
          <button className="md:hidden p-2 text-[#a3a3a3] shrink-0 relative z-10 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 bg-[#111111] mx-4 mt-6 rounded-2xl border border-white/5 shadow-xl flex items-center gap-3 shrink-0 relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-br from-[#c9a263]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <div className="w-10 h-10 bg-[#1a1a1a] text-[#c9a263] border border-[#c9a263]/20 rounded-xl flex items-center justify-center font-serif text-lg shrink-0 relative z-10">
             {user?.name.charAt(0).toUpperCase()}
           </div>
           <div className="overflow-hidden min-w-0 flex-1 relative z-10">
             <p className="text-sm font-medium text-white truncate">{user?.name}</p>
             <p className="text-[10px] text-[#a3a3a3] uppercase tracking-widest flex items-center gap-1.5 truncate w-full mt-0.5">
               <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${user?.role === 'admin' ? 'bg-[#c9a263] shadow-[0_0_8px_rgba(201,162,99,0.5)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'}`}></span>
               <span className="truncate">{user?.role}</span>
             </p>
           </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto hide-scrollbar">
          {allNavItems.map((item, idx) => {
            if (item.divider) {
              return <div key={`div-${idx}`} className="px-4 pt-6 pb-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#a3a3a3]/50 truncate">{item.divider}</div>;
            }
            if (!user || (!canAccessModule(user.role as any, item.id!) && user.role !== 'admin')) {
              return null;
            }
            const Icon = item.icon!;
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id!);
                  setIsMobileMenuOpen(false);
                }} 
                className={`flex items-center gap-3 w-full px-4 py-3 text-sm rounded-xl font-medium transition-all relative overflow-hidden group ${isActive ? 'bg-[#111111] text-white border border-[#c9a263]/20' : 'text-[#a3a3a3] hover:bg-[#111111] hover:text-white border border-transparent'}`}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#c9a263] rounded-r-full shadow-[0_0_10px_rgba(201,162,99,0.5)]"></div>}
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} className={`shrink-0 transition-colors ${isActive ? 'text-[#c9a263]' : 'text-[#a3a3a3] group-hover:text-white'}`} /> 
                <span className="truncate text-left flex-1 tracking-wide">{item.label}</span>
              </button>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-white/5 shrink-0 bg-[#0a0a0a]">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3.5 text-sm rounded-xl text-[#a3a3a3] font-medium hover:bg-red-900/10 hover:text-red-400 hover:border-red-900/20 border border-transparent transition-all group">
            <LogOut size={18} strokeWidth={1.5} className="shrink-0 group-hover:scale-110 transition-transform" /> <span className="truncate tracking-wide">Sair do painel</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="min-w-0 w-full overflow-x-hidden flex flex-col min-h-screen relative">
        {renderContent()}
      </main>
    </div>
  );
}
