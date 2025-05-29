'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  Search, 
  MoreHorizontal,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  Shield,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAdminUsers, useUpdateUserStatus } from '@/hooks/useAdminQueries';
import { toast } from 'sonner';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: usersData, isLoading } = useAdminUsers({
    page: currentPage,
    limit: 10,
    role: selectedRole === 'all' ? undefined : selectedRole,
    search: searchTerm || undefined,
    isActive: selectedStatus === 'all' ? undefined : selectedStatus === 'active',
  });

  const updateUserStatusMutation = useUpdateUserStatus();

  const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
    try {
      await updateUserStatusMutation.mutateAsync({
        userId,
        isActive: !currentStatus,
        reason: !currentStatus ? 'Activated by admin' : 'Deactivated by admin'
      });
    } catch (error) {
      console.error('Status update failed:', error);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: 'bg-red-100 text-red-700',
      provider: 'bg-blue-100 text-blue-700',
      user: 'bg-green-100 text-green-700'
    };
    return variants[role as keyof typeof variants] || variants.user;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          User Management
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Manage users and providers across the platform
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6 border border-gray-200 shadow-sm rounded-2xl">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-[#1EC6D9] focus:ring-[#1EC6D9]"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full sm:w-48 border-gray-200">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">Customers</SelectItem>
                <SelectItem value="provider">Providers</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48 border-gray-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
               </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border border-gray-200 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Users ({usersData?.pagination?.count || 0})</span>
          </CardTitle>
          <CardDescription>
            Manage all platform users and their access permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-xl">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {usersData?.users?.map((user: any) => (
                <div key={user._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8] text-white font-semibold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                        <Badge className={getRoleBadge(user.role)}>
                          {user.role}
                        </Badge>
                        {user.isEmailVerified && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <Mail className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Badge variant={user.isActive ? "default" : "secondary"} className={
                      user.isActive 
                        ? "bg-green-100 text-green-700 hover:bg-green-100" 
                        : "bg-red-100 text-red-700 hover:bg-red-100"
                    }>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleStatusToggle(user._id, user.isActive)}
                          disabled={updateUserStatusMutation.isPending}
                          className={user.isActive ? "text-red-600" : "text-green-600"}
                        >
                          {user.isActive ? (
                            <>
                              <UserX className="w-4 h-4 mr-2" />
                              Deactivate User
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-4 h-4 mr-2" />
                              Activate User
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info('View details coming soon')}>
                          <Shield className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              
              {usersData?.users?.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          )}
          
          {/* Pagination */}
          {usersData?.pagination && usersData.pagination.total > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, usersData.pagination.count)} of {usersData.pagination.count} users
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage >= usersData.pagination.total}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;