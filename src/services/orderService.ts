import { OrderAdmin, CustomerAdmin } from '../types/admin';

// Mocked data
let mockOrders: OrderAdmin[] = [
  {
    id: "ord_1",
    orderNumber: "CFC-001",
    customer: {
      name: "João Silva",
      email: "joao@example.com",
      whatsapp: "34998728882",
    },
    shipping: {
      type: "delivery",
      cep: "30140000",
      street: "Rua Exemplo",
      number: "123",
      neighborhood: "Savassi",
      city: "Belo Horizonte",
      state: "MG"
    },
    items: [
      {
        productId: "prod_1",
        name: "Cerrado Clássico",
        format: "Pacote 250g",
        quantity: 2,
        unitPrice: 65,
        totalPrice: 130
      }
    ],
    subtotal: 130,
    discount: 0,
    shippingPrice: 15,
    total: 145,
    currency: "BRL",
    payment: {
      provider: "pix",
      method: "pix",
      status: "approved",
      paidAt: new Date().toISOString()
    },
    status: "preparing",
    source: "site",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [
      { id: "tl_1", type: "system", label: "Pedido Criado", createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: "tl_2", type: "payment", label: "Pagamento Aprovado", createdAt: new Date(Date.now() - 86000000).toISOString() },
    ]
  },
  {
    id: "ord_2",
    orderNumber: "CFC-002",
    customer: {
      name: "Maria Oliveira",
      whatsapp: "34998728882",
    },
    shipping: {
      type: "pickup",
      city: "Belo Horizonte",
      state: "MG"
    },
    items: [
      {
        productId: "prod_2",
        name: "Kit Degustação",
        format: "Kits",
        quantity: 1,
        unitPrice: 150,
        totalPrice: 150
      }
    ],
    subtotal: 150,
    discount: 10,
    shippingPrice: 0,
    total: 140,
    currency: "BRL",
    payment: {
      provider: "manual",
      method: "dinheiro",
      status: "pending"
    },
    status: "awaiting_payment",
    source: "whatsapp",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [
      { id: "tl_3", type: "system", label: "Pedido Criado", createdAt: new Date().toISOString() },
    ]
  }
];

export const orderService = {
  async listOrders(): Promise<OrderAdmin[]> {
    // Sort by created descending
    return Promise.resolve([...mockOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  },

  async getOrderById(id: string): Promise<OrderAdmin | undefined> {
    return Promise.resolve(mockOrders.find(o => o.id === id));
  },

  async updateOrderStatus(id: string, status: OrderAdmin['status'], note?: string, user?: {id: string, name: string}): Promise<OrderAdmin | undefined> {
    const idx = mockOrders.findIndex(o => o.id === id);
    if (idx === -1) return undefined;
    
    mockOrders[idx].status = status;
    mockOrders[idx].updatedAt = new Date().toISOString();
    
    if (!mockOrders[idx].timeline) mockOrders[idx].timeline = [];
    
    // Add timeline event
    mockOrders[idx].timeline!.push({
      id: `tl_${Date.now()}`,
      type: 'status_change',
      label: `Status alterado para: ${status.replace(/_/g, ' ')}`,
      description: note,
      userId: user?.id,
      createdAt: new Date().toISOString()
    });

    return Promise.resolve(mockOrders[idx]);
  },

  async addInternalNote(id: string, text: string, user: {id: string, name: string}): Promise<OrderAdmin | undefined> {
     const idx = mockOrders.findIndex(o => o.id === id);
     if (idx === -1) return undefined;
     
     if (!mockOrders[idx].internalNotes) mockOrders[idx].internalNotes = [];
     
     mockOrders[idx].internalNotes!.push({
       id: `note_${Date.now()}`,
       text,
       userId: user.id,
       userName: user.name,
       createdAt: new Date().toISOString()
     });

     return Promise.resolve(mockOrders[idx]);
  },

  async exportOrdersCSV(): Promise<string> {
    const headers = ["Número", "Data", "Cliente", "WhatsApp", "E-mail", "Total", "Status Operacional", "Status Pagamento", "Origem"];
    const rows = mockOrders.map(o => [
      o.orderNumber,
      new Date(o.createdAt).toLocaleDateString(),
      o.customer.name,
      o.customer.whatsapp || '',
      o.customer.email || '',
      o.total.toFixed(2),
      o.status,
      o.payment.status,
      o.source
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.map(f => `"${f}"`).join(","))
    ].join("\n");
    
    return Promise.resolve(csvContent);
  },

  async createOrder(orderData: Partial<OrderAdmin>): Promise<OrderAdmin> {
    const newOrder = {
      ...orderData,
      id: orderData.id || `ord_${Date.now()}`,
      createdAt: orderData.createdAt || new Date().toISOString(),
      updatedAt: orderData.updatedAt || new Date().toISOString(),
      timeline: orderData.timeline || [
        { id: `tl_${Date.now()}`, type: "system", label: "Pedido Criado", createdAt: new Date().toISOString() }
      ]
    } as OrderAdmin;
    
    mockOrders.push(newOrder);

    // Integation with customer CRM
    // Normally this would be a backend trigger or cloud function, but since we are mocking/client side here:
    try {
      const { customerService } = await import('./customerService');
      await customerService.createOrUpdateCustomerFromOrder(newOrder);
    } catch (e) {
      console.warn("Could not sync customer from order", e);
    }

    return Promise.resolve(newOrder);
  }
};
