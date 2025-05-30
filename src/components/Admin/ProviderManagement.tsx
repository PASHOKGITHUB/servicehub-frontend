'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  UserCheck, 
  Search, 
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  Shield,
  DollarSign,
  Star,
  Package
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAdminProviders, useUpdateUserStatus } from '@/hooks/useAdminQueries';
import { toast } from 'sonner';

// Provider interface for admin management
interface AdminProvider {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified?: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Provider-specific stats
  servicesCount?: number;
  totalEarnings?: number;
  totalBookings?: number;
  averageRating?: number;
  completedBookings?: number;
  pendingBookings?: number;
}

// Pagination interface
interface PaginationMeta {
  current: number;
  total: number;
  count: number;
  limit: number;
}

// Admin providers response interface
interface AdminProvidersResponse {
  providers: AdminProvider[];
  pagination: PaginationMeta;
}

// Admin providers query parameters
interface AdminProvidersParams {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
}

// Update user status request
interface UpdateUserStatusRequest {
  userId: string;
  isActive: boolean;
  reason: string;
}

const ProviderManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // Query parameters with proper typing
  const queryParams: AdminProvidersParams = {
    page: currentPage,
    limit: 10,
    search: searchTerm || undefined,
    isActive: selectedStatus === 'all' ? undefined : selectedStatus === 'active',
  };

  const { data: providersData, isLoading } = useAdminProviders(queryParams) as {
    data?: AdminProvidersResponse;
    isLoading: boolean;
  };

  const updateUserStatusMutation = useUpdateUserStatus();

  const handleStatusToggle = async (userId: string, currentStatus: boolean): Promise<void> => {
    const updateRequest: UpdateUserStatusRequest = {
      userId,
      isActive: !currentStatus,
      reason: !currentStatus ? 'Provider activated by admin' : 'Provider deactivated by admin'
    };

    try {
      await updateUserStatusMutation.mutateAsync(updateRequest);
      toast.success(`Provider ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Status update failed:', error);
      toast.error('Failed to update provider status');
    }
  };

  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewDetails = (providerId: string): void => {
    toast.info('View details coming soon');
    // TODO: Navigate to provider details page
    console.log('View details for provider:', providerId);
  };

  const handleViewServices = (providerId: string): void => {
    toast.info('View services coming soon');
    // TODO: Navigate to provider services page
    console.log('View services for provider:', providerId);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Provider Management
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Manage service providers and their business performance
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6 border border-gray-200 shadow-sm rounded-2xl">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search providers by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-[#1EC6D9] focus:ring-[#1EC6D9]"
              />
            </div>
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

      {/* Providers Table */}
      <Card className="border border-gray-200 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5" />
            <span>Service Providers ({providersData?.pagination?.count || 0})</span>
          </CardTitle>
          <CardDescription>
            Manage service providers and monitor their business performance
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
              {providersData?.providers?.map((provider: AdminProvider) => (
                <div key={provider._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={provider.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8] text-white font-semibold">
                        {getInitials(provider.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{provider.name}</h3>
                        <Badge className="bg-blue-100 text-blue-700">
                          Provider
                        </Badge>
                        {provider.isEmailVerified && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <Mail className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{provider.email}</span>
                        </div>
                        {provider.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{provider.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(provider.createdAt)}</span>
                        </div>
                      </div>

                      {/* Provider Stats */}
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Package className="w-3 h-3" />
                          <span>{provider.servicesCount || 0} Services</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-3 h-3" />
                          <span>{formatCurrency(provider.totalEarnings || 0)} Earned</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{provider.totalBookings || 0} Bookings</span>
                        </div>
                        {provider.averageRating && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{provider.averageRating.toFixed(1)} Rating</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Badge variant={provider.isActive ? "default" : "secondary"} className={
                      provider.isActive 
                        ? "bg-green-100 text-green-700 hover:bg-green-100" 
                        : "bg-red-100 text-red-700 hover:bg-red-100"
                    }>
                      {provider.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleStatusToggle(provider._id, provider.isActive)}
                          disabled={updateUserStatusMutation.isPending}
                          className={provider.isActive ? "text-red-600" : "text-green-600"}
                        >
                          {provider.isActive ? 'Deactivate Provider' : 'Activate Provider'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewDetails(provider._id)}>
                          <Shield className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewServices(provider._id)}>
                          <Package className="w-4 h-4 mr-2" />
                          View Services
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              
              {providersData?.providers?.length === 0 && (
                <div className="text-center py-12">
                  <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No providers found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          )}
          
          {/* Pagination */}
          {providersData?.pagination && providersData.pagination.total > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, providersData.pagination.count)} of {providersData.pagination.count} providers
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage >= providersData.pagination.total}
                  className="border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white"
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

export default ProviderManagement;