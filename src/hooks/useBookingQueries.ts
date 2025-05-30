import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createBookingWithPayment,
  verifyPayment,
  handlePaymentFailure,
} from '@/instance/Booking';
import { toast } from 'sonner';

export const useCreateBookingWithPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBookingWithPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'bookings'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'bookings'] });
      toast.success('Payment verified successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useHandlePaymentFailure = () => {
  return useMutation({
    mutationFn: ({ paymentId, reason }: { paymentId: string; reason: string }) =>
      handlePaymentFailure(paymentId, reason),
  });
};