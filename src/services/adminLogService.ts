import { AdminLog } from '../types/admin';
import { collection, addDoc, getDocs, query, orderBy, limit, where, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface LogPayload {
  userId: string;
  userEmail: string;
  action: string;
  entity: string;
  entityId?: string;
  before?: any;
  after?: any;
}

export const adminLogService = {
  async logAdminAction(payload: LogPayload) {
    try {
        const logsRef = collection(db, 'adminLogs');
        await addDoc(logsRef, {
            ...payload,
            createdAt: Timestamp.now()
        });
        return true;
    } catch (error) {
        console.error('Failed to write admin log:', error);
        return false;
    }
  },
  
  async getLogs(filters?: { startDate?: Date; endDate?: Date }): Promise<any[]> {
    const logsRef = collection(db, 'adminLogs');
    let q = query(logsRef, orderBy('createdAt', 'desc'));
    
    if (filters?.startDate) {
        q = query(q, where('createdAt', '>=', filters.startDate));
    }
    if (filters?.endDate) {
        q = query(q, where('createdAt', '<=', filters.endDate));
    }
    
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate()?.toISOString() }));
  }
};
