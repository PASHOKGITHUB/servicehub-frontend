// src/components/Providers/AuthProvider.tsx - COMPLETELY FIXED
'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { initialize, isInitialized } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  // 🔥 STEP 1: Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 🔥 STEP 2: Initialize auth when component mounts (client-side only)
  useEffect(() => {
    if (!isClient) return;

    console.log('🚀 AuthProvider: Initializing authentication...');
    
    const initAuth = async () => {
      try {
        await initialize();
        console.log('✅ AuthProvider: Authentication initialized successfully');
      } catch (error) {
        console.error('❌ AuthProvider: Failed to initialize auth:', error);
      }
    };

    // Only initialize if not already initialized
    if (!isInitialized) {
      initAuth();
    } else {
      console.log('✅ AuthProvider: Already initialized');
    }
  }, [isClient, initialize, isInitialized]);

  // 🔥 STEP 3: Render children (always render, let ProtectedRoute handle auth logic)
  return <>{children}</>;
}