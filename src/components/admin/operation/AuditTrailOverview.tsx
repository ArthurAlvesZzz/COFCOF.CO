import React from 'react';
import { adminLogService } from '../../../services/adminLogService';
import { History, User, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { OperationEmptyState } from './OperationEmptyState';

export function AuditTrailOverview() {
  const [logs, setLogs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    const data = await adminLogService.getLogs();
    setLogs(data);
    setLoading(false);
  };

  const formatAction = (action: string) => {
    return action.replace(/_/g, ' ').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-xl font-black tracking-tight text-[#1C1A17]">Registro Operacional</h2>
         <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-gray-100">
           Timeline de Atividades
         </span>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2rem] p-6">
        {loading ? (
            <p className="text-sm font-medium text-gray-500">Carregando auditoria...</p>
        ) : logs.length === 0 ? (
            <OperationEmptyState 
              icon={History}
              title="Sem histórico"
              description="Nenhum evento registrado no período."
            />
        ) : (
            <div className="relative border-l-2 border-gray-100 ml-4 space-y-8 pb-4">
               {logs.map((log) => (
                  <div key={log.id} className="relative pl-8 group">
                      <div className="absolute w-4 h-4 bg-white border-2 border-[#1C1A17] rounded-full -left-[9px] top-1 group-hover:bg-[#B06A32] group-hover:border-[#B06A32] transition-colors" />
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                         <div className="flex items-center gap-2">
                             <span className="text-xs font-black uppercase tracking-widest text-[#B06A32]">{formatAction(log.action)}</span>
                             <span className="text-[10px] font-bold text-gray-400">em</span>
                             <span className="text-xs font-bold text-[#1C1A17]">{log.entity}</span>
                         </div>
                         <span className="text-xs font-medium text-gray-500">
                             {log.createdAt ? format(new Date(log.createdAt), "dd MMM 'às' HH:mm", { locale: ptBR }) : 'Desconhecido'}
                         </span>
                      </div>
                                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                          <div className="flex items-center gap-3 mb-3">
                             <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                                <User size={14} className="text-gray-400" />
                             </div>
                             <div>
                                <p className="text-xs font-black text-[#1C1A17]">{log.userEmail}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Responsável</p>
                             </div>
                          </div>
                          
                          {/* Rich Content Extraction */}
                          {log.after && (
                             <div className="bg-white border border-gray-200 rounded-xl p-3 mb-3">
                                {log.after.name && <p className="text-xs font-black text-[#1C1A17] mb-1">Nome/Lote: {log.after.name}</p>}
                                {log.after.stock?.purchasedKg && <p className="text-xs font-medium text-gray-600"><span className="font-bold text-gray-400 mr-1">Comprado:</span> {log.after.stock.purchasedKg}kg</p>}
                                {log.after.purchase?.finalTotalCost && <p className="text-xs font-medium text-gray-600"><span className="font-bold text-gray-400 mr-1">Valor:</span> R$ {log.after.purchase.finalTotalCost.toLocaleString('pt-BR')}</p>}
                                {log.after.rawKgUsed && <p className="text-xs font-medium text-gray-600"><span className="font-bold text-gray-400 mr-1">Cru Consumido:</span> {log.after.rawKgUsed}kg</p>}
                                {log.after.roastedKgOutput && <p className="text-xs font-medium text-gray-600"><span className="font-bold text-gray-400 mr-1">Torrado Produzido:</span> {log.after.roastedKgOutput}kg</p>}
                                {log.after.totalKg && <p className="text-xs font-medium text-gray-600"><span className="font-bold text-gray-400 mr-1">Total Empacotado:</span> {log.after.totalKg}kg</p>}
                                {log.after.packageFormat && <p className="text-xs font-medium text-gray-600"><span className="font-bold text-gray-400 mr-1">Formato:</span> {log.after.packageFormat}</p>}
                                {log.after.quantityUnits && <p className="text-xs font-medium text-gray-600"><span className="font-bold text-gray-400 mr-1">Unidades:</span> {log.after.quantityUnits}</p>}
                                {log.after.totalHours && <p className="text-xs font-medium text-gray-600"><span className="font-bold text-gray-400 mr-1">Horas Registradas:</span> {log.after.totalHours}h</p>}
                                {log.after.roasterName && <p className="text-xs font-medium text-gray-600"><span className="font-bold text-gray-400 mr-1">Mestre:</span> {log.after.roasterName}</p>}
                             </div>
                          )}

                          {log.entityId && (
                             <p className="text-[10px] font-bold text-gray-400 mb-2 font-mono">
                                ID: {log.entityId}
                             </p>
                          )}
                          
                          {(log.after || log.before) && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                               <button className="text-[10px] font-black uppercase tracking-widest text-[#B06A32] flex items-center gap-1 hover:text-[#1C1A17] transition-colors">
                                  <FileText size={12} />
                                  Ver Payload Completo
                               </button>
                            </div>
                          )}
                      </div>
                  </div>
               ))}
            </div>
        )}
      </div>
    </div>
  );
}
