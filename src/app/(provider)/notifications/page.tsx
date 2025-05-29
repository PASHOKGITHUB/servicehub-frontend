import { Card, CardContent } from '@/components/ui/card';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Notifications
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Stay updated with important alerts and messages
        </p>
      </div>
      
      <Card className="border border-gray-200 shadow-sm rounded-2xl">
        <CardContent className="p-12 text-center">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-600">You&apos;re all caught up! New notifications will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}