import { useState, useEffect, useCallback } from 'react';
import { ProductAdmin } from '../types/admin';
import { productService } from '../services/productService';
import { adminLogService } from '../services/adminLogService';
import { useAdminAuthStore } from '../store/adminAuthStore';

export function useProducts() {
  const [products, setProducts] = useState<ProductAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAdminAuthStore();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productService.listProducts();
      setProducts(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = async (data: Omit<ProductAdmin, 'id'>) => {
    const newProduct = await productService.createProduct(data);
    if (user) {
      await adminLogService.logAdminAction({
        userId: user.id,
        userEmail: user.email,
        action: 'create_product',
        entity: 'product',
        entityId: newProduct.id,
        after: newProduct
      });
    }
    await fetchProducts();
    return newProduct;
  };

  const updateProduct = async (id: string, data: Partial<ProductAdmin>) => {
    const oldProduct = products.find(p => p.id === id);
    const updated = await productService.updateProduct(id, data);
    if (updated && user) {
      await adminLogService.logAdminAction({
        userId: user.id,
        userEmail: user.email,
        action: 'update_product',
        entity: 'product',
        entityId: id,
        before: oldProduct,
        after: updated
      });
    }
    await fetchProducts();
    return updated;
  };

  const toggleActive = async (id: string) => {
    const p = products.find(p => p.id === id);
    if (!p) return;
    await productService.toggleProductActive(id);
    if (user) {
      await adminLogService.logAdminAction({
        userId: user.id,
        userEmail: user.email,
        action: p.active ? 'deactivate_product' : 'activate_product',
        entity: 'product',
        entityId: id,
      });
    }
    await fetchProducts();
  };

  const archiveProduct = async (id: string) => {
    await productService.archiveProduct(id);
    if (user) {
      await adminLogService.logAdminAction({
        userId: user.id,
        userEmail: user.email,
        action: 'archive_product',
        entity: 'product',
        entityId: id,
      });
    }
    await fetchProducts();
  };

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    toggleActive,
    archiveProduct,
    refresh: fetchProducts
  };
}
