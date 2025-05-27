// src/lib/apiClient.ts - FIXED WITH IMPROVED TOKEN HANDLING
import axios, { AxiosError, AxiosResponse } from "axios";
import Cookies from "js-cookie";

// Set base URL to match your backend server
const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api/v1';

// Helper function for debug logging
const debugLog = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    component: 'ApiClient',
    message,
    data: data || null,
    url: typeof window !== 'undefined' ? window.location.href : 'server'
  };
  
  console.log(`🌐 [${timestamp}] ApiClient: ${message}`, data);
  
  if (typeof window !== 'undefined') {
    const existingLogs = JSON.parse(localStorage.getItem('auth-debug-logs') || '[]');
    existingLogs.push(logEntry);
    
    if (existingLogs.length > 50) {
      existingLogs.splice(0, existingLogs.length - 50);
    }
    
    localStorage.setItem('auth-debug-logs', JSON.stringify(existingLogs));
  }
};

// 🔧 IMPROVED TOKEN RETRIEVAL FUNCTION
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Try multiple sources
  const cookieToken = Cookies.get('token');
  const localToken = localStorage.getItem('auth_token');
  
  // Prefer cookie, fallback to localStorage
  const token = cookieToken || localToken;
  
  debugLog('Token retrieval in ApiClient', {
    hasCookie: !!cookieToken,
    hasLocal: !!localToken,
    usingToken: token ? 'found' : 'none',
    tokenLength: token?.length || 0
  });
  
  return token;
};

const ApiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // 🔥 IMPORTANT: Send cookies with requests
});

// 🔧 IMPROVED REQUEST INTERCEPTOR
ApiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    
    debugLog('Request interceptor triggered', {
      url: config.url,
      method: config.method?.toUpperCase(),
      hasToken: !!token,
      tokenLength: token?.length || 0,
      hasAuthHeader: !!config.headers.Authorization
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      debugLog('✅ Token added to Authorization header');
    } else {
      debugLog('⚠️ No token available for request');
    }
    
    return config;
  },
  (error) => {
    debugLog('❌ Request interceptor error', { error: error.message });
    return Promise.reject(error);
  }
);

// 🔧 IMPROVED RESPONSE INTERCEPTOR
ApiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    debugLog('✅ Response successful', {
      url: response.config.url,
      status: response.status,
      method: response.config.method?.toUpperCase(),
      hasData: !!response.data
    });
    return response;
  },
  (error: AxiosError) => {
    const url = error.config?.url;
    const status = error.response?.status;
    const method = error.config?.method?.toUpperCase();
    
    debugLog('❌ Response error', {
      url,
      status,
      method,
      message: error.message,
      responseData: error.response?.data
    });

    // 🔥 HANDLE 401 ERRORS PROPERLY
    if (status === 401) {
      debugLog('🔒 401 Unauthorized detected');
      
      // Only clear token if it's not a login/register request
      const isAuthRequest = url?.includes('/auth/login') || 
                           url?.includes('/auth/register');
      
      if (!isAuthRequest) {
        debugLog('🗑️ Clearing invalid token (non-auth request)');
        
        // Clear from all storage locations
        Cookies.remove('token', { path: '/' });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_storage_method');
        }
        
        debugLog('✅ Invalid tokens cleared');
      } else {
        debugLog('ℹ️ Auth request failed, not clearing tokens');
      }
    }
    
    return Promise.reject(error);
  }
);

debugLog('ApiClient initialized', { baseURL });

export default ApiClient;

// 🔥 EXPORT DEBUG UTILITIES
if (typeof window !== 'undefined') {
  (window as any).debugApiClient = {
    checkToken: () => {
      const token = getAuthToken();
      console.log('🔍 Current API Client token status:', {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        tokenPreview: token ? token.substring(0, 20) + '...' : 'none',
        cookieToken: Cookies.get('token'),
        localToken: localStorage.getItem('auth_token')
      });
      return token;
    },
    makeTestRequest: async () => {
      try {
        console.log('🧪 Making test request to /auth/profile...');
        const response = await ApiClient.get('/auth/profile');
        console.log('✅ Test request successful:', response.data);
        return response.data;
      } catch (error) {
        console.log('❌ Test request failed:', error);
        throw error;
      }
    }
  };
}