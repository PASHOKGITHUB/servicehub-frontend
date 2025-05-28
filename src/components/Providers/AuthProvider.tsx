'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { initialize, isInitialized } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize auth when component mounts (client-side only)
  useEffect(() => {
    if (!isClient || isInitialized) return;

    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 AuthProvider: Initializing authentication...');
    }
    
    initialize();
  }, [isClient, initialize, isInitialized]);

  return <>{children}</>;
}