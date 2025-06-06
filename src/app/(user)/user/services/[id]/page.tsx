import { Metadata } from 'next';
import ServiceDetails from '@/components/User/ServiceDetails';
import ProtectedRoute from '@/components/Common/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Service Details - ServiceHub',
  description: 'View service details and book your appointment',
};

interface ServiceDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ServiceDetailsPage({ params }: ServiceDetailsPageProps) {
  // Await the params before using
  const { id } = await params;
  
  return (
    <ProtectedRoute allowedRoles={['user']} requireEmailVerification={true}>
      <ServiceDetails serviceId={id} />
    </ProtectedRoute>
  );
}