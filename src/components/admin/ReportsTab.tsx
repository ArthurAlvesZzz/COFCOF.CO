import React from 'react';
import { AdminPageHeader } from './AdminPageHeader';
import { AdminStatCard } from './AdminStatCard';

export function ReportsTab() {
  return (
    <div className="pb-24">
       <AdminPageHeader
          title="Relatórios Operacionais"
          subtitle="Acompanhe o desempenho de vendas, estoque, comissões e clientes."
          action={{
             label: "Exportar Relatório Geral",
             onClick: () => alert('A exportação do relatório geral estará disponível na próxima versão.')
          }}
       />

       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <AdminStatCard title="Receita (Mês)" value="R$ 45.000" />
          <AdminStatCard title="Pedidos" value="120" />
          <AdminStatCard title="Novos Clientes" value="34" />
          <AdminStatCard title="Comissões Pagas" value="R$ 3.400" />
       </div>

       <div className="bg-white border p-12 text-center rounded-2xl">
          <h3 className="font-serif text-xl mb-4">Relatórios detalhados em breve</h3>
          <p className="text-gray-500">Estamos trabalhando para trazer os melhores insights para sua operação.</p>
       </div>
    </div>
  );
}
