'use client';

import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  AlertCircle,
  IndianRupee,
  CheckCircle
} from 'lucide-react';

const AdminStatsCards = () => {
  const platformStats = [
    { label: "Total Users", value: "12,543", change: "+8.2%", trend: "up", icon: Users },
    { label: "Active Providers", value: "1,284", change: "+12.1%", trend: "up", icon: CheckCircle },
    { label: "Monthly Revenue", value: "₹45,230", change: "+15.3%", trend: "up", icon: IndianRupee },
    { label: "Pending Issues", value: "23", change: "-5.2%", trend: "down", icon: AlertCircle }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {platformStats.map((stat, index) => (
        <Card key={index} className="bg-gradient-to-r from-[#181A1B] to-[#2A2D2E] text-white border border-gray-700 shadow-lg rounded-2xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-xs sm:text-sm font-medium">{stat.label}</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{stat.value}</p>
                <p className={`text-xs sm:text-sm ${stat.trend === 'up' ? 'text-green-400' : 'text-orange-400'}`}>
                  {stat.change} from last {stat.label === 'Pending Issues' ? 'week' : 'month'}
                </p>
              </div>
              <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#1EC6D9]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStatsCards;
