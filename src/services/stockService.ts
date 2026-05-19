import { StockItem, StockMovement } from '../types/admin';

// Mocked data for now
let mockStockItems: StockItem[] = [
  {
     id: 'stk_1',
     type: 'finished',
     productId: 'p_1',
     productName: 'Cerrado Premium 250g',
     format: 'Pacote 250g',
     availableUnits: 150,
     consignedUnits: 20,
     reservedUnits: 5,
     soldUnits: 45,
     lowStockThresholdUnits: 50,
     status: 'available',
     createdAt: new Date().toISOString(),
     updatedAt: new Date().toISOString()
  },
  {
     id: 'stk_2',
     type: 'raw',
     rawLotId: 'CR-01',
     rawLotName: 'CR-01: Cerrado Doce',
     availableKg: 350,
     lowStockThresholdKg: 100,
     status: 'available',
     createdAt: new Date().toISOString(),
     updatedAt: new Date().toISOString()
  },
  {
     id: 'stk_3',
     type: 'roasted',
     roastBatchId: 'TR-102',
     availableKg: 12,
     status: 'low',
     createdAt: new Date().toISOString(),
     updatedAt: new Date().toISOString()
  }
];
let mockMovements: StockMovement[] = [];

export const stockService = {
  async listStockItems(): Promise<StockItem[]> {
    return [...mockStockItems];
  },

  async getStockItemById(id: string): Promise<StockItem | undefined> {
    return mockStockItems.find(i => i.id === id);
  },

  async getStockByProduct(productId: string): Promise<StockItem[]> {
    return mockStockItems.filter(i => i.productId === productId);
  },

  async getStockByRawLot(rawLotId: string): Promise<StockItem[]> {
    return mockStockItems.filter(i => i.rawLotId === rawLotId);
  },

  async getStockByRoastBatch(roastBatchId: string): Promise<StockItem[]> {
    return mockStockItems.filter(i => i.roastBatchId === roastBatchId);
  },

  async getLowStockItems(): Promise<StockItem[]> {
    return mockStockItems.filter(i => i.status === 'low' || i.status === 'empty');
  },

  async getStockStats(): Promise<any> {
    // simplified stats
    const rawItems = mockStockItems.filter(i => i.type === 'raw');
    const roastedItems = mockStockItems.filter(i => i.type === 'roasted');
    const finishedItems = mockStockItems.filter(i => i.type === 'finished');

    return {
      rawTotalKg: rawItems.reduce((acc, i) => acc + (i.availableKg || 0), 0),
      roastedTotalKg: roastedItems.reduce((acc, i) => acc + (i.availableKg || 0), 0),
      finishedTotalUnits: finishedItems.reduce((acc, i) => acc + (i.availableUnits || 0), 0),
      lowStockCount: mockStockItems.filter(i => i.status === 'low').length,
      emptyCount: mockStockItems.filter(i => i.status === 'empty').length,
      consignedTotalUnits: mockStockItems.reduce((acc, i) => acc + (i.consignedUnits || 0), 0)
    };
  },

  async createStockMovement(data: Omit<StockMovement, 'id' | 'createdAt'>): Promise<StockMovement> {
    const mov: StockMovement = {
      ...data,
      id: `mov_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    mockMovements.push(mov);
    return mov;
  },

  async adjustStock(data: { stockItemId: string, adjustmentType: string, quantityUnits?: number, quantityKg?: number, reason: string, userId: string, userName?: string }): Promise<StockItem> {
    const item = await this.getStockItemById(data.stockItemId);
    if (!item) throw new Error("Item de estoque não encontrado");

    const movType = "ajuste_manual";
    const previousUnits = item.availableUnits || 0;
    const previousKg = item.availableKg || 0;
    let newUnits = previousUnits;
    let newKg = previousKg;

    if (typeof data.quantityUnits === 'number') {
      newUnits = previousUnits + (data.adjustmentType === 'add' ? data.quantityUnits : -data.quantityUnits);
      item.availableUnits = newUnits;
    }
    if (typeof data.quantityKg === 'number') {
      newKg = previousKg + (data.adjustmentType === 'add' ? data.quantityKg : -data.quantityKg);
      item.availableKg = newKg;
    }

    if (newUnits < 0 || newKg < 0) {
      throw new Error("Saldo não pode ficar negativo (salvo exceções)");
    }

    // Updating status based on new balance
    if (item.type === 'finished') {
       if(newUnits === 0) item.status = 'empty';
       else if(item.lowStockThresholdUnits && newUnits <= item.lowStockThresholdUnits) item.status = 'low';
       else item.status = 'available';
    } else {
       if(newKg === 0) item.status = 'empty';
       else if(item.lowStockThresholdKg && newKg <= item.lowStockThresholdKg) item.status = 'low';
       else item.status = 'available';
    }
    
    item.lastMovementAt = new Date().toISOString();
    item.updatedAt = new Date().toISOString();

    await this.createStockMovement({
      type: movType,
      stockItemId: item.id,
      productId: item.productId,
      rawLotId: item.rawLotId,
      roastBatchId: item.roastBatchId,
      quantityUnits: (data.adjustmentType === 'add' ? 1 : -1) * (data.quantityUnits || 0),
      quantityKg: (data.adjustmentType === 'add' ? 1 : -1) * (data.quantityKg || 0),
      previousUnits,
      newUnits,
      previousKg,
      newKg,
      reason: data.reason,
      relatedEntityType: 'adjustment',
      userId: data.userId,
      userName: data.userName
    });

    return item;
  },

  async registerCourtesy(data: { stockItemId: string, quantityUnits?: number, quantityKg?: number, recipient: string, reason: string, userId: string, userName?: string }): Promise<StockItem> {
    const item = await this.getStockItemById(data.stockItemId);
    if (!item) throw new Error("Item não encontrado");

    const prevUnits = item.availableUnits || 0;
    let newUnits = prevUnits;
    if (data.quantityUnits) {
       newUnits -= data.quantityUnits;
       item.availableUnits = newUnits;
       item.courtesyUnits = (item.courtesyUnits || 0) + data.quantityUnits;
    }

    await this.createStockMovement({
      type: 'cortesia_saida',
      stockItemId: item.id,
      productId: item.productId,
      quantityUnits: -(data.quantityUnits || 0),
      previousUnits: prevUnits,
      newUnits,
      reason: `Cortesia para: ${data.recipient}. Motivo: ${data.reason}`,
      relatedEntityType: 'courtesy',
      userId: data.userId,
      userName: data.userName
    });

    return item;
  },

  async getMovements(filters?: any): Promise<StockMovement[]> {
    return [...mockMovements].sort((a,b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  },
  
  async createStockItem(data: Omit<StockItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<StockItem> {
     const item: StockItem = {
        ...data,
        id: `stk_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
     } as StockItem;
     mockStockItems.push(item);
     return item;
  }
};
