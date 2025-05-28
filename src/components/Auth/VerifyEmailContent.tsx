'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { verifyEmailToken } from '@/instance/Auth';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

const VerifyEmailContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, updateUser } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [isAlreadyVerified, setIsAlreadyVerified] = useState(false);
  
  // Use ref to prevent multiple API calls
  const hasProcessedToken = useRef(false);
  const isProcessing = useRef(false);

  useEffect(() => {
    const token = searchParams.get('token');
    
    // Prevent multiple executions
    if (hasProcessedToken.current || isProcessing.current) {
      return;
    }
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. Please check your email and try again.');
      return;
    }

    // Mark as processing to prevent duplicate calls
    isProcessing.current = true;

    const verifyEmail = async () => {
      try {
        console.log('🔍 Starting email verification for token:', token.substring(0, 10) + '...');
        
        const result = await verifyEmailToken(token);
        
        // Mark as processed
        hasProcessedToken.current = true;
        
        console.log('✅ Verification result:', {
          userEmail: result.user.email,
          alreadyVerified: result.alreadyVerified,
          isVerified: result.user.isEmailVerified
        });
        
        // Handle both new verification and already verified cases
        if (result.alreadyVerified === true) {
          setIsAlreadyVerified(true);
          setStatus('success');
          setMessage('Your email is already verified! You can proceed to your dashboard.');
          toast.success('Email already verified! Redirecting to dashboard...');
        } else {
          setIsAlreadyVerified(false);
          setStatus('success');
          setMessage('Your email has been verified successfully! Welcome to ServiceHub!');
          toast.success('Email verified successfully! Welcome to ServiceHub!');
        }
        
        // Update user in store with verified status
        updateUser(result.user);
        
        // Redirect to correct dashboard based on user role
        setTimeout(() => {
          const userRole = result.user.role || user?.role || 'user';
          console.log('🔄 Redirecting user with role:', userRole);
          
          switch (userRole) {
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
        }, 2000); // Give user time to read the success message
        
      } catch (error: unknown) {
        console.error('❌ Verification error:', error);
        hasProcessedToken.current = true; // Mark as processed even on error
        setStatus('error');

        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to verify email. Please try again.';

        setMessage(errorMessage);
        toast.error(errorMessage);
      } finally {
        isProcessing.current = false;
      }
    };

    verifyEmail();
  }, [searchParams, updateUser, router, user?.role]); // Keep dependencies but use refs to prevent re-runs

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'error':
        return <XCircle className="w-16 h-16 text-red-500" />;
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'loading':
        return 'Verifying your email...';
      case 'success':
        return isAlreadyVerified ? 'Already Verified!' : 'Email Verified!';
      case 'error':
        return 'Verification Failed';
    }
  };

  const handleDashboardRedirect = () => {
    const userRole = user?.role || 'user';
    console.log('👤 Manual redirect for role:', userRole);
    
    switch (userRole) {
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
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="mb-4 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg"></div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              ServiceHub
            </h1>
          </div>
        </div>

        {/* Verification Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {getIcon()}
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">
              {getTitle()}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {message}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {status === 'success' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Redirecting to your dashboard in 2 seconds...
                </p>
                <Button
                  onClick={handleDashboardRedirect}
                  className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                >
                  Go to Dashboard Now
                </Button>
              </div>
            )}
            
            {status === 'error' && (
              <div className="space-y-4">
                <Button
                  onClick={() => router.push('/login')}
                  className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                >
                  Back to Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmailContent;