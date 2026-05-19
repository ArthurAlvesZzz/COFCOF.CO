import { SubscriptionPlan, SubscriptionInterest, Subscription } from '../types/admin';

let mockPlans: SubscriptionPlan[] = [
  {
    id: "plan_1",
    name: "Clube Essencial",
    slug: "clube-essencial",
    shortDescription: "Para quem bebe café todo dia sem erro.",
    description: "Um clube pensado para quem busca cafés doces, equilibrados e perfeitos para qualquer método. Receba mensalmente cafés com notas clássicas aprovados por Q-Graders.",
    active: true,
    featured: true,
    publicVisible: true,
    displayOrder: 1,
    priceFrom: 79.9,
    frequency: "monthly",
    type: "home",
    sensoryProfile: ["doce", "equilibrado", "baixa acidez"],
    benefits: ["Frete grátis", "1 brindes surpresa por semestre", "Curadoria focada em docura"],
    badge: "Mais escolhido",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "plan_2",
    name: "Clube Explorador",
    slug: "clube-explorador",
    shortDescription: "Para quem busca cafés exóticos e fermentados.",
    active: true,
    publicVisible: true,
    displayOrder: 2,
    priceFrom: 99.9,
    frequency: "monthly",
    type: "explorer",
    sensoryProfile: ["intenso", "frutado", "exploratório"],
    benefits: ["Microlotes exclusivos", "Cafés exóticos", "Acesso antecipado a lançamentos"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "plan_3",
    name: "Clube Empresa (B2B)",
    slug: "clube-empresa",
    shortDescription: "Para escritórios que valorizam a equipe.",
    active: true,
    publicVisible: true,
    displayOrder: 3,
    priceFrom: 299.9,
    frequency: "monthly",
    type: "office",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let mockInterests: SubscriptionInterest[] = [
  {
    id: "int_1",
    name: "João Tech",
    whatsapp: "11988887777",
    email: "joao@tech.com",
    planName: "Clube Empresa (B2B)",
    status: "new",
    source: "subscription_page",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let mockSubscriptions: Subscription[] = [];

export const subscriptionService = {
  // Plans
  async listPlans(): Promise<SubscriptionPlan[]> {
    return Promise.resolve([...mockPlans].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
  },

  async getPublicPlans(): Promise<SubscriptionPlan[]> {
    return Promise.resolve(mockPlans.filter(p => p.active && p.publicVisible).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
  },

  async createPlan(data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const newPlan: SubscriptionPlan = {
      ...data,
      id: `plan_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as SubscriptionPlan;
    mockPlans.push(newPlan);
    return Promise.resolve(newPlan);
  },

  async updatePlan(id: string, data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan | undefined> {
    const idx = mockPlans.findIndex(p => p.id === id);
    if (idx === -1) return undefined;
    mockPlans[idx] = { ...mockPlans[idx], ...data, updatedAt: new Date().toISOString() };
    return Promise.resolve(mockPlans[idx]);
  },

  async togglePlanActive(id: string): Promise<SubscriptionPlan | undefined> {
    const plan = mockPlans.find(p => p.id === id);
    if (!plan) return undefined;
    return this.updatePlan(id, { active: !plan.active });
  },

  async archivePlan(id: string): Promise<boolean> {
    const plan = await this.updatePlan(id, { archived: true });
    return !!plan;
  },

  // Interests
  async listInterests(): Promise<SubscriptionInterest[]> {
    return Promise.resolve([...mockInterests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  },

  async createInterest(data: Partial<SubscriptionInterest>): Promise<SubscriptionInterest> {
    const existing = mockInterests.find(i => 
      (data.email && i.email && i.email.toLowerCase() === data.email.toLowerCase()) ||
      (data.whatsapp && i.whatsapp && i.whatsapp.replace(/\D/g, '') === data.whatsapp.replace(/\D/g, ''))
    );
    
    if (existing) {
      const updated = {
         ...existing,
         status: existing.status === 'lost' ? 'new' : existing.status,
         planId: data.planId || existing.planId,
         planName: data.planName || existing.planName,
         updatedAt: new Date().toISOString()
      };
      const idx = mockInterests.findIndex(i => i.id === existing.id);
      mockInterests[idx] = updated;
      return Promise.resolve(updated);
    }

    const newInt: SubscriptionInterest = {
      ...data,
      id: `int_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "new",
      source: data.source || "subscription_page"
    } as SubscriptionInterest;
    mockInterests.push(newInt);
    return Promise.resolve(newInt);
  },

  async updateInterest(id: string, data: Partial<SubscriptionInterest>): Promise<SubscriptionInterest | undefined> {
    const idx = mockInterests.findIndex(i => i.id === id);
    if (idx === -1) return undefined;
    mockInterests[idx] = { ...mockInterests[idx], ...data, updatedAt: new Date().toISOString() };
    return Promise.resolve(mockInterests[idx]);
  },

  async updateInterestStatus(id: string, status: SubscriptionInterest['status']): Promise<SubscriptionInterest | undefined> {
    return this.updateInterest(id, { status });
  },

  async convertInterestToCustomer(id: string): Promise<any> {
    const interest = mockInterests.find(i => i.id === id);
    if (!interest) throw new Error("Interessado não encontrado");
    
    // Call customer service
    const { customerService } = await import('./customerService');
    const custReq = {
      name: interest.name,
      email: interest.email,
      whatsapp: interest.whatsapp,
      type: interest.type === 'company' ? 'b2b' : 'retail',
      source: 'subscription',
      tags: ['interessado_assinatura']
    };
    
    let existingCust = await customerService.findCustomerByEmailOrWhatsapp(interest.email, interest.whatsapp);
    if (existingCust) {
       await customerService.updateCustomer(existingCust.id, { tags: [...(existingCust.tags || []), 'interessado_assinatura'] });
    } else {
       existingCust = await customerService.createCustomer(custReq as any);
    }
    
    await this.updateInterest(id, {
      status: 'converted',
      customerId: existingCust.id
    });
    
    return existingCust;
  },

  // Subscriptions
  async listSubscriptions(): Promise<Subscription[]> {
    return Promise.resolve([...mockSubscriptions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  },

  async createSubscription(data: Partial<Subscription>): Promise<Subscription> {
    const sub: Subscription = {
      ...data,
      id: `sub_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: data.status || 'active'
    } as Subscription;
    mockSubscriptions.push(sub);
    return Promise.resolve(sub);
  },

  async updateSubscription(id: string, data: Partial<Subscription>): Promise<Subscription | undefined> {
    const idx = mockSubscriptions.findIndex(s => s.id === id);
    if (idx === -1) return undefined;
    mockSubscriptions[idx] = { ...mockSubscriptions[idx], ...data, updatedAt: new Date().toISOString() };
    return Promise.resolve(mockSubscriptions[idx]);
  },

  async pauseSubscription(id: string): Promise<Subscription | undefined> {
    return this.updateSubscription(id, { status: "paused" });
  },

  async reactivateSubscription(id: string): Promise<Subscription | undefined> {
    return this.updateSubscription(id, { status: "active" });
  },

  async cancelSubscription(id: string): Promise<Subscription | undefined> {
    return this.updateSubscription(id, { status: "cancelled" });
  },

  async exportSubscriptionsCSV(): Promise<string> {
    return "csv data";
  }
};
