import { useState, useCallback, useEffect } from 'react';
import { consignmentService } from '../services/consignmentService';
import { Consignment } from '../types/admin';
import { useAdminAuthStore } from '../store/adminAuthStore';
import { adminLogService } from '../services/adminLogService';

export function useConsignments() {
  const [consignments, setConsignments] = useState<Consignment[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAdminAuthStore();

  const fetchConsignments = useCallback(async () => {
    try {
      setLoading(true);
      const [fetchedCons, fetchedStats] = await Promise.all([
         consignmentService.listConsignments(),
         consignmentService.getConsignmentStats()
      ]);
      setConsignments(fetchedCons);
      setStats(fetchedStats);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar consignações');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConsignments();
  }, [fetchConsignments]);

  const logAction = async (action: string, entityId: string, details?: any) => {
    if (user) {
      await adminLogService.logAdminAction({
        userId: user.id,
        userEmail: user.email,
        action,
        entity: 'consignment',
        entityId,
        after: details
      });
    }
  };

  const createConsignment = async (data: any) => {
    const res = await consignmentService.createConsignment(data);
    await logAction('create_consignment', res.id, data);
    await fetchConsignments();
    return res;
  };

  const registerSettlement = async (id: string, data: any) => {
    const res = await consignmentService.registerConsignmentSettlement(id, data);
    if(res) {
       await logAction('settle_consignment', id, data);
       await fetchConsignments();
    }
    return res;
  };

  const registerPayment = async (id: string, data: any) => {
    const res = await consignmentService.registerConsignmentPayment(id, { ...data, userId: user?.id });
    if(res) {
       await logAction('pay_consignment', id, data);
       await fetchConsignments();
    }
    return res;
  };

  return {
    consignments,
    stats,
    loading,
    error,
    refresh: fetchConsignments,
    createConsignment,
    registerSettlement,
    registerPayment
  };
}
