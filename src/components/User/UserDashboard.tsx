'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Calendar, 
  Star, 
  TrendingUp,   
  Eye,
  ArrowRight
} from 'lucide-react';
import { useUserDashboard } from '@/hooks/useUserQueries';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { useRouter } from 'next/navigation';

// Define proper interfaces for the component
interface UserBooking {
  _id: string;
  service: {
    name: string;
  };
  provider: {
    name: string;
  };
  bookingDate: string;
  status: string;
  totalAmount: number;
}

interface FavoriteCategory {
  _id: string;
  count: number;
  categoryData: {
    name: string;
    icon: string;
  };
}

// Extended interface for dashboard data with optional properties
interface UserDashboardData {
  recentBookings?: UserBooking[];
  favoriteCategories?: FavoriteCategory[];
  totalBookings?: number;
  totalSpent?: number;
  memberSince?: string;
  rewardsPoints?: number;
}

const UserDashboard: React.FC = () => {
  const router = useRouter();
  const { data: dashboard, isLoading, error } = useUserDashboard() as {
    data?: UserDashboardData;
    isLoading: boolean;
    error: unknown;
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Failed to load dashboard data</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleNavigateToServices = (): void => {
    router.push('/user/browse');
  };

  const handleNavigateToBookings = (): void => {
    router.push('/user/bookings');
  };

  const handleNavigateToUpcomingBookings = (): void => {
    router.push('/user/bookings/upcoming');
  };

  const handleNavigateToReviews = (): void => {
    router.push('/user/reviews');
  };

  // Safe access to dashboard data with fallbacks
  const recentBookings = dashboard?.recentBookings || [];
  const favoriteCategories = dashboard?.favoriteCategories || [];

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8] rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-blue-100">Manage your bookings and discover new services</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card className="border border-gray-200 shadow-lg rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Bookings</CardTitle>
              <CardDescription>Your latest service bookings</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNavigateToBookings}
              className="text-[#1EC6D9] hover:text-[#16A8B8] hover:bg-cyan-50"
            >
              <Eye className="w-4 h-4 mr-1" />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="mb-2">No bookings yet</p>
                <p className="text-sm text-gray-400 mb-4">Start by browsing our services</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNavigateToServices}
                  className="border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white"
                >
                  Browse Services
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentBookings.slice(0, 3).map((booking: UserBooking) => (
                  <div key={booking._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{booking.service.name}</h4>
                      <p className="text-xs text-gray-600">by {booking.provider.name}</p>
                      <p className="text-xs text-gray-500">{formatDate(booking.bookingDate)}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(booking.status)} variant="secondary">
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                      <div className="text-sm font-medium mt-1">
                        {formatCurrency(booking.totalAmount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Favorite Categories */}
        <Card className="border border-gray-200 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Favorite Categories</CardTitle>
            <CardDescription>Services you book most often</CardDescription>
          </CardHeader>
          <CardContent>
            {favoriteCategories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="mb-1">No favorites yet</p>
                <p className="text-sm text-gray-400">Book services to see your preferences</p>
              </div>
            ) : (
              <div className="space-y-4">
                {favoriteCategories.map((category: FavoriteCategory) => (
                  <div key={category._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#1EC6D9]/10 rounded-full flex items-center justify-center">
                        <span className="text-lg">{category.categoryData.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{category.categoryData.name}</h4>
                        <p className="text-xs text-gray-500">{category.count} bookings</p>
                      </div>
                    </div>
                    <TrendingUp className="w-4 h-4 text-[#1EC6D9]" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border border-gray-200 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Popular actions to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              onClick={handleNavigateToServices}
              className="bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8] hover:from-[#16A8B8] hover:to-[#128A96] text-white justify-between h-12 rounded-xl"
            >
              <span>Browse Services</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={handleNavigateToUpcomingBookings}
              className="justify-between h-12 rounded-xl border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white"
            >
              <span>View Bookings</span>
              <Calendar className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={handleNavigateToReviews}
              className="justify-between h-12 rounded-xl border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white"
            >
              <span>My Reviews</span>
              <Star className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Optional: Future Features - Only show if data exists */}
      {dashboard && (dashboard.totalBookings !== undefined || dashboard.totalSpent !== undefined || dashboard.rewardsPoints !== undefined || dashboard.memberSince) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboard.totalBookings !== undefined && (
            <Card className="border border-gray-200 shadow-sm rounded-2xl">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#1EC6D9]">{dashboard.totalBookings}</div>
                <p className="text-sm text-gray-600">Total Bookings</p>
              </CardContent>
            </Card>
          )}
          
          {dashboard.totalSpent !== undefined && (
            <Card className="border border-gray-200 shadow-sm rounded-2xl">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(dashboard.totalSpent)}</div>
                <p className="text-sm text-gray-600">Total Spent</p>
              </CardContent>
            </Card>
          )}
          
          {dashboard.rewardsPoints !== undefined && (
            <Card className="border border-gray-200 shadow-sm rounded-2xl">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{dashboard.rewardsPoints}</div>
                <p className="text-sm text-gray-600">Reward Points</p>
              </CardContent>
            </Card>
          )}
          
          {dashboard.memberSince && (
            <Card className="border border-gray-200 shadow-sm rounded-2xl">
              <CardContent className="p-4 text-center">
                <div className="text-lg font-bold text-gray-700">{formatDate(dashboard.memberSince)}</div>
                <p className="text-sm text-gray-600">Member Since</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

const DashboardSkeleton: React.FC = () => (
  <div className="p-4 sm:p-6 space-y-6">
    <Skeleton className="h-32 w-full rounded-2xl" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="rounded-2xl">
          <CardHeader className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </CardHeader>
        </Card>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="rounded-2xl">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-2xl">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default UserDashboard;