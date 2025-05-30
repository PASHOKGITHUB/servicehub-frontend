import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  getCurrentUser,
  sendVerificationEmail,
  verifyEmailToken 
} from '@/instance/Auth';
import type { LoginRequest, RegisterRequest } from '@/domain/entities';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

// Get Current User Query
export const useCurrentUser = () => {
  const { isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: getCurrentUser,
    enabled: isAuthenticated && !!(Cookies.get('token') || localStorage.getItem('auth_token')),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: Error) => {
      if ((error as unknown as { response?: { status?: number } })?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
};

// Login Mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequest) => loginUser(data),
    onSuccess: (data) => {
      // Update auth store
      updateUser(data.user);
      
      // Set user data in query cache
      queryClient.setQueryData(authKeys.profile(), data.user);
      
      // Prefetch related data if needed
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      
      toast.success('Login successful!');
      
      // Redirect based on role
      switch (data.user.role) {
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
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed');
    },
  });
};

// Register Mutation
export const useRegister = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequest) => registerUser(data),
    onSuccess: (data) => {
      // Update auth store
      updateUser(data.user);
      
      // Set user data in query cache
      queryClient.setQueryData(authKeys.profile(), data.user);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      
      toast.success('Account created successfully! Please verify your email.');
      
      // Redirect based on role
      switch (data.user.role) {
        case 'provider':
          router.push('/provider-dashboard');
          break;
        case 'user':
        default:
          router.push('/user-dashboard');
          break;
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed');
    },
  });
};

// Logout Mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout: authLogout } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // Clear auth store
      authLogout();
      
      // Clear all queries
      queryClient.clear();
      
      // Remove cached user data
      queryClient.removeQueries({ queryKey: authKeys.all });
      
      toast.success('Logged out successfully');
      
      // Redirect to home
      router.push('/');
    },
    onError: () => {
      // Still clear cache even if logout API fails
      authLogout();
      queryClient.clear();
      router.push('/');
      toast.success('Logged out successfully');
    },
  });
};

// Send Verification Email Mutation
export const useSendVerificationEmail = () => {
  return useMutation({
    mutationFn: sendVerificationEmail,
    onSuccess: (data) => {
      toast.success('Verification email sent! Please check your inbox.');
      if (data.previewUrl) {
        console.log('📧 Email Preview URL:', data.previewUrl);
        toast.info('Check console for email preview link (development mode)');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send verification email');
    },
  });
};

// Verify Email Mutation
export const useVerifyEmail = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: (token: string) => verifyEmailToken(token),
    onSuccess: (data) => {
      // Update user in store and cache
      updateUser(data.user);
      queryClient.setQueryData(authKeys.profile(), data.user);
      
      // Invalidate user queries to refetch latest data
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      
      if (data.alreadyVerified) {
        toast.success('Email already verified! Redirecting to dashboard...');
      } else {
        toast.success('Email verified successfully! Welcome to ServiceHub!');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to verify email');
    },
  });
};
