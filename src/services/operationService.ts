import { 
  RawCoffeeLot, 
  RoastBatch, 
  PackagingRun, 
  StockItem, 
  StockMovement, 
  RoasterTimeEntry, 
  WeeklyPayroll,
  Consignment
} from '../types/admin';
import { rawCoffeeLotService } from './rawCoffeeLotService';
import { stockService } from './stockService';
import { adminLogService } from './adminLogService';
import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const operationService = {
  // --- NEW LOT LAUNCH ---
  async launchNewLot(data: Omit<RawCoffeeLot, "id" | "createdAt" | "updatedAt">, userId: string, userEmail: string): Promise<RawCoffeeLot> {
    const newLot = await rawCoffeeLotService.createRawCoffeeLot(data as any); 
    const stockItem = await stockService.createStockItem({
      type: 'raw',
      rawLotId: newLot.id,
      rawLotName: newLot.name,
      availableKg: data.stock.purchasedKg,
      status: 'available'
    });
    await stockService.createStockMovement({
      type: 'entrada_lote_cru',
      stockItemId: stockItem.id,
      rawLotId: newLot.id,
      quantityKg: data.stock.purchasedKg,
      previousKg: 0,
      newKg: data.stock.purchasedKg,
      reason: 'Estoque inicial do lançamento de lote',
      relatedEntityType: 'rawLot',
      userId,
      userName: userEmail
    });
    await adminLogService.logAdminAction({
      userId,
      userEmail,
      action: 'CREATED_RAW_COFFEE_LOT',
      entity: 'rawLot',
      entityId: newLot.id,
      after: newLot
    } as any);
    return newLot;
  },

  // --- NEW ANALYTICS & DASHBOARD ---

  async getOperationDashboard(filters: { startDate: Date; endDate: Date }) {
    const startStr = filters.startDate.toISOString();
    const endStr = filters.endDate.toISOString();
    
    // 1. Lots
    const allLots = await rawCoffeeLotService.listRawCoffeeLots();
    const lotsInPeriod = allLots.filter(l => l.createdAt >= startStr && l.createdAt <= endStr);
    const activeLots = allLots.filter(l => l.status === 'active' || l.status === 'low_stock');
    const rawKgAvailable = activeLots.reduce((acc, l) => acc + (l.stock?.availableKg || 0), 0);
    const rawKgPurchasedInPeriod = lotsInPeriod.reduce((acc, l) => acc + (l.stock?.purchasedKg || 0), 0);
    const rawInvestmentInPeriod = lotsInPeriod.reduce((acc, l) => acc + (l.purchase?.finalTotalCost || 0), 0);
    const averageRawCostPerKg = rawKgPurchasedInPeriod > 0 ? rawInvestmentInPeriod / rawKgPurchasedInPeriod : 0;
    const lastLotName = lotsInPeriod.length > 0 ? lotsInPeriod[lotsInPeriod.length - 1].name : (activeLots.length > 0 ? activeLots[0].name : null);

    // 2. Roasts
    const allRoasts = await this.listRoasts();
    const roastsInPeriod = allRoasts.filter(r => r.date >= startStr && r.date <= endStr);
    const roastedKgInPeriod = roastsInPeriod.reduce((acc, r) => acc + r.roastedKgOutput, 0);
    const rawKgUsedInPeriod = roastsInPeriod.reduce((acc, r) => acc + r.rawKgUsed, 0);
    const averageRoastLossPercent = roastsInPeriod.length ? roastsInPeriod.reduce((acc, r) => acc + r.lossPercent, 0) / roastsInPeriod.length : 0;

    // 3. Packaging
    const allPackagings = await this.listPackagingRuns();
    const packagingsInPeriod = allPackagings.filter(p => p.date >= startStr && p.date <= endStr);
    const packagedKgInPeriod = packagingsInPeriod.reduce((acc, p) => acc + p.totalKg, 0);
    const packagedUnitsInPeriod = packagingsInPeriod.reduce((acc, p) => acc + p.quantityUnits, 0);
    
    const packagedByFormat = packagingsInPeriod.reduce((acc, p) => {
      acc[p.packageFormat] = (acc[p.packageFormat] || 0) + p.quantityUnits;
      return acc;
    }, {} as Record<string, number>);

    // 4. Stock & Consignments
    const stockStats = await stockService.getStockStats(); 
    const stockItems = await stockService.listStockItems();
    
    // Roasted stock available
    const roastedKgAvailable = stockItems.filter(i => i.type === 'roasted').reduce((acc, i) => acc + (i.availableKg || 0), 0);

    const finishedStockItems = stockItems.filter(i => i.type === 'finished');
    const finishedStockUnits = finishedStockItems.reduce((acc, i) => acc + (i.availableUnits || 0), 0);
    const finishedStockByFormat = finishedStockItems.reduce((acc, i) => {
        if(i.format) acc[i.format] = (acc[i.format] || 0) + (i.availableUnits || 0);
        return acc;
    }, {} as Record<string, number>);
    
    const lowStockItemsCount = stockStats.lowStockCount + allLots.filter(l => l.status === 'low_stock').length;

    // We don't have consignment collection yet in Firestore wrapped here, we will fetch it from where it belongs later.
    
    // 5. Time Entries
    const timeEntries = await this.getTimeEntries();
    // Consider period mapping requested by user for card (Horas Reg should be filtered by period)
    const timeEntriesInPeriod = timeEntries.filter(t => t.date >= startStr && t.date <= endStr);
    const roasterHoursInPeriod = timeEntriesInPeriod.reduce((acc, t) => acc + t.totalHours, 0);
    const pendingRoasterHours = timeEntries.filter(t => t.status === 'pending').reduce((acc, t) => acc + t.totalHours, 0);
    const estimatedPayrollValue = pendingRoasterHours * 50;

    // INTEGRITY VALIDATION
    const issues = [];
    
    if (activeLots.length > 0 && rawKgAvailable <= 0) {
       issues.push({
         id: 'lotes_ativos_sem_saldo',
         severity: 'critical',
         title: 'Lotes ativos sem saldo de café cru',
         description: `Existem ${activeLots.length} lotes listados como ativos, mas a soma de saldo disponível é 0kg.`,
         affectedArea: 'Café Cru',
         impact: 'Impede o registro de novas torras.',
         recommendedAction: 'Lançar um novo lote ou alterar o status dos lotes vazios para esgotado.',
         actionType: 'open_launch_lot'
       });
    }

    if (finishedStockUnits > 0 && packagedUnitsInPeriod === 0 && allPackagings.length === 0) {
       issues.push({
         id: 'estoque_sem_empacotamento',
         severity: 'warning',
         title: 'Estoque pronto sem pacotes registrados',
         description: `Existem ${finishedStockUnits} unidades em estoque, mas nenhum registro de empacotamento.`,
         affectedArea: 'Estoque',
         impact: 'Indicadores de produção inconsistentes.',
         recommendedAction: 'Revisar origem do estoque ou registrar empacotamento para garantir rastreabilidade.',
         actionType: 'open_stock_review'
       });
    }

    if (finishedStockUnits > 0 && activeLots.length === 0 && allLots.length === 0) {
       issues.push({
         id: 'estoque_legado_sem_lote',
         severity: 'critical',
         title: 'Estoque legado sem lote ativo',
         description: `Há estoque disponível (${finishedStockUnits} unidades), mas nenhum lote de café cru correspondente registrado no sistema.`,
         affectedArea: 'Rastreabilidade',
         impact: 'Quebra de rastreabilidade (falta de origem).',
         recommendedAction: 'Lançar um lote retroativo e vincular ao estoque.',
         actionType: 'open_launch_lot'
       });
    }

    if (pendingRoasterHours > 0 && estimatedPayrollValue === 0) {
       issues.push({
         id: 'horas_sem_valor',
         severity: 'info',
         title: 'Horas aprovadas sem valor financeiro configurado',
         description: `Existem ${pendingRoasterHours} horas pendentes, mas o valor hora não está configurado ou é zero.`,
         affectedArea: 'Financeiro',
         impact: 'Fechamento financeiro pode não refletir os custos de produção reais.',
         recommendedAction: 'Configurar taxa hora do mestre de torra.',
         actionType: 'open_settings'
       });
    }

    const criticalAlertsCount = issues.filter(i => i.severity === 'critical').length;

    return {
      rawKgAvailable,
      activeLotsCount: activeLots.length,
      rawLotsLaunchedInPeriod: lotsInPeriod.length,
      rawKgPurchasedInPeriod,
      rawInvestmentInPeriod,
      averageRawCostPerKg,
      lastLotName,

      roastedKgAvailable,
      roastedKgInPeriod,
      rawKgUsedInPeriod,
      averageRoastLossPercent,
      roastsCountInPeriod: roastsInPeriod.length,

      packagedKgInPeriod,
      packagedUnitsInPeriod,
      packagedByFormat,

      finishedStockUnits,
      finishedStockByFormat,
      lowStockItemsCount,
      consignedUnits: 0, 
      consignedByFormat: {},

      overdueConsignmentsCount: 0,
      overdueConsignmentsValue: 0,
      pendingConsignmentValue: 0,
      pendingOrdersValue: 0,
      totalPendingValue: estimatedPayrollValue, // just for demo

      newCustomersCount: 0,
      newCustomersBySource: {},
      newCustomersByType: {},

      roasterHoursInPeriod,
      pendingRoasterHours,
      estimatedPayrollValue,

      criticalAlertsCount,
      issues
    };
  },

  async getOperationalTimeline(filters: { startDate?: Date; endDate?: Date }) {
      // Use adminLogService
      const logs = await adminLogService.getLogs(filters);
      return logs;
  },

  // --- SPECIFIC SERVICES ---
  
  async getOperationStats() {
      // Legacy wrapper
      return this.getOperationDashboard({ startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), endDate: new Date() });
  },

  async registerRoast(data: Omit<RoastBatch, 'id' | 'createdAt' | 'updatedAt' | 'lossKg' | 'lossPercent' | 'status'> & { userId: string; userName: string }): Promise<RoastBatch> {
    const lot = await rawCoffeeLotService.getRawCoffeeLotById(data.rawLotId);
    if (!lot) throw new Error("Lote de cru não encontrado");
    if ((lot.stock?.availableKg || 0) < data.rawKgUsed) throw new Error("Saldo insuficiente no lote de cru");

    const lossKg = data.rawKgUsed - data.roastedKgOutput;
    const lossPercent = (lossKg / data.rawKgUsed) * 100;

    const newRoast = {
      ...data,
      lossKg,
      lossPercent,
      status: 'registrada',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Firestore write
    const ref = collection(db, 'roastBatches');
    const docRef = await addDoc(ref, newRoast);
    const roastWithId = { ...newRoast, id: docRef.id } as RoastBatch;

    await rawCoffeeLotService.adjustRawLotBalance(data.rawLotId, {
      adjustmentKg: -data.rawKgUsed,
      type: 'torra_consumo_cru',
      reason: `Consumo para torra ${roastWithId.id}`,
      userId: data.userId
    });

    await stockService.createStockItem({
      type: 'roasted',
      roastBatchId: roastWithId.id,
      availableKg: data.roastedKgOutput,
      status: 'available'
    });

    await adminLogService.logAdminAction({
      userId: data.userId,
      userEmail: data.userName,
      action: 'CREATE_ROAST',
      entity: 'roastBatch',
      entityId: roastWithId.id,
      after: roastWithId
    });

    return roastWithId;
  },

  async listRoasts(): Promise<RoastBatch[]> {
    const snap = await getDocs(collection(db, 'roastBatches'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as RoastBatch))
      .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async registerPackaging(data: any): Promise<PackagingRun> {
    const stockItems = await stockService.listStockItems();
    const roastedStock = stockItems.find(i => i.roastBatchId === data.roastBatchId && i.type === 'roasted');
    
    if (!roastedStock || (roastedStock.availableKg || 0) < (data.unitWeightKg * data.quantityUnits)) {
       throw new Error("Saldo insuficiente");
    }

    const totalKg = data.unitWeightKg * data.quantityUnits;
    const newRun = {
      ...data,
      totalKg,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const ref = collection(db, 'packagingRuns');
    const docRef = await addDoc(ref, newRun);
    const runWithId = { ...newRun, id: docRef.id } as PackagingRun;

    await stockService.adjustStock({
      stockItemId: roastedStock.id,
      adjustmentType: 'subtract',
      quantityKg: totalKg,
      reason: `Empacotamento ${runWithId.id}`,
      userId: data.userId,
      userName: data.userName
    });

    const productStock = stockItems.find(i => i.type === 'finished' && i.format === data.packageFormat);
    if (productStock) {
      await stockService.adjustStock({
        stockItemId: productStock.id,
        adjustmentType: 'add',
        quantityUnits: data.quantityUnits,
        reason: `Entrada via empacotamento ${runWithId.id}`,
        userId: data.userId,
        userName: data.userName
      });
    } else {
      await stockService.createStockItem({
        type: 'finished',
        productName: `Café ${data.packageFormat}`,
        format: data.packageFormat,
        availableUnits: data.quantityUnits,
        status: 'available'
      });
    }

    await adminLogService.logAdminAction({
      userId: data.userId,
      userEmail: data.userName,
      action: 'REGISTER_PACKAGING',
      entity: 'packagingRun',
      entityId: runWithId.id,
      after: runWithId
    });

    return runWithId;
  },

  async listPackagingRuns(): Promise<PackagingRun[]> {
    const snap = await getDocs(collection(db, 'packagingRuns'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as PackagingRun))
      .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async registerTimeEntry(data: any): Promise<RoasterTimeEntry> {
    const newEntry = {
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const ref = collection(db, 'roasterTimeEntries');
    const docRef = await addDoc(ref, newEntry);
    return { ...newEntry, id: docRef.id } as RoasterTimeEntry;
  },

  async getTimeEntries(): Promise<RoasterTimeEntry[]> {
    const snap = await getDocs(collection(db, 'roasterTimeEntries'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as RoasterTimeEntry))
      .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async approveTimeEntry(id: string, userId: string): Promise<RoasterTimeEntry> {
    const docRef = doc(db, 'roasterTimeEntries', id);
    await updateDoc(docRef, { status: 'approved', approvedAt: new Date().toISOString(), approvedBy: userId });
    
    await adminLogService.logAdminAction({
      userId,
      userEmail: 'contato@cofcof.co',
      action: 'APPROVE_HOURS',
      entity: 'timeEntry',
      entityId: id,
      after: { status: 'approved', id }
    });

    return this.getTimeEntries().then(res => res.find(e => e.id === id)!);
  },

  async generatePayroll(roasterId: string, startDate: string, endDate: string): Promise<WeeklyPayroll> {
    const entries = await this.getTimeEntries();
    const relevant = entries.filter(e => 
      e.roasterId === roasterId && e.status === 'approved' && !e.payrollId &&
      e.date >= startDate && e.date <= endDate
    );
    if (!relevant.length) throw new Error("Nenhum registro");

    const totalHours = relevant.reduce((acc, e) => acc + e.totalHours, 0);
    const baseValue = totalHours * 50;

    const payroll = {
      roasterId,
      roasterName: relevant[0].roasterName,
      startDate,
      endDate,
      totalHours,
      hourlyRate: 50,
      baseValue,
      adjustments: 0,
      totalValue: baseValue,
      status: 'pending',
      entryIds: relevant.map(e => e.id),
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'weeklyPayrolls'), payroll);
    
    // Update references
    for (const e of relevant) {
        await updateDoc(doc(db, 'roasterTimeEntries', e.id), { payrollId: docRef.id });
    }
    
    return { ...payroll, id: docRef.id } as unknown as WeeklyPayroll;
  },

  async markPayrollAsPaid(id: string, method: string): Promise<WeeklyPayroll> {
    await updateDoc(doc(db, 'weeklyPayrolls', id), { status: 'paid', paidAt: new Date().toISOString(), paymentMethod: method });
    
    // Also update entries
    const entries = await this.getTimeEntries();
    for (const e of entries.filter(ent => ent.payrollId === id)) {
        await updateDoc(doc(db, 'roasterTimeEntries', e.id), { status: 'paid' });
    }
    
    const snap = await getDocs(collection(db, 'weeklyPayrolls'));
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return all.find(p => p.id === id) as unknown as WeeklyPayroll;
  },

  async listPayrolls(): Promise<WeeklyPayroll[]> {
    const snap = await getDocs(collection(db, 'weeklyPayrolls'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as unknown as WeeklyPayroll))
      .sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }
};
