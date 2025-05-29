

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ApiClient from '@/lib/apiClient';
import { toast } from 'sonner';

// Query Keys
export const adminKeys = {
  all: ['admin'] as const,
  dashboard: () => [...adminKeys.all, 'dashboard'] as const,
  users: (params?: any) => [...adminKeys.all, 'users', params] as const,
  providers: (params?: any) => [...adminKeys.all, 'providers', params] as const,
  categories: (params?: any) => [...adminKeys.all, 'categories', params] as const,
  bookings: (params?: any) => [...adminKeys.all, 'bookings', params] as const,
  reports: (params?: any) => [...adminKeys.all, 'reports', params] as const,
};

// Dashboard Statistics
export const useAdminDashboard = () => {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: async () => {
      const response = await ApiClient.get('/admin/dashboard');
      return response.data.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
};

// Users Management
export const useAdminUsers = (params: {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} = {}) => {
  return useQuery({
    queryKey: adminKeys.users(params),
    queryFn: async () => {
      const response = await ApiClient.get('/admin/users', { params });
      return response.data.data;
    },
    placeholderData: (previousData) => previousData, // ✅ FIXED: Use placeholderData instead of keepPreviousData
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, isActive, reason }: { userId: string; isActive: boolean; reason?: string }) => {
      const response = await ApiClient.put(`/admin/users/${userId}/status`, { isActive, reason });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard() });
      toast.success('User status updated successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update user status';
      toast.error(message);
    },
  });
};

// Providers Management
export const useAdminProviders = (params: {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} = {}) => {
  return useQuery({
    queryKey: adminKeys.providers(params),
    queryFn: async () => {
      const response = await ApiClient.get('/admin/providers', { params });
      return response.data.data;
    },
    placeholderData: (previousData) => previousData, // ✅ FIXED: Use placeholderData instead of keepPreviousData
  });
};

// Service Categories Management
export const useAdminCategories = (params: {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} = {}) => {
  return useQuery({
    queryKey: adminKeys.categories(params),
    queryFn: async () => {
      const response = await ApiClient.get('/admin/categories', { params });
      return response.data.data;
    },
    placeholderData: (previousData) => previousData, // ✅ FIXED: Use placeholderData instead of keepPreviousData
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { name: string; description: string; icon: string; sortOrder?: number }) => {
      const response = await ApiClient.post('/admin/categories', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories() });
      toast.success('Service category created successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to create category';
      toast.error(message);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<{ name: string; description: string; icon: string; isActive: boolean; sortOrder: number }> }) => {
      const response = await ApiClient.put(`/admin/categories/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories() });
      toast.success('Service category updated successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update category';
      toast.error(message);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await ApiClient.delete(`/admin/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories() });
      toast.success('Service category deleted successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to delete category';
      toast.error(message);
    },
  });
};

// Bookings Management
export const useAdminBookings = (params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} = {}) => {
  return useQuery({
    queryKey: adminKeys.bookings(params),
    queryFn: async () => {
      const response = await ApiClient.get('/admin/bookings', { params });
      return response.data.data;
    },
    placeholderData: (previousData) => previousData, // ✅ FIXED: Use placeholderData instead of keepPreviousData
  });
};

// Financial Reports
export const useFinancialReports = (params: {
  startDate?: string;
  endDate?: string;
  period?: 'day' | 'week' | 'month';
} = {}) => {
  return useQuery({
    queryKey: adminKeys.reports(params),
    queryFn: async () => {
      const response = await ApiClient.get('/admin/reports/financial', { params });
      return response.data.data;
    },
  });
};