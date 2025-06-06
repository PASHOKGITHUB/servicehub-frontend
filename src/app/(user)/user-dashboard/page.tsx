import { Metadata } from 'next';
import UserDashboard from '@/components/User/UserDashboard';
import ProtectedRoute from '@/components/Common/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Dashboard - ServiceHub',
  description: 'Your personal dashboard to manage bookings and discover services',
};

export default function UserDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['user']} requireEmailVerification={true}>
      <UserDashboard />
    </ProtectedRoute>
  );
}