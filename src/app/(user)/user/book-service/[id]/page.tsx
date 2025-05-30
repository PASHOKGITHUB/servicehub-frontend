import { Metadata } from 'next';
import BookService from '@/components/User/BookService';
import ProtectedRoute from '@/components/Common/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Book Service - ServiceHub',
  description: 'Complete your service booking with secure payment',
};

interface BookServicePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BookServicePage({ params }: BookServicePageProps) {
  // Await the params before using
  const { id } = await params;
  
  return (
    <ProtectedRoute allowedRoles={['user']} requireEmailVerification={true}>
      <BookService serviceId={id} />
    </ProtectedRoute>
  );
}