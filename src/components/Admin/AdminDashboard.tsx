// src/components/Admin/AdminDashboard.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/Common/Sidebar';
import AdminStatsCards from './AdminStatsCards';
import RecentActivityCard from './RecentActivityCard';
import PendingApprovalsCard from './PendingApprovalsCard';
import PlatformManagementCard from './PlatformManagementCard';
import PlatformHealthOverview from './PlatformHealthOverview';

const AdminDashboard = () => {
  const { user } = useAuth(true, ['admin']);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar role="admin" />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0 ml-16"> {/* Adjust margin for mobile sidebar */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Monitor and manage the ServiceHub platform.
            </p>
          </div>

          {/* Stats Overview - Dark themed cards */}
          <AdminStatsCards />

          {/* Activity and Approvals Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Recent Platform Activity */}
            <RecentActivityCard />

            {/* Pending Approvals */}
            <PendingApprovalsCard />
          </div>

          {/* Management Quick Actions */}
          <PlatformManagementCard />

          {/* Platform Health Overview */}
          <PlatformHealthOverview />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;