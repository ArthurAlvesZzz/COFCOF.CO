import { B2BLead } from '../types/admin';

let mockLeads: B2BLead[] = [
  {
    id: "lead_1",
    contactName: "João Silva",
    companyName: "Tech Solutions",
    whatsapp: "11988887777",
    email: "joao@techsolutions.com",
    segment: "office",
    city: "São Paulo",
    state: "SP",
    source: "empresas_page",
    status: "new",
    temperature: "warm",
    estimatedConsumption: {
      peoplePerDay: 50,
      cupsPerPerson: 2,
      daysPerMonth: 22,
      gramsPerCup: 10,
      monthlyKg: 22,
      recommendedPackage: "Pacote 20kg",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "lead_2",
    contactName: "Maria Oliveira",
    companyName: "Bistro da Gabi",
    whatsapp: "31999998888",
    email: "contato@bistroda.com",
    segment: "restaurant",
    city: "Belo Horizonte",
    state: "MG",
    source: "whatsapp",
    status: "negotiation",
    temperature: "hot",
    estimatedConsumption: {
      monthlyKg: 50,
      recommendedPackage: "Pacote 50kg",
    },
    proposal: {
      packageName: "Pacote Misto 50kg",
      monthlyKg: 50,
      pricePerKg: 75,
      estimatedMonthlyValue: 3750,
      status: "sent"
    },
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const b2bLeadService = {
  async listLeads(): Promise<B2BLead[]> {
    return Promise.resolve([...mockLeads].sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()));
  },

  async getLeadById(id: string): Promise<B2BLead | undefined> {
    return Promise.resolve(mockLeads.find(l => l.id === id));
  },

  async createLead(data: Partial<B2BLead>): Promise<B2BLead> {
    // Check duplication
    const existing = await this.findDuplicateLead(data.email, data.whatsapp, data.companyName);
    if (existing) {
      // Logic for adding a note/update instead of duplicate, left out of create for now
      // Or just update existing:
      throw new Error(`Lead já existe com este WhatsApp/E-mail. ID: ${existing.id}`);
    }

    const newLead: B2BLead = {
      ...data,
      id: `lead_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: data.status || "new",
      source: data.source || "admin"
    } as B2BLead;

    mockLeads.push(newLead);
    return Promise.resolve(newLead);
  },

  async updateLead(id: string, data: Partial<B2BLead>): Promise<B2BLead | undefined> {
    const idx = mockLeads.findIndex(l => l.id === id);
    if (idx === -1) return undefined;

    mockLeads[idx] = {
      ...mockLeads[idx],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return Promise.resolve(mockLeads[idx]);
  },

  async updateLeadStatus(id: string, status: B2BLead['status'], note?: string): Promise<B2BLead | undefined> {
    const lead = await this.updateLead(id, { status });
    if (note && lead) {
       await this.addLeadNote(id, note, {id: "system", name: "Sistema"});
    }
    return lead;
  },

  async assignResponsible(id: string, sellerId: string): Promise<B2BLead | undefined> {
    return this.updateLead(id, { responsibleSellerId: sellerId });
  },

  async archiveLead(id: string): Promise<boolean> {
    const lead = await this.updateLead(id, { archived: true });
    return !!lead;
  },

  async addFollowUp(id: string, followUp: Omit<NonNullable<B2BLead['followUps']>[0], 'id' | 'createdAt'>): Promise<B2BLead | undefined> {
    const idx = mockLeads.findIndex(l => l.id === id);
    if (idx === -1) return undefined;

    if (!mockLeads[idx].followUps) mockLeads[idx].followUps = [];
    mockLeads[idx].followUps!.push({
      ...followUp,
      id: `fu_${Date.now()}`,
      createdAt: new Date().toISOString()
    });
    mockLeads[idx].updatedAt = new Date().toISOString();
    return Promise.resolve(mockLeads[idx]);
  },

  async addLeadNote(id: string, text: string, user: {id: string, name: string}): Promise<B2BLead | undefined> {
    const idx = mockLeads.findIndex(l => l.id === id);
    if (idx === -1) return undefined;

    if (!mockLeads[idx].notes) mockLeads[idx].notes = [];
    mockLeads[idx].notes!.push({
      id: `note_${Date.now()}`,
      text,
      userId: user.id,
      userName: user.name,
      createdAt: new Date().toISOString()
    });
    mockLeads[idx].updatedAt = new Date().toISOString();
    return Promise.resolve(mockLeads[idx]);
  },

  async createProposal(id: string, proposal: B2BLead['proposal']): Promise<B2BLead | undefined> {
    return this.updateLead(id, { 
      proposal: {
         ...proposal,
         status: "sent",
         sentAt: new Date().toISOString()
      },
      status: "proposal_sent"
    });
  },

  async convertLeadToCustomer(id: string): Promise<{lead: B2BLead, customer: any} | undefined> {
    const leadStr = await this.getLeadById(id);
    if (!leadStr) return;

    // Call customerService to create/update
    const { customerService } = await import('./customerService');
    const existingCust = await customerService.findCustomerByEmailOrWhatsapp(leadStr.email, leadStr.whatsapp);

    let customerResult;
    if (existingCust) {
       customerResult = await customerService.updateCustomer(existingCust.id, {
         type: "b2b",
         company: {
            ...existingCust.company,
            name: leadStr.companyName || existingCust.company?.name,
            segment: leadStr.segment || existingCust.company?.segment,
            estimatedMonthlyKg: leadStr.estimatedConsumption?.monthlyKg || existingCust.company?.estimatedMonthlyKg,
            commercialStatus: "active_client",
            responsibleSellerId: leadStr.responsibleSellerId || existingCust.company?.responsibleSellerId,
         },
         related: {
           ...existingCust.related,
           leadIds: [...(existingCust.related.leadIds || []), leadStr.id]
         }
       });
    } else {
       customerResult = await customerService.createCustomer({
         name: leadStr.contactName,
         email: leadStr.email,
         whatsapp: leadStr.whatsapp,
         type: "b2b",
         status: "new",
         source: "b2b_lead",
         company: {
           name: leadStr.companyName,
           segment: leadStr.segment,
           estimatedMonthlyKg: leadStr.estimatedConsumption?.monthlyKg,
           commercialStatus: "active_client",
           responsibleSellerId: leadStr.responsibleSellerId,
         },
         address: {
           city: leadStr.city,
           state: leadStr.state
         },
         related: {
           leadIds: [leadStr.id]
         }
       });
    }

    const updatedLead = await this.updateLead(id, {
       status: "converted",
       conversion: {
          convertedAt: new Date().toISOString(),
          customerId: customerResult?.id
       }
    });

    return { lead: updatedLead!, customer: customerResult };
  },

  async markLeadLost(id: string, reason: string, notes?: string): Promise<B2BLead | undefined> {
    return this.updateLead(id, {
      status: "lost",
      conversion: {
        convertedAt: new Date().toISOString(),
        lostReason: reason,
        lostNotes: notes
      }
    });
  },

  async findDuplicateLead(email?: string, whatsapp?: string, companyName?: string): Promise<B2BLead | undefined> {
    return Promise.resolve(mockLeads.find(l => {
      if (email && l.email && l.email.toLowerCase() === email.toLowerCase()) return true;
      if (whatsapp && l.whatsapp && l.whatsapp.replace(/\D/g, '') === whatsapp.replace(/\D/g, '')) return true;
      if (companyName && l.companyName && l.companyName.toLowerCase() === companyName.toLowerCase()) return true;
      return false;
    }));
  },

  async exportLeadsCSV(): Promise<string> {
    const headers = ["Empresa", "Contato", "WhatsApp", "E-mail", "Segmento", "Cidade", "UF", "Status", "Consumo (Kg)", "Criado Em"];
    const rows = mockLeads.map(l => [
      l.companyName || '',
      l.contactName,
      l.whatsapp || '',
      l.email || '',
      l.segment || '',
      l.city || '',
      l.state || '',
      l.status,
      l.estimatedConsumption?.monthlyKg?.toString() || '',
      new Date(l.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.map(f => `"${f || ''}"`).join(","))
    ].join("\n");

    return Promise.resolve(csvContent);
  }
};
