import { useState, useCallback, useEffect } from 'react';
import { contentService } from '../services/contentService';
import { ContentBlock, FAQItem, Banner } from '../types/admin';
import { useAdminAuthStore } from '../store/adminAuthStore';
import { adminLogService } from '../services/adminLogService';

export function useContent() {
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAdminAuthStore();

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [blocksData, faqsData, bannersData] = await Promise.all([
        contentService.listContentBlocks(),
        contentService.listFAQs(),
        contentService.listBanners()
      ]);
      setContentBlocks(blocksData);
      setFaqs(faqsData);
      setBanners(bannersData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar conteúdo');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const logAction = async (action: string, entity: string, entityId: string) => {
    if (user) {
      await adminLogService.logAdminAction({
        userId: user.id,
        userEmail: user.email,
        action,
        entity,
        entityId
      });
    }
  };

  // Blocks
  const saveBlock = async (id: string | null, data: Partial<ContentBlock>) => {
    let saved;
    if (id) {
      saved = await contentService.updateContentBlock(id, data);
      if (saved) await logAction('update_content_block', 'content_block', id);
    } else {
      saved = await contentService.createContentBlock(data);
      if (saved) await logAction('create_content_block', 'content_block', saved.id);
    }
    await fetchAll();
    return saved;
  };

  const deleteBlock = async (id: string) => {
    const success = await contentService.archiveContentBlock(id);
    if (success) await logAction('archive_content_block', 'content_block', id);
    await fetchAll();
    return success;
  };

  const publishBlock = async (id: string) => {
    const success = await contentService.publishContentBlock(id);
    if (success) await logAction('publish_content_block', 'content_block', id);
    await fetchAll();
    return success;
  };

  const unpublishBlock = async (id: string) => {
    const success = await contentService.unpublishContentBlock(id);
    if (success) await logAction('unpublish_content_block', 'content_block', id);
    await fetchAll();
    return success;
  };

  const duplicateBlock = async (id: string) => {
    const success = await contentService.duplicateContentBlock(id);
    if (success) await logAction('duplicate_content_block', 'content_block', success.id);
    await fetchAll();
    return success;
  };

  const restoreDefaults = async () => {
    await contentService.restoreDefaultContent();
    await logAction('restore_default_content', 'content_block', 'all');
    await fetchAll();
  };

  // FAQs
  const saveFAQ = async (id: string | null, data: Partial<FAQItem>) => {
    let saved;
    if (id) {
      saved = await contentService.updateFAQ(id, data);
      if (saved) await logAction('update_faq', 'faq', id);
    } else {
      saved = await contentService.createFAQ(data);
      if (saved) await logAction('create_faq', 'faq', saved.id);
    }
    await fetchAll();
    return saved;
  };

  const publishFAQ = async (id: string) => {
    const success = await contentService.publishFAQ(id);
    if (success) await logAction('publish_faq', 'faq', id);
    await fetchAll();
    return success;
  };

  const deleteFAQ = async (id: string) => {
    const success = await contentService.archiveFAQ(id);
    if (success) await logAction('archive_faq', 'faq', id);
    await fetchAll();
    return success;
  };

  // Banners
  const saveBanner = async (id: string | null, data: Partial<Banner>) => {
    let saved;
    if (id) {
      saved = await contentService.updateBanner(id, data);
      if (saved) await logAction('update_banner', 'banner', id);
    } else {
      saved = await contentService.createBanner(data);
      if (saved) await logAction('create_banner', 'banner', saved.id);
    }
    await fetchAll();
    return saved;
  };

  const toggleBanner = async (id: string) => {
    const success = await contentService.toggleBannerActive(id);
    if (success) await logAction('toggle_banner', 'banner', id);
    await fetchAll();
    return success;
  };

  const deleteBanner = async (id: string) => {
    const success = await contentService.archiveBanner(id);
    if (success) await logAction('archive_banner', 'banner', id);
    await fetchAll();
    return success;
  };

  return {
    contentBlocks,
    faqs,
    banners,
    loading,
    error,
    refresh: fetchAll,
    saveBlock,
    publishBlock,
    unpublishBlock,
    deleteBlock,
    duplicateBlock,
    restoreDefaults,
    saveFAQ,
    publishFAQ,
    deleteFAQ,
    saveBanner,
    toggleBanner,
    deleteBanner
  };
}
