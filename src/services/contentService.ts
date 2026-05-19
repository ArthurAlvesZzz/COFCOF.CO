import { ContentBlock, FAQItem, Banner } from '../types/admin';

let mockContentBlocks: ContentBlock[] = [];
let mockFAQs: FAQItem[] = [];
let mockBanners: Banner[] = [];

export const contentService = {
  // --- Content Blocks ---
  async listContentBlocks(): Promise<ContentBlock[]> {
    return Promise.resolve([...mockContentBlocks]);
  },

  async getContentBlockById(id: string): Promise<ContentBlock | undefined> {
    return Promise.resolve(mockContentBlocks.find(b => b.id === id));
  },

  async getContentBlockByKey(key: string, page: string): Promise<ContentBlock | undefined> {
    return Promise.resolve(mockContentBlocks.find(b => b.key === key && b.page === page));
  },

  async getPublishedBlocksByPage(page: string): Promise<ContentBlock[]> {
    const blocks = mockContentBlocks.filter(
      b => b.page === page && b.status === 'published' && b.active
    );
    return Promise.resolve(blocks.sort((a, b) => (a.order || 0) - (b.order || 0)));
  },

  async createContentBlock(data: Partial<ContentBlock>): Promise<ContentBlock> {
    const newBlock: ContentBlock = {
      ...data,
      id: `cb_${Date.now()}`,
      status: data.status || 'draft',
      active: data.active ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as ContentBlock;
    mockContentBlocks.push(newBlock);
    return Promise.resolve(newBlock);
  },

  async updateContentBlock(id: string, data: Partial<ContentBlock>): Promise<ContentBlock | undefined> {
    const idx = mockContentBlocks.findIndex(b => b.id === id);
    if (idx === -1) return undefined;
    mockContentBlocks[idx] = { 
      ...mockContentBlocks[idx], 
      ...data, 
      updatedAt: new Date().toISOString() 
    };
    return Promise.resolve(mockContentBlocks[idx]);
  },

  async duplicateContentBlock(id: string): Promise<ContentBlock | undefined> {
    const existing = mockContentBlocks.find(b => b.id === id);
    if (!existing) return undefined;
    
    const { id: _id, key, createdAt, updatedAt, ...rest } = existing;
    return this.createContentBlock({
       ...rest,
       key: `${key}_copy`,
       title: existing.title ? `${existing.title} (Cópia)` : '',
       status: 'draft',
       active: false
    });
  },

  async publishContentBlock(id: string): Promise<ContentBlock | undefined> {
    return this.updateContentBlock(id, { status: 'published', active: true });
  },

  async unpublishContentBlock(id: string): Promise<ContentBlock | undefined> {
    return this.updateContentBlock(id, { status: 'draft', active: false });
  },

  async archiveContentBlock(id: string): Promise<ContentBlock | undefined> {
    return this.updateContentBlock(id, { status: 'archived', active: false });
  },

  // --- FAQs ---
  async listFAQs(): Promise<FAQItem[]> {
    return Promise.resolve([...mockFAQs]);
  },

  async getFAQsByPage(page: string): Promise<FAQItem[]> {
    const faqs = mockFAQs.filter(f => f.page === page && f.status === 'published' && f.active);
    return Promise.resolve(faqs.sort((a, b) => (a.order || 0) - (b.order || 0)));
  },

  async createFAQ(data: Partial<FAQItem>): Promise<FAQItem> {
    const newFAQ: FAQItem = {
      ...data,
      id: `faq_${Date.now()}`,
      status: data.status || 'draft',
      active: data.active ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as FAQItem;
    mockFAQs.push(newFAQ);
    return Promise.resolve(newFAQ);
  },

  async updateFAQ(id: string, data: Partial<FAQItem>): Promise<FAQItem | undefined> {
    const idx = mockFAQs.findIndex(f => f.id === id);
    if (idx === -1) return undefined;
    mockFAQs[idx] = { ...mockFAQs[idx], ...data, updatedAt: new Date().toISOString() };
    return Promise.resolve(mockFAQs[idx]);
  },

  async publishFAQ(id: string): Promise<FAQItem | undefined> {
    return this.updateFAQ(id, { status: 'published', active: true });
  },

  async unpublishFAQ(id: string): Promise<FAQItem | undefined> {
    return this.updateFAQ(id, { status: 'draft', active: false });
  },

  async archiveFAQ(id: string): Promise<FAQItem | undefined> {
    return this.updateFAQ(id, { status: 'archived', active: false });
  },

  // --- Banners ---
  async listBanners(): Promise<Banner[]> {
    return Promise.resolve([...mockBanners]);
  },

  async getActiveBannersByPage(page: string, position?: string): Promise<Banner[]> {
    const banners = mockBanners.filter(b => 
      b.page === page && 
      b.active &&
      (!position || b.position === position) &&
      (!b.startDate || new Date(b.startDate) <= new Date()) &&
      (!b.endDate || new Date(b.endDate) >= new Date())
    );
    return Promise.resolve(banners.sort((a, b) => (b.priority || 0) - (a.priority || 0)));
  },

  async createBanner(data: Partial<Banner>): Promise<Banner> {
    const newBanner: Banner = {
      ...data,
      id: `ban_${Date.now()}`,
      active: data.active ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Banner;
    mockBanners.push(newBanner);
    return Promise.resolve(newBanner);
  },

  async updateBanner(id: string, data: Partial<Banner>): Promise<Banner | undefined> {
    const idx = mockBanners.findIndex(b => b.id === id);
    if (idx === -1) return undefined;
    mockBanners[idx] = { ...mockBanners[idx], ...data, updatedAt: new Date().toISOString() };
    return Promise.resolve(mockBanners[idx]);
  },

  async toggleBannerActive(id: string): Promise<Banner | undefined> {
    const banner = mockBanners.find(b => b.id === id);
    if (!banner) return undefined;
    return this.updateBanner(id, { active: !banner.active });
  },

  async archiveBanner(id: string): Promise<boolean> {
     // Hard delete or softly removing the active? Let's just remove from mock for banners now
     mockBanners = mockBanners.filter(b => b.id !== id);
     return Promise.resolve(true);
  },

  // Seed default content (simulating importing from the actual public site)
  async importPublicContent(): Promise<void> {
    const { publicContentRegistry, publicFAQRegistry, publicBannerRegistry } = await import('../data/publicContentRegistry');
    
    mockContentBlocks = [...publicContentRegistry.map(b => ({ ...b, id: b.id || `cb_${Date.now()}_${Math.random()}` }))];
    mockFAQs = [...publicFAQRegistry.map(f => ({ ...f, id: f.id || `faq_${Date.now()}_${Math.random()}` }))];
    mockBanners = [...publicBannerRegistry.map(b => ({ ...b, id: b.id || `banner_${Date.now()}_${Math.random()}` }))];
    
    return Promise.resolve();
  },

  async restoreDefaultContent(): Promise<void> {
    await this.importPublicContent();
  }
};
