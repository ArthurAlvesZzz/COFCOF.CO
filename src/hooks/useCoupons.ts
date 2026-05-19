import { useState, useCallback, useEffect } from 'react';
import { couponService } from '../services/couponService';
import { Coupon, CouponUsage } from '../types/admin';
import { useAdminAuthStore } from '../store/adminAuthStore';
import { adminLogService } from '../services/adminLogService';

export function useCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAdminAuthStore();

  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true);
      const data = await couponService.listCoupons();
      setCoupons(data.filter(c => !c.archived));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar cupons');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const createCoupon = async (data: Partial<Coupon>) => {
    const created = await couponService.createCoupon(data);
    if (user) {
      await adminLogService.logAdminAction({
        userId: user.id,
        userEmail: user.email,
        action: 'create_coupon',
        entity: 'coupon',
        entityId: created.id
      });
    }
    await fetchCoupons();
    return created;
  };

  const updateCoupon = async (id: string, data: Partial<Coupon>) => {
    const updated = await couponService.updateCoupon(id, data);
    if (updated && user) {
      await adminLogService.logAdminAction({
        userId: user.id,
        userEmail: user.email,
        action: 'update_coupon',
        entity: 'coupon',
        entityId: id
      });
    }
    await fetchCoupons();
    return updated;
  };

  const duplicateCoupon = async (id: string) => {
    const duplicated = await couponService.duplicateCoupon(id);
    if (duplicated && user) {
      await adminLogService.logAdminAction({
        userId: user.id,
        userEmail: user.email,
        action: 'duplicate_coupon',
        entity: 'coupon',
        entityId: id
      });
    }
    await fetchCoupons();
    return duplicated;
  };

  const archiveCoupon = async (id: string) => {
    const success = await couponService.archiveCoupon(id);
    if (success && user) {
      await adminLogService.logAdminAction({
        userId: user.id,
        userEmail: user.email,
        action: 'archive_coupon',
        entity: 'coupon',
        entityId: id
      });
    }
    await fetchCoupons();
    return success;
  };

  return {
    coupons,
    loading,
    error,
    createCoupon,
    updateCoupon,
    duplicateCoupon,
    archiveCoupon,
    refresh: fetchCoupons
  };
}
