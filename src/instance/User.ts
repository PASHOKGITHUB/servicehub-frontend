import ApiClient from "@/lib/apiClient";
import { 
  BrowseServicesRequest, 
  BrowseServicesResponse, 
  Service 
} from "@/domain/entities/User/Service";
import { 
  CreateBookingRequest, 
  Booking, 
  GetBookingsRequest, 
  BookingsResponse 
} from "@/domain/entities/User/Booking";
import { 
  CreateReviewRequest, 
  UpdateReviewRequest, 
  Review, 
  ReviewsResponse 
} from "@/domain/entities/User/Review";
import { UserDashboard } from "@/domain/entities/User/Dashboard";

// Dashboard
export const getUserDashboard = async (): Promise<UserDashboard> => {
  try {
    const response = await ApiClient.get('/user/dashboard');
    return response.data.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Failed to fetch dashboard';
    throw new Error(message);
  }
};

// Services
export const browseServices = async (params: BrowseServicesRequest): Promise<BrowseServicesResponse> => {
  try {
    const response = await ApiClient.get('/user/services', { params });
    return response.data.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Failed to browse services';
    throw new Error(message);
  }
};

export const getServiceDetails = async (serviceId: string): Promise<{ service: Service; reviews: Review[] }> => {
  try {
    const response = await ApiClient.get(`/user/services/${serviceId}`);
    return response.data.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Failed to fetch service details';
    throw new Error(message);
  }
};

// Bookings
export const createBooking = async (data: CreateBookingRequest): Promise<Booking> => {
  try {
    const response = await ApiClient.post('/user/bookings', data);
    return response.data.data.booking;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Failed to create booking';
    const errors = error?.response?.data?.errors || [];
    
    if (errors.length > 0) {
      const errorMessage = errors.map((err: any) => `${err.field}: ${err.message}`).join(', ');
      throw new Error(errorMessage);
    }
    
    throw new Error(message);
  }
};

export const getUserBookings = async (params: GetBookingsRequest): Promise<BookingsResponse> => {
  try {
    const response = await ApiClient.get('/user/bookings', { params });
    return response.data.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Failed to fetch bookings';
    throw new Error(message);
  }
};

export const cancelBooking = async (bookingId: string, cancelReason?: string): Promise<Booking> => {
  try {
    const response = await ApiClient.put(`/user/bookings/${bookingId}/cancel`, { cancelReason });
    return response.data.data.booking;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Failed to cancel booking';
    throw new Error(message);
  }
};

// Reviews
export const createReview = async (data: CreateReviewRequest): Promise<Review> => {
  try {
    const response = await ApiClient.post('/user/reviews', data);
    return response.data.data.review;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Failed to create review';
    const errors = error?.response?.data?.errors || [];
    
    if (errors.length > 0) {
      const errorMessage = errors.map((err: any) => `${err.field}: ${err.message}`).join(', ');
      throw new Error(errorMessage);
    }
    
    throw new Error(message);
  }
};

export const getUserReviews = async (params: any = {}): Promise<ReviewsResponse> => {
  try {
    const response = await ApiClient.get('/user/reviews', { params });
    return response.data.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Failed to fetch reviews';
    throw new Error(message);
  }
};

export const updateReview = async (reviewId: string, data: UpdateReviewRequest): Promise<Review> => {
  try {
    const response = await ApiClient.put(`/user/reviews/${reviewId}`, data);
    return response.data.data.review;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Failed to update review';
    const errors = error?.response?.data?.errors || [];
    
    if (errors.length > 0) {
      const errorMessage = errors.map((err: any) => `${err.field}: ${err.message}`).join(', ');
      throw new Error(errorMessage);
    }
    
    throw new Error(message);
  }
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    await ApiClient.delete(`/user/reviews/${reviewId}`);
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Failed to delete review';
    throw new Error(message);
  }
};