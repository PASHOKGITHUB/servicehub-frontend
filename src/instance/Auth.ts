// src/instance/Auth.ts - FIXED TYPESCRIPT ERRORS WITH PROPER TYPES
import { AxiosErrorResponse, EmailSendResponse, EmailVerificationResponse } from "@/domain/entities/Auth/Auth";
import ApiClient from "@/lib/apiClient";
import { LoginRequest, RegisterRequest, AuthResponse } from "@/domain/entities/Auth/Auth";
import { User } from "@/domain/entities/Auth/User";
import Cookies from "js-cookie";

// Helper function for debug logging
const debugLog = (message: string, data?: unknown) => {
  const timestamp = new Date().toISOString();
  console.log(`🔑 [${timestamp}] AuthInstance: ${message}`, data);
  
  if (typeof window !== 'undefined') {
    const existingLogs = JSON.parse(localStorage.getItem('auth-debug-logs') || '[]');
    existingLogs.push({
      timestamp,
      component: 'AuthInstance',
      message,
      data: data || null,
      url: window.location.href
    });
    
    if (existingLogs.length > 50) {
      existingLogs.splice(0, existingLogs.length - 50);
    }
    
    localStorage.setItem('auth-debug-logs', JSON.stringify(existingLogs));
  }
};

// 🔧 COMPLETELY FIXED TOKEN STORAGE
const storeToken = (token: string): boolean => {
  debugLog('🔐 Storing token', { 
    tokenLength: token.length,
    tokenStart: token.substring(0, 20) + '...',
    isLocalhost: window.location.hostname === 'localhost',
    currentDomain: window.location.hostname,
    currentProtocol: window.location.protocol
  });

  try {
    // 🔥 STEP 1: Store in localStorage first (most reliable)
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_storage_method', 'dual');
    
    // 🔥 STEP 2: Try to store in cookies with different strategies
    let cookieStored = false;
    
    // Strategy 1: Basic cookie (most permissive for localhost)
    try {
      debugLog('🍪 Trying basic cookie storage...');
      Cookies.set('token', token, {
        expires: 7,
        path: '/'
      });
      
      // Immediate verification
      const testCookie = Cookies.get('token');
      if (testCookie === token) {
        cookieStored = true;
        debugLog('✅ Basic cookie storage successful');
      } else {
        debugLog('❌ Basic cookie storage failed');
      }
    } catch (error) {
      debugLog('❌ Basic cookie storage error', { error });
    }
    
    // Strategy 2: If basic failed, try with SameSite=None (for some browsers)
    if (!cookieStored) {
      try {
        debugLog('🍪 Trying SameSite=None cookie storage...');
        Cookies.set('token', token, {
          expires: 7,
          path: '/',
          sameSite: 'None',
          secure: false // Note: SameSite=None usually requires secure=true, but localhost is special
        });
        
        const testCookie = Cookies.get('token');
        if (testCookie === token) {
          cookieStored = true;
          debugLog('✅ SameSite=None cookie storage successful');
        }
      } catch (error) {
        debugLog('❌ SameSite=None cookie storage error', { error });
      }
    }
    
    // Strategy 3: If still failed, try manual document.cookie
    if (!cookieStored) {
      try {
        debugLog('🍪 Trying manual document.cookie...');
        document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        
        const testCookie = Cookies.get('token');
        if (testCookie === token) {
          cookieStored = true;
          debugLog('✅ Manual cookie storage successful');
        }
      } catch (error) {
        debugLog('❌ Manual cookie storage error', { error });
      }
    }

    // 🔥 STEP 3: Final verification
    const localStored = localStorage.getItem('auth_token') === token;
    
    debugLog('✅ Final token storage verification', {
      cookieStored,
      localStored,
      cookieValue: Cookies.get('token') ? 'present' : 'missing',
      localValue: localStorage.getItem('auth_token') ? 'present' : 'missing',
      success: localStored // We only require localStorage to work
    });

    // 🔥 IMPORTANT: We only require localStorage to work
    // Cookies are nice-to-have but not required
    return localStored;
    
  } catch (error) {
    debugLog('❌ Token storage failed completely', { error });
    return false;
  }
};

// 🔧 IMPROVED TOKEN RETRIEVAL (localStorage primary)
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // 🔥 PRIMARY: Try localStorage first (most reliable)
  const localToken = localStorage.getItem('auth_token');
  
  // 🔥 SECONDARY: Try cookies as backup
  const cookieToken = Cookies.get('token');
  
  debugLog('🔍 Token retrieval check', {
    hasLocal: !!localToken,
    hasCookie: !!cookieToken,
    tokensMatch: localToken === cookieToken,
    usingToken: localToken || cookieToken || 'none',
    source: localToken ? 'localStorage' : (cookieToken ? 'cookie' : 'none')
  });

  // Prefer localStorage, fallback to cookies
  const token = localToken || cookieToken;
  
  // If we have a token from cookies but not localStorage, sync them
  if (cookieToken && !localToken) {
    debugLog('🔄 Syncing cookie to localStorage');
    localStorage.setItem('auth_token', cookieToken);
    localStorage.setItem('auth_storage_method', 'dual');
  }

  return token ?? null;
};

// 🔧 IMPROVED TOKEN REMOVAL
const removeToken = (): void => {
  debugLog('🗑️ Removing all tokens');
  
  try {
    // Remove from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_storage_method');
    
    // Try multiple cookie removal strategies
    Cookies.remove('token', { path: '/' });
    Cookies.remove('token', { path: '/', domain: window.location.hostname });
    Cookies.remove('token'); // Default removal
    
    // Manual cookie removal as backup
    try {
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } catch (error) {
      debugLog('⚠️ Manual cookie removal failed', { error });
    }
    
    // Verify removal
    const cookieCheck = Cookies.get('token');
    const localCheck = localStorage.getItem('auth_token');
    
    debugLog('✅ Token removal verification', {
      cookieRemoved: !cookieCheck,
      localRemoved: !localCheck,
      completelyCleared: !cookieCheck && !localCheck
    });
    
  } catch (error) {
    debugLog('❌ Token removal error', { error });
  }
};

// 🔧 FIXED: Proper response interface for getCurrentUser
interface GetCurrentUserResponse {
  user: User;
}

export const loginUser = async (payload: LoginRequest): Promise<AuthResponse> => {
  try {
    debugLog('🔑 Login request starting', { email: payload.email });
    
    const response = await ApiClient.post<{ data: AuthResponse }>(`/auth/login`, payload);
    
    debugLog('✅ Login response received', {
      userEmail: response.data.data.user.email,
      userRole: response.data.data.user.role,
      hasToken: !!response.data.data.token,
      tokenLength: response.data.data.token.length
    });
    
    // 🔥 CRITICAL: Store token and accept localStorage-only success
    const token = response.data.data.token;
    const stored = storeToken(token);
    
    if (!stored) {
      debugLog('❌ CRITICAL: Even localStorage failed');
      throw new Error('Failed to store authentication token. Please check if localStorage is enabled.');
    }
    
    debugLog('✅ Login completed successfully');
    return response.data.data;
    
  } catch (error: unknown) {
    debugLog('❌ Login failed', { error });
    const axiosError = error as AxiosErrorResponse;
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
    throw new Error('Failed to login');
  }
};

export const registerUser = async (payload: RegisterRequest): Promise<AuthResponse> => {
  try {
    debugLog('📝 Register request starting', { email: payload.email, role: payload.role });
    
    const response = await ApiClient.post<{ data: AuthResponse }>(`/auth/register`, payload);
    
    debugLog('✅ Register response received', {
      userEmail: response.data.data.user.email,
      userRole: response.data.data.user.role,
      hasToken: !!response.data.data.token,
      tokenLength: response.data.data.token.length
    });
    
    // 🔥 CRITICAL: Store token and accept localStorage-only success
    const token = response.data.data.token;
    const stored = storeToken(token);
    
    if (!stored) {
      debugLog('❌ CRITICAL: Even localStorage failed');
      throw new Error('Failed to store authentication token. Please check if localStorage is enabled.');
    }
    
    debugLog('✅ Register completed successfully');
    return response.data.data;
    
  } catch (error: unknown) {
    debugLog('❌ Register failed', { error });
    const axiosError = error as AxiosErrorResponse;
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
    throw new Error('Failed to register');
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    debugLog('👋 Logout request starting');
    
    await ApiClient.post(`/auth/logout`);
    debugLog('✅ Logout API successful');
    
  } catch (error: unknown) {
    debugLog('⚠️ Logout API failed, but continuing', { error });
  } finally {
    removeToken();
    debugLog('✅ Logout completed');
  }
};

// 🔧 FIXED: Using proper User type instead of any
export const getCurrentUser = async (): Promise<GetCurrentUserResponse> => {
  try {
    debugLog('👤 GetCurrentUser request starting');
    
    // 🔥 CRITICAL: Check token before making request
    const token = getToken();
    debugLog('🔍 Pre-request token check', {
      hasToken: !!token,
      tokenLength: token?.length || 0,
      tokenStart: token?.substring(0, 20) + '...' || 'none'
    });
    
    if (!token) {
      debugLog('❌ No token found, cannot get current user');
      throw new Error('No authentication token found');
    }
    
    const response = await ApiClient.get<{ data: GetCurrentUserResponse }>(`/auth/profile`);
    
    debugLog('✅ GetCurrentUser successful', {
      userEmail: response.data.data.user.email,
      userRole: response.data.data.user.role,
      isVerified: response.data.data.user.isEmailVerified
    });
    
    return response.data.data;
    
  } catch (error: unknown) {
    debugLog('❌ GetCurrentUser failed', { error });
    
    const axiosError = error as AxiosErrorResponse;
    if (axiosError.response?.status === 401) {
      debugLog('🗑️ 401 error, removing invalid token');
      removeToken();
    }
    
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
    throw new Error('Failed to get user profile');
  }
};

export const sendVerificationEmail = async (): Promise<EmailSendResponse> => {
  try {
    debugLog('📧 SendVerificationEmail request starting');
    
    const response = await ApiClient.post<{ data: { previewUrl?: string } }>(`/auth/send-verification`);
    
    debugLog('✅ SendVerificationEmail successful');
    
    return {
      success: true,
      previewUrl: response.data.data.previewUrl,
    };
  } catch (error: unknown) {
    debugLog('❌ SendVerificationEmail failed', { error });
    
    const axiosError = error as AxiosErrorResponse;
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
    throw new Error('Failed to send verification email');
  }
};

export const verifyEmailToken = async (token: string): Promise<EmailVerificationResponse> => {
  try {
    debugLog('✉️ VerifyEmailToken request starting', { tokenLength: token.length });
    
    const response = await ApiClient.post<{ data: EmailVerificationResponse }>(`/auth/verify-email`, { token });
    
    debugLog('✅ VerifyEmailToken successful', {
      userEmail: response.data.data.user.email,
      alreadyVerified: response.data.data.alreadyVerified
    });
    
    return response.data.data;
  } catch (error: unknown) {
    debugLog('❌ VerifyEmailToken failed', { error });
    
    const axiosError = error as AxiosErrorResponse;
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
    throw new Error('Failed to verify email');
  }
};

// 🔥 EXPORT TOKEN UTILITIES FOR DEBUGGING
export const authTokenUtils = {
  getToken,
  storeToken,
  removeToken,
  debugToken: (): string | null => {
    const token = getToken();
    console.log('🔍 Current token status:', {
      hasToken: !!token,
      tokenLength: token?.length || 0,
      cookieToken: Cookies.get('token'),
      localToken: localStorage.getItem('auth_token'),
      storageMethod: localStorage.getItem('auth_storage_method')
    });
    return token;
  },
  testCookies: (): boolean => {
    // Test if cookies work at all
    const testValue = 'test_' + Date.now();
    Cookies.set('test_cookie', testValue);
    const retrieved = Cookies.get('test_cookie');
    Cookies.remove('test_cookie');
    
    console.log('🧪 Cookie test result:', {
      canStore: retrieved === testValue,
      testValue,
      retrieved
    });
    
    return retrieved === testValue;
  }
};