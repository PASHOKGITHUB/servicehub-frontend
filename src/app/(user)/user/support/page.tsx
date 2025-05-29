import { Metadata } from 'next';
import UserSupport from '@/components/User/Support';
import ProtectedRoute from '@/components/Common/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Support - ServiceHub',
  description: 'Get help and contact customer support',
};

export default function UserSupportPage() {
  return (
    <ProtectedRoute allowedRoles={['user']} requireEmailVerification={true}>
      <UserSupport />
    </ProtectedRoute>
  );
}