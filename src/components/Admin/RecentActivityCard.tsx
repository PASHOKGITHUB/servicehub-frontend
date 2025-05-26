'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface Activity {
  type: string;
  message: string;
  time: string;
  status: string;
}

const RecentActivityCard = () => {
  const router = useRouter();

  const recentActivities: Activity[] = [
    {
      type: "user_signup",
      message: "New user registration: Rajesh Kumar",
      time: "2 minutes ago",
      status: "info"
    },
    {
      type: "provider_approval",
      message: "Provider approved: Sharma's Cleaning Services",
      time: "15 minutes ago",
      status: "success"
    },
    {
      type: "payment_issue",
      message: "Payment dispute reported - Booking #1234",
      time: "1 hour ago",
      status: "warning"
    },
    {
      type: "service_completed",
      message: "High-value service completed: ₹2,500",
      time: "2 hours ago",
      status: "success"
    }
  ];

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-900 space-y-2 sm:space-y-0">
          <span className="text-lg sm:text-xl">Recent Activity</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/admin/activity')}
            className="border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white rounded-full w-full sm:w-auto"
          >
            View All
          </Button>
        </CardTitle>
        <CardDescription className="text-gray-600 text-sm sm:text-base">
          Latest platform activities and events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full mt-2 ${getActivityStatusColor(activity.status)}`}></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 break-words">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;