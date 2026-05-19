import { CustomerAdmin, OrderAdmin } from '../types/admin';

let mockCustomers: CustomerAdmin[] = [
  {
    id: "cus_1",
    name: "João Silva",
    email: "joao@example.com",
    whatsapp: "31999998888",
    cpf: "111.111.111-11",
    type: "b2c",
    status: "active",
    address: {
      cep: "30140000",
      street: "Rua Exemplo",
      number: "123",
      neighborhood: "Savassi",
      city: "Belo Horizonte",
      state: "MG"
    },
    source: "checkout",
    tags: ["Assinante Promissor"],
    stats: {
      totalOrders: 3,
      totalSpent: 435,
      totalPaid: 435,
      totalPending: 0,
      averageTicket: 145,
      firstOrderAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      lastOrderAt: new Date(Date.now() - 86400000).toISOString()
    },
    subscription: {
      interested: true,
      planName: "Assinatura Mensal - 2 Pct",
      status: "interested"
    },
    related: {
      orderIds: ["ord_1"]
    },
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "cus_2",
    name: "Café Tech LTDA",
    email: "compras@cafetech.com",
    whatsapp: "11988887777",
    cnpj: "00.000.000/0001-00",
    type: "b2b",
    status: "new",
    company: {
      name: "Café Tech",
      segment: "Escritório / TI",
      estimatedMonthlyKg: 10,
      commercialStatus: "negotiation"
    },
    address: {
      city: "São Paulo",
      state: "SP"
    },
    source: "b2b_lead",
    tags: ["B2B"],
    stats: {
      totalOrders: 0,
      totalSpent: 0,
      totalPaid: 0,
      totalPending: 0,
      averageTicket: 0
    },
    related: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "cus_3",
    name: "Maria Oliveira",
    whatsapp: "31988887777",
    type: "b2c",
    status: "pending_payment",
    address: {
      city: "Belo Horizonte",
      state: "MG"
    },
    source: "whatsapp",
    tags: ["WhatsApp"],
    stats: {
      totalOrders: 1,
      totalSpent: 150,
      totalPaid: 0,
      totalPending: 150,
      averageTicket: 150,
      firstOrderAt: new Date().toISOString(),
      lastOrderAt: new Date().toISOString()
    },
    related: {
      orderIds: ["ord_2"]
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const customerService = {
  async listCustomers(): Promise<CustomerAdmin[]> {
    return Promise.resolve([...mockCustomers].sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()));
  },

  async getCustomerById(id: string): Promise<CustomerAdmin | undefined> {
    return Promise.resolve(mockCustomers.find(c => c.id === id));
  },

  async createCustomer(data: Partial<CustomerAdmin>): Promise<CustomerAdmin> {
    const newCustomer: CustomerAdmin = {
      ...data,
      id: `cus_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: data.stats || {
        totalOrders: 0,
        totalSpent: 0,
        totalPaid: 0,
        totalPending: 0,
        averageTicket: 0
      },
      type: data.type || "b2c",
      status: data.status || "new",
      source: data.source || "admin",
      related: data.related || {}
    } as CustomerAdmin;

    mockCustomers.push(newCustomer);
    return Promise.resolve(newCustomer);
  },

  async updateCustomer(id: string, data: Partial<CustomerAdmin>): Promise<CustomerAdmin | undefined> {
    const idx = mockCustomers.findIndex(c => c.id === id);
    if (idx === -1) return undefined;

    mockCustomers[idx] = {
      ...mockCustomers[idx],
      ...data,
      updatedAt: new Date().toISOString()
    };

    return Promise.resolve(mockCustomers[idx]);
  },

  async addCustomerNote(id: string, text: string, user: {id: string, name: string}): Promise<CustomerAdmin | undefined> {
    const idx = mockCustomers.findIndex(c => c.id === id);
    if (idx === -1) return undefined;

    if (!mockCustomers[idx].notes) mockCustomers[idx].notes = [];
    mockCustomers[idx].notes!.push({
      id: `note_${Date.now()}`,
      text,
      userId: user.id,
      userName: user.name,
      createdAt: new Date().toISOString()
    });

    mockCustomers[idx].updatedAt = new Date().toISOString();
    return Promise.resolve(mockCustomers[idx]);
  },

  async archiveCustomer(id: string): Promise<boolean> {
    const idx = mockCustomers.findIndex(c => c.id === id);
    if (idx === -1) return false;
    
    mockCustomers[idx].archived = true;
    mockCustomers[idx].status = 'archived';
    mockCustomers[idx].updatedAt = new Date().toISOString();
    return Promise.resolve(true);
  },

  async exportCustomersCSV(): Promise<string> {
    const headers = ["Nome", "Tipo", "Status", "WhatsApp", "E-mail", "Cidade", "UF", "Pedidos", "Total Gasto", "Pendente", "Última Compra"];
    const rows = mockCustomers.map(c => [
      c.name,
      c.type,
      c.status,
      c.whatsapp || '',
      c.email || '',
      c.address?.city || '',
      c.address?.state || '',
      c.stats.totalOrders.toString(),
      c.stats.totalSpent.toFixed(2),
      c.stats.totalPending.toFixed(2),
      c.stats.lastOrderAt ? new Date(c.stats.lastOrderAt).toLocaleDateString() : ''
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.map(f => `"${f || ''}"`).join(","))
    ].join("\n");

    return Promise.resolve(csvContent);
  },

  async findCustomerByEmailOrWhatsapp(email?: string, whatsapp?: string): Promise<CustomerAdmin | undefined> {
    return Promise.resolve(mockCustomers.find(c => {
      const matchEmail = email && c.email && c.email.toLowerCase() === email.toLowerCase();
      const matchWhatsapp = whatsapp && c.whatsapp && c.whatsapp.replace(/\D/g, '') === whatsapp.replace(/\D/g, '');
      return matchEmail || matchWhatsapp;
    }));
  },

  async createOrUpdateCustomerFromOrder(order: OrderAdmin): Promise<CustomerAdmin> {
    const existing = await this.findCustomerByEmailOrWhatsapp(order.customer.email, order.customer.whatsapp);
    
    if (existing) {
      // Update logic
      const isPaid = order.payment.status === 'approved';
      const orderAmount = order.total;
      
      const newTotalOrders = existing.stats.totalOrders + 1;
      const newTotalSpent = existing.stats.totalSpent + orderAmount;
      const newTotalPaid = existing.stats.totalPaid + (isPaid ? orderAmount : 0);
      const newTotalPending = existing.stats.totalPending + (isPaid ? 0 : orderAmount);
      
      const updated = await this.updateCustomer(existing.id, {
        name: order.customer.name, // optionally update name
        email: order.customer.email || existing.email,
        whatsapp: order.customer.whatsapp || existing.whatsapp,
        cpf: order.customer.cpf || existing.cpf,
        address: order.shipping.type === 'delivery' ? {
          cep: order.shipping.cep || existing.address?.cep,
          street: order.shipping.street || existing.address?.street,
          number: order.shipping.number || existing.address?.number,
          complement: order.shipping.complement || existing.address?.complement,
          neighborhood: order.shipping.neighborhood || existing.address?.neighborhood,
          city: order.shipping.city || existing.address?.city,
          state: order.shipping.state || existing.address?.state,
        } : existing.address,
        stats: {
          ...existing.stats,
          totalOrders: newTotalOrders,
          totalSpent: newTotalSpent,
          totalPaid: newTotalPaid,
          totalPending: newTotalPending,
          averageTicket: newTotalSpent / newTotalOrders,
          lastOrderAt: order.createdAt
        },
        related: {
          ...existing.related,
          orderIds: [...(existing.related.orderIds || []), order.id]
        }
      });
      return updated!;
    } else {
      // Create new customer
      const isPaid = order.payment.status === 'approved';
      const orderAmount = order.total;

      const created = await this.createCustomer({
        name: order.customer.name,
        email: order.customer.email,
        whatsapp: order.customer.whatsapp,
        cpf: order.customer.cpf,
        type: 'b2c',
        status: isPaid ? 'active' : 'pending_payment',
        source: 'checkout',
        address: order.shipping.type === 'delivery' ? {
          cep: order.shipping.cep,
          street: order.shipping.street,
          number: order.shipping.number,
          complement: order.shipping.complement,
          neighborhood: order.shipping.neighborhood,
          city: order.shipping.city,
          state: order.shipping.state,
        } : undefined,
        stats: {
          totalOrders: 1,
          totalSpent: orderAmount,
          totalPaid: isPaid ? orderAmount : 0,
          totalPending: isPaid ? 0 : orderAmount,
          averageTicket: orderAmount,
          firstOrderAt: order.createdAt,
          lastOrderAt: order.createdAt
        },
        related: {
          orderIds: [order.id]
        }
      });
      return created;
    }
  }
};
