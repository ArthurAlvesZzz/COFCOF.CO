import { useState, useCallback, useEffect } from 'react';
import { stockService } from '../services/stockService';
import { StockItem, StockMovement } from '../types/admin';
import { useAdminAuthStore } from '../store/adminAuthStore';
import { adminLogService } from '../services/adminLogService';

export function useStock() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAdminAuthStore();

  const fetchStock = useCallback(async () => {
    try {
      setLoading(true);
      const [fetchedItems, fetchedStats] = await Promise.all([
         stockService.listStockItems(),
         stockService.getStockStats()
      ]);
      setItems(fetchedItems);
      setStats(fetchedStats);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar estoque');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  const logAction = async (action: string, entityId: string, details?: any) => {
    if (user) {
      await adminLogService.logAdminAction({
        userId: user.id,
        userEmail: user.email,
        action,
        entity: 'stock',
        entityId,
        after: details
      });
    }
  };

  const adjustStock = async (data: any) => {
    if (!user) return;
    const res = await stockService.adjustStock({ ...data, userId: user.id, userName: user.name });
    await logAction('adjust_stock', data.stockItemId, data);
    await fetchStock();
    return res;
  };

  const registerCourtesy = async (data: any) => {
    if (!user) return;
    const res = await stockService.registerCourtesy({ ...data, userId: user.id, userName: user.name });
    await logAction('register_courtesy', data.stockItemId, data);
    await fetchStock();
    return res;
  };
  
  const getMovements = async () => {
     return await stockService.getMovements();
  };
  
  const createStockItem = async (data: any) => {
     const res = await stockService.createStockItem(data);
     await fetchStock();
     return res;
  };

  return {
    items,
    stats,
    loading,
    error,
    refresh: fetchStock,
    adjustStock,
    registerCourtesy,
    getMovements,
    createStockItem
  };
}
