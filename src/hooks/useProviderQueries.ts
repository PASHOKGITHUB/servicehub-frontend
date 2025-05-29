import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ApiClient from '@/lib/apiClient';
import { toast } from 'sonner';

// Query Keys
export const providerKeys = {
  all: ['provider'] as const,
  dashboard: () => [...providerKeys.all, 'dashboard'] as const,
  services: (params?: any) => [...providerKeys.all, 'services', params] as const,
  bookings: (params?: any) => [...providerKeys.all, 'bookings', params] as const,
  earnings: (params?: any) => [...providerKeys.all, 'earnings', params] as const,
  reviews: (params?: any) => [...providerKeys.all, 'reviews', params] as const,
};

// Dashboard Statistics
export const useProviderDashboard = () => {
  return useQuery({
    queryKey: providerKeys.dashboard(),
    queryFn: async () => {
      const response = await ApiClient.get('/provider/dashboard');
      return response.data.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
};

// Services Management
export const useProviderServices = (params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} = {}) => {
  return useQuery({
    queryKey: providerKeys.services(params),
    queryFn: async () => {
      const response = await ApiClient.get('/provider/services', { params });
      return response.data.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      category: string;
      price: number;
      duration: number;
      serviceAreas: string[];
      tags?: string[];
    }) => {
      const response = await ApiClient.post('/provider/services', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerKeys.services() });
      queryClient.invalidateQueries({ queryKey: providerKeys.dashboard() });
      toast.success('Service created successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to create service';
      toast.error(message);
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { 
      id: string; 
      data: Partial<{
        name: string;
        description: string;
        price: number;
        duration: number;
        isActive: boolean;
        serviceAreas: string[];
        tags: string[];
      }> 
    }) => {
      const response = await ApiClient.put(`/provider/services/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerKeys.services() });
      toast.success('Service updated successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update service';
      toast.error(message);
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await ApiClient.delete(`/provider/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerKeys.services() });
      queryClient.invalidateQueries({ queryKey: providerKeys.dashboard() });
      toast.success('Service deleted successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to delete service';
      toast.error(message);
    },
  });
};

// Bookings Management
export const useProviderBookings = (params: {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} = {}) => {
  return useQuery({
    queryKey: providerKeys.bookings(params),
    queryFn: async () => {
      const response = await ApiClient.get('/provider/bookings', { params });
      return response.data.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      providerNotes, 
      cancelReason 
    }: { 
      id: string; 
      status: string; 
      providerNotes?: string; 
      cancelReason?: string; 
    }) => {
      const response = await ApiClient.put(`/provider/bookings/${id}/status`, {
        status,
        providerNotes,
        cancelReason
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerKeys.bookings() });
      queryClient.invalidateQueries({ queryKey: providerKeys.dashboard() });
      toast.success('Booking status updated successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update booking status';
      toast.error(message);
    },
  });
};

// Reviews Management
export const useProviderReviews = (params: {
  page?: number;
  limit?: number;
  rating?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} = {}) => {
  return useQuery({
    queryKey: providerKeys.reviews(params),
    queryFn: async () => {
      const response = await ApiClient.get('/provider/reviews', { params });
      return response.data.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useReplyToReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, reply }: { id: string; reply: string }) => {
      const response = await ApiClient.put(`/provider/reviews/${id}/reply`, { reply });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerKeys.reviews() });
      toast.success('Reply added successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to add reply';
      toast.error(message);
    },
  });
};

// Service Categories (for dropdown)
export const useServiceCategories = () => {
  return useQuery({
    queryKey: ['common', 'categories'],
    queryFn: async () => {
      const response = await ApiClient.get('/common/categories');
      return response.data.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
