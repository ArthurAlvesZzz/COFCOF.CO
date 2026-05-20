import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole } from '../types/admin'; // using UserRole if exists?

type Role = 'admin' | 'staff' | 'roaster' | 'seller' | 'customer';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
}

interface AdminAuthState {
  user: AdminUser | null;
  authVersion: number;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  isValidAdminUser: () => boolean;
  clearInvalidSession: () => void;
}

const CURRENT_AUTH_VERSION = 2; // Incremented version to bust cache

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      user: null,
      authVersion: CURRENT_AUTH_VERSION,
      
      isValidAdminUser: () => {
        const user = get().user;
        const version = get().authVersion;
        
        if (version !== CURRENT_AUTH_VERSION) return false;
        if (!user) return false;
        if (!user.active) return false;
        
        const validRoles: Role[] = ['admin', 'staff', 'roaster', 'seller'];
        return validRoles.includes(user.role);
      },
      
      clearInvalidSession: () => {
        set({ user: null, authVersion: CURRENT_AUTH_VERSION });
      },

      login: async (email, password) => {
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password?.trim();

        // Dev mock logic for admin
        if (normalizedEmail === 'admin@cofcof.local' && normalizedPassword === 'CofcofAdmin@2026') {
          set({
            user: {
              id: 'dev-admin-1',
              name: 'Admin Temporário',
              email: 'admin@cofcof.local',
              role: 'admin',
              active: true,
            },
            authVersion: CURRENT_AUTH_VERSION
          });
          return;
        }

        // Mock staff login
        if (normalizedEmail === 'staff@cofcof.local' && normalizedPassword === 'CofcofStaff@2026') {
           set({
             user: {
               id: 'dev-staff-1',
               name: 'Staff Temporário',
               email: 'staff@cofcof.local',
               role: 'staff',
               active: true,
             },
             authVersion: CURRENT_AUTH_VERSION
           });
           return;
         }

        // Simulating error for others
        throw new Error("Credenciais inválidas ou usuário sem permissão.");
      },
      
      logout: () => set({ user: null, authVersion: CURRENT_AUTH_VERSION }),
    }),
    {
      name: 'cofcof-admin-auth',
      onRehydrateStorage: () => (state) => {
        // Run after rehydration to clear invalid session automatically
        if (state) {
           if (state.authVersion !== CURRENT_AUTH_VERSION || !state.user || !state.user.active || !['admin', 'staff', 'roaster', 'seller'].includes(state.user.role)) {
             state.clearInvalidSession();
           }
        }
      }
    }
  )
);
