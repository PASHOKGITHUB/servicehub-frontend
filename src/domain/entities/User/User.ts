import { ServiceCategory } from "../Admin/Admin";
import { PaginationMeta, QueryParams } from "../Common/ApiTypes";

export interface UserDashboardData {
  upcomingBookings: UserBooking[];
  recentBookings: UserBooking[];
  favoriteServices: UserService[];
  stats: {
    totalBookings: number;
    completedBookings: number;
    totalSpent: number;
  };
}

export interface BrowseServicesParams extends QueryParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  rating?: number;
}

export interface BrowseServicesResponse {
  services: UserService[];
  pagination: PaginationMeta;
  filters: {
    categories: ServiceCategory[];
    priceRange: { min: number; max: number };
    locations: string[];
  };
}

export interface UserService {
  _id: string;
  name: string;
  description: string;
  category: {
    _id: string;
    name: string;
  };
  provider: {
    _id: string;
    name: string;
    avatar?: string;
    email?: string;
    averageRating: number;
    totalReviews: number;
    provider?:string;
    phone?: string;
  };
  price: number;
  duration: number;
  serviceAreas: string[];
  tags: string[];
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceDetailsResponse {
  service: UserService;
  reviews: ServiceReview[];
  relatedServices: UserService[];
}

export interface ServiceReview {
  _id: string;
  customer: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment?: string;
  createdAt: string;
  providerReply?: string;
  providerReplyAt?: string;
}

export interface UserBookingsParams extends QueryParams {
  status?: string;
}

export interface UserBookingsResponse {
  bookings: UserBooking[];
  pagination: PaginationMeta;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export interface UserBooking {
  _id: string;
  service: {
    _id: string;
    name: string;
    duration: number;
  };
  provider: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  // Add missing fields for compatibility
  customer?: {
    _id: string;
    name: string;
    email: string;
  };
  bookingDate: string;
  timeSlot: string;
  status: BookingStatus;
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
  updatedAt?: string; // Add this field
  completedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
}

export interface CreateBookingRequest {
  service: string;
  bookingDate: string;
  timeSlot: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  customerNotes?: string;
}

export interface CancelBookingRequest {
  bookingId: string;
  cancelReason?: string;
}

export interface UserReviewsParams extends QueryParams {
  rating?: string;
}

export interface UserReviewsResponse {
  reviews: UserReview[];
  pagination: PaginationMeta;
}

export interface UserReview {
  _id: string;
  service: {
    _id: string;
    name: string;
  };
  provider: {
    _id: string;
    name: string;
  };
   customer?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  booking?: string; 
  rating: number;
  comment?: string;
  isVisible: boolean;
  providerReply?: string;
  providerReplyAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateReviewRequest {
  booking: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewRequest {
  reviewId: string;
  data: {
    rating: number;
    comment?: string;
  };
}