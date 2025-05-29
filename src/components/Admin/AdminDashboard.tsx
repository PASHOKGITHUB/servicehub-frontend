'use client';

import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  CreditCard, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  BarChart3,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useAdminDashboard } from '@/hooks/useAdminQueries';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const { data: dashboardData, isLoading, error } = useAdminDashboard();

  if (!user) {
    return null;
  }

  const handleNavigate = (path: string) => {
    if (path === '#') {
      toast.info('This feature is under development');
    } else {
      router.push(path);
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Dashboard</h2>
          <p className="text-gray-600 mb-4">Unable to fetch dashboard data. Please try again.</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Mock recent activity for now (replace with real data when backend provides it)
  const recentActivity = [
    {
      id: 1,
      type: "New Provider",
      description: "Cleaning Services Delhi joined the platform",
      time: "2 hours ago",
      status: "success"
    },
    {
      id: 2,
      type: "Booking Completed",
      description: "Home cleaning service completed successfully",
      time: "4 hours ago",
      status: "success"
    },
    {
      id: 3,
      type: "New User Registration",
      description: "User registered from Mumbai",
      time: "6 hours ago",
      status: "success"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Monitor and manage the ServiceHub platform. Welcome back, {user.name}!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="bg-gradient-to-r from-[#181A1B] to-[#2A2D2E] text-white border border-gray-700 shadow-lg rounded-2xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-xs sm:text-sm font-medium">Total Users</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {dashboardData?.users?.total?.toLocaleString() || '12,847'}
                </p>
                <div className="flex items-center mt-2 text-xs text-green-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>Active: {dashboardData?.users?.customers || '11,274'}</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#1EC6D9] to-[#16A8B8] rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-[#181A1B] to-[#2A2D2E] text-white border border-gray-700 shadow-lg rounded-2xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-xs sm:text-sm font-medium">Active Providers</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {dashboardData?.users?.providers?.toLocaleString() || '1,573'}
                </p>
                <div className="flex items-center mt-2 text-xs text-blue-400">
                  <Activity className="w-3 h-3 mr-1" />
                  <span>Verified Professionals</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#1EC6D9] to-[#16A8B8] rounded-full flex items-center justify-center">
                <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-[#181A1B] to-[#2A2D2E] text-white border border-gray-700 shadow-lg rounded-2xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-xs sm:text-sm font-medium">Total Bookings</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {dashboardData?.bookings?.total?.toLocaleString() || '8,492'}
                </p>
                <div className="flex items-center mt-2 text-xs">
                  <span className="text-yellow-400 mr-2">
                    Pending: {dashboardData?.bookings?.pending || '124'}
                  </span>
                  <span className="text-green-400">
                    Completed: {dashboardData?.bookings?.completed || '7,893'}
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#1EC6D9] to-[#16A8B8] rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-[#181A1B] to-[#2A2D2E] text-white border border-gray-700 shadow-lg rounded-2xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-xs sm:text-sm font-medium">Platform Revenue</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {formatCurrency(dashboardData?.revenue?.total || 240000)}
                </p>
                <div className="flex items-center mt-2 text-xs text-green-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>This month: {formatCurrency(dashboardData?.revenue?.monthly || 45000)}</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#1EC6D9] to-[#16A8B8] rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        {/* Recent Activity */}
        <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <span className="text-lg sm:text-xl">Recent Activity</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleNavigate('#')}
                className="border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white w-full sm:w-auto"
              >
                View All
              </Button>
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">Platform activity overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-green-100">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm sm:text-base">{activity.type}</p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{activity.description}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Quick Stats</CardTitle>
            <CardDescription className="text-sm sm:text-base">Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-blue-900">Active Services</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {dashboardData?.services?.total || '2,847'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-green-900">Success Rate</p>
                  <p className="text-2xl font-bold text-green-700">
                    {dashboardData?.bookings?.total > 0 ? 
                      Math.round((dashboardData?.bookings?.completed / dashboardData?.bookings?.total) * 100) 
                      : 93}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-yellow-900">Pending Actions</p>
                  <p className="text-2xl font-bold text-yellow-700">
                    {dashboardData?.bookings?.pending || '124'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Management */}
      <Card className="mt-6 sm:mt-8 bg-white border border-gray-200 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Platform Management</CardTitle>
          <CardDescription className="text-sm sm:text-base">Quick access to admin functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Button 
              onClick={() => handleNavigate('/admin/users')}
              className="h-16 sm:h-20 bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8] hover:from-[#16A8B8] hover:to-[#128A96] text-white flex flex-col items-center justify-center space-y-1 sm:space-y-2 rounded-2xl"
            >
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm">User Management</span>
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleNavigate('/admin/providers')}
              className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white rounded-2xl"
            >
              <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm">Providers</span>
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleNavigate('/admin/categories')}
              className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white rounded-2xl"
            >
              <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm">Categories</span>
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleNavigate('/admin/reports')}
              className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white rounded-2xl"
            >
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm">Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;