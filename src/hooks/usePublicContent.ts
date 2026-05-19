import { useState, useCallback, useEffect } from 'react';
import { contentService } from '../services/contentService';
import { ContentBlock, FAQItem, Banner } from '../types/admin';
import { publicContentRegistry, publicFAQRegistry, publicBannerRegistry } from '../data/publicContentRegistry';

export function usePublicContent(page: string) {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const dbBlocks = await contentService.getPublishedBlocksByPage(page);
      const allBlocks = await contentService.listContentBlocks();
      
      let finalBlocks = dbBlocks;
      if (allBlocks.length === 0) {
        finalBlocks = publicContentRegistry.filter(b => b.page === page);
      }
      
      const dbFaqs = await contentService.getFAQsByPage(page);
      const allFaqs = await contentService.listFAQs();
      let finalFaqs = dbFaqs;
      if (allFaqs.length === 0) {
        finalFaqs = publicFAQRegistry.filter(f => f.page === page || f.page === 'global');
      }

      const dbBanners = await contentService.getActiveBannersByPage(page);
      const allBanners = await contentService.listBanners();
      let finalBanners = dbBanners;
      if (allBanners.length === 0) {
        finalBanners = publicBannerRegistry.filter(b => b.page === page || b.page === 'global');
      }

      setBlocks(finalBlocks);
      setFaqs(finalFaqs);
      setBanners(finalBanners);
    } catch (error) {
      console.error('Error fetching public content:', error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const getBlock = (key: string) => blocks.find(b => b.key === key);

  return { blocks, faqs, banners, loading, getBlock };
}
