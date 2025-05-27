import Sidebar from '@/components/Common/Sidebar';
import ProtectedRoute from '@/components/Common/ProtectedRoute';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['user']} requireEmailVerification={true}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="user" />
        <div className="flex-1 lg:ml-0 ml-16 overflow-auto">
          <main className="h-full">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}