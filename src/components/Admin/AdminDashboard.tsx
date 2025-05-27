// src/components/Admin/AdminDashboard.tsx - FIXED (Remove useAuth)
'use client';

import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  CreditCard, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { user } = useAuthStore(); // ✅ Only use store, not useAuth hook

  // ProtectedRoute already handles loading and auth checks
  if (!user) {
    return null;
  }

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
      type: "Dispute Resolved",
      description: "Customer complaint #1234 resolved",
      time: "4 hours ago",
      status: "success"
    },
    {
      id: 3,
      type: "Payment Issue",
      description: "Failed payment for booking #5678",
      time: "6 hours ago",
      status: "warning"
    }
  ];

  const pendingApprovals = [
    {
      id: 1,
      type: "Provider Application",
      name: "Beauty Salon Mumbai",
      category: "Beauty Services",
      submitted: "Today"
    },
    {
      id: 2,
      type: "Service Verification",
      name: "Tech Repair Solutions",
      category: "Electronics",
      submitted: "Yesterday"
    },
    {
      id: 3,
      type: "Payout Request",
      name: "Home Cleaning Pro",
      category: "Cleaning",
      submitted: "2 days ago"
    }
  ];

  const handleDevelopmentClick = () => {
    toast.info('This feature is under development');
  };

  return (
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="bg-gradient-to-r from-[#181A1B] to-[#2A2D2E] text-white border border-gray-700 shadow-lg rounded-2xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-xs sm:text-sm font-medium">Total Users</p>
                <p className="text-2xl sm:text-3xl font-bold">12,847</p>
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
                <p className="text-2xl sm:text-3xl font-bold">1,573</p>
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
                <p className="text-2xl sm:text-3xl font-bold">8,492</p>
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
                <p className="text-gray-300 text-xs sm:text-sm font-medium">Revenue</p>
                <p className="text-2xl sm:text-3xl font-bold">₹2.4L</p>
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
                onClick={handleDevelopmentClick}
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
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.status === 'success' ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      {activity.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                      )}
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

        {/* Pending Approvals */}
        <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <span className="text-lg sm:text-xl">Pending Approvals</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDevelopmentClick}
                className="border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white w-full sm:w-auto"
              >
                View All
              </Button>
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">Items requiring admin approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="p-3 sm:p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{approval.name}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{approval.type}</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-700 text-xs self-start sm:self-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-600 mb-3 space-y-1 sm:space-y-0">
                    <span>Category: {approval.category}</span>
                    <span>Submitted: {approval.submitted}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8] hover:from-[#16A8B8] hover:to-[#128A96] text-white border-0 rounded-full">
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 border-2 border-gray-300 text-gray-600 hover:bg-gray-100 rounded-full">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
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
              onClick={handleDevelopmentClick}
              className="h-16 sm:h-20 bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8] hover:from-[#16A8B8] hover:to-[#128A96] text-white flex flex-col items-center justify-center space-y-1 sm:space-y-2 rounded-2xl"
            >
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm">User Management</span>
            </Button>
            <Button 
              variant="outline"
              onClick={handleDevelopmentClick}
              className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white rounded-2xl"
            >
              <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm">Provider Approval</span>
            </Button>
            <Button 
              variant="outline"
              onClick={handleDevelopmentClick}
              className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white rounded-2xl"
            >
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm">Analytics</span>
            </Button>
            <Button 
              variant="outline"
              onClick={handleDevelopmentClick}
              className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white rounded-2xl"
            >
              <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm">System Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;