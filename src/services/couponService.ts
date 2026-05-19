import { Coupon, CouponUsage, OrderAdmin } from '../types/admin';

let mockCoupons: Coupon[] = [
  {
    id: "coup_1",
    code: "COF10",
    name: "Desconto 10%",
    active: true,
    discountType: "percentage",
    discountValue: 10,
    usedCount: 0,
    appliesTo: "all",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "coup_2",
    code: "PRIMEIRACOMPRA",
    name: "Primeira Compra",
    description: "15% off na primeira compra",
    active: true,
    discountType: "first_order",
    discountValue: 15,
    usedCount: 0,
    appliesTo: "all",
    firstOrderOnly: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "coup_3",
    code: "B2B15",
    name: "B2B Desconto",
    active: true,
    discountType: "percentage",
    discountValue: 15,
    usedCount: 0,
    appliesTo: "all",
    b2bOnly: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "coup_4",
    code: "FRETEGRATIS",
    name: "Frete Grátis Sudeste",
    active: true,
    discountType: "free_shipping",
    freeShipping: true,
    usedCount: 0,
    appliesTo: "all",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

let mockUsages: CouponUsage[] = [];

export const couponService = {
  async listCoupons(): Promise<Coupon[]> {
    return Promise.resolve([...mockCoupons].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
  },

  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    const normalized = code.trim().toUpperCase();
    return Promise.resolve(mockCoupons.find(c => c.code === normalized && !c.archived));
  },

  async createCoupon(data: Partial<Coupon>): Promise<Coupon> {
    const newCoupon: Coupon = {
      ...data,
      id: `coup_${Date.now()}`,
      code: (data.code || '').trim().toUpperCase(),
      usedCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Coupon;
    mockCoupons.push(newCoupon);
    return Promise.resolve(newCoupon);
  },

  async updateCoupon(id: string, data: Partial<Coupon>): Promise<Coupon | undefined> {
    const idx = mockCoupons.findIndex(c => c.id === id);
    if (idx === -1) return undefined;
    mockCoupons[idx] = { 
      ...mockCoupons[idx], 
      ...data, 
      code: data.code ? data.code.trim().toUpperCase() : mockCoupons[idx].code,
      updatedAt: new Date().toISOString() 
    };
    return Promise.resolve(mockCoupons[idx]);
  },

  async duplicateCoupon(id: string): Promise<Coupon | undefined> {
    const existing = mockCoupons.find(c => c.id === id);
    if (!existing) return undefined;
    
    const { id: _id, code, createdAt, updatedAt, usedCount, stats, ...rest } = existing;
    return this.createCoupon({
       ...rest,
       code: `${code}_COPY`,
       name: `${existing.name} (Cópia)`,
       active: false
    });
  },

  async archiveCoupon(id: string): Promise<boolean> {
    const coupon = await this.updateCoupon(id, { archived: true });
    return !!coupon;
  },

  async toggleCouponActive(id: string): Promise<Coupon | undefined> {
    const coupon = mockCoupons.find(c => c.id === id);
    if (!coupon) return undefined;
    return this.updateCoupon(id, { active: !coupon.active });
  },

  getCouponComputedStatus(coupon: Coupon): 'active' | 'inactive' | 'scheduled' | 'expired' | 'exhausted' | 'archived' {
    if (coupon.archived) return 'archived';
    if (!coupon.active) return 'inactive';

    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) return 'scheduled';
    if (coupon.endDate && new Date(coupon.endDate) < now) return 'expired';
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return 'exhausted';

    return 'active';
  },

  async validateCouponForCart(code: string, cartSubtotal: number, customer?: any): Promise<{ valid: boolean; error?: string; coupon?: Coupon }> {
    const coupon = await this.getCouponByCode(code);
    if (!coupon) return { valid: false, error: 'Cupom inválido.' };
    
    const status = this.getCouponComputedStatus(coupon);
    if (status === 'archived' || status === 'inactive') return { valid: false, error: 'Cupom inválido.' };
    if (status === 'scheduled') return { valid: false, error: 'Cupom ainda não está ativo.' };
    if (status === 'expired') return { valid: false, error: 'Cupom expirado.' };
    if (status === 'exhausted') return { valid: false, error: 'Cupom esgotado.' };

    if (coupon.minimumOrderValue && cartSubtotal < coupon.minimumOrderValue) {
      return { valid: false, error: `Pedido mínimo de R$ ${coupon.minimumOrderValue.toFixed(2)} não atingido.` };
    }

    if (coupon.firstOrderOnly) {
      // Simplification: assume valid for now unless customer explicitly has previous orders
      // In a real app we'd verify customer order history
      if (customer && customer.ordersCount > 0) {
        return { valid: false, error: 'Válido apenas para primeira compra.' };
      }
    }

    if (coupon.b2bOnly) {
      if (!customer || customer.type !== 'b2b') {
        return { valid: false, error: 'Válido apenas para clientes B2B.' };
      }
    }

    // Verify usage limits per customer
    if (coupon.maxUsesPerCustomer || coupon.oneUsePerCustomer) {
       const limit = coupon.oneUsePerCustomer ? 1 : (coupon.maxUsesPerCustomer || 1);
       if (customer) {
         const pastUsages = mockUsages.filter(u => u.couponId === coupon.id && (u.customerId === customer.id || u.customerEmail === customer.email || u.customerWhatsapp === customer.whatsapp));
         if (pastUsages.length >= limit) {
            return { valid: false, error: 'Limite de uso por cliente atingido.' };
         }
       }
    }

    return { valid: true, coupon };
  },

  calculateCouponDiscount(coupon: Coupon, cartSubtotal: number, shippingPrice: number): { discountAmount: number, discountShipping: number } {
    let discountAmount = 0;
    let discountShipping = 0;

    if (coupon.freeShipping) {
      discountShipping = shippingPrice;
    }

    if (coupon.discountType === 'percentage' || coupon.discountType === 'first_order') {
       discountAmount = cartSubtotal * ((coupon.discountValue || 0) / 100);
       if (coupon.maxDiscountValue && discountAmount > coupon.maxDiscountValue) {
          discountAmount = coupon.maxDiscountValue;
       }
    } else if (coupon.discountType === 'fixed_amount') {
       discountAmount = Math.min(coupon.discountValue || 0, cartSubtotal);
    } // simplify other types for now

    return { discountAmount, discountShipping };
  },

  async registerCouponUsage(couponId: string, order: Partial<OrderAdmin>): Promise<CouponUsage> {
    const coupon = mockCoupons.find(c => c.id === couponId);
    if (coupon) {
      coupon.usedCount += 1;
      if (!coupon.stats) coupon.stats = { usedCount: 0, totalDiscountGiven: 0, totalRevenueGenerated: 0 };
      coupon.stats.usedCount += 1;
      coupon.stats.totalDiscountGiven += (order.discountAmount || 0);
      coupon.stats.totalRevenueGenerated += (order.total || 0);
      coupon.stats.lastUsedAt = new Date().toISOString();
    }

    const usage: CouponUsage = {
      id: `usg_${Date.now()}`,
      couponId,
      couponCode: order.couponCode || '',
      orderId: order.id || '',
      customerId: order.customerId,
      customerEmail: order.customer?.email,
      customerWhatsapp: order.customer?.whatsapp,
      subtotalBeforeDiscount: order.subtotalBeforeDiscount || order.total || 0,
      shippingBeforeDiscount: order.shippingPrice || 0,
      discountAmount: order.discountAmount || 0,
      totalAfterDiscount: order.totalAfterDiscount || order.total || 0,
      usedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockUsages.push(usage);
    return Promise.resolve(usage);
  },

  async listUsages(couponId?: string): Promise<CouponUsage[]> {
    let usages = [...mockUsages];
    if (couponId) {
      usages = usages.filter(u => u.couponId === couponId);
    }
    return Promise.resolve(usages.sort((a,b) => new Date(b.usedAt).getTime() - new Date(a.usedAt).getTime()));
  }
};
