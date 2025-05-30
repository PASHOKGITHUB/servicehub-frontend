import ApiClient from "@/lib/apiClient";
import type {
  UserDashboardData,
  BrowseServicesParams,
  BrowseServicesResponse,
  ServiceDetailsResponse,
  CreateBookingRequest,
  UserBookingsParams,
  UserBookingsResponse,
  CreateReviewRequest,
  UserReviewsParams,
  UserReviewsResponse,
  UpdateReviewRequest,
  ApiResponse
} from "@/domain/entities";

export const getUserDashboard = async (): Promise<UserDashboardData> => {
  try {
    const response = await ApiClient.get<ApiResponse<UserDashboardData>>('/user/dashboard');
    return response.data.data;
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch dashboard data';
    throw new Error(message);
  }
};

export const browseServices = async (params: BrowseServicesParams): Promise<BrowseServicesResponse> => {
  try {
    const response = await ApiClient.get<ApiResponse<BrowseServicesResponse>>('/user/services', { params });
    return response.data.data;
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch services';
    throw new Error(message);
  }
};

export const getServiceDetails = async (serviceId: string): Promise<ServiceDetailsResponse> => {
  try {
    const response = await ApiClient.get<ApiResponse<ServiceDetailsResponse>>(`/user/services/${serviceId}`);
    return response.data.data;
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch service details';
    throw new Error(message);
  }
};

export const createBooking = async (data: CreateBookingRequest): Promise<UserBookingsResponse> => {
  try {
    const response = await ApiClient.post<ApiResponse<UserBookingsResponse>>('/user/bookings', data);
    return response.data.data;
  } catch (error: unknown) {
    const apiError = error as { response?: { data?: { message?: string; errors?: Array<{ field: string; message: string }> } } };
    const message = apiError?.response?.data?.message || 'Failed to create booking';
    const errors = apiError?.response?.data?.errors || [];
    
    if (errors.length > 0) {
      const errorMessage = errors.map((err) => `${err.field}: ${err.message}`).join(', ');
      throw new Error(errorMessage);
    }
    
    throw new Error(message);
  }
};

export const getUserBookings = async (params: UserBookingsParams): Promise<UserBookingsResponse> => {
  try {
    const response = await ApiClient.get<ApiResponse<UserBookingsResponse>>('/user/bookings', { params });
    return response.data.data;
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch bookings';
    throw new Error(message);
  }
};

export const cancelBooking = async (bookingId: string, cancelReason?: string): Promise<void> => {
  try {
    await ApiClient.put(`/user/bookings/${bookingId}/cancel`, { cancelReason });
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to cancel booking';
    throw new Error(message);
  }
};

export const createReview = async (data: CreateReviewRequest): Promise<void> => {
  try {
    await ApiClient.post('/user/reviews', data);
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create review';
    throw new Error(message);
  }
};

export const getUserReviews = async (params: UserReviewsParams): Promise<UserReviewsResponse> => {
  try {
    const response = await ApiClient.get<ApiResponse<UserReviewsResponse>>('/user/reviews', { params });
    return response.data.data;
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch reviews';
    throw new Error(message);
  }
};

export const updateReview = async (reviewId: string, data: UpdateReviewRequest['data']): Promise<void> => {
  try {
    await ApiClient.put(`/user/reviews/${reviewId}`, data);
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update review';
    throw new Error(message);
  }
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    await ApiClient.delete(`/user/reviews/${reviewId}`);
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to delete review';
    throw new Error(message);
  }
};

  