import { Consignment, StockMovement } from '../types/admin';

const STORAGE_KEY = 'cofcof_mock_consignments';

let mockConsignments: Consignment[] = (() => {
  try {
     const saved = localStorage.getItem(STORAGE_KEY);
     if (saved) return JSON.parse(saved);
  } catch(e) {}
  return [
  {
    id: 'cons_1',
    code: 'CONS-4091',
    recipientType: 'partner',
    recipientName: 'Empório do Val do Cerrado',
    recipientWhatsapp: '5534998728882',
    startDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    dueDate: new Date(Date.now() + 10 * 86400000).toISOString(),
    status: 'open',
    agreementType: 'consignment',
    paymentStatus: 'pending',
    totalValue: 700,
    receivedValue: 0,
    soldValue: 0,
    pendingValue: 700,
    items: [
      {
        id: 'ci_1',
        productId: 'p_1',
        productName: 'Cerrado Premium 250g',
        quantitySent: 20,
        quantitySold: 0,
        quantityReturned: 0,
        quantityPending: 20,
        unitPrice: 35,
        totalValue: 700,
        soldValue: 0,
        pendingValue: 700
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
    ];
})();

const saveConsignments = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockConsignments));
};

export const consignmentService = {
  async listConsignments(): Promise<Consignment[]> {
    return [...mockConsignments];
  },

  async getConsignmentById(id: string): Promise<Consignment | undefined> {
    return mockConsignments.find(c => c.id === id);
  },

  async createConsignment(data: Omit<Consignment, 'id' | 'createdAt' | 'updatedAt' | 'code' | 'totalValue' | 'receivedValue' | 'pendingValue' | 'soldValue'>): Promise<Consignment> {
    const totalValue = data.items.reduce((acc, item) => acc + (item.quantitySent * item.unitPrice), 0);
    const newConsignment: Consignment = {
      ...data,
      id: `cons_${Math.random().toString(36).substr(2, 9)}`,
      code: `CONS-${Math.floor(1000 + Math.random() * 9000)}`,
      totalValue,
      receivedValue: 0,
      soldValue: 0,
      pendingValue: totalValue,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Consignment;
    mockConsignments.push(newConsignment);
    saveConsignments();
    return newConsignment;
  },

  async registerConsignmentSettlement(id: string, settlementData: {
    items: Array<{
      itemId: string;
      quantitySold: number;
      quantityReturned: number;
      quantityLost: number;
    }>;
    notes?: string;
  }): Promise<Consignment | undefined> {
    const consignment = await this.getConsignmentById(id);
    if (!consignment) return undefined;

    let newlySoldValue = 0;

    settlementData.items.forEach(settleItem => {
      const item = consignment.items.find(i => i.id === settleItem.itemId);
      if (item) {
        item.quantitySold += settleItem.quantitySold;
        item.quantityReturned += settleItem.quantityReturned;
        if(settleItem.quantityLost) item.quantityLost = (item.quantityLost || 0) + settleItem.quantityLost;
        
        item.quantityPending = item.quantitySent - item.quantitySold - item.quantityReturned - (item.quantityLost || 0);

        const soldAmountCurrent = settleItem.quantitySold * item.unitPrice;
        item.soldValue = (item.soldValue || 0) + soldAmountCurrent;
        item.pendingValue = item.quantityPending * item.unitPrice;

        newlySoldValue += soldAmountCurrent;
      }
    });

    consignment.soldValue = (consignment.soldValue || 0) + newlySoldValue;
    // Overdue/open etc logic could be improved with an actual backend
    consignment.updatedAt = new Date().toISOString();
    saveConsignments();
    return consignment;
  },

  async registerConsignmentPayment(id: string, paymentData: { value: number; method: string; userId?: string }): Promise<Consignment | undefined> {
    const consignment = await this.getConsignmentById(id);
    if (!consignment) return undefined;

    if (!consignment.payments) consignment.payments = [];
    consignment.payments.push({
      id: `pay_${Math.random().toString(36).substr(2, 9)}`,
      value: paymentData.value,
      method: paymentData.method as any,
      userId: paymentData.userId,
      paidAt: new Date().toISOString()
    });

    consignment.receivedValue += paymentData.value;
    consignment.pendingValue = consignment.totalValue - consignment.receivedValue; // In a real system, you might only owe for what was sold.

    if (consignment.pendingValue <= 0) {
       consignment.paymentStatus = 'paid';
    } else {
       consignment.paymentStatus = 'partial';
    }

    consignment.updatedAt = new Date().toISOString();
    saveConsignments();
    return consignment;
  },

  async markConsignmentOverdue(id: string): Promise<boolean> {
     const consignment = await this.getConsignmentById(id);
     if(!consignment) return false;
     consignment.status = 'overdue';
     consignment.updatedAt = new Date().toISOString();
     saveConsignments();
     return true;
  },

  async getConsignmentStats(): Promise<any> {
     return {
        open: mockConsignments.filter(c => c.status === 'open' || c.status === 'partial').length,
        overdue: mockConsignments.filter(c => c.status === 'overdue').length,
        totalConsigned: mockConsignments.reduce((acc, c) => acc + c.totalValue, 0),
        totalReceived: mockConsignments.reduce((acc, c) => acc + c.receivedValue, 0),
        pendingValue: mockConsignments.reduce((acc, c) => acc + c.pendingValue, 0),
     };
  }
};
