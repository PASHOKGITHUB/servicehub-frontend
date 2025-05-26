import { User } from "./User";


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