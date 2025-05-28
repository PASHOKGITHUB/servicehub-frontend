import { 
  AxiosErrorResponse, 
  EmailSendResponse, 
  EmailVerificationResponse,
  LoginRequest, 
  RegisterRequest, 
  AuthResponse 
} from "@/domain/entities/Auth/Auth";
import { User } from "@/domain/entities/Auth/User";
import ApiClient from "@/lib/apiClient";
import Cookies from "js-cookie";

// Store token in both localStorage and cookies
const storeToken = (token: string): boolean => {
  try {
    // Store in localStorage (primary)
    localStorage.setItem('auth_token', token);
    
    // Store in cookies (backup)
    Cookies.set('token', token, {
      expires: 7,
      path: '/'
    });
    
    return localStorage.getItem('auth_token') === token;
  } catch (error) {
    console.error('Token storage failed:', error);
    return false;
  }
};

// Remove tokens from all storage
const removeToken = (): void => {
  localStorage.removeItem('auth_token');
  Cookies.remove('token', { path: '/' });
};

interface GetCurrentUserResponse {
  user: User;
}

export const loginUser = async (payload: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await ApiClient.post(`/auth/login`, payload);
    
    const { token } = response.data.data;
    const stored = storeToken(token);
    
    if (!stored) {
      throw new Error('Failed to store authentication token');
    }
    
    return response.data.data;
    
  } catch (error: unknown) {
    const axiosError = error as AxiosErrorResponse;
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
    throw new Error('Failed to login');
  }
};

export const registerUser = async (payload: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await ApiClient.post(`/auth/register`, payload);
    
    const { token } = response.data.data;
    const stored = storeToken(token);
    
    if (!stored) {
      throw new Error('Failed to store authentication token');
    }
    
    return response.data.data;
    
  } catch (error: unknown) {
    const axiosError = error as AxiosErrorResponse;
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
    throw new Error('Failed to register');
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await ApiClient.post(`/auth/logout`);
  } catch (error) {
    // Continue with logout even if API fails
    console.warn('Logout API failed:', error);
  } finally {
    removeToken();
  }
};

export const getCurrentUser = async (): Promise<GetCurrentUserResponse> => {
  try {
    const response = await ApiClient.get(`/auth/profile`);
    return response.data.data;
    
  } catch (error: unknown) {
    const axiosError = error as AxiosErrorResponse;
    
    if (axiosError.response?.status === 401) {
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
    const response = await ApiClient.post(`/auth/send-verification`);
    
    return {
      success: true,
      previewUrl: response.data.data.previewUrl,
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosErrorResponse;
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
    throw new Error('Failed to send verification email');
  }
};

export const verifyEmailToken = async (token: string): Promise<EmailVerificationResponse> => {
  try {
    const response = await ApiClient.post(`/auth/verify-email`, { token });
    return response.data.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosErrorResponse;
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
    throw new Error('Failed to verify email');
  }
};