import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  getUserDashboard,
  browseServices,
  getServiceDetails,
  createBooking,
  getUserBookings,
  cancelBooking,
  createReview,
  getUserReviews,
  updateReview,
  deleteReview,
} from '@/instance/User';
import { toast } from 'sonner';

// Query Keys
export const userKeys = {
  all: ['user'] as const,
  dashboard: () => [...userKeys.all, 'dashboard'] as const,
  services: () => [...userKeys.all, 'services'] as const,
  servicesList: (params: any) => [...userKeys.services(), 'list', params] as const,
  serviceDetail: (id: string) => [...userKeys.services(), 'detail', id] as const,
  bookings: () => [...userKeys.all, 'bookings'] as const,
  bookingsList: (params: any) => [...userKeys.bookings(), 'list', params] as const,
  reviews: () => [...userKeys.all, 'reviews'] as const,
  reviewsList: (params: any) => [...userKeys.reviews(), 'list', params] as const,
};

// Dashboard
export const useUserDashboard = () => {
  return useQuery({
    queryKey: userKeys.dashboard(),
    queryFn: getUserDashboard,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Services
export const useBrowseServices = (params: any) => {
  return useQuery({
    queryKey: userKeys.servicesList(params),
    queryFn: () => browseServices(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: keepPreviousData,
  });
};

export const useServiceDetails = (serviceId: string) => {
  return useQuery({
    queryKey: userKeys.serviceDetail(serviceId),
    queryFn: () => getServiceDetails(serviceId),
    enabled: !!serviceId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Bookings
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: userKeys.bookings() });
      toast.success('Booking created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
};

export const useUserBookings = (params: any) => {
  return useQuery({
    queryKey: userKeys.bookingsList(params),
    queryFn: () => getUserBookings(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
    placeholderData: keepPreviousData,
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, cancelReason }: { bookingId: string; cancelReason?: string }) =>
      cancelBooking(bookingId, cancelReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: userKeys.bookings() });
      toast.success('Booking cancelled successfully');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
};

// Reviews
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.reviews() });
      queryClient.invalidateQueries({ queryKey: userKeys.bookings() });
      toast.success('Review submitted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
};

export const useUserReviews = (params: any) => {
  return useQuery({
    queryKey: userKeys.reviewsList(params),
    queryFn: () => getUserReviews(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: keepPreviousData,
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: string; data: any }) =>
      updateReview(reviewId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.reviews() });
      toast.success('Review updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.reviews() });
      toast.success('Review deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
};