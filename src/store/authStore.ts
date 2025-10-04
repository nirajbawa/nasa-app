import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  signInWithGoogle: () => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial State
      user: null,
      loading: true,
      error: null,

      // Actions
      setLoading: (loading: boolean) => set({ loading }),

      clearError: () => set({ error: null }),

      signInWithGoogle: async (): Promise<{ success: boolean; user?: User; error?: string }> => {
        set({ loading: true, error: null });
        try {
          const result = await signInWithPopup(auth, googleProvider);
          set({ user: result.user, loading: false });
          return { success: true, user: result.user };
        } catch (error: any) {
          const errorMessage = error.message || 'Failed to sign in with Google';
          set({ error: errorMessage, loading: false });
          return { success: false, error: errorMessage };
        }
      },

      logout: async (): Promise<{ success: boolean; error?: string }> => {
        set({ loading: true, error: null });
        try {
          await signOut(auth);
          set({ user: null, loading: false });
          return { success: true };
        } catch (error: any) {
          const errorMessage = error.message || 'Failed to sign out';
          set({ error: errorMessage, loading: false });
          return { success: false, error: errorMessage };
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user 
      }),
    }
  )
);