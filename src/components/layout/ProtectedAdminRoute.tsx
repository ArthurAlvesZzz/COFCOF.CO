import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '../../store/adminAuthStore';
import { Loader2 } from 'lucide-react';

export default function ProtectedAdminRoute() {
  const { isValidAdminUser, clearInvalidSession } = useAdminAuthStore();
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);
  const isValid = isValidAdminUser();

  useEffect(() => {
    // Quick validation cycle
    if (!isValid) {
       clearInvalidSession();
    }
    setIsReady(true);
  }, [isValid, clearInvalidSession]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4 text-[#c9a263]">
          <Loader2 className="animate-spin" size={32} />
          <p className="text-sm font-medium">Verificando sessão segura...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/admin/login" state={{ from: location, error: "Sessão expirada ou inválida. Faça login novamente." }} replace />;
  }

  return <Outlet />;
}
