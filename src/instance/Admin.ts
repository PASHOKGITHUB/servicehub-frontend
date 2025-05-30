import ApiClient from "@/lib/apiClient";
import type {
  AdminDashboardData,
  AdminUsersParams,
  AdminUsersResponse,
  AdminProvidersParams,
  AdminProvidersResponse,
  UpdateUserStatusRequest,
  AdminCategoriesParams,
  AdminCategoriesResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  AdminBookingsParams,
  AdminBookingsResponse,
  FinancialReportsParams,
  FinancialReportsResponse,
  ApiResponse
} from "@/domain/entities";

export const getAdminDashboard = async (): Promise<AdminDashboardData> => {
  try {
    const response = await ApiClient.get<ApiResponse<AdminDashboardData>>('/admin/dashboard');
    return response.data.data;
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch dashboard data';
    throw new Error(message);
  }
};

export const getAdminUsers = async (params: AdminUsersParams): Promise<AdminUsersResponse> => {
  try {
    const response = await ApiClient.get<ApiResponse<AdminUsersResponse>>('/admin/users', { params });
    return response.data.data;
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch users';
    throw new Error(message);
  }
};

export const updateUserStatus = async (data: UpdateUserStatusRequest): Promise<void> => {
  try {
    await ApiClient.put(`/admin/users/${data.userId}/status`, {
      isActive: data.isActive,
      reason: data.reason
    });
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update user status';
    throw new Error(message);
  }
};

export const getAdminProviders = async (params: AdminProvidersParams): Promise<AdminProvidersResponse> => {
  try {
    const response = await ApiClient.get<ApiResponse<AdminProvidersResponse>>('/admin/providers', { params });
    return response.data.data;
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch providers';
    throw new Error(message);
  }
};

export const getAdminCategories = async (params: AdminCategoriesParams): Promise<AdminCategoriesResponse> => {
  try {
    const response = await ApiClient.get<ApiResponse<AdminCategoriesResponse>>('/admin/categories', { params });
    return response.data.data;
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch categories';
    throw new Error(message);
  }
};

export const createCategory = async (data: CreateCategoryRequest): Promise<void> => {
  try {
    await ApiClient.post('/admin/categories', data);
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create category';
    throw new Error(message);
  }
};

export const updateCategory = async (data: UpdateCategoryRequest): Promise<void> => {
  try {
    await ApiClient.put(`/admin/categories/${data.id}`, data.data);
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update category';
    throw new Error(message);
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await ApiClient.delete(`/admin/categories/${id}`);
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to delete category';
    throw new Error(message);
  }
};

export const getAdminBookings = async (params: AdminBookingsParams): Promise<AdminBookingsResponse> => {
  try {
    const response = await ApiClient.get<ApiResponse<AdminBookingsResponse>>('/admin/bookings', { params });
    return response.data.data;
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch bookings';
    throw new Error(message);
  }
};

export const getFinancialReports = async (params: FinancialReportsParams): Promise<FinancialReportsResponse> => {
  try {
    const response = await ApiClient.get<ApiResponse<FinancialReportsResponse>>('/admin/reports/financial', { params });
    return response.data.data;
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch financial reports';
    throw new Error(message);
  }
};