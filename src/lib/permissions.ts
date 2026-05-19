import { UserRole } from '../types/admin';

export function canAccessModule(role: UserRole, moduleId: string): boolean {
  if (role === 'admin') return true;
  if (role === 'customer') return false;

  switch (role) {
    case 'staff':
      return [
        'dashboard', 'products', 'orders', 'customers', 'leads', 'partners',
        'subscriptions', 'content', 'op_dashboard', 'op_lots', 'op_roasts', 
        'op_packaging', 'op_stock', 'op_consignments', 'op_reports'
      ].includes(moduleId);
      
    case 'roaster':
      return [
        'op_dashboard', 'op_lots', 'op_roasts', 'op_packaging', 'op_hours_payroll'
      ].includes(moduleId);

    case 'seller':
      return [
        'dashboard', 'leads', 'orders', 'op_consignments', 'op_sellers', 'op_commissions'
      ].includes(moduleId);

    default:
      return false;
  }
}
