'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useCurrentUser } from '@/hooks/useAuthQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { PageLoading } from '@/components/ui/page-loading';
import EmailVerificationBanner from './EmailVerificationBanner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireEmailVerification?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  requireEmailVerification = true 
}) => {
  const router = useRouter();
  const { user, isAuthenticated, logout, isInitialized, initialize } = useAuthStore();
  const { isLoading: isLoadingUser, error: userError } = useCurrentUser();
  const [hasCheckedAuth, setHasCheckedAuth] = useState<boolean>(false);

  // Initialize auth store when component mounts
  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      if (!isInitialized) {
        initialize();
      }
      setHasCheckedAuth(true);
    };

    initializeAuth();
  }, [isInitialized, initialize]);

  // Handle redirects after auth check is complete
  const handleRedirects = useCallback((): void => {
    if (!hasCheckedAuth || !isInitialized || isLoadingUser) {
      return;
    }

    // If there's a user error (like 401), consider user not authenticated
    if (userError) {
      router.push('/login');
      return;
    }

    // Not authenticated -> redirect to login
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    // Wrong role -> redirect to correct dashboard
    if (allowedRoles && !allowedRoles.includes(user.role)) {
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
  }, [hasCheckedAuth, isInitialized, isLoadingUser, userError, isAuthenticated, user, allowedRoles, router]);

  useEffect(() => {
    handleRedirects();
  }, [handleRedirects]);

  // Still checking auth or loading
  if (!hasCheckedAuth || !isInitialized || isLoadingUser) {
    return (
      <PageLoading 
        title="Loading..." 
        subtitle={!hasCheckedAuth || !isInitialized ? 'Initializing authentication...' : 'Verifying your session...'}
      />
    );
  }

  // Not authenticated or user error
  if (userError || !isAuthenticated || !user) {
    return (
      <PageLoading title="Redirecting..." subtitle="Taking you to the login page..." />
    );
  }

  // Wrong role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <PageLoading title="Redirecting..." subtitle="Taking you to your dashboard..." />
    );
  }

  // Email not verified (if required)
  if (requireEmailVerification && !user.isEmailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <Mail className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Email Verification Required</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We&apos;ve sent a verification link to <strong>{user.email}</strong>. 
              Please check your inbox and click the link to verify your account.
            </p>
            
            <div className="mb-6">
              <EmailVerificationBanner />
            </div>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => logout()}
                className="w-full border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white"
              >
                Sign Out
              </Button>
              
              <p className="text-xs text-gray-500">
                Having trouble? Contact support for assistance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // All checks passed - render children
  return <>{children}</>;
};

export default ProtectedRoute;