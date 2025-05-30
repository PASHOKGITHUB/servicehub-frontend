'use client';

import { Card, CardContent} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User} from 'lucide-react';

const UserProfile = () => {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Profile</h1>
        <p className="text-gray-600">Manage your account information and preferences</p>
      </div>

      <Card>
        <CardContent className="p-8 text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">Profile Management Coming Soon</h3>
          <p className="text-gray-600 mb-4">
            Complete profile management features are under development
          </p>
          <Button variant="outline">
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;