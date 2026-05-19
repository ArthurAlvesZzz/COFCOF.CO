import { Commission } from '../types/admin';

let mockCommissions: Commission[] = [
  {
     id: 'comm_1',
     sellerId: 'seller_1',
     sellerName: 'João Silva',
     sourceType: 'order',
     sourceId: 'ord_123',
     customerName: 'Maria Oliveira',
     baseValue: 150,
     calculationBase: 'net_sale',
     ruleSnapshot: {
       type: 'percentage',
       percentage: 5,
       releaseOnlyAfterPayment: true
     },
     commissionValue: 7.5,
     finalValue: 7.5,
     status: 'pending',
     dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
     createdAt: new Date().toISOString(),
     updatedAt: new Date().toISOString()
  },
  {
     id: 'comm_2',
     sellerId: 'seller_1',
     sellerName: 'João Silva',
     sourceType: 'consignment',
     sourceId: 'cons_1',
     partnerName: 'Empório do Val do Cerrado',
     baseValue: 300,
     calculationBase: 'net_sale',
     ruleSnapshot: {
       type: 'percentage',
       percentage: 5,
       releaseOnlyAfterPayment: true
     },
     commissionValue: 15,
     finalValue: 15,
     status: 'approved',
     approvedAt: new Date().toISOString(),
     createdAt: new Date().toISOString(),
     updatedAt: new Date().toISOString()
  }
];

export const commissionService = {
  async listCommissions(): Promise<Commission[]> {
    return [...mockCommissions].sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  },

  async getCommissionById(id: string): Promise<Commission | undefined> {
    return mockCommissions.find(c => c.id === id);
  },

  async getCommissionsBySeller(sellerId: string): Promise<Commission[]> {
    return mockCommissions.filter(c => c.sellerId === sellerId);
  },

  async createManualCommission(data: Partial<Commission>): Promise<Commission> {
    const comm: Commission = {
      ...data,
      id: `comm_${Math.random().toString(36).substr(2, 9)}`,
      status: data.status || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Commission;
    mockCommissions.push(comm);
    return comm;
  },

  async approveCommission(id: string): Promise<Commission | undefined> {
    const idx = mockCommissions.findIndex(c => c.id === id);
    if (idx === -1) return undefined;
    mockCommissions[idx].status = 'approved';
    mockCommissions[idx].approvedAt = new Date().toISOString();
    mockCommissions[idx].updatedAt = new Date().toISOString();
    return mockCommissions[idx];
  },

  async markCommissionAsPaid(id: string, paymentData: any): Promise<Commission | undefined> {
    const idx = mockCommissions.findIndex(c => c.id === id);
    if (idx === -1) return undefined;
    mockCommissions[idx].status = 'paid';
    mockCommissions[idx].paidAt = new Date().toISOString();
    mockCommissions[idx].paymentMethod = paymentData.method;
    mockCommissions[idx].updatedAt = new Date().toISOString();
    return mockCommissions[idx];
  },

  async cancelCommission(id: string, reason: string): Promise<Commission | undefined> {
    const idx = mockCommissions.findIndex(c => c.id === id);
    if (idx === -1) return undefined;
    mockCommissions[idx].status = 'cancelled';
    mockCommissions[idx].cancelReason = reason;
    mockCommissions[idx].updatedAt = new Date().toISOString();
    return mockCommissions[idx];
  },

  async adjustCommissionValue(id: string, newValue: number, reason: string): Promise<Commission | undefined> {
    const idx = mockCommissions.findIndex(c => c.id === id);
    if (idx === -1) return undefined;
    mockCommissions[idx].adjustedValue = newValue;
    mockCommissions[idx].finalValue = newValue;
    mockCommissions[idx].adjustmentReason = reason;
    mockCommissions[idx].updatedAt = new Date().toISOString();
    return mockCommissions[idx];
  },

  async getCommissionStats(): Promise<any> {
    return {
       pending: mockCommissions.filter(c => c.status === 'pending').length,
       approved: mockCommissions.filter(c => c.status === 'approved').length,
       paid: mockCommissions.filter(c => c.status === 'paid').length,
       pendingValue: mockCommissions.filter(c => c.status === 'pending').reduce((acc, c) => acc + c.finalValue, 0),
       approvedValue: mockCommissions.filter(c => c.status === 'approved').reduce((acc, c) => acc + c.finalValue, 0),
       paidValue: mockCommissions.filter(c => c.status === 'paid').reduce((acc, c) => acc + c.finalValue, 0),
    };
  }
};
