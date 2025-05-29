export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface BookingAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface Booking {
  _id: string;
  customer: string;
  provider: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  service: {
    _id: string;
    name: string;
    duration: number;
    category: {
      name: string;
    };
  };
  bookingDate: Date;
  timeSlot: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  serviceFee: number;
  platformFee: number;
  address: BookingAddress;
  customerNotes?: string;
  providerNotes?: string;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBookingRequest {
  service: string;
  bookingDate: string;
  timeSlot: string;
  address: BookingAddress;
  customerNotes?: string;
}

export interface GetBookingsRequest {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BookingsResponse {
  bookings: Booking[];
  pagination: {
    current: number;
    total: number;
    count: number;
    limit: number;
  };
}