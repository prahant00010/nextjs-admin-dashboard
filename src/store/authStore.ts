import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from '@/types';

interface AuthStore extends AuthState {
  login: (token: string, user: AuthState['user']) => void;
  logout: () => void;
}

/**
 * Zustand was chosen for state management because:
 * 1. Simplicity: Minimal boilerplate compared to Redux
 * 2. Small footprint: ~1KB gzipped vs Redux's larger bundle
 * 3. Built-in async actions: No need for middleware like Redux Thunk
 * 4. Better for small-medium apps: Less overhead, easier to maintain
 * 5. TypeScript support: Excellent type inference out of the box
 * 6. No provider needed: Can be used anywhere without wrapping components
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) =>
        set({
          token,
          user,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);

