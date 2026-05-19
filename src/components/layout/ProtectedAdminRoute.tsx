import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '../../store/adminAuthStore';
import { Loader2 } from 'lucide-react';

export default function ProtectedAdminRoute() {
  const { user } = useAdminAuthStore();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Timeout to simulate verification
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [user]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4 text-cof-caramel">
          <Loader2 className="animate-spin" size={32} />
          <p className="text-sm font-medium">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role === 'customer' || !user.active) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
