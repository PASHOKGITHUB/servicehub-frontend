// src/domain/entities/Auth/User.ts
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

