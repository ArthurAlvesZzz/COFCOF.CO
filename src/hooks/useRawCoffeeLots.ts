import { useState, useCallback, useEffect } from 'react';
import { rawCoffeeLotService } from '../services/rawCoffeeLotService';
import { RawCoffeeLot, StockMovement } from '../types/admin';
import { useAdminAuthStore } from '../store/adminAuthStore';
import { adminLogService } from '../services/adminLogService';

export function useRawCoffeeLots() {
  const [lots, setLots] = useState<RawCoffeeLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAdminAuthStore();

  const fetchLots = useCallback(async () => {
    try {
      setLoading(true);
      const data = await rawCoffeeLotService.listRawCoffeeLots();
      setLots(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar lotes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLots();
  }, [fetchLots]);

  const logAction = async (action: string, entityId: string, details?: any) => {
    if (user) {
      await adminLogService.logAdminAction({
        userId: user.id,
        userEmail: user.email,
        action,
        entity: 'raw_coffee_lot',
        entityId,
        after: details
      });
    }
  };

  const saveLot = async (id: string | null, data: Partial<RawCoffeeLot>) => {
    let saved;
    if (id) {
      saved = await rawCoffeeLotService.updateRawCoffeeLot(id, data);
      if (saved) await logAction('update_lot', id, data);
    } else {
      saved = await rawCoffeeLotService.createRawCoffeeLot(data as any);
      if (saved) await logAction('create_lot', saved.id, data);
    }
    await fetchLots();
    return saved;
  };

  const checkCodeUnique = async (code: string, ignoreId?: string) => {
    return await rawCoffeeLotService.validateLotCodeUnique(code, ignoreId);
  };

  const archiveLot = async (id: string) => {
    const success = await rawCoffeeLotService.archiveRawCoffeeLot(id);
    if (success) await logAction('archive_lot', id);
    await fetchLots();
    return success;
  };

  const registerEntry = async (lotId: string, data: { quantityKg: number; reason?: string; supplier?: string }) => {
     if (!user) return undefined;
     const result = await rawCoffeeLotService.registerRawLotEntry(lotId, { ...data, userId: user.id });
     if (result) await logAction('register_lot_entry', lotId, data);
     await fetchLots();
     return result;
  };

  const adjustBalance = async (lotId: string, data: { newBalanceKg?: number; adjustmentKg?: number; type: StockMovement['type']; reason: string }) => {
     if (!user) return undefined;
     const result = await rawCoffeeLotService.adjustRawLotBalance(lotId, { ...data, userId: user.id });
     if (result) await logAction('adjust_lot_balance', lotId, data);
     await fetchLots();
     return result;
  };
  
  const getMovements = async (lotId: string) => {
     return await rawCoffeeLotService.getRawLotMovements(lotId);
  };

  return {
    lots,
    loading,
    error,
    refresh: fetchLots,
    saveLot,
    checkCodeUnique,
    archiveLot,
    registerEntry,
    adjustBalance,
    getMovements
  };
}
