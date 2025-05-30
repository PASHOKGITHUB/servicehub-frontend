'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  CreditCard, 
  TrendingUp,
  DollarSign,
  Calendar,
  Download,
  Wallet,
  ArrowUpRight
} from 'lucide-react';
import { useProviderDashboard } from '@/hooks/useProviderQueries';
import { toast } from 'sonner';

// Import existing types
import type { ProviderDashboardData } from '@/domain/entities/Provider/Provider';

// Transaction interface for mock data
interface Transaction {
  id: number;
  service: string;
  customer: string;
  amount: number;
  date: string;
  status: string;
}

const Earnings: React.FC = () => {
  const { data: dashboardData, isLoading } = useProviderDashboard() as {
    data?: ProviderDashboardData;
    isLoading: boolean;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleRequestPayout = (): void => {
    toast.info('Payout request feature coming soon');
  };

  const handleDownloadReport = (): void => {
    toast.info('Download report feature coming soon');
  };

  // Mock data for demonstration
  const recentTransactions: Transaction[] = [
    {
      id: 1,
      service: 'Home Cleaning Service',
      customer: 'Priya Sharma',
      amount: 500,
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: 2,
      service: 'AC Repair',
      customer: 'Rajesh Kumar',
      amount: 800,
      date: '2024-01-14',
      status: 'completed'
    },
    {
      id: 3,
      service: 'Plumbing Service',
      customer: 'Anita Patel',
      amount: 300,
      date: '2024-01-13',
      status: 'completed'
    }
  ];

  // Extract earnings data with proper fallbacks
  const totalEarnings = dashboardData?.earnings?.total || 45000;
  const monthlyEarnings = dashboardData?.earnings?.monthly || 8500;
  
  // Calculate available balance (could be a percentage of monthly earnings or based on business logic)
  const availableBalance = Math.round(monthlyEarnings * 0.4) || 3200; // Assume 40% of monthly is available
  
  // Calculate average per service
  const completedBookings = dashboardData?.bookings?.completed || 75;
  const averagePerService = completedBookings > 0 ? Math.round(totalEarnings / completedBookings) : 600;

  // Calculate success rate
  const totalBookings = dashboardData?.bookings?.total || 0;
  const successRate = totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 95;

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Earnings
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Track your income and manage payouts
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleDownloadReport}
              className="border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button
              onClick={handleRequestPayout}
              className="bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8] hover:from-[#16A8B8] hover:to-[#128A96] text-white"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Request Payout
            </Button>
          </div>
        </div>
      </div>

      {/* Earnings Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg rounded-2xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm font-medium">Total Earnings</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {formatCurrency(totalEarnings)}
                </p>
                <div className="flex items-center mt-2 text-xs text-green-200">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>+12% from last month</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-400 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg rounded-2xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm font-medium">This Month</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {formatCurrency(monthlyEarnings)}
                </p>
                <div className="flex items-center mt-2 text-xs text-blue-200">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{completedBookings} services completed</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-400 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg rounded-2xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs sm:text-sm font-medium">Available Balance</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {formatCurrency(availableBalance)}
                </p>
                <div className="flex items-center mt-2 text-xs text-purple-200">
                  <Wallet className="w-3 h-3 mr-1" />
                  <span>Ready for payout</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-400 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg rounded-2xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-xs sm:text-sm font-medium">Avg. per Service</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {formatCurrency(averagePerService)}
                </p>
                <div className="flex items-center mt-2 text-xs text-orange-200">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  <span>+5% from last month</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-400 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        {/* Recent Transactions */}
        <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Recent Transactions</CardTitle>
            <CardDescription className="text-sm sm:text-base">Your latest completed services and earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction: Transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{transaction.service}</p>
                      <p className="text-xs text-gray-500">{transaction.customer}</p>
                      <p className="text-xs text-gray-400">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">+{formatCurrency(transaction.amount)}</p>
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      Completed
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Earnings Breakdown */}
        <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Earnings Breakdown</CardTitle>
            <CardDescription className="text-sm sm:text-base">Monthly performance analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-blue-900">Services Completed</p>
                  <p className="text-2xl font-bold text-blue-700">{completedBookings}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-green-900">Success Rate</p>
                  <p className="text-2xl font-bold text-green-700">
                    {successRate}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-purple-900">Customer Rating</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {dashboardData?.rating?.average?.toFixed(1) || '4.8'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payout Information */}
      <Card className="mt-6 sm:mt-8 bg-white border border-gray-200 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Payout Information</CardTitle>
          <CardDescription className="text-sm sm:text-base">How and when you get paid</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Weekly Payouts</h3>
              <p className="text-sm text-gray-600">Earnings are transferred every Friday for the previous week&apos;s completed services.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Minimum Payout</h3>
              <p className="text-sm text-gray-600">Minimum balance of ₹500 required to request a payout to your bank account.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Processing Time</h3>
              <p className="text-sm text-gray-600">Bank transfers typically take 1-3 business days to reflect in your account.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Earnings;