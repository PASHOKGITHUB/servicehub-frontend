import { Metadata } from 'next';
import UserNotifications from '@/components/User/Notifications';
import ProtectedRoute from '@/components/Common/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Notifications - ServiceHub',
  description: 'Stay updated with booking confirmations and platform updates',
};

export default function UserNotificationsPage() {
  return (
    <ProtectedRoute allowedRoles={['user']} requireEmailVerification={true}>
      <UserNotifications />
    </ProtectedRoute>
  );
}