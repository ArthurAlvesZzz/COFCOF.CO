import React, { useState } from 'react';
import { useContent } from '../../hooks/useContent';
import { AdminPageHeader } from './AdminPageHeader';
import { AdminStatCard } from './AdminStatCard';
import { FileText, Edit3, MessageSquare, Image as ImageIcon, Link2, Search, Download, RefreshCcw, Activity, ExternalLink } from 'lucide-react';
import { ContentBlock, FAQItem, Banner } from '../../types/admin';
import { ContentBlockFormDrawer } from './ContentBlockFormDrawer';
import toast from 'react-hot-toast';
import { exportToCSV } from '../../lib/export';
import { AdminConfirmDialog } from './ui/AdminConfirmDialog';
import { Link } from 'react-router-dom';
import { publicContentRegistry, publicFAQRegistry, publicBannerRegistry } from '../../data/publicContentRegistry';

type InnerTab = 'overview' | 'pages' | 'blocks' | 'faqs' | 'banners' | 'ctas' | 'seo' | 'history';

export function ContentTab() {
  const { 
    contentBlocks, faqs, banners, loading, 
    saveBlock, publishBlock, unpublishBlock, deleteBlock, duplicateBlock, restoreDefaults,
    saveFAQ, publishFAQ, deleteFAQ,
    saveBanner, toggleBanner, deleteBanner
  } = useContent();

  const [activeTab, setActiveTab] = useState<InnerTab>('overview');
  const [isBlockFormOpen, setIsBlockFormOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Partial<ContentBlock> | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  const displayBlocks = contentBlocks.length > 0 ? contentBlocks : publicContentRegistry;
  const displayFaqs = faqs.length > 0 ? faqs : publicFAQRegistry;
  const displayBanners = banners.length > 0 ? banners : publicBannerRegistry;

  if (loading) return <div className="p-8 text-center text-gray-500">Carregando conteúdo...</div>;

  const publishedBlocks = displayBlocks.filter(b => b.status === 'published');
  const draftBlocks = displayBlocks.filter(b => b.status === 'draft');
  const activeFaqs = displayFaqs.filter(f => f.active);
  const activeBanners = displayBanners.filter(b => b.active);

  const handleOpenBlockForm = (block?: ContentBlock) => {
    if (block) {
      setEditingBlock(block);
    } else {
      setEditingBlock(null);
    }
    setIsBlockFormOpen(true);
  };

  const handleSaveBlock = async (status: 'draft' | 'published', data: Partial<ContentBlock>) => {
    if (!data.key || !data.type) {
      throw new Error("Chave e tipo são obrigatórios.");
    }

    if (!data.id) {
       const existing = contentBlocks.find(b => b.key === data.key && b.page === data.page);
       if (existing) {
         throw new Error("Já existe um bloco com esta chave nesta página.");
       }
    }

    await saveBlock(data.id || null, { 
      ...data, 
      status, 
      active: status === 'published' ? true : (data.active ?? false) 
    });
  };

  const handleExportJSON = () => {
     const data = { contentBlocks, faqs, banners };
     const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
     const url = URL.createObjectURL(blob);
     const a = document.createElement("a");
     a.href = url;
     a.download = `cofcof-content-export-${new Date().toISOString().split('T')[0]}.json`;
     document.body.appendChild(a);
     a.click();
     document.body.removeChild(a);
     toast.success('Conteúdo exportado com sucesso!');
  };

  const handleRestoreDefaults = async () => {
    setShowRestoreConfirm(true);
  };

  const renderOverviewTab = () => {
    if (contentBlocks.length === 0) {
      return (
        <div className="bg-orange-50 border border-orange-200 p-8 rounded-2xl mb-8 flex flex-col items-center justify-center text-center">
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <RefreshCcw className="text-orange-600" size={32} />
          </div>
          <h2 className="text-xl font-serif text-orange-900 mb-2">Conteúdo público não sincronizado</h2>
          <p className="text-orange-800/80 mb-6 max-w-md">
            O site público possui conteúdo (textos, CTAs, imagens) que ainda não está editável no painel. Importe agora para transformá-lo num CMS.
          </p>
          <button 
            onClick={handleRestoreDefaults}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2"
          >
            <Download size={18} />
            Importar conteúdo atual do site
          </button>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-serif text-[#1C1A17] mb-4">Status do CMS</h3>
          <ul className="space-y-4">
            <li className="flex justify-between items-center pb-4 border-b border-gray-50">
              <span className="text-sm font-medium text-gray-600">Blocos Publicados</span>
              <span className="text-sm font-bold text-green-600">{publishedBlocks.length}</span>
            </li>
            <li className="flex justify-between items-center pb-4 border-b border-gray-50">
              <span className="text-sm font-medium text-gray-600">Rascunhos Pendentes</span>
              <span className="text-sm font-bold text-orange-600">{draftBlocks.length}</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Sincronização</span>
              <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded uppercase tracking-wider">Sincronizado</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-gradient-to-br from-[#1C1A17] to-[#2A160E] p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
           <div className="relative z-10">
              <h3 className="text-lg font-serif text-[#c9a263] mb-2">Ações Rápidas</h3>
              <p className="text-sm text-gray-300 mb-6">Atualize Banners, crie anúncios ou adicione novas FAQs.</p>
           </div>
           <div className="grid grid-cols-2 gap-3 relative z-10">
              <button onClick={() => setActiveTab('banners')} className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-bold transition-colors text-left flex items-center justify-between">
                Gerenciar Banners
              </button>
              <button onClick={() => setActiveTab('faqs')} className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-bold transition-colors text-left flex items-center justify-between">
                Editar FAQs
              </button>
              <button onClick={() => handleOpenBlockForm()} className="p-3 bg-[#c9a263] hover:bg-[#b58b4b] text-[#111111] rounded-xl text-xs font-bold transition-colors col-span-2 text-center shadow-[0_0_15px_rgba(201,162,99,0.3)]">
                Criar Novo Bloco
              </button>
           </div>
        </div>
      </div>
    );
  };

  const renderPagesTab = () => {
    const pages = ['home', 'cafes', 'origem', 'empresas', 'parceiros', 'assinatura', 'checkout', 'global'];
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map(page => {
           const blocksCount = displayBlocks.filter(b => b.page === page).length;
           const publishedCount = displayBlocks.filter(b => b.page === page && b.status === 'published').length;
           return (
             <div key={page} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
               <div>
                  <h3 className="text-xl font-serif text-[#1C1A17] capitalize mb-2">{page}</h3>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-1"><FileText size={14}/> {blocksCount} blocos</span>
                    <span className="flex items-center gap-1 text-green-600"><Activity size={14}/> {publishedCount} pub</span>
                  </div>
               </div>
               <div className="flex flex-col gap-2">
                 <button onClick={() => { setFilterQuery(page); setActiveTab('blocks'); }} className="w-full py-2 bg-[#F6F1EB] text-[#2A160E] rounded-xl font-bold hover:bg-[#E8E1D7] transition-colors text-sm">
                   Editar Conteúdo
                 </button>
                 <Link to={page === 'home' ? '/' : page === 'global' ? '#' : `/${page}`} target="_blank" className="w-full py-2 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors text-sm text-center block">
                   Ver no site
                 </Link>
               </div>
             </div>
           );
        })}
      </div>
    );
  };

  const renderBlocksTab = () => {
    const filteredBlocks = displayBlocks.filter(b => 
      b.status !== 'archived' && 
      ((b.key || '').toLowerCase().includes((filterQuery || '').toLowerCase()) || 
       (b.title || '').toLowerCase().includes((filterQuery || '').toLowerCase()) ||
       (b.page || '').toLowerCase().includes((filterQuery || '').toLowerCase()))
    );

    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden text-sm">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center sm:gap-4 gap-2 bg-gray-50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por chave, página ou título..." 
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl w-full focus:outline-none focus:border-[#B06A32]" 
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
          </div>
          <button onClick={() => handleOpenBlockForm()} className="px-5 py-2.5 bg-[#1C1A17] text-white rounded-xl font-bold hover:bg-[#2A160E] w-full sm:w-auto">Novo Bloco</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap min-w-[800px]">
             <thead className="bg-[#F6F1EB] border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-medium text-[#2A160E]">Chave</th>
                  <th className="px-6 py-3 font-medium text-[#2A160E]">Página</th>
                  <th className="px-6 py-3 font-medium text-[#2A160E]">Tipo</th>
                  <th className="px-6 py-3 font-medium text-[#2A160E]">Visibilidade</th>
                  <th className="px-6 py-3 font-medium text-[#2A160E]">Status</th>
                  <th className="px-6 py-3 font-medium text-[#2A160E]">Última Edição</th>
                  <th className="px-6 py-3 font-medium text-[#2A160E]">Publicado Por</th>
                  <th className="px-6 py-3 font-medium text-[#2A160E] text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBlocks.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-[#1C1A17] bg-gray-100 px-2 py-1 rounded">{b.key}</span>
                      <div className="text-xs text-gray-500 mt-1">{b.title || 'Sem título'}</div>
                    </td>
                    <td className="px-6 py-4 capitalize">{b.page}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded font-bold uppercase tracking-widest">{b.type}</span>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${b.active ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
                          {b.active ? 'Visível' : 'Oculto'}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                        b.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {b.status === 'published' ? 'Publicado' : b.status === 'draft' ? 'Rascunho' : b.status === 'registry' ? 'Fallback / Registry' : b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {b.updatedAt ? new Date(b.updatedAt).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                       {b.source === 'registry' ? 'Fallback' : (b.source === 'imported' ? 'Sistema (Importação)' : (b.updatedBy || 'Admin'))}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-3 items-center">
                          {b.publicRoute && (
                            <Link to={b.publicRoute} target="_blank" className="text-gray-500 font-bold text-xs hover:text-gray-800 flex items-center gap-1"><ExternalLink size={12}/> Ver no site</Link>
                          )}
                          <button onClick={() => b.source === 'registry' ? handleRestoreDefaults() : handleOpenBlockForm(b)} className="text-[#B06A32] font-bold text-xs hover:underline">
                            {b.source === 'registry' ? 'Importar' : 'Editar'}
                          </button>
                          {b.source !== 'registry' && (
                            <>
                              {b.status === 'draft' ? (
                                 <button onClick={() => publishBlock(b.id)} className="text-green-600 font-bold text-xs hover:underline">Publicar</button>
                              ) : (
                                 <button onClick={() => unpublishBlock(b.id)} className="text-orange-600 font-bold text-xs hover:underline">Despublicar</button>
                              )}
                              <button onClick={() => duplicateBlock(b.id)} className="text-blue-600 font-bold text-xs hover:underline">Duplicar</button>
                              <button onClick={() => deleteBlock(b.id)} className="text-red-600 font-bold text-xs hover:underline">Arquivar</button>
                            </>
                          )}
                       </div>
                    </td>
                  </tr>
                ))}
                {filteredBlocks.length === 0 && (
                   <tr>
                     <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        Nenhum bloco de conteúdo encontrado. <br/>
                        <button onClick={handleRestoreDefaults} className="text-[#B06A32] font-bold underline mt-2 hover:text-[#1C1A17] transition-colors">Gerar conteúdo padrão</button>
                     </td>
                   </tr>
                )}
              </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderFaqsTab = () => {
    if (faqs.length === 0) {
      return (
        <div className="p-12 text-center bg-gray-50 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center">
          <MessageSquare className="text-gray-400 mb-4" size={32} />
          <h3 className="text-xl font-serif text-gray-800 mb-2">Nenhuma FAQ ativa.</h3>
          <p className="text-gray-500 mb-6 max-w-sm">FAQs ajudam a reduzir dúvidas antes da compra. Comece com perguntas sobre torra, entrega, moagem e assinatura.</p>
          <button onClick={handleRestoreDefaults} className="px-5 py-2.5 bg-[#1C1A17] text-white rounded-xl font-bold hover:bg-[#2A160E] transition-colors">Criar FAQ Padrão</button>
        </div>
      );
    }
    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden text-sm">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-[#1C1A17]">Perguntas Frequentes</h3>
          <button className="px-4 py-2 bg-[#1C1A17] text-white rounded-xl font-bold text-xs hover:bg-[#2A160E]">Nova FAQ</button>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead className="bg-[#F6F1EB] border-b border-gray-200">
                <tr>
                   <th className="px-6 py-3 font-medium text-[#2A160E]">Pergunta</th>
                   <th className="px-6 py-3 font-medium text-[#2A160E]">Categoria</th>
                   <th className="px-6 py-3 font-medium text-[#2A160E]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                 {faqs.map(f => (
                    <tr key={f.id} className="hover:bg-gray-50">
                       <td className="px-6 py-4 font-medium">{f.question}</td>
                       <td className="px-6 py-4">{f.category || 'Geral'}</td>
                       <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${f.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                             {f.status === 'published' ? 'Publicada' : 'Rascunho'}
                          </span>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    );
  };

  const renderBannersTab = () => {
    if (banners.length === 0) {
      return (
        <div className="p-12 text-center bg-gray-50 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center">
          <ImageIcon className="text-gray-400 mb-4" size={32} />
          <h3 className="text-xl font-serif text-gray-800 mb-2">Nenhum banner ativo agora.</h3>
          <p className="text-gray-500 mb-6 max-w-sm">Crie campanhas para lotes novos, frete grátis, Clube ou B2B para engajar seus clientes.</p>
          <button className="px-5 py-2.5 bg-[#1C1A17] text-white rounded-xl font-bold hover:bg-[#2A160E] transition-colors">Criar Primeiro Banner</button>
        </div>
      );
    }
    return (
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map(b => (
             <div key={b.id} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#B06A32] mb-2 block">{b.position}</span>
                  <h4 className="font-bold text-lg text-[#1C1A17]">{b.title}</h4>
                  {b.subtitle && <p className="text-sm text-gray-500 mt-1">{b.subtitle}</p>}
                </div>
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-50">
                   <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${b.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                       {b.active ? 'Ativo' : 'Inativo'}
                   </span>
                   <button className="text-sm font-bold text-[#B06A32]">Editar</button>
                </div>
             </div>
          ))}
       </div>
    );
  };

  const renderCtasTab = () => (
     <div className="p-12 text-center bg-white text-gray-500 border border-dashed border-gray-200 rounded-2xl">
        <h3 className="text-xl font-serif text-gray-800 mb-2">Biblioteca de Conversão (CTAs)</h3>
        <p className="max-w-md mx-auto mb-6">Esta aba centralizará todos os botões e CTAs do site, permitindo ajustes globais de links e A/B tests. Em breve.</p>
     </div>
  );

  const renderSeoTab = () => (
     <div className="p-12 text-center bg-white text-gray-500 border border-dashed border-gray-200 rounded-2xl">
        <h3 className="text-xl font-serif text-gray-800 mb-2">Otimização (SEO e Social)</h3>
        <p className="max-w-md mx-auto mb-6">Aqui você editará tags Meta, OpenGraph, Schemas e visualização nos resultados do Google de cada página. Em breve.</p>
     </div>
  );

  return (
    <div className="pb-24">
       <AdminPageHeader
          title="Conteúdo"
          subtitle="Edite textos, CTAs, FAQs, banners e blocos públicos do site CofCof sem mexer no código."
          action={{
            label: "Ver site",
            onClick: () => window.open('/', '_blank')
          }}
       >
         <button onClick={handleExportJSON} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-[#1C1A17] hover:bg-gray-50 shadow-sm transition-colors">
           <Download size={16} /> Exportar JSON
         </button>
         <button onClick={handleRestoreDefaults} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-red-600 hover:bg-gray-50 shadow-sm transition-colors">
           <RefreshCcw size={16} /> Restaurar Padrões
         </button>
       </AdminPageHeader>

       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         <AdminStatCard title="Blocos Publicados" value={publishedBlocks.length} />
         <AdminStatCard title="Rascunhos" value={draftBlocks.length} alert={draftBlocks.length > 0} />
         <AdminStatCard title="FAQs Ativas" value={activeFaqs.length} />
         <AdminStatCard title="Banners Ativos" value={activeBanners.length} />
       </div>

       {/* Tabs Navigation */}
       <div className="flex overflow-x-auto gap-2 mb-6 border-b border-gray-200 pb-px scrollbar-hide">
         {[
           { id: 'overview', label: 'Visão Geral' },
           { id: 'pages', label: 'Visão por Páginas' },
           { id: 'blocks', label: 'Todos os Blocos' },
           { id: 'faqs', label: 'FAQs' },
           { id: 'banners', label: 'Banners' },
           { id: 'ctas', label: 'CTAs' },
           { id: 'seo', label: 'SEO' },
         ].map(tab => (
           <button
             key={tab.id}
             onClick={() => { setActiveTab(tab.id as InnerTab); setFilterQuery(''); }}
             className={`px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
               activeTab === tab.id
                 ? 'border-[#B06A32] text-[#1C1A17]'
                 : 'border-transparent text-gray-500 hover:text-[#1C1A17] hover:border-gray-300'
             }`}
           >
             {tab.label}
           </button>
         ))}
       </div>

       {activeTab === 'overview' && renderOverviewTab()}
       {activeTab === 'pages' && renderPagesTab()}
       {activeTab === 'blocks' && renderBlocksTab()}
       {activeTab === 'faqs' && renderFaqsTab()}
       {activeTab === 'banners' && renderBannersTab()}
       {activeTab === 'ctas' && renderCtasTab()}
       {activeTab === 'seo' && renderSeoTab()}

       <ContentBlockFormDrawer 
         isOpen={isBlockFormOpen}
         onClose={() => setIsBlockFormOpen(false)}
         onSave={handleSaveBlock}
         block={editingBlock}
       />

       <AdminConfirmDialog
         isOpen={showRestoreConfirm}
         onClose={() => setShowRestoreConfirm(false)}
         title="Importar conteúdo atual do site público?"
         description="Vamos criar blocos editáveis no painel com base no conteúdo que já aparece no site. Nada será apagado. Você poderá revisar antes de publicar."
         confirmLabel="Importar e Manter Publicado"
         isDestructive={false}
         onConfirm={async () => {
            await restoreDefaults();
            toast.success("Conteúdo importado com sucesso! Agora a aba Conteúdo é um CMS real.");
            setShowRestoreConfirm(false);
         }}
       />
    </div>
  );
}
