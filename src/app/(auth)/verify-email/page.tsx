// src/app/(auth)/verify-email/page.tsx
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import VerifyEmailContent from '@/components/Auth/VerifyEmailContent';

// Loading component for the fallback
const VerifyEmailLoading = () => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="w-full max-w-md">
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg"></div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            ServiceHub
          </h1>
        </div>
      </div>
      
      <div className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-lg p-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            Loading...
          </h2>
          <p className="text-gray-600">
            Please wait while we prepare your verification page.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const VerifyEmailPage = () => {
  return (
    <Suspense fallback={<VerifyEmailLoading />}>
      <VerifyEmailContent />
    </Suspense>
  );
};

export default VerifyEmailPage;