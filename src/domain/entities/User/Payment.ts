import { UserBooking } from "./User";

export enum PaymentMethod {
  RAZORPAY = 'razorpay',
  WALLET = 'wallet',
  COD = 'cod',
}

export enum PaymentGatewayStatus {
  CREATED = 'created',
  AUTHORIZED = 'authorized',
  CAPTURED = 'captured',
  REFUNDED = 'refunded',
  FAILED = 'failed',
}

export interface Payment {
  _id: string;
  booking: string;
  customer: string;
  provider: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentGatewayStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

export interface CreateBookingWithPaymentRequest {
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
  paymentMethod: PaymentMethod;
}

export interface BookingWithPaymentResponse {
  booking: UserBooking;
  payment: Payment;
  razorpayOrder: RazorpayOrder;
}