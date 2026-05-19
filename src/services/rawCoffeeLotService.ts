import { RawCoffeeLot, StockMovement } from '../types/admin';

// Mocked data for now, ideally this connects to Firebase later
let mockLots: RawCoffeeLot[] = [];
let mockMovements: StockMovement[] = [];

export const rawCoffeeLotService = {
  async listRawCoffeeLots(): Promise<RawCoffeeLot[]> {
    return Promise.resolve([...mockLots]);
  },

  async getRawCoffeeLotById(id: string): Promise<RawCoffeeLot | undefined> {
    return Promise.resolve(mockLots.find(l => l.id === id));
  },

  async createRawCoffeeLot(data: Omit<RawCoffeeLot, 'id'>): Promise<RawCoffeeLot> {
    const newLot: RawCoffeeLot = {
      ...data,
      id: `raw_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as RawCoffeeLot;
    mockLots.push(newLot);
    return Promise.resolve(newLot);
  },

  async updateRawCoffeeLot(id: string, data: Partial<RawCoffeeLot>): Promise<RawCoffeeLot | undefined> {
    const idx = mockLots.findIndex(l => l.id === id);
    if (idx === -1) return undefined;
    
    mockLots[idx] = {
      ...mockLots[idx],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return Promise.resolve(mockLots[idx]);
  },

  async archiveRawCoffeeLot(id: string): Promise<boolean> {
    const idx = mockLots.findIndex(l => l.id === id);
    if (idx === -1) return false;
    mockLots[idx].status = 'archived';
    mockLots[idx].updatedAt = new Date().toISOString();
    return true;
  },

  async registerRawLotEntry(lotId: string, data: { quantityKg: number; reason?: string; userId: string; supplier?: string }): Promise<RawCoffeeLot | undefined> {
    const lot = mockLots.find(l => l.id === lotId);
    if (!lot) return undefined;

    const previousBalance = lot.stock?.availableKg || 0;
    const newBalance = previousBalance + data.quantityKg;

    if (!lot.stock) lot.stock = { purchasedKg: 0, availableKg: 0, storageLocation: '', storageType: '' };
    lot.stock.purchasedKg += data.quantityKg;
    lot.stock.availableKg = newBalance;
    lot.updatedAt = new Date().toISOString();
    if(data.supplier) {
        if (!lot.purchase) lot.purchase = { totalPaid: 0, currency: "BRL", purchasedKg: 0, costPerKg: 0 };
        lot.purchase.supplier = data.supplier;
    }

    mockMovements.push({
      id: `mov_${Math.random().toString(36).substr(2, 9)}`,
      type: 'entrada_lote_cru',
      rawLotId: lotId,
      quantityKg: data.quantityKg,
      previousBalanceKg: previousBalance,
      newBalanceKg: newBalance,
      reason: data.reason || 'Entrada de lote cru',
      userId: data.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return Promise.resolve(lot);
  },

  async adjustRawLotBalance(lotId: string, data: { newBalanceKg?: number; adjustmentKg?: number; type: StockMovement['type']; reason: string; userId: string }): Promise<RawCoffeeLot | undefined> {
    const lot = mockLots.find(l => l.id === lotId);
    if (!lot) return undefined;

    const previousBalance = lot.stock?.availableKg || 0;
    let newBalance = previousBalance;

    if (typeof data.newBalanceKg === 'number') {
      newBalance = data.newBalanceKg;
    } else if (typeof data.adjustmentKg === 'number') {
      newBalance = previousBalance + data.adjustmentKg;
    }

    if (newBalance < 0) {
      throw new Error("Saldo não pode ser negativo");
    }

    const diffKg = newBalance - previousBalance;

    if (!lot.stock) lot.stock = { purchasedKg: 0, availableKg: 0, storageLocation: '', storageType: '' };
    lot.stock.availableKg = newBalance;
    lot.updatedAt = new Date().toISOString();

    mockMovements.push({
      id: `mov_${Math.random().toString(36).substr(2, 9)}`,
      type: data.type,
      rawLotId: lotId,
      quantityKg: diffKg,
      previousBalanceKg: previousBalance,
      newBalanceKg: newBalance,
      reason: data.reason,
      userId: data.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return Promise.resolve(lot);
  },

  async getRawLotMovements(lotId: string): Promise<StockMovement[]> {
    return Promise.resolve(mockMovements.filter(m => m.rawLotId === lotId).sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()));
  },

  async validateLotCodeUnique(code: string, ignoreId?: string): Promise<boolean> {
    return Promise.resolve(!mockLots.some(l => l.code === code && l.id !== ignoreId));
  },
  
  async getActiveLotsWithStock(): Promise<RawCoffeeLot[]> {
     return Promise.resolve(mockLots.filter(l => l.status === 'active' && (l.stock?.availableKg || 0) > 0));
  }
};
