import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getAdminDashboard,
  getAdminUsers,
  updateUserStatus,
  getAdminProviders,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAdminBookings,
  getFinancialReports
} from '@/instance/Admin';
import type {
  AdminUsersParams,
  AdminProvidersParams,
  AdminCategoriesParams,
  AdminBookingsParams,
  FinancialReportsParams
} from '@/domain/entities';

// Query Keys
export const adminKeys = {
  all: ['admin'] as const,
  dashboard: () => [...adminKeys.all, 'dashboard'] as const,
  users: (params?: AdminUsersParams) => [...adminKeys.all, 'users', params] as const,
  providers: (params?: AdminProvidersParams) => [...adminKeys.all, 'providers', params] as const,
  categories: (params?: AdminCategoriesParams) => [...adminKeys.all, 'categories', params] as const,
  bookings: (params?: AdminBookingsParams) => [...adminKeys.all, 'bookings', params] as const,
  reports: (params?: FinancialReportsParams) => [...adminKeys.all, 'reports', params] as const,
};

// Dashboard Statistics
export const useAdminDashboard = () => {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: getAdminDashboard,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
};

// Users Management
export const useAdminUsers = (params: AdminUsersParams = {}) => {
  return useQuery({
    queryKey: adminKeys.users(params),
    queryFn: () => getAdminUsers(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard() });
      toast.success('User status updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update user status');
    },
  });
};

// Providers Management
export const useAdminProviders = (params: AdminProvidersParams = {}) => {
  return useQuery({
    queryKey: adminKeys.providers(params),
    queryFn: () => getAdminProviders(params),
    placeholderData: (previousData) => previousData,
  });
};

// Service Categories Management
export const useAdminCategories = (params: AdminCategoriesParams = {}) => {
  return useQuery({
    queryKey: adminKeys.categories(params),
    queryFn: () => getAdminCategories(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories() });
      toast.success('Service category created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create category');
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories() });
      toast.success('Service category updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update category');
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories() });
      toast.success('Service category deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete category');
    },
  });
};

// Bookings Management
export const useAdminBookings = (params: AdminBookingsParams = {}) => {
  return useQuery({
    queryKey: adminKeys.bookings(params),
    queryFn: () => getAdminBookings(params),
    placeholderData: (previousData) => previousData,
  });
};

// Financial Reports
export const useFinancialReports = (params: FinancialReportsParams = {}) => {
  return useQuery({
    queryKey: adminKeys.reports(params),
    queryFn: () => getFinancialReports(params),
  });
};