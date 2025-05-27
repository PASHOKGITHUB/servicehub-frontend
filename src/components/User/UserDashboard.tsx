'use client';

import { useAuthStore } from '@/store/authStore';
import EmailVerificationBanner from '@/components/Common/EmailVerificationBanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  CreditCard, 
  Star, 
  Home, 
  Scissors, 
  ShoppingCart, 
  Heart,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

const UserDashboard = () => {
  const router = useRouter();
  const { user } = useAuthStore();

  // Layout already handles authentication, so no need to check here
  if (!user) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="text-center">
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  const recentBookings = [
    {
      id: 1,
      service: "Home Cleaning",
      provider: "Priya Sharma",
      date: "Today, 2:00 PM",
      status: "upcoming",
      icon: Home
    },
    {
      id: 2,
      service: "Hair Cut & Styling",
      provider: "Ravi's Salon",
      date: "Yesterday",
      status: "completed",
      icon: Scissors
    },
    {
      id: 3,
      service: "Grocery Delivery",
      provider: "FreshMart",
      date: "2 days ago",
      status: "completed",
      icon: ShoppingCart
    }
  ];

  const recommendedServices = [
    {
      name: "Pet Grooming",
      provider: "Pet Care Delhi",
      rating: 4.9,
      price: "₹850",
      icon: Heart
    },
    {
      name: "Home Repair",
      provider: "Fix-It Mumbai",
      rating: 4.8,
      price: "₹300/hr",
      icon: Home
    },
    {
      name: "Beauty Services",
      provider: "Glow Studio Bangalore",
      rating: 4.9,
      price: "₹600",
      icon: Scissors
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleDevelopmentClick = () => {
    toast.info('This feature is under development');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Email Verification Banner */}
      <EmailVerificationBanner />
      
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name.split(' ')[0]}!
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Here's what's happening with your services today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="bg-gradient-to-r from-[#181A1B] to-[#2A2D2E] text-white border border-gray-700 shadow-lg rounded-2xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-xs sm:text-sm font-medium">Total Bookings</p>
                <p className="text-2xl sm:text-3xl font-bold">24</p>
              </div>
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-[#1EC6D9]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-[#181A1B] to-[#2A2D2E] text-white border border-gray-700 shadow-lg rounded-2xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-xs sm:text-sm font-medium">Completed</p>
                <p className="text-2xl sm:text-3xl font-bold">18</p>
              </div>
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-[#1EC6D9]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-[#181A1B] to-[#2A2D2E] text-white border border-gray-700 shadow-lg rounded-2xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-xs sm:text-sm font-medium">Wallet Balance</p>
                <p className="text-2xl sm:text-3xl font-bold">₹2,450</p>
              </div>
              <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-[#1EC6D9]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-[#181A1B] to-[#2A2D2E] text-white border border-gray-700 shadow-lg rounded-2xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-xs sm:text-sm font-medium">Avg. Rating</p>
                <p className="text-2xl sm:text-3xl font-bold">4.8</p>
              </div>
              <Star className="w-6 h-6 sm:w-8 sm:h-8 text-[#1EC6D9]" />
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
                onClick={handleDevelopmentClick}
                className="border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white w-full sm:w-auto"
              >
                View All
              </Button>
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">Your latest service bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8] rounded-full flex items-center justify-center flex-shrink-0">
                      <booking.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{booking.service}</p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{booking.provider}</p>
                      <p className="text-xs text-gray-400">{booking.date}</p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(booking.status)} text-xs flex-shrink-0`}>
                    {getStatusIcon(booking.status)}
                    <span className="ml-1 capitalize hidden sm:inline">{booking.status}</span>
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Services */}
        <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <span className="text-lg sm:text-xl">Recommended for You</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDevelopmentClick}
                className="border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white w-full sm:w-auto"
              >
                Browse All
              </Button>
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">Services you might be interested in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {recommendedServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8] rounded-full flex items-center justify-center flex-shrink-0">
                      <service.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{service.name}</p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{service.provider}</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs sm:text-sm text-gray-600">{service.rating}</span>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-400">•</span>
                        <span className="text-xs sm:text-sm font-medium text-gray-900">{service.price}</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white text-xs flex-shrink-0">
                    Book
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6 sm:mt-8 bg-white border border-gray-200 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
          <CardDescription className="text-sm sm:text-base">Get things done faster</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Button 
              onClick={handleDevelopmentClick}
              className="h-16 sm:h-20 bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8] hover:from-[#16A8B8] hover:to-[#128A96] text-white flex flex-col items-center justify-center space-y-1 sm:space-y-2 rounded-2xl"
            >
              <Home className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm">Book Service</span>
            </Button>
            <Button 
              variant="outline"
              onClick={handleDevelopmentClick}
              className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white rounded-2xl"
            >
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm">View Bookings</span>
            </Button>
            <Button 
              variant="outline"
              onClick={handleDevelopmentClick}
              className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white rounded-2xl"
            >
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm">Manage Wallet</span>
            </Button>
            <Button 
              variant="outline"
              onClick={handleDevelopmentClick}
              className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white rounded-2xl"
            >
              <Star className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm">Leave Review</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;