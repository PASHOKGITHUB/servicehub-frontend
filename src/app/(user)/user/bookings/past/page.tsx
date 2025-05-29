import { Metadata } from 'next';
import PastBookings from '@/components/User/Bookings/Past';
import ProtectedRoute from '@/components/Common/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Past Bookings - ServiceHub',
  description: 'View your booking history and leave reviews',
};

export default function PastBookingsPage() {
  return (
    <ProtectedRoute allowedRoles={['user']} requireEmailVerification={true}>
      <PastBookings />
    </ProtectedRoute>
  );
}