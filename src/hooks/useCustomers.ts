import { useState, useEffect, useCallback } from 'react';
import { CustomerAdmin } from '../types/admin';
import { customerService } from '../services/customerService';
import { adminLogService } from '../services/adminLogService';
import { useAdminAuthStore } from '../store/adminAuthStore';

export function useCustomers() {
  const [customers, setCustomers] = useState<CustomerAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAdminAuthStore();

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await customerService.listCustomers();
      // Only show non-archived by default
      setCustomers(data.filter(c => !c.archived));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const updateCustomer = async (id: string, data: Partial<CustomerAdmin>) => {
    const updated = await customerService.updateCustomer(id, data);
    if (updated && user) {
      await adminLogService.logAdminAction({
        userId: user.id,
        userEmail: user.email,
        action: 'update_customer',
        entity: 'customer',
        entityId: id
      });
    }
    await fetchCustomers();
    return updated;
  };

  const createCustomer = async (data: Partial<CustomerAdmin>) => {
    const created = await customerService.createCustomer(data);
    if (created && user) {
      await adminLogService.logAdminAction({
        userId: user.id,
        userEmail: user.email,
        action: 'create_customer',
        entity: 'customer',
        entityId: created.id
      });
    }
    await fetchCustomers();
    return created;
  };

  const addNote = async (id: string, text: string) => {
    if (!user) return;
    const updated = await customerService.addCustomerNote(id, text, { id: user.id, name: user.email });
    if (updated) {
      await adminLogService.logAdminAction({
        userId: user.id,
        userEmail: user.email,
        action: 'add_customer_note',
        entity: 'customer',
        entityId: id,
        after: { text }
      });
    }
    await fetchCustomers();
    return updated;
  };

  const archiveCustomer = async (id: string) => {
    if (!user) return;
    if (!window.confirm("Deseja arquivar este cliente? Ele não aparecerá mais na lista principal.")) return;
    const archived = await customerService.archiveCustomer(id);
    if (archived) {
       await adminLogService.logAdminAction({
        userId: user.id,
        userEmail: user.email,
        action: 'archive_customer',
        entity: 'customer',
        entityId: id
      });
      await fetchCustomers();
    }
    return archived;
  };

  const exportCSV = async () => {
    const csv = await customerService.exportCustomersCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `clientes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    if (user) {
      await adminLogService.logAdminAction({
        userId: user.id,
        userEmail: user.email,
        action: 'export_customers',
        entity: 'customer'
      });
    }
  };

  return {
    customers,
    loading,
    error,
    updateCustomer,
    createCustomer,
    addNote,
    archiveCustomer,
    exportCSV,
    refresh: fetchCustomers
  };
}
