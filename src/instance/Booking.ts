// import ApiClient from "@/lib/apiClient";
// import { 
//   CreateBookingWithPaymentRequest, 
//   BookingWithPaymentResponse 
// } from "@/domain/entities/User/Payment";

// export const createBookingWithPayment = async (
//   data: CreateBookingWithPaymentRequest
// ): Promise<BookingWithPaymentResponse> => {
//   try {
//     const response = await ApiClient.post('/bookings', data);
//     return response.data.data;
//   } catch (error: any) {
//     const message = error?.response?.data?.message || 'Failed to create booking';
//     const errors = error?.response?.data?.errors || [];
    
//     if (errors.length > 0) {
//       const errorMessage = errors.map((err: any) => `${err.field}: ${err.message}`).join(', ');
//       throw new Error(errorMessage);
//     }
    
//     throw new Error(message);
//   }
// };

// export const verifyPayment = async (paymentData: {
//   paymentId: string;
//   razorpay_order_id: string;
//   razorpay_payment_id: string;
//   razorpay_signature: string;
// }) => {
//   try {
//     const response = await ApiClient.post('/bookings/verify-payment', paymentData);
//     return response.data.data;
//   } catch (error: any) {
//     const message = error?.response?.data?.message || 'Payment verification failed';
//     throw new Error(message);
//   }
// };

// export const handlePaymentFailure = async (paymentId: string, reason: string) => {
//   try {
//     const response = await ApiClient.post('/bookings/payment-failure', {
//       paymentId,
//       reason,
//     });
//     return response.data.data;
//   } catch (error: any) {
//     console.error('Payment failure handling error:', error);
//   }
// };

import ApiClient from "@/lib/apiClient";
import type {
  CreateBookingWithPaymentRequest,
  BookingWithPaymentResponse,
  ApiResponse
} from "@/domain/entities";

export const createBookingWithPayment = async (
  data: CreateBookingWithPaymentRequest
): Promise<BookingWithPaymentResponse> => {
  try {
    const response = await ApiClient.post<ApiResponse<BookingWithPaymentResponse>>('/bookings', data);
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

export const verifyPayment = async (paymentData: {
  paymentId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<BookingWithPaymentResponse> => {
  try {
    const response = await ApiClient.post<ApiResponse<BookingWithPaymentResponse>>('/bookings/verify-payment', paymentData);
    return response.data.data;
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Payment verification failed';
    throw new Error(message);
  }
};

export const handlePaymentFailure = async (paymentId: string, reason: string): Promise<void> => {
  try {
    await ApiClient.post('/bookings/payment-failure', {
      paymentId,
      reason,
    });
  } catch (error: unknown) {
    console.error('Payment failure handling error:', error);
  }
};