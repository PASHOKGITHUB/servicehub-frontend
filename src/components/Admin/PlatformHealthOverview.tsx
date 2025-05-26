'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle,
  Calendar,
  Star
} from 'lucide-react';

const PlatformHealthOverview = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
      <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg text-gray-900">System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 text-sm sm:text-base">Overall Status</span>
            <Badge className="bg-green-100 text-green-700 text-xs sm:text-sm">
              <CheckCircle className="w-3 h-3 mr-1" />
              Healthy
            </Badge>
          </div>
          <div className="mt-2 text-xs sm:text-sm text-gray-500">
            All systems operational
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg text-gray-900">Average Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-xl sm:text-2xl font-bold text-gray-900">4.8</span>
            <div className="flex items-center">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs sm:text-sm text-gray-500 ml-1">Platform wide</span>
            </div>
          </div>
          <div className="mt-2 text-xs sm:text-sm text-green-600">
            +0.2 from last month
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl sm:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg text-gray-900">Active Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-xl sm:text-2xl font-bold text-gray-900">342</span>
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#1EC6D9]" />
          </div>
          <div className="mt-2 text-xs sm:text-sm text-[#1EC6D9]">
            +18% from yesterday
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformHealthOverview;