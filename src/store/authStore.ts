// src/store/authStore.ts - COMPLETELY FIXED AUTH STORE
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LoginRequest, RegisterRequest } from '@/domain/entities/Auth/Auth';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '@/instance/Auth';
import Cookies from 'js-cookie';
import { User } from '@/domain/entities/Auth/User';

// Type definitions for better error handling
type APIError = {
  message: string;
  response?: {
    status: number;
    data?: unknown;
  };
};

type DebugLogData = {
  timestamp: string;
  component: string;
  message: string;
  data: unknown;
  url: string;
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  
  // Actions
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateUser: (user: User) => void;
  clearError: () => void;
  initialize: () => Promise<void>;
}

// Helper function for debug logging
const debugLog = (message: string, data?: unknown) => {
  const timestamp = new Date().toISOString();
  const logEntry: DebugLogData = {
    timestamp,
    component: 'AuthStore',
    message,
    data: data || null,
    url: typeof window !== 'undefined' ? window.location.href : 'server'
  };
  
  console.log(`🏪 [${timestamp}] AuthStore: ${message}`, data);
  
  if (typeof window !== 'undefined') {
    const existingLogs = JSON.parse(localStorage.getItem('auth-debug-logs') || '[]') as DebugLogData[];
    existingLogs.push(logEntry);
    
    if (existingLogs.length > 50) {
      existingLogs.splice(0, existingLogs.length - 50);
    }
    
    localStorage.setItem('auth-debug-logs', JSON.stringify(existingLogs));
  }
};

// 🔧 IMPROVED TOKEN CHECK FUNCTION
const hasValidToken = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const cookieToken = Cookies.get('token');
  const localToken = localStorage.getItem('auth_token');
  const hasToken = !!(cookieToken || localToken);
  
  debugLog('Token validation check', {
    hasCookie: !!cookieToken,
    hasLocal: !!localToken,
    hasAnyToken: hasToken,
    tokensMatch: cookieToken === localToken
  });
  
  return hasToken;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isInitialized: false,

      // 🔧 COMPLETELY REWRITTEN INITIALIZE FUNCTION
      initialize: async () => {
        const state = get();
        
        debugLog('🚀 Initialize called', { 
          isInitialized: state.isInitialized,
          isAuthenticated: state.isAuthenticated,
          hasUser: !!state.user,
          currentPath: typeof window !== 'undefined' ? window.location.pathname : 'server'
        });
        
        // Prevent multiple initializations
        if (state.isInitialized) {
          debugLog('✅ Already initialized, skipping');
          return;
        }
        
        debugLog('🔄 Starting initialization process...');
        
        // 🔥 STEP 1: Check if we have a valid token
        const hasToken = hasValidToken();
        
        if (!hasToken) {
          debugLog('❌ No token found, setting unauthenticated state');
          set({ 
            isAuthenticated: false, 
            user: null, 
            isInitialized: true,
            isLoading: false 
          });
          return;
        }

        // 🔥 STEP 2: We have a token, try to get user data
        debugLog('🔄 Token found, fetching user data...');
        
        try {
          set({ isLoading: true });
          
          const response = await getCurrentUser();
          
          debugLog('✅ User data received successfully', {
            email: response.user.email,
            role: response.user.role,
            verified: response.user.isEmailVerified
          });
          
          // 🔥 STEP 3: Update state with user data
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
            error: null
          });
          
          debugLog('✅ Initialization completed successfully');
          
        } catch (err: unknown) {
          const error = err as APIError;
          debugLog('❌ Failed to load user during initialization', { 
            error: error.message,
            status: error.response?.status 
          });
          
          // 🔥 STEP 4: If user fetch fails, clear everything
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true,
            error: null // Don't set error on initialization failure
          });
          
          debugLog('✅ Initialization completed with cleared state');
        }
      },

      // 🔧 IMPROVED LOGIN FUNCTION
      login: async (data: LoginRequest) => {
        debugLog('🔑 Login attempt started', { email: data.email });
        
        set({ isLoading: true, error: null });
        
        try {
          const response = await loginUser(data);
          
          debugLog('✅ Login API successful', {
            userEmail: response.user.email,
            userRole: response.user.role,
            hasToken: !!response.token,
            isVerified: response.user.isEmailVerified
          });
          
          // 🔥 CRITICAL: Wait a bit for token to be properly stored
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Update state
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          debugLog('✅ Login state updated successfully');
          
        } catch (err: unknown) {
          const error = err as APIError;
          debugLog('❌ Login failed', { error: error.message });
          
          set({ 
            isLoading: false, 
            error: error?.message || 'Login failed',
            isAuthenticated: false,
            user: null
          });
          
          throw err;
        }
      },

      // 🔧 IMPROVED REGISTER FUNCTION
      register: async (data: RegisterRequest) => {
        debugLog('📝 Register attempt started', { email: data.email, role: data.role });
        
        set({ isLoading: true, error: null });
        
        try {
          const response = await registerUser(data);
          
          debugLog('✅ Register API successful', {
            userEmail: response.user.email,
            userRole: response.user.role,
            hasToken: !!response.token,
            isVerified: response.user.isEmailVerified
          });
          
          // 🔥 CRITICAL: Wait a bit for token to be properly stored
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Update state
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          debugLog('✅ Register state updated successfully');
          
        } catch (err: unknown) {
          const error = err as APIError;
          debugLog('❌ Register failed', { error: error.message });
          
          set({ 
            isLoading: false, 
            error: error?.message || 'Registration failed',
            isAuthenticated: false,
            user: null
          });
          
          throw err;
        }
      },

      // 🔧 IMPROVED LOGOUT FUNCTION
      logout: async () => {
        debugLog('👋 Logout started');
        
        try {
          await logoutUser();
          debugLog('✅ Logout API successful');
        } catch (error) {
          debugLog('⚠️ Logout API failed, but continuing...', { error });
        }
        
        // Clear state
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          isInitialized: true,
        });
        
        debugLog('✅ Logout completed - state cleared');
      },

      // 🔧 IMPROVED LOAD USER FUNCTION
      loadUser: async () => {
        debugLog('🔄 LoadUser called explicitly');
        
        const hasToken = hasValidToken();
        
        if (!hasToken) {
          debugLog('❌ LoadUser: No token found');
          set({ 
            isAuthenticated: false, 
            user: null, 
            isLoading: false 
          });
          return;
        }

        set({ isLoading: true });
        
        try {
          const response = await getCurrentUser();
          
          debugLog('✅ LoadUser: API successful', {
            email: response.user.email,
            verified: response.user.isEmailVerified
          });
          
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
        } catch (err: unknown) {
          const error = err as APIError;
          debugLog('❌ LoadUser: API failed', { 
            error: error.message,
            status: error.response?.status 
          });
          
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      },

      updateUser: (user: User) => {
        debugLog('🔄 UpdateUser called', {
          email: user.email,
          verified: user.isEmailVerified
        });
        set({ user });
      },

      clearError: () => {
        debugLog('🧹 ClearError called');
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // Only persist user data, not tokens or loading states
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        debugLog('🏪 Store rehydrated from localStorage', {
          hasUser: !!state?.user,
          isAuthenticated: state?.isAuthenticated,
          userEmail: state?.user?.email
        });
      },
    }
  )
);

// 🔥 EXPORT DEBUG UTILITIES
if (typeof window !== 'undefined') {
  (window as Window & { debugAuthStore?: unknown }).debugAuthStore = {
    getState: () => {
      const state = useAuthStore.getState();
      console.log('🏪 Current Auth Store State:', {
        isAuthenticated: state.isAuthenticated,
        isInitialized: state.isInitialized,
        isLoading: state.isLoading,
        hasUser: !!state.user,
        userEmail: state.user?.email,
        userRole: state.user?.role,
        error: state.error
      });
      return state;
    },
    
    checkTokens: () => {
      const cookieToken = Cookies.get('token');
      const localToken = localStorage.getItem('auth_token');
      console.log('🔍 Token Status:', {
        hasCookie: !!cookieToken,
        hasLocal: !!localToken,
        cookieLength: cookieToken?.length || 0,
        localLength: localToken?.length || 0,
        tokensMatch: cookieToken === localToken
      });
      return { cookieToken, localToken };
    },
    
    forceInitialize: () => {
      console.log('🔄 Force initializing auth store...');
      useAuthStore.getState().initialize();
    },
    
    clearAll: () => {
      console.log('🗑️ Clearing all auth data...');
      Cookies.remove('token', { path: '/' });
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_storage_method');
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