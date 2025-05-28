import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  getCurrentUser,
  sendVerificationEmail,
  verifyEmailToken 
} from '@/instance/Auth';
import { LoginRequest, RegisterRequest } from '@/domain/entities/Auth/Auth';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

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
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
};

// Login Mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginRequest) => loginUser(data),
    onSuccess: (data) => {
      // Update auth store
      updateUser(data.user);
      
      // Set user data in query cache
      queryClient.setQueryData(authKeys.profile(), { user: data.user });
      
      // Prefetch related data if needed
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      
      toast.success('Login successful!');
    },
    onError: (error: any) => {
      const message = error?.message || 'Login failed';
      toast.error(message);
    },
  });
};

// Register Mutation
export const useRegister = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: RegisterRequest) => registerUser(data),
    onSuccess: (data) => {
      // Update auth store
      updateUser(data.user);
      
      // Set user data in query cache
      queryClient.setQueryData(authKeys.profile(), { user: data.user });
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      
      toast.success('Account created successfully! Please verify your email.');
    },
    onError: (error: any) => {
      const message = error?.message || 'Registration failed';
      toast.error(message);
    },
  });
};

// Logout Mutation
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
      
      // Remove cached user data
      queryClient.removeQueries({ queryKey: authKeys.all });
      
      toast.success('Logged out successfully');
    },
    onError: (error: any) => {
      // Still clear cache even if logout API fails
      queryClient.clear();
      toast.error('Logout failed, but you have been signed out locally');
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
    onError: (error: any) => {
      const message = error?.message || 'Failed to send verification email';
      toast.error(message);
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
      queryClient.setQueryData(authKeys.profile(), { user: data.user });
      
      // Invalidate user queries to refetch latest data
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      
      if (data.alreadyVerified) {
        toast.success('Email already verified! Redirecting to dashboard...');
      } else {
        toast.success('Email verified successfully! Welcome to ServiceHub!');
      }
    },
    onError: (error: any) => {
      const message = error?.message || 'Failed to verify email';
      toast.error(message);
    },
  });
};