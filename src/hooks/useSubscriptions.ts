import { useState, useCallback, useEffect } from 'react';
import { subscriptionService } from '../services/subscriptionService';
import { SubscriptionPlan, SubscriptionInterest, Subscription } from '../types/admin';
import { useAdminAuthStore } from '../store/adminAuthStore';
import { adminLogService } from '../services/adminLogService';

export function useSubscriptions() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [interests, setInterests] = useState<SubscriptionInterest[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAdminAuthStore();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [fetchedPlans, fetchedInterests, fetchedSubs] = await Promise.all([
        subscriptionService.listPlans(),
        subscriptionService.listInterests(),
        subscriptionService.listSubscriptions()
      ]);
      setPlans(fetchedPlans.filter(p => !p.archived));
      setInterests(fetchedInterests);
      setSubscriptions(fetchedSubs);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados de assinaturas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createPlan = async (data: Partial<SubscriptionPlan>) => {
    const created = await subscriptionService.createPlan(data);
    if (user) {
      await adminLogService.logAdminAction({
        userId: user.id,
        userEmail: user.email,
        action: 'create_subscription_plan',
        entity: 'subscription_plan',
        entityId: created.id
      });
    }
    await fetchData();
    return created;
  };

  const updatePlan = async (id: string, data: Partial<SubscriptionPlan>) => {
    const updated = await subscriptionService.updatePlan(id, data);
    if (updated && user) {
      await adminLogService.logAdminAction({
        userId: user.id,
        userEmail: user.email,
        action: 'update_subscription_plan',
        entity: 'subscription_plan',
        entityId: id
      });
    }
    await fetchData();
    return updated;
  };

  const updateInterestStatus = async (id: string, status: SubscriptionInterest['status']) => {
    const updated = await subscriptionService.updateInterestStatus(id, status);
    if (updated && user) {
       await adminLogService.logAdminAction({
         userId: user.id,
         userEmail: user.email,
         action: 'update_subscription_interest_status',
         entity: 'subscription_interest',
         entityId: id,
         after: { status }
       });
    }
    await fetchData();
    return updated;
  };

  const convertInterestToCustomer = async (id: string) => {
    const cust = await subscriptionService.convertInterestToCustomer(id);
    if (cust && user) {
       await adminLogService.logAdminAction({
         userId: user.id,
         userEmail: user.email,
         action: 'convert_subscription_interest',
         entity: 'subscription_interest',
         entityId: id,
         after: { customerId: cust.id }
       });
    }
    await fetchData();
    return cust;
  };

  const updateSubscription = async (id: string, data: Partial<Subscription>) => {
    const updated = await subscriptionService.updateSubscription(id, data);
    if (updated && user) {
       await adminLogService.logAdminAction({
         userId: user.id,
         userEmail: user.email,
         action: 'update_subscription',
         entity: 'subscription',
         entityId: id
       });
    }
    await fetchData();
    return updated;
  };

  return {
    plans,
    interests,
    subscriptions,
    loading,
    error,
    createPlan,
    updatePlan,
    updateInterestStatus,
    convertInterestToCustomer,
    updateSubscription,
    refresh: fetchData
  };
}
