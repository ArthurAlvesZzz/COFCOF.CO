import { useState, useCallback, useEffect } from 'react';
import { sellerService } from '../services/sellerService';
import { Seller } from '../types/admin';
import { useAdminAuthStore } from '../store/adminAuthStore';
import { adminLogService } from '../services/adminLogService';

export function useSellers() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAdminAuthStore();

  const fetchSellers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await sellerService.listSellers();
      setSellers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar vendedores');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  const logAction = async (action: string, entityId: string, details?: any) => {
    if (user) {
      await adminLogService.logAdminAction({
        userId: user.id,
        userEmail: user.email,
        action,
        entity: 'seller',
        entityId,
        after: details
      });
    }
  };

  const createSeller = async (data: any) => {
    const res = await sellerService.createSeller(data);
    await logAction('create_seller', res.id, data);
    await fetchSellers();
    return res;
  };

  const updateSeller = async (id: string, data: any) => {
    const res = await sellerService.updateSeller(id, data);
    if(res) {
       await logAction('update_seller', id, data);
       await fetchSellers();
    }
    return res;
  };

  return {
    sellers,
    loading,
    error,
    refresh: fetchSellers,
    createSeller,
    updateSeller
  };
}
