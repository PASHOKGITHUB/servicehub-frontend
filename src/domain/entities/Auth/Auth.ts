// src/domain/entities/Auth/Auth.ts - UPDATED WITH VERIFICATION TYPES

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'user' | 'provider';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface EmailVerificationResponse {
  user: User;
  alreadyVerified?: boolean;
}

export interface EmailSendResponse {
  success: boolean;
  previewUrl?: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

export interface AxiosErrorResponse {
  request: XMLHttpRequest | null;
  message(arg0: string, message: unknown): unknown;
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
  };
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'provider' | 'admin';
  avatar?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
