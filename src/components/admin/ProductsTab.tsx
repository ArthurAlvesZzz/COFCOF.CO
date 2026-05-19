import React, { useState } from 'react';
import { ProductAdmin } from '../../types/admin';
import { useProducts } from '../../hooks/useProducts';
import { AdminPageHeader } from './AdminPageHeader';
import { AdminStatCard } from './AdminStatCard';
import { AdminEmptyState } from './AdminEmptyState';
import { PackageOpen, ExternalLink, MoreVertical, Edit, Copy, Eye, EyeOff, Archive, Star, Download } from 'lucide-react';
import { ProductFormDrawer } from './ProductFormDrawer';
import { exportToCSV } from '../../lib/export';
import toast from 'react-hot-toast';
import { AdminConfirmDialog } from './ui/AdminConfirmDialog';

export function ProductsTab() {
  const { products, loading, toggleActive, archiveProduct, createProduct, updateProduct } = useProducts();
  const [editingProduct, setEditingProduct] = useState<ProductAdmin | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [productToArchive, setProductToArchive] = useState<string | null>(null);
  
  const [filterQuery, setFilterQuery] = useState('');

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Carregando produtos...</div>;
  }

  const activeCount = products.filter(p => p.active).length;
  const inativeCount = products.filter(p => !p.active).length;
  const featuredCount = products.filter(p => p.featured).length;
  const lowStockCount = products.filter(p => p.stock < 10 && p.stock > 0).length;

  const filteredProducts = products.filter(p => !p.archived && (
    (p.name || '').toLowerCase().includes((filterQuery || '').toLowerCase()) || 
    (p.category || '').toLowerCase().includes((filterQuery || '').toLowerCase())
  ));

  const handleExport = () => {
    const headers = ['Nome', 'Categoria', 'Formato', 'Preço (R$)', 'Estoque', 'Status', 'Destaque'];
    const rows = filteredProducts.map(p => [
      p.name, p.category, p.format, p.price, p.stock, 
      p.active ? 'Ativo' : 'Inativo',
      p.featured ? 'Sim' : 'Não'
    ]);
    exportToCSV('produtos.csv', headers, rows);
    toast.success('CSV exportado!');
  };



  const handleCreate = () => {
    setEditingProduct(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (product: ProductAdmin) => {
    setEditingProduct(product);
    setIsDrawerOpen(true);
  };

  const handleDuplicate = async (product: ProductAdmin) => {
    const { id, ...dataToDuplicate } = product;
    await createProduct({
      ...dataToDuplicate,
      name: `${product.name} (Cópia)`,
      slug: `${product.slug}-copia`,
      active: false // create as inactive by default
    });
  };

  const handleSave = async (data: Partial<ProductAdmin>) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, data);
    } else {
      await createProduct(data as any);
    }
    setIsDrawerOpen(false);
  };

  return (
    <div>
      <AdminPageHeader 
        title="Produtos" 
        subtitle="Gerencie cafés, formatos, preços, estoque e informações do catálogo."
        action={{
          label: "Novo Produto",
          onClick: handleCreate
        }}
      >
        <button onClick={handleExport} className="bg-white border border-gray-200 text-[#1C1A17] px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-colors">
          <Download size={16} /> Exportar
        </button>
      </AdminPageHeader>

      {products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <AdminStatCard title="Ativos" value={activeCount} />
          <AdminStatCard title="Inativos" value={inativeCount} />
          <AdminStatCard title="Em Destaque" value={featuredCount} />
          <AdminStatCard title="Estoque Baixo" value={lowStockCount} alert={lowStockCount > 0} />
        </div>
      )}

      {products.length === 0 ? (
         <AdminEmptyState 
           title="Nenhum produto cadastrado"
           description="Cadastre o primeiro café para alimentar o catálogo, checkout e estoque."
           action={{ label: "Criar Produto", onClick: handleCreate }}
           icon={<PackageOpen size={32} />}
         />
      ) : (
        <div className="bg-white border text-sm max-w-full border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex gap-4">
             <input 
               type="text" 
               placeholder="Buscar por nome ou categoria..." 
               className="flex-1 border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-sm focus:outline-none focus:border-[#C89B5A]"
               value={filterQuery}
               onChange={(e) => setFilterQuery(e.target.value)}
             />
             <select className="border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-sm focus:outline-none focus:border-[#C89B5A]">
               <option value="all">Todos os Status</option>
               <option value="active">Ativos</option>
               <option value="inactive">Inativos</option>
             </select>
          </div>
          
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left whitespace-nowrap min-w-[800px]">
              <thead className="bg-[#F6F1EB] border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-medium text-[#2A160E] w-12"></th>
                  <th className="px-6 py-4 font-medium text-[#2A160E]">Produto</th>
                  <th className="px-6 py-4 font-medium text-[#2A160E]">Categoria / Formato</th>
                  <th className="px-6 py-4 font-medium text-[#2A160E]">Preço (R$)</th>
                  <th className="px-6 py-4 font-medium text-[#2A160E]">Estoque</th>
                  <th className="px-6 py-4 font-medium text-[#2A160E]">Status</th>
                  <th className="px-6 py-4 font-medium text-[#2A160E] text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                       <div className="w-10 h-10 rounded-lg bg-gray-200 overflow-hidden flex items-center justify-center">
                         {p.mainImage ? <img src={p.mainImage} alt={p.name} className="w-full h-full object-cover" /> : <PackageOpen size={20} className="text-gray-400" />}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="font-bold text-[#1C1A17] flex items-center gap-2">
                         {p.name}
                         {p.featured && <Star size={14} className="text-amber-500 fill-amber-500" />}
                       </div>
                       <div className="text-xs text-gray-500">{p.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#1C1A17]">{p.category}</div>
                      <div className="text-xs text-gray-500">{p.format}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-[#1C1A17]">{p.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-1 rounded text-xs font-bold ${p.stock <= 0 ? 'bg-red-100 text-red-800' : p.stock < 10 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                         {p.stock} undis
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-3 py-1 rounded-full text-xs font-medium border ${p.active ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                         {p.active ? 'Ativo no Site' : 'Inativo'}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <button onClick={() => handleEdit(p)} className="p-2 text-gray-400 hover:text-[#B06A32] transition-colors tooltip-trigger" title="Editar">
                           <Edit size={16} />
                         </button>
                         <button onClick={() => handleDuplicate(p)} className="p-2 text-gray-400 hover:text-[#B06A32] transition-colors tooltip-trigger" title="Duplicar">
                           <Copy size={16} />
                         </button>
                         <button onClick={() => toggleActive(p.id)} className="p-2 text-gray-400 hover:text-[#1C1A17] transition-colors tooltip-trigger" title={p.active ? "Desativar" : "Ativar"}>
                           {p.active ? <EyeOff size={16} /> : <Eye size={16} />}
                         </button>
                         <button onClick={() => setProductToArchive(p.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors tooltip-trigger" title="Arquivar">
                           <Archive size={16} />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ProductFormDrawer 
        isOpen={isDrawerOpen}
        product={editingProduct} 
        onClose={() => setIsDrawerOpen(false)} 
        onSave={handleSave} 
      />

      <AdminConfirmDialog
        isOpen={!!productToArchive}
        onClose={() => setProductToArchive(null)}
        title="Arquivar Produto"
        description="Tem certeza que deseja arquivar este produto? Ele não ficará mais disponível na loja."
        confirmLabel="Arquivar Produto"
        isDestructive={true}
        onConfirm={async () => {
          if (productToArchive) {
            await archiveProduct(productToArchive);
            toast.success("Produto arquivado.");
          }
        }}
      />
    </div>
  );
}
