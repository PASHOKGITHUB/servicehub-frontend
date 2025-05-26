// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LoginRequest, RegisterRequest } from '@/domain/entities/Auth/Auth';
import { User } from '@/domain/entities/Auth/User';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '@/instance/Auth';
import Cookies from 'js-cookie';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (data: LoginRequest) => {
        try {
          set({ isLoading: true, error: null });
          const response = await loginUser(data);
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Login failed',
            isAuthenticated: false,
            user: null,
            token: null
          });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        try {
          set({ isLoading: true, error: null });
          const response = await registerUser(data);
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Registration failed',
            isAuthenticated: false,
            user: null,
            token: null
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await logoutUser();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

loadUser: async () => {
  const token = Cookies.get('token');
  if (!token) {
    set({ isAuthenticated: false, user: null, token: null, isLoading: false });
    return;
  }

  try {
    set({ isLoading: true });
    const response = await getCurrentUser();
    
    set({
      user: response.user,
      token,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  } catch (error) {
    // Token might be invalid, clear it
    Cookies.remove('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }
},

      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);