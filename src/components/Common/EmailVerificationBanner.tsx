'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Mail, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useSendVerificationEmail } from '@/hooks/useAuthQueries';

const EmailVerificationBanner = () => {
  const { user } = useAuthStore();
  const [isVisible, setIsVisible] = useState(true);
  const sendVerificationMutation = useSendVerificationEmail();

  // Don't show if user is verified or banner is dismissed
  if (!user || user.isEmailVerified || !isVisible) {
    return null;
  }

  const handleResendVerification = () => {
    sendVerificationMutation.mutate();
  };

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Mail className="w-5 h-5 text-yellow-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-yellow-800">
              Please verify your email address
            </p>
            <p className="text-sm text-yellow-700">
              Check your inbox for a verification link or{' '}
              <Button
                variant="link"
                size="sm"
                onClick={handleResendVerification}
                disabled={sendVerificationMutation.isPending}
                className="text-yellow-700 underline p-0 h-auto font-semibold"
              >
                {sendVerificationMutation.isPending ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'resend verification email'
                )}
              </Button>
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="text-yellow-600 hover:text-yellow-800"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;