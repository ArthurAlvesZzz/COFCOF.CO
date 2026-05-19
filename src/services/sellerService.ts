import { Seller } from '../types/admin';

let mockSellers: Seller[] = [
  {
    id: 'seller_1',
    name: 'João Silva',
    status: 'active',
    type: 'internal',
    contact: { whatsapp: '34998728882', email: 'joao@cofcof.co' },
    location: { city: 'São Paulo', state: 'SP' },
    joinedAt: new Date(Date.now() - 100 * 86400000).toISOString(),
    commissionRule: {
      type: 'percentage',
      percentage: 5,
      base: 'paid_order',
      releaseOnlyAfterPayment: true,
      includeShipping: false,
      applyAfterDiscount: true
    },
    goals: {
      monthlyRevenue: 10000,
      monthlyKg: 100,
      monthlyNewCustomers: 5
    },
    stats: {
      totalRevenue: 50000,
      monthlyRevenue: 8500,
      totalCommissions: 2500,
      pendingCommissions: 150,
      paidCommissions: 2350,
      activeLeads: 12,
      customersCount: 20
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const sellerService = {
  async listSellers(): Promise<Seller[]> {
    return [...mockSellers];
  },

  async getSellerById(id: string): Promise<Seller | undefined> {
    return mockSellers.find(s => s.id === id);
  },

  async createSeller(data: Omit<Seller, 'id' | 'createdAt' | 'updatedAt'>): Promise<Seller> {
    const newSeller: Seller = {
      ...data,
      id: `sell_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Seller;
    mockSellers.push(newSeller);
    return newSeller;
  },

  async updateSeller(id: string, data: Partial<Seller>): Promise<Seller | undefined> {
    const idx = mockSellers.findIndex(s => s.id === id);
    if (idx === -1) return undefined;
    mockSellers[idx] = { ...mockSellers[idx], ...data, updatedAt: new Date().toISOString() };
    return mockSellers[idx];
  },

  async getActiveSellers(): Promise<Seller[]> {
    return mockSellers.filter(s => s.status === 'active');
  },

  async getSellerStats(sellerId: string): Promise<any> {
    return mockSellers.find(s => s.id === sellerId)?.stats || {};
  }
};
