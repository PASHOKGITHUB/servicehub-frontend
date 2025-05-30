// src/instance/Provider.ts
import ApiClient from "@/lib/apiClient";
import type {
  ProviderDashboardData,
  ProviderServicesParams,
  ProviderServicesResponse,
  CreateServiceRequest,
  UpdateServiceRequest,
  ProviderBookingsParams,
  ProviderBookingsResponse,
  UpdateBookingStatusRequest,
  ProviderReviewsParams,
  ProviderReviewsResponse,
  ReplyToReviewRequest,
  AdminCategoriesResponse,
  ApiResponse
} from "@/domain/entities";

export const getProviderDashboard = async (): Promise<ProviderDashboardData> => {
  try {
    const response = await ApiClient.get<ApiResponse<ProviderDashboardData>>('/provider/dashboard');
    return response.data.data;
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch dashboard data';
    throw new Error(message);
  }
};

export const getProviderServices = async (params: ProviderServicesParams): Promise<ProviderServicesResponse> => {
  try {
    const response = await ApiClient.get<ApiResponse<ProviderServicesResponse>>('/provider/services', { params });
    return response.data.data;
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch services';
    throw new Error(message);
  }
};

export const createService = async (data: CreateServiceRequest): Promise<void> => {
  try {
    await ApiClient.post('/provider/services', data);
  } catch (error: unknown) {
    const apiError = error as { 
      response?: { 
        data?: { 
          message?: string; 
          errors?: Array<{ field: string; message: string }> 
        } 
      } 
    };
    const message = apiError?.response?.data?.message || 'Failed to create service';
    const errors = apiError?.response?.data?.errors || [];
    
    if (errors.length > 0) {
      const errorMessage = errors.map((err) => `${err.field}: ${err.message}`).join(', ');
      throw new Error(errorMessage);
    }
    
    throw new Error(message);
  }
};

export const updateService = async (data: UpdateServiceRequest): Promise<void> => {
  try {
    await ApiClient.put(`/provider/services/${data.id}`, data.data);
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update service';
    throw new Error(message);
  }
};

export const deleteService = async (id: string): Promise<void> => {
  try {
    await ApiClient.delete(`/provider/services/${id}`);
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to delete service';
    throw new Error(message);
  }
};

export const getProviderBookings = async (params: ProviderBookingsParams): Promise<ProviderBookingsResponse> => {
  try {
    const response = await ApiClient.get<ApiResponse<ProviderBookingsResponse>>('/provider/bookings', { params });
    return response.data.data;
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch bookings';
    throw new Error(message);
  }
};

export const updateBookingStatus = async (data: UpdateBookingStatusRequest): Promise<void> => {
  try {
    await ApiClient.put(`/provider/bookings/${data.id}/status`, {
      status: data.status,
      providerNotes: data.providerNotes,
      cancelReason: data.cancelReason
    });
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update booking status';
    throw new Error(message);
  }
};

export const getProviderReviews = async (params: ProviderReviewsParams): Promise<ProviderReviewsResponse> => {
  try {
    const response = await ApiClient.get<ApiResponse<ProviderReviewsResponse>>('/provider/reviews', { params });
    return response.data.data;
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch reviews';
    throw new Error(message);
  }
};

export const replyToReview = async (data: ReplyToReviewRequest): Promise<void> => {
  try {
    await ApiClient.put(`/provider/reviews/${data.id}/reply`, { reply: data.reply });
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to add reply';
    throw new Error(message);
  }
};

export const getServiceCategories = async (): Promise<AdminCategoriesResponse> => {
  try {
    const response = await ApiClient.get<ApiResponse<AdminCategoriesResponse>>('/common/categories');
    return response.data.data;
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch categories';
    throw new Error(message);
  }
};