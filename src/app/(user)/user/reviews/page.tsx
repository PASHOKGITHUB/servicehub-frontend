import { Metadata } from 'next';
import UserReviews from '@/components/User/Reviews';
import ProtectedRoute from '@/components/Common/ProtectedRoute';

export const metadata: Metadata = {
  title: 'My Reviews - ServiceHub',
  description: 'Manage your service reviews and feedback',
};

export default function UserReviewsPage() {
  return (
    <ProtectedRoute allowedRoles={['user']} requireEmailVerification={true}>
      <UserReviews />
    </ProtectedRoute>
  );
}