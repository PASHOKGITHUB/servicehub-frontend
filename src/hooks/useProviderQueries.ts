import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getProviderDashboard,
  getProviderServices,
  createService,
  updateService,
  deleteService,
  getProviderBookings,
  updateBookingStatus,
  getProviderReviews,
  replyToReview,
  getServiceCategories
} from '@/instance/Provider';
import type {
  ProviderServicesParams,
  ProviderBookingsParams,
  ProviderReviewsParams,
} from '@/domain/entities';

// Query Keys
export const providerKeys = {
  all: ['provider'] as const,
  dashboard: () => [...providerKeys.all, 'dashboard'] as const,
  services: (params?: ProviderServicesParams) => [...providerKeys.all, 'services', params] as const,
  bookings: (params?: ProviderBookingsParams) => [...providerKeys.all, 'bookings', params] as const,
  earnings: (params?: unknown) => [...providerKeys.all, 'earnings', params] as const,
  reviews: (params?: ProviderReviewsParams) => [...providerKeys.all, 'reviews', params] as const,
};

// Dashboard Statistics
export const useProviderDashboard = () => {
  return useQuery({
    queryKey: providerKeys.dashboard(),
    queryFn: getProviderDashboard,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
};

// Services Management
export const useProviderServices = (params: ProviderServicesParams = {}) => {
  return useQuery({
    queryKey: providerKeys.services(params),
    queryFn: () => getProviderServices(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerKeys.services() });
      queryClient.invalidateQueries({ queryKey: providerKeys.dashboard() });
      toast.success('Service created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create service');
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerKeys.services() });
      toast.success('Service updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update service');
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerKeys.services() });
      queryClient.invalidateQueries({ queryKey: providerKeys.dashboard() });
      toast.success('Service deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete service');
    },
  });
};

// Bookings Management
export const useProviderBookings = (params: ProviderBookingsParams = {}) => {
  return useQuery({
    queryKey: providerKeys.bookings(params),
    queryFn: () => getProviderBookings(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateBookingStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerKeys.bookings() });
      queryClient.invalidateQueries({ queryKey: providerKeys.dashboard() });
      toast.success('Booking status updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update booking status');
    },
  });
};

// Reviews Management
export const useProviderReviews = (params: ProviderReviewsParams = {}) => {
  return useQuery({
    queryKey: providerKeys.reviews(params),
    queryFn: () => getProviderReviews(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useReplyToReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: replyToReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerKeys.reviews() });
      toast.success('Reply added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add reply');
    },
  });
};

// Service Categories (for dropdown)
export const useServiceCategories = () => {
  return useQuery({
    queryKey: ['common', 'categories'],
    queryFn: getServiceCategories,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};