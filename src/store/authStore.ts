import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/domain/entities/Auth/User';
import Cookies from 'js-cookie';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  
  // Actions
  updateUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  logout: () => void;
  initialize: () => void;
}

// Token validation helper
const hasValidToken = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const cookieToken = Cookies.get('token');
  const localToken = localStorage.getItem('auth_token');
  return !!(cookieToken || localToken);
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isInitialized: false,

      initialize: () => {
        const state = get();
        
        if (state.isInitialized) {
          return;
        }
        
        const hasToken = hasValidToken();
        const hasUser = !!state.user;
        
        set({
          isAuthenticated: hasToken && hasUser,
          isInitialized: true,
          isLoading: false
        });
      },

      updateUser: (user: User) => {
        set({
          user,
          isAuthenticated: true,
          error: null
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      logout: () => {
        // Clear tokens
        Cookies.remove('token', { path: '/' });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
        
        // Clear state
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          isInitialized: true,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Debug utilities for development only
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).debugAuthStore = {
    getState: () => useAuthStore.getState(),
    clearAll: () => {
      Cookies.remove('token', { path: '/' });
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth-storage');
      useAuthStore.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        isInitialized: false
      });
      console.log('✅ All auth data cleared');
    }
  };
}