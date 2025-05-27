'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Mail, Loader2 } from 'lucide-react';
import EmailVerificationBanner from './EmailVerificationBanner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireEmailVerification?: boolean;
}

// Helper function for debug logging
const debugLog = (message: string, data?: unknown) => {
  const timestamp = new Date().toISOString();
  console.log(`🛡️ [${timestamp}] ProtectedRoute: ${message}`, data);
};

const ProtectedRoute = ({ 
  children, 
  allowedRoles,
  requireEmailVerification = true 
}: ProtectedRouteProps) => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, isInitialized, initialize } = useAuthStore();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // 🔥 STEP 1: Initialize auth store when component mounts
  useEffect(() => {
    debugLog('Component mounted - starting auth check', {
      isInitialized,
      isAuthenticated,
      hasUser: !!user,
      allowedRoles,
      currentPath: window.location.pathname
    });

    const initializeAuth = async () => {
      if (!isInitialized) {
        debugLog('🔄 Auth not initialized, calling initialize...');
        await initialize();
      }
      setHasCheckedAuth(true);
    };

    initializeAuth();
  }, [isInitialized, initialize, isAuthenticated, user, allowedRoles]);

  // 🔥 STEP 2: Handle redirects after auth check is complete
  const handleRedirects = useCallback(() => {
    if (!hasCheckedAuth || !isInitialized) {
      debugLog('⏳ Waiting for auth check to complete...');
      return;
    }

    debugLog('🔍 Auth check complete, handling redirects', {
      isLoading,
      isAuthenticated,
      hasUser: !!user,
      userRole: user?.role,
      allowedRoles,
      currentPath: window.location.pathname
    });

    // Don't redirect while still loading
    if (isLoading) {
      debugLog('⏳ Still loading, waiting...');
      return;
    }

    // Not authenticated -> redirect to login
    if (!isAuthenticated || !user) {
      debugLog('❌ Not authenticated, redirecting to login');
      router.push('/login');
      return;
    }

    // Wrong role -> redirect to correct dashboard
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      debugLog('❌ Wrong role, redirecting to correct dashboard', {
        userRole: user.role,
        allowedRoles
      });
      
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

    debugLog('✅ All auth checks passed');
  }, [hasCheckedAuth, isInitialized, isLoading, isAuthenticated, user, allowedRoles, router]);

  useEffect(() => {
    handleRedirects();
  }, [handleRedirects]);

  // 🔥 STEP 3: Render appropriate UI based on auth state

  // Still checking auth or loading
  if (!hasCheckedAuth || !isInitialized || isLoading) {
    debugLog('🔄 Rendering loading state');
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Loading...</h2>
          <p className="text-gray-600 mb-4">
            {!hasCheckedAuth || !isInitialized ? 'Initializing authentication...' : 'Verifying your session...'}
          </p>
          <div className="bg-gray-100 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-gray-500">
              This should only take a moment. If you continue to see this screen, 
              please refresh the page or clear your browser cache.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    debugLog('🔄 Rendering redirect state (not authenticated)');
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Redirecting...</h2>
          <p className="text-gray-600">Taking you to the login page...</p>
        </div>
      </div>
    );
  }

  // Wrong role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    debugLog('🔄 Rendering redirect state (wrong role)');
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <Shield className="w-12 h-12 mx-auto mb-4 text-blue-500" />
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Redirecting...</h2>
          <p className="text-gray-600">Taking you to your dashboard...</p>
        </div>
      </div>
    );
  }

  // Email not verified (if required)
  if (requireEmailVerification && !user.isEmailVerified) {
    debugLog('📧 Rendering email verification screen');
    
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
                onClick={() => {
                  debugLog('Manual logout triggered from verification screen');
                  logout();
                }}
                className="w-full"
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
  debugLog('✅ Rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;