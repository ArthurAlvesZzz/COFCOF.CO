import { useState, useEffect, useCallback } from 'react';
import { OrderAdmin } from '../types/admin';
import { orderService } from '../services/orderService';
import { adminLogService } from '../services/adminLogService';
import { useAdminAuthStore } from '../store/adminAuthStore';

export function useOrders() {
  const [orders, setOrders] = useState<OrderAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAdminAuthStore();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await orderService.listOrders();
      setOrders(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (id: string, status: OrderAdmin['status'], note?: string) => {
    const updated = await orderService.updateOrderStatus(id, status, note, user ? { id: user.id, name: user.email } : undefined);
    if (updated && user) {
      await adminLogService.logAdminAction({
        userId: user.id,
        userEmail: user.email,
        action: 'update_order_status',
        entity: 'order',
        entityId: id,
        after: { status }
      });
    }
    await fetchOrders();
    return updated;
  };

  const addNote = async (id: string, text: string) => {
    if (!user) return;
    const updated = await orderService.addInternalNote(id, text, { id: user.id, name: user.email });
    if (updated) {
       await adminLogService.logAdminAction({
        userId: user.id,
        userEmail: user.email,
        action: 'add_order_note',
        entity: 'order',
        entityId: id,
        after: { text }
      });
    }
    await fetchOrders();
    return updated;
  };

  const exportCSV = async () => {
    const csv = await orderService.exportOrdersCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `pedidos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    orders,
    loading,
    error,
    updateStatus,
    addNote,
    exportCSV,
    refresh: fetchOrders
  };
}
