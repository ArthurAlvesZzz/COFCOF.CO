import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Role = 'admin' | 'staff' | 'customer';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
}

interface AdminAuthState {
  user: AdminUser | null;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      user: null,
      login: async (email, password) => {
        // Dev mock logic for VITE_ENABLE_DEV_ADMIN_LOGIN
        if (email === 'admin@cofcof.local' && password === 'CofcofAdmin@2026') {
          set({
            user: {
              id: 'dev-admin-1',
              name: 'Admin Temporário',
              email: 'admin@cofcof.local',
              role: 'admin',
              active: true,
            }
          });
          return;
        }

        // Mock staff login
        if (email === 'staff@cofcof.local' && password === 'CofcofStaff@2026') {
           set({
             user: {
               id: 'dev-staff-1',
               name: 'Staff Temporário',
               email: 'staff@cofcof.local',
               role: 'staff',
               active: true,
             }
           });
           return;
         }

        // Simulating error for others
        throw new Error("Credenciais inválidas ou usuário sem permissão.");
      },
      logout: () => set({ user: null }),
    }),
    {
      name: 'cofcof-admin-auth',
    }
  )
);
