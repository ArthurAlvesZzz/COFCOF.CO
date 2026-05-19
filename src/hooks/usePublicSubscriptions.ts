import { useState, useCallback, useEffect } from 'react';
import { subscriptionService } from '../services/subscriptionService';
import { SubscriptionPlan } from '../types/admin';

export function usePublicSubscriptions() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getPublicPlans();
      setPlans(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar planos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const submitInterest = async (data: any) => {
     try {
       await subscriptionService.createInterest(data);
       return true;
     } catch (err) {
       console.error("Error submitting interest", err);
       return false;
     }
  };

  return { plans, loading, error, submitInterest };
}
