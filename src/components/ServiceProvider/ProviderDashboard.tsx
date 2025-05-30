'use client';

import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Briefcase, 
  Calendar, 
  CreditCard, 
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import { useProviderDashboard } from '@/hooks/useProviderQueries';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Import existing type definitions
import type { 
  ProviderDashboardData,
  ProviderBooking
} from '@/domain/entities/Provider/Provider';

// Additional type for auth store user
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

const ProviderDashboard = () => {
  const { user } = useAuthStore() as { user: User | null };
  const router = useRouter();
  const { data: dashboardData, isLoading, error } = useProviderDashboard() as {
    data?: ProviderDashboardData;
    isLoading: boolean;
    error: unknown;
  };

  if (!user) {
    return null;
  }

  const handleNavigate = (path: string): void => {
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

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getBookingStatusColor = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const calculateCompletionRate = (): number => {
    if (!dashboardData?.bookings?.total || !dashboardData?.bookings?.completed) {
      return 0;
    }
    return Math.round((dashboardData.bookings.completed / dashboardData.bookings.total) * 100);
  };

  const calculateAverageEarningsPerService = (): number => {
    if (!dashboardData?.earnings?.total || !dashboardData?.bookings?.completed) {
      return 0;
    }
    return dashboardData.earnings.total / dashboardData.bookings.completed;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Provider Dashboard
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Welcome back, {user.name}! Here&apos;s your business overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg rounded-2xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm font-medium">My Services</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {dashboardData?.services?.total || 0}
                </p>
                <div className="flex items-center mt-2 text-xs text-blue-200">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>Active: {dashboardData?.services?.active || 0}</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-400 rounded-full flex items-center justify-center">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg rounded-2xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm font-medium">Total Bookings</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {dashboardData?.bookings?.total?.toLocaleString() || 0}
                </p>
                <div className="flex items-center mt-2 text-xs">
                  <span className="text-yellow-200 mr-2">
                    Pending: {dashboardData?.bookings?.pending || 0}
                  </span>
                  <span className="text-green-200">
                    Done: {dashboardData?.bookings?.completed || 0}
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-400 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg rounded-2xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs sm:text-sm font-medium">Total Earnings</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {formatCurrency(dashboardData?.earnings?.total || 0)}
                </p>
                <div className="flex items-center mt-2 text-xs text-purple-200">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>This month: {formatCurrency(dashboardData?.earnings?.monthly || 0)}</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-400 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg rounded-2xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-xs sm:text-sm font-medium">Average Rating</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {dashboardData?.rating?.average?.toFixed(1) || '0.0'}
                </p>
                <div className="flex items-center mt-2 text-xs text-yellow-200">
                  <Star className="w-3 h-3 mr-1" />
                  <span>{dashboardData?.rating?.totalReviews || 0} Reviews</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        {/* Recent Bookings */}
        <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <span className="text-lg sm:text-xl">Recent Bookings</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleNavigate('/provider/bookings')}
                className="border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white w-full sm:w-auto"
              >
                View All
              </Button>
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">Latest booking requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {dashboardData?.recentBookings && dashboardData.recentBookings.length > 0 ? (
                dashboardData.recentBookings.slice(0, 3).map((booking: ProviderBooking) => (
                  <div key={booking._id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm sm:text-base">{booking.service?.name}</p>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">{booking.customer?.name}</p>
                        <p className="text-xs text-gray-400">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Badge className={getBookingStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No recent bookings</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
            <CardDescription className="text-sm sm:text-base">Manage your business efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Button 
                onClick={() => handleNavigate('/provider/services')}
                className="h-16 sm:h-20 bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8] hover:from-[#16A8B8] hover:to-[#128A96] text-white flex flex-col items-center justify-center space-y-1 sm:space-y-2 rounded-2xl"
              >
                <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-xs sm:text-sm">Add Service</span>
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => handleNavigate('/provider/bookings/pending')}
                className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white rounded-2xl"
              >
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-xs sm:text-sm">Pending Requests</span>
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => handleNavigate('/provider/earnings')}
                className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white rounded-2xl"
              >
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-xs sm:text-sm">View Earnings</span>
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => handleNavigate('/provider/reviews')}
                className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white rounded-2xl"
              >
                <Star className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-xs sm:text-sm">Reviews</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card className="mt-6 sm:mt-8 bg-white border border-gray-200 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Performance Summary</CardTitle>
          <CardDescription className="text-sm sm:text-base">Your business metrics at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {calculateCompletionRate()}%
              </h3>
              <p className="text-gray-600">Completion Rate</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {dashboardData?.rating?.average?.toFixed(1) || '0.0'}
              </h3>
              <p className="text-gray-600">Average Rating</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatCurrency(calculateAverageEarningsPerService())}
              </h3>
              <p className="text-gray-600">Avg. per Service</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderDashboard;