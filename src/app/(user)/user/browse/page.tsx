import { Metadata } from 'next';
import BrowseServices from '@/components/User/Browse';
import ProtectedRoute from '@/components/Common/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Browse Services - ServiceHub',
  description: 'Discover trusted professionals and services in your area',
};

export default function BrowseServicesPage() {
  return (
    <ProtectedRoute allowedRoles={['user']} requireEmailVerification={true}>
      <BrowseServices />
    </ProtectedRoute>
  );
}