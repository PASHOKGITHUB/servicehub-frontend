// src/instance/Auth.ts
import { AxiosErrorResponse } from "@/domain/entities/Auth/Auth";
import ApiClient from "@/lib/apiClient";
import { LoginRequest, RegisterRequest, AuthResponse } from "@/domain/entities/Auth/Auth";
import Cookies from "js-cookie";

export const loginUser = async (payload: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await ApiClient.post<{ data: AuthResponse }>(`/auth/login`, payload);
    
    // Store token in cookies
    Cookies.set('token', response.data.data.token, { expires: 7 });
    
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
    const response = await ApiClient.post<{ data: AuthResponse }>(`/auth/register`, payload);
    
    // Store token in cookies
    Cookies.set('token', response.data.data.token, { expires: 7 });
    
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
    
    // Remove token from cookies
    Cookies.remove('token');
  } catch (error: unknown) {
    // Even if API call fails, remove token locally
    Cookies.remove('token');
    throw new Error('Logout failed');
  }
};

export const getCurrentUser = async (): Promise<{ user: any }> => {
  try {
    const response = await ApiClient.get<{ data: { user: any } }>(`/auth/profile`);
    return response.data.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosErrorResponse;
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
    throw new Error('Failed to get user profile');
  }
};