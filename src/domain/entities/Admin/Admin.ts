import { PaginationMeta, QueryParams } from "../Common/ApiTypes";

export interface AdminDashboardData {
  stats: {
    totalUsers: number;
    totalProviders: number;
    totalBookings: number;
    totalRevenue: number;
    activeServices: number;
  };
  recentActivity: AdminActivity[];
  monthlyStats: MonthlyStats[];
}

export interface AdminActivity {
  _id: string;
  type: 'user_registration' | 'provider_approval' | 'booking_created' | 'payment_received';
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface MonthlyStats {
  month: string;
  users: number;
  bookings: number;
  revenue: number;
}

export interface AdminUsersParams extends QueryParams {
  role?: string;
  isActive?: boolean;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  pagination: PaginationMeta;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  // Provider specific fields
  servicesCount?: number;
  totalEarnings?: number;
  totalBookings?: number;
  averageRating?: number;
}

export interface AdminProvidersParams extends QueryParams {
  isActive?: boolean;
}

export interface AdminProvidersResponse {
  providers: AdminUser[];
  pagination: PaginationMeta;
}

export interface UpdateUserStatusRequest {
  userId: string;
  isActive: boolean;
  reason?: string;
}

export interface AdminCategoriesParams extends QueryParams {
  isActive?: boolean;
}

export interface AdminCategoriesResponse {
  categories: ServiceCategory[];
  pagination: PaginationMeta;
}

export interface ServiceCategory {
  _id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
  servicesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
  icon: string;
  sortOrder?: number;
}

export interface UpdateCategoryRequest {
  id: string;
  data: Partial<{
    name: string;
    description: string;
    icon: string;
    isActive: boolean;
    sortOrder: number;
  }>;
}

export interface AdminBookingsParams extends QueryParams {
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface AdminBookingsResponse {
  bookings: AdminBooking[];
  pagination: PaginationMeta;
}

export interface AdminBooking {
  _id: string;
  customer: {
    _id: string;
    name: string;
    email: string;
  };
  provider: {
    _id: string;
    name: string;
    email: string;
  };
  service: {
    _id: string;
    name: string;
    price: number;
  };
  bookingDate: string;
  timeSlot: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
}

export interface FinancialReportsParams {
  startDate?: string;
  endDate?: string;
  period?: 'day' | 'week' | 'month';
}

export interface FinancialReportsResponse {
  totalRevenue: number;
  totalBookings: number;
  averageOrderValue: number;
  revenueGrowth: number;
  platformFees: number;
  providerPayouts: number;
  chartData: ChartDataPoint[];
}

export interface ChartDataPoint {
  date: string;
  revenue: number;
  bookings: number;
}
