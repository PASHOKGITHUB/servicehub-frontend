// Add these types to your src/domain/entities/Provider/Provider.ts file

import type { QueryParams, PaginationMeta } from '../Common/ApiTypes';

export interface ProviderDashboardData {
  services: {
    total: number;
    active: number;
  };
  bookings: {
    total: number;
    pending: number;
    completed: number;
  };
  earnings: {
    total: number;
    monthly: number;
  };
  rating: {
    average: number;
    totalReviews: number;
  };
  recentBookings: ProviderBooking[];
}

export interface ProviderServicesParams extends QueryParams {
  category?: string;
  isActive?: boolean;
}

export interface ProviderServicesResponse {
  services: ProviderService[];
  pagination: PaginationMeta;
}

export interface ProviderService {
  _id: string;
  name: string;
  description: string;
  category: {
    _id: string;
    name: string;
  };
  price: number;
  duration: number;
  isActive: boolean;
  serviceAreas: string[];
  tags: string[];
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceRequest {
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  serviceAreas: string[];
  tags?: string[];
}

export interface UpdateServiceRequest {
  id: string;
  data: Partial<{
    name: string;
    description: string;
    price: number;
    duration: number;
    isActive: boolean;
    serviceAreas: string[];
    tags: string[];
  }>;
}

export interface ProviderBookingsParams extends QueryParams {
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface ProviderBookingsResponse {
  bookings: ProviderBooking[];
  pagination: PaginationMeta;
}

export interface ProviderBooking {
  _id: string;
  customer: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  service: {
    _id: string;
    name: string;
    duration: number;
  };
  bookingDate: string;
  timeSlot: string;
  status: string;
  paymentStatus: string;
  serviceFee: number;
  platformFee: number;
  totalAmount: number;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  customerNotes?: string;
  providerNotes?: string;
  createdAt: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
}

export interface UpdateBookingStatusRequest {
  id: string;
  status: string;
  providerNotes?: string;
  cancelReason?: string;
}

export interface ProviderReviewsParams extends QueryParams {
  rating?: number;
}

export interface ProviderReviewsResponse {
  reviews: ProviderReview[];
  pagination: PaginationMeta;
}

export interface ProviderReview {
  _id: string;
  customer: {
    _id: string;
    name: string;
    avatar?: string;
  };
  service: {
    _id: string;
    name: string;
  };
  rating: number;
  comment?: string;
  isVisible: boolean;
  providerReply?: string;
  providerReplyAt?: string;
  createdAt: string;
}

export interface ReplyToReviewRequest {
  id: string;
  reply: string;
}