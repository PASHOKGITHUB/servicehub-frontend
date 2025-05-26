'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

interface PendingApproval {
  type: string;
  name: string;
  submitted: string;
  priority: string;
}

const PendingApprovalsCard = () => {
  const router = useRouter();

  const pendingApprovals: PendingApproval[] = [
    {
      type: "Provider Application",
      name: "Mishra's Handyman Services",
      submitted: "2 days ago",
      priority: "high"
    },
    {
      type: "Service Addition",
      name: "Premium Car Wash - Delhi",
      submitted: "1 day ago",
      priority: "medium"
    },
    {
      type: "Profile Update",
      name: "Priya's Pet Care - Mumbai",
      submitted: "3 hours ago",
      priority: "low"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-900 space-y-2 sm:space-y-0">
          <span className="text-lg sm:text-xl">Pending Approvals</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/admin/approvals')}
            className="border-2 border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white rounded-full w-full sm:w-auto"
          >
            View All
          </Button>
        </CardTitle>
        <CardDescription className="text-gray-600 text-sm sm:text-base">
          Items requiring admin approval
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {pendingApprovals.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200 space-y-3 sm:space-y-0">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-sm text-gray-600">{item.type}</p>
                <p className="text-xs text-gray-500">Submitted {item.submitted}</p>
              </div>
              <div className="flex flex-col sm:items-end space-y-2">
                <Badge className={`${getPriorityColor(item.priority)} text-xs`}>
                  {item.priority} priority
                </Badge>
                <div className="flex space-x-2 w-full sm:w-auto">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 rounded-full flex-1 sm:flex-initial">
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full flex-1 sm:flex-initial">
                    Review
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingApprovalsCard;