'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  CreditCard, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const PlatformManagementCard = () => {
  const router = useRouter();

  return (
    <Card className="mt-6 sm:mt-8 bg-white border border-gray-200 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-gray-900 text-lg sm:text-xl">Platform Management</CardTitle>
        <CardDescription className="text-gray-600 text-sm sm:text-base">
          Quick access to key management functions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Button 
            onClick={() => router.push('/admin/users')}
            className="h-16 sm:h-20 bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8] hover:from-[#16A8B8] hover:to-[#128A96] text-white flex flex-col items-center justify-center space-y-1 sm:space-y-2 rounded-2xl"
          >
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs sm:text-sm">User Management</span>
          </Button>
          <Button 
            variant="outline"
            onClick={() => router.push('/admin/providers')}
            className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white rounded-2xl"
          >
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs sm:text-sm">Provider Management</span>
          </Button>
          <Button 
            variant="outline"
            onClick={() => router.push('/admin/reports')}
            className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white rounded-2xl"
          >
            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs sm:text-sm">Analytics</span>
          </Button>
          <Button 
            variant="outline"
            onClick={() => router.push('/admin/settings')}
            className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white rounded-2xl"
          >
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs sm:text-sm">Platform Settings</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformManagementCard;