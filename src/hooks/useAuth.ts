// src/hooks/useAuth.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export const useAuth = (requireAuth: boolean = true, allowedRoles?: string[]) => {
  const { user, isAuthenticated, loadUser, logout, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Load user data on mount if not already loaded
    if (!user && !isLoading) {
      loadUser();
    }
  }, [loadUser, user, isLoading]);

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on user role
      switch (user.role) {
        case 'admin':
          router.push('/admin-dashboard');
          break;
        case 'provider':
          router.push('/provider-dashboard');
          break;
        case 'user':
        default:
          router.push('/user-dashboard');
          break;
      }
      return;
    }
  }, [isAuthenticated, user, requireAuth, allowedRoles, router, isLoading]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    logout: handleLogout,
    isAuthorized: !allowedRoles || (user && allowedRoles.includes(user.role)),
  };
};