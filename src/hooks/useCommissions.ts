import { useState, useCallback, useEffect } from 'react';
import { commissionService } from '../services/commissionService';
import { Commission } from '../types/admin';
import { useAdminAuthStore } from '../store/adminAuthStore';
import { adminLogService } from '../services/adminLogService';

export function useCommissions() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAdminAuthStore();

  const fetchCommissions = useCallback(async () => {
    try {
      setLoading(true);
      const [data, fetchedStats] = await Promise.all([
         commissionService.listCommissions(),
         commissionService.getCommissionStats()
      ]);
      setCommissions(data);
      setStats(fetchedStats);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar comissões');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommissions();
  }, [fetchCommissions]);

  const logAction = async (action: string, entityId: string, details?: any) => {
    if (user) {
      await adminLogService.logAdminAction({
        userId: user.id,
        userEmail: user.email,
        action,
        entity: 'commission',
        entityId,
        after: details
      });
    }
  };

  const createManualCommission = async (data: any) => {
    const res = await commissionService.createManualCommission(data);
    await logAction('create_manual_commission', res.id, data);
    await fetchCommissions();
    return res;
  };

  const approveCommission = async (id: string) => {
    const res = await commissionService.approveCommission(id);
    if(res) {
       await logAction('approve_commission', id);
       await fetchCommissions();
    }
    return res;
  };

  const markAsPaid = async (id: string, data: any) => {
    const res = await commissionService.markCommissionAsPaid(id, data);
    if(res) {
       await logAction('pay_commission', id, data);
       await fetchCommissions();
    }
    return res;
  };

  const cancelCommission = async (id: string, reason: string) => {
    const res = await commissionService.cancelCommission(id, reason);
    if(res) {
       await logAction('cancel_commission', id, { reason });
       await fetchCommissions();
    }
    return res;
  };

  const adjustCommission = async (id: string, newValue: number, reason: string) => {
    const res = await commissionService.adjustCommissionValue(id, newValue, reason);
    if(res) {
       await logAction('adjust_commission', id, { newValue, reason });
       await fetchCommissions();
    }
    return res;
  };

  return {
    commissions,
    stats,
    loading,
    error,
    refresh: fetchCommissions,
    createManualCommission,
    approveCommission,
    markAsPaid,
    cancelCommission,
    adjustCommission
  };
}
