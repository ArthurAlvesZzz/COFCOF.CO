import { contentService } from './contentService';
import { ContentBlock, FAQItem, Banner } from '../types/admin';

export const publicContentService = {
  async getPageContent(page: string): Promise<ContentBlock[]> {
    try {
      return await contentService.getPublishedBlocksByPage(page);
    } catch (e) {
      console.error('Error fetching page content:', e);
      return [];
    }
  },

  async getBlock(page: string, key: string, fallback?: Partial<ContentBlock>): Promise<Partial<ContentBlock>> {
    try {
      const blocks = await this.getPageContent(page);
      const block = blocks.find(b => b.key === key);
      return block || fallback || {};
    } catch (e) {
      console.error('Error fetching block:', e);
      return fallback || {};
    }
  },

  async getFAQs(page: string): Promise<FAQItem[]> {
    try {
      return await contentService.getFAQsByPage(page);
    } catch (e) {
      console.error('Error fetching FAQs:', e);
      return [];
    }
  },

  async getActiveBanners(page: string, position?: string): Promise<Banner[]> {
    try {
      return await contentService.getActiveBannersByPage(page, position);
    } catch (e) {
      console.error('Error fetching active banners:', e);
      return [];
    }
  },

  async getPageSEO(page: string): Promise<ContentBlock['seo'] | undefined> {
    try {
      const blocks = await this.getPageContent(page);
      const seoBlock = blocks.find(b => b.type === 'seo');
      if (seoBlock) return seoBlock.seo;
      
      if (page !== 'global') {
         const globalBlocks = await this.getPageContent('global');
         const globalSeo = globalBlocks.find(b => b.type === 'seo');
         if (globalSeo) return globalSeo.seo;
      }
      return undefined;
    } catch (e) {
      console.error('Error fetching page SEO:', e);
      return undefined;
    }
  }
};
