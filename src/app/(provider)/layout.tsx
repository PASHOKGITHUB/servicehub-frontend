import Sidebar from '@/components/Common/Sidebar';
import ProtectedRoute from '@/components/Common/ProtectedRoute';

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['provider']} requireEmailVerification={true}>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar role="provider" />
        <div className="flex-1 lg:ml-0 ml-16 overflow-auto">
          <main className="h-full">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}