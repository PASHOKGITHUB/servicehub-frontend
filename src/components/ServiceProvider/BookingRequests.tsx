'use client';

import React, { useState } from 'react';
import { Card, CardContent} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Calendar, 
  Search, 
  MoreHorizontal,
  Check,
  X,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  MessageCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  useProviderBookings, 
  useUpdateBookingStatus 
} from '@/hooks/useProviderQueries';
import { toast } from 'sonner';

// Import existing types from domain entities
import type { 
  ProviderBooking,
  ProviderBookingsParams,
  ProviderBookingsResponse,
  UpdateBookingStatusRequest
} from '@/domain/entities/Provider/Provider';

interface BookingRequestsProps {
  status?: string;
}

// Status variant type for badge styling
type BookingStatusVariant = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

const BookingRequests: React.FC<BookingRequestsProps> = ({ status = 'all' }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>(status);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // Properly typed query parameters
  const queryParams: ProviderBookingsParams = {
    page: currentPage,
    limit: 10,
    status: selectedStatus === 'all' ? undefined : selectedStatus,
    // search: searchTerm || undefined, // Backend might not support search
  };

  const { data: bookingsData, isLoading } = useProviderBookings(queryParams) as {
    data?: ProviderBookingsResponse;
    isLoading: boolean;
  };

  const updateBookingMutation = useUpdateBookingStatus();

  const handleStatusUpdate = async (bookingId: string, newStatus: string, notes?: string): Promise<void> => {
    const updateRequest: UpdateBookingStatusRequest = {
      id: bookingId,
      status: newStatus,
      providerNotes: notes
    };

    try {
      await updateBookingMutation.mutateAsync(updateRequest);
      toast.success(`Booking ${newStatus.replace('_', ' ').toLowerCase()} successfully`);
    } catch (error) {
      console.error('Status update failed:', error);
      toast.error('Failed to update booking status');
    }
  };

  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusBadge = (status: string): string => {
    const variants: Record<BookingStatusVariant, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      in_progress: 'bg-purple-100 text-purple-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return variants[status as BookingStatusVariant] || variants.pending;
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

  const formatStatusDisplay = (status: string): string => {
    return status.replace('_', ' ').toUpperCase();
  };

  const handleCallCustomer = (phone?: string): void => {
    if (phone) {
      window.open(`tel:${phone}`);
    } else {
      toast.error('Customer phone number not available');
    }
  };

  const handleEmailCustomer = (email: string): void => {
    if (email) {
      window.open(`mailto:${email}`);
    } else {
      toast.error('Customer email not available');
    }
  };

  const handleSendMessage = (): void => {
    toast.info('Chat feature coming soon');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Booking Requests
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Manage your service booking requests and appointments
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6 border border-gray-200 shadow-sm rounded-2xl">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by customer name or service..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          bookingsData?.bookings?.map((booking: ProviderBooking) => (
            <Card key={booking._id} className="border border-gray-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <AvatarImage src={booking.customer?.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8] text-white font-semibold">
                        {getInitials(booking.customer?.name || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{booking.service?.name}</h3>
                        <Badge className={getStatusBadge(booking.status)}>
                          {formatStatusDisplay(booking.status)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>{booking.customer?.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(booking.bookingDate)} at {booking.timeSlot}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.address?.street}, {booking.address?.city}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-green-600">{formatCurrency(booking.serviceFee)}</span>
                        </div>
                      </div>
                      
                      {booking.customerNotes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600">
                            <strong>Customer Notes:</strong> {booking.customerNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 lg:ml-4">
                    {booking.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                          disabled={updateBookingMutation.isPending}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(booking._id, 'cancelled', 'Declined by provider')}
                          disabled={updateBookingMutation.isPending}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Decline
                        </Button>
                      </>
                    )}
                    
                    {booking.status === 'confirmed' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(booking._id, 'in_progress')}
                        disabled={updateBookingMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        Start Service
                      </Button>
                    )}
                    
                    {booking.status === 'in_progress' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(booking._id, 'completed')}
                        disabled={updateBookingMutation.isPending}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Complete
                      </Button>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleCallCustomer(booking.customer?.phone)}>
                          <Phone className="w-4 h-4 mr-2" />
                          Call Customer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEmailCustomer(booking.customer?.email)}>
                          <Mail className="w-4 h-4 mr-2" />
                          Email Customer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleSendMessage}>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Send Message
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        
        {!isLoading && (!bookingsData?.bookings || bookingsData.bookings.length === 0) && (
          <Card className="border border-gray-200 shadow-sm rounded-2xl">
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No booking requests found</h3>
              <p className="text-gray-600">
                {selectedStatus === 'pending' 
                  ? "You don't have any pending requests at the moment" 
                  : "No bookings match your current filters"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {bookingsData?.pagination && bookingsData.pagination.total > 1 && (
        <Card className="mt-6 border border-gray-200 shadow-sm rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, bookingsData.pagination.count)} of {bookingsData.pagination.count} bookings
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
                  disabled={currentPage >= bookingsData.pagination.total}
                  className="border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookingRequests;