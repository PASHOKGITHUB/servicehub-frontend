'use client';

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

const UserDashboard = () => {
  const router = useRouter();
  const { data: dashboard, isLoading, error } = useUserDashboard();

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

  const getStatusColor = (status: string) => {
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

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg p-6 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-blue-100">Manage your bookings and discover new services</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Bookings</CardTitle>
              <CardDescription>Your latest service bookings</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/user/bookings')}
              className="text-primary hover:text-primary/80"
            >
              <Eye className="w-4 h-4 mr-1" />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {dashboard?.recentBookings?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No bookings yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/user/browse')}
                  className="mt-2"
                >
                  Browse Services
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboard?.recentBookings?.slice(0, 3).map((booking) => (
                  <div key={booking._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{booking.service.name}</h4>
                      <p className="text-xs text-gray-600">by {booking.provider.name}</p>
                      <p className="text-xs text-gray-500">{formatDate(booking.bookingDate)}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(booking.status)} variant="secondary">
                        {booking.status}
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Favorite Categories</CardTitle>
            <CardDescription>Services you book most often</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboard?.favoriteCategories?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No favorites yet</p>
                <p className="text-sm">Book services to see your preferences</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboard?.favoriteCategories?.map((category) => (
                  <div key={category._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-lg">{category.categoryData.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{category.categoryData.name}</h4>
                        <p className="text-xs text-gray-500">{category.count} bookings</p>
                      </div>
                    </div>
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Popular actions to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              onClick={() => router.push('/user/browse')}
              className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white justify-between"
            >
              <span>Browse Services</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/user/bookings/upcoming')}
              className="justify-between"
            >
              <span>View Bookings</span>
              <Calendar className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/user/reviews')}
              className="justify-between"
            >
              <span>My Reviews</span>
              <Star className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DashboardSkeleton = () => (
  <div className="p-4 sm:p-6 space-y-6">
    <Skeleton className="h-32 w-full rounded-lg" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </CardHeader>
        </Card>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default UserDashboard;