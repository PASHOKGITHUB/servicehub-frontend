import { Metadata } from 'next';
import ServiceDetails from '@/components/User/ServiceDetails';
import ProtectedRoute from '@/components/Common/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Service Details - ServiceHub',
  description: 'View service details and book your appointment',
};

interface ServiceDetailsPageProps {
  params: {
    id: string;
  };
}

export default function ServiceDetailsPage({ params }: ServiceDetailsPageProps) {
  return (
    <ProtectedRoute allowedRoles={['user']} requireEmailVerification={true}>
      <ServiceDetails serviceId={params.id} />
    </ProtectedRoute>
  );
}