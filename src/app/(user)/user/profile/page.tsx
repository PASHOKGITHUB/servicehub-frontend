import { Metadata } from 'next';
import UserProfile from '@/components/User/Profile';
import ProtectedRoute from '@/components/Common/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Profile - ServiceHub',
  description: 'Manage your account information and preferences',
};

export default function UserProfilePage() {
  return (
    <ProtectedRoute allowedRoles={['user']} requireEmailVerification={true}>
      <UserProfile />
    </ProtectedRoute>
  );
}