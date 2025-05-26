// src/components/ServiceProvider/ProviderDashboard.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/Common/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  CreditCard, 
  Star, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  IndianRupee,
  Briefcase,
  Bell
} from 'lucide-react';

const ProviderDashboard = () => {
  const router = useRouter();
  const { user, isLoading } = useAuth(true, ['provider']);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // useAuth will handle redirect
  }
  const pendingBookings = [
    {
      id: 1,
      service: "Home Cleaning",
      customer: "Rahul Kumar",
      date: "Today, 2:00 PM",
      price: "₹1,500",
      duration: "3 hours"
    },
    {
      id: 2,
      service: "Deep Cleaning",
      customer: "Priya Sharma",
      date: "Tomorrow, 10:00 AM",
      price: "₹2,200",
      duration: "4 hours"
    },
    {
      id: 3,
      service: "Office Cleaning",
      customer: "Tech Solutions Ltd",
      date: "Friday, 6:00 PM",
      price: "₹2,800",
      duration: "5 hours"
    }
  ];

  const recentEarnings = [
    { date: "Today", amount: "₹4,500", jobs: 3 },
    { date: "Yesterday", amount: "₹3,200", jobs: 2 },
    { date: "2 days ago", amount: "₹5,800", jobs: 4 },
    { date: "3 days ago", amount: "₹2,700", jobs: 2 }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar role="provider" />
      
      <div className="flex-1 lg:ml-0 ml-16">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#202020] mb-2">
              Welcome back, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage your services and track your earnings.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="bg-gradient-to-r from-[#181A1B] to-[#2A2D2E] text-white border border-gray-700 shadow-lg rounded-2xl">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-xs sm:text-sm font-medium">Today's Earnings</p>
                    <p className="text-2xl sm:text-3xl font-bold">₹4,500</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#1EC6D9] to-[#16A8B8] rounded-full flex items-center justify-center">
                    <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-[#181A1B] to-[#2A2D2E] text-white border border-gray-700 shadow-lg rounded-2xl">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-xs sm:text-sm font-medium">Pending Requests</p>
                    <p className="text-2xl sm:text-3xl font-bold">8</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#1EC6D9] to-[#16A8B8] rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-[#181A1B] to-[#2A2D2E] text-white border border-gray-700 shadow-lg rounded-2xl">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-xs sm:text-sm font-medium">Completed Jobs</p>
                    <p className="text-2xl sm:text-3xl font-bold">142</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#1EC6D9] to-[#16A8B8] rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-[#181A1B] to-[#2A2D2E] text-white border border-gray-700 shadow-lg rounded-2xl">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-xs sm:text-sm font-medium">Rating</p>
                    <p className="text-2xl sm:text-3xl font-bold">4.9</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#1EC6D9] to-[#16A8B8] rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
            {/* Pending Booking Requests */}
            <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-[#202020] space-y-2 sm:space-y-0">
                  <span className="text-lg sm:text-xl">Pending Requests</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push('/provider/bookings/pending')}
                    className="border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white rounded-full w-full sm:w-auto"
                  >
                    View All
                  </Button>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  New booking requests awaiting your response
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {pendingBookings.map((booking) => (
                    <div key={booking.id} className="p-3 sm:p-4 bg-gray-50 rounded-2xl border border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-[#202020] text-sm sm:text-base truncate">{booking.service}</p>
                          <p className="text-xs sm:text-sm text-gray-600">Customer: {booking.customer}</p>
                        </div>
                        <Badge className="bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8] text-white border-0 rounded-full text-xs self-start sm:self-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-600 mb-3 space-y-1 sm:space-y-0">
                        <span>{booking.date}</span>
                        <span>{booking.duration}</span>
                        <span className="font-semibold text-green-500">{booking.price}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button size="sm" className="flex-1 bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8] hover:from-[#16A8B8] hover:to-[#128A96] text-white border-0 rounded-full">
                          Accept
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 border-2 border-gray-300 text-gray-600 hover:bg-gray-100 rounded-full">
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Earnings */}
            <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-[#202020] space-y-2 sm:space-y-0">
                  <span className="text-lg sm:text-xl">Recent Earnings</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push('/provider/earnings')}
                    className="border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white rounded-full w-full sm:w-auto"
                  >
                    View All
                  </Button>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Your earnings over the past few days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {recentEarnings.map((earning, index) => (
                    <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-2xl border border-gray-200">
                      <div>
                        <p className="font-medium text-[#202020] text-sm sm:text-base">{earning.date}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{earning.jobs} jobs completed</p>
                      </div>
                      <div className="text-right">
                        <p className="text-base sm:text-lg font-bold text-green-500">{earning.amount}</p>
                        <div className="flex items-center text-xs sm:text-sm text-green-500">
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span>+12%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-6 sm:mt-8 bg-white border border-gray-200 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-[#202020] text-lg sm:text-xl">Quick Actions</CardTitle>
              <CardDescription className="text-sm sm:text-base">Manage your services efficiently</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Button 
                  onClick={() => router.push('/provider/bookings/pending')}
                  className="h-16 sm:h-20 bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8] hover:from-[#16A8B8] hover:to-[#128A96] text-white flex flex-col items-center justify-center space-y-1 sm:space-y-2 border-0 rounded-2xl"
                >
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-xs sm:text-sm">View Requests</span>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/provider/services')}
                  className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white rounded-2xl"
                >
                  <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-xs sm:text-sm">Manage Services</span>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/provider/earnings')}
                  className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white rounded-2xl"
                >
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-xs sm:text-sm">View Earnings</span>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/provider/reviews')}
                  className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white rounded-2xl"
                >
                  <Star className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-xs sm:text-sm">Customer Reviews</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;