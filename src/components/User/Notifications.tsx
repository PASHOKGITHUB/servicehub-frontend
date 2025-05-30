'use client';

import { Card, CardContent} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

const UserNotifications = () => {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
        <p className="text-gray-600">Stay updated with booking confirmations and platform updates</p>
      </div>

      <Card>
        <CardContent className="p-8 text-center">
          <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">Notification System Coming Soon</h3>
          <p className="text-gray-600 mb-4">
            Real-time notifications are under development
          </p>
          <Button variant="outline">
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserNotifications;