import { useState, useCallback, useEffect } from 'react';
import { b2bLeadService } from '../services/b2bLeadService';
import { B2BLead } from '../types/admin';
import { useAdminAuthStore } from '../store/adminAuthStore';
import { adminLogService } from '../services/adminLogService';

export function useB2BLeads() {
  const [leads, setLeads] = useState<B2BLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAdminAuthStore();

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const data = await b2bLeadService.listLeads();
      setLeads(data.filter(l => !l.archived));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar leads');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const createLead = async (data: Partial<B2BLead>) => {
    try {
      const created = await b2bLeadService.createLead(data);
      if (user) {
        await adminLogService.logAdminAction({
          userId: user.id,
          userEmail: user.email,
          action: 'create_lead',
          entity: 'b2b_lead',
          entityId: created.id
        });
      }
      await fetchLeads();
      return created;
    } catch (err: any) {
       alert(err.message);
       throw err;
    }
  };

  const updateLead = async (id: string, data: Partial<B2BLead>) => {
    const updated = await b2bLeadService.updateLead(id, data);
    if (updated && user) {
      await adminLogService.logAdminAction({
        userId: user.id,
        userEmail: user.email,
        action: 'update_lead',
        entity: 'b2b_lead',
        entityId: id
      });
    }
    await fetchLeads();
    return updated;
  };

  const updateStatus = async (id: string, status: B2BLead['status'], note?: string) => {
    const updated = await b2bLeadService.updateLeadStatus(id, status, note);
    if (updated && user) {
      await adminLogService.logAdminAction({
         userId: user.id,
         userEmail: user.email,
         action: 'update_lead_status',
         entity: 'b2b_lead',
         entityId: id,
         after: { status, note }
      });
    }
    await fetchLeads();
    return updated;
  };

  const assignResponsible = async (id: string, sellerId: string) => {
    const updated = await b2bLeadService.assignResponsible(id, sellerId);
    if (updated && user) {
       await adminLogService.logAdminAction({
         userId: user.id,
         userEmail: user.email,
         action: 'assign_lead_seller',
         entity: 'b2b_lead',
         entityId: id,
         after: { sellerId }
       });
    }
    await fetchLeads();
    return updated;
  }

  const addFollowUp = async (id: string, followUp: Omit<NonNullable<B2BLead['followUps']>[0], 'id' | 'createdAt'>) => {
    const updated = await b2bLeadService.addFollowUp(id, followUp);
    if (updated && user) {
       await adminLogService.logAdminAction({
         userId: user.id,
         userEmail: user.email,
         action: 'add_lead_followup',
         entity: 'b2b_lead',
         entityId: id,
       });
    }
    await fetchLeads();
    return updated;
  };

  const addNote = async (id: string, text: string) => {
    if (!user) return;
    const updated = await b2bLeadService.addLeadNote(id, text, {id: user.id, name: user.email});
    if (updated) {
       await adminLogService.logAdminAction({
         userId: user.id,
         userEmail: user.email,
         action: 'add_lead_note',
         entity: 'b2b_lead',
         entityId: id,
       });
    }
    await fetchLeads();
    return updated;
  };

  const createProposal = async (id: string, proposal: B2BLead['proposal']) => {
    const updated = await b2bLeadService.createProposal(id, proposal);
    if (user && updated) {
       await adminLogService.logAdminAction({
         userId: user.id,
         userEmail: user.email,
         action: 'create_lead_proposal',
         entity: 'b2b_lead',
         entityId: id,
       });
    }
    await fetchLeads();
    return updated;
  }

  const convertToCustomer = async (id: string) => {
    const result = await b2bLeadService.convertLeadToCustomer(id);
    if (user && result) {
       await adminLogService.logAdminAction({
         userId: user.id,
         userEmail: user.email,
         action: 'convert_lead',
         entity: 'b2b_lead',
         entityId: id,
         after: { customerId: result.customer.id }
       });
    }
    await fetchLeads();
    return result;
  };

  const markLost = async (id: string, reason: string, notes?: string) => {
     const updated = await b2bLeadService.markLeadLost(id, reason, notes);
     if (user && updated) {
       await adminLogService.logAdminAction({
         userId: user.id,
         userEmail: user.email,
         action: 'mark_lead_lost',
         entity: 'b2b_lead',
         entityId: id,
         after: { reason }
       });
     }
     await fetchLeads();
     return updated;
  };

  const archiveLead = async (id: string) => {
     if (!window.confirm("Deseja mesmo arquivar este lead?")) return;
     const archived = await b2bLeadService.archiveLead(id);
     if (archived && user) {
       await adminLogService.logAdminAction({
         userId: user.id,
         userEmail: user.email,
         action: 'archive_lead',
         entity: 'b2b_lead',
         entityId: id
       });
     }
     await fetchLeads();
     return archived;
  }

  const exportCSV = async () => {
    const csv = await b2bLeadService.exportLeadsCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_b2b_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    leads,
    loading,
    error,
    createLead,
    updateLead,
    updateStatus,
    assignResponsible,
    addFollowUp,
    addNote,
    createProposal,
    convertToCustomer,
    markLost,
    archiveLead,
    exportCSV,
    refresh: fetchLeads
  };
}
