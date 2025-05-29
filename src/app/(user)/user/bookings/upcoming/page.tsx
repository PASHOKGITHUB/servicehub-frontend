import { Metadata } from 'next';
import UpcomingBookings from '@/components/User/Bookings/Upcoming';
import ProtectedRoute from '@/components/Common/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Upcoming Bookings - ServiceHub',
  description: 'Manage your scheduled services and appointments',
};

export default function UpcomingBookingsPage() {
  return (
    <ProtectedRoute allowedRoles={['user']} requireEmailVerification={true}>
      <UpcomingBookings />
    </ProtectedRoute>
  );
}