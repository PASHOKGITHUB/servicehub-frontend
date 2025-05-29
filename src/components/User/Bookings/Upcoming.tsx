'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare,
  X,
  AlertTriangle
} from 'lucide-react';
import { useUserBookings, useCancelBooking } from '@/hooks/useUserQueries';
import { formatCurrency, formatDate} from '@/lib/formatters';
import { Booking, BookingStatus } from '@/domain/entities/User/Booking';

const UpcomingBookings = () => {
  const [page, setPage] = useState(1);
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const { data, isLoading, error } = useUserBookings({
    page,
    limit: 10,
    status: 'pending,confirmed',
    sortBy: 'bookingDate',
    sortOrder: 'asc'
  });

  const cancelMutation = useCancelBooking();

  const handleCancelBooking = async () => {
    if (!cancellingBooking) return;

    try {
      await cancelMutation.mutateAsync({
        bookingId: cancellingBooking,
        cancelReason: cancelReason.trim() || undefined
      });
      setCancellingBooking(null);
      setCancelReason('');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canCancelBooking = (booking: Booking) => {
    const bookingDate = new Date(booking.bookingDate);
    const now = new Date();
    const hoursDiff = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return (
      booking.status === BookingStatus.PENDING || 
      booking.status === BookingStatus.CONFIRMED
    ) && hoursDiff > 2; // Can cancel up to 2 hours before
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Failed to load upcoming bookings</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Upcoming Bookings</h1>
          <p className="text-gray-600">Manage your scheduled services</p>
        </div>
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <BookingsSkeleton />
      ) : data?.bookings?.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No upcoming bookings</h3>
            <p className="text-gray-600 mb-4">
              You don&apos;t have any scheduled services at the moment
            </p>
            <Button onClick={() => window.location.href = '/user/browse'}>
              Browse Services
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data?.bookings?.map((booking) => (
            <BookingCard 
              key={booking._id} 
              booking={booking}
              onCancel={() => setCancellingBooking(booking._id)}
              canCancel={canCancelBooking(booking)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.pagination.total > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm text-gray-600">
            Page {page} of {data.pagination.total}
          </span>
          <Button
            variant="outline"
            disabled={page === data.pagination.total}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Cancel Booking Dialog */}
      <Dialog 
        open={!!cancellingBooking} 
        onOpenChange={() => {
          if (!cancelMutation.isPending) {
            setCancellingBooking(null);
            setCancelReason('');
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Cancel Booking
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cancelReason">Reason for cancellation (optional)</Label>
              <Textarea
                id="cancelReason"
                placeholder="Please let us know why you're cancelling..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setCancellingBooking(null);
                  setCancelReason('');
                }}
                disabled={cancelMutation.isPending}
              >
                Keep Booking
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelBooking}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Booking'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface BookingCardProps {
  booking: Booking;
  onCancel: () => void;
  canCancel: boolean;
}

const BookingCard = ({ booking, onCancel, canCancel }: BookingCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{booking.service.name}</CardTitle>
            <CardDescription>
              Booking ID: {booking._id.slice(-8).toUpperCase()}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(booking.status)} variant="secondary">
            {booking.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Service Details */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Service Provider</h4>
              <div className="space-y-1">
                <p className="font-medium">{booking.provider.name}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {booking.provider.phone || 'Not provided'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {booking.provider.email}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Schedule</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{formatDate(booking.bookingDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{booking.timeSlot} ({booking.service.duration} minutes)</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Service Address</h4>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
                <div>
                  <p>{booking.address.street}</p>
                  <p>{booking.address.city}, {booking.address.state}</p>
                  <p>PIN: {booking.address.pincode}</p>
                  {booking.address.landmark && (
                    <p className="text-gray-600">Near: {booking.address.landmark}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Payment Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>{formatCurrency(booking.serviceFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span>{formatCurrency(booking.platformFee)}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Total Amount</span>
                  <span className="text-primary">{formatCurrency(booking.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Payment Status</span>
                  <span className="capitalize">{booking.paymentStatus}</span>
                </div>
              </div>
            </div>

            {booking.customerNotes && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Your Notes</h4>
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
                    <p>{booking.customerNotes}</p>
                  </div>
                </div>
              </div>
            )}

            {booking.providerNotes && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Provider Notes</h4>
                <div className="bg-blue-50 p-3 rounded-lg text-sm">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                    <p>{booking.providerNotes}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`tel:${booking.provider.phone}`, '_self')}
                disabled={!booking.provider.phone}
              >
                <Phone className="w-4 h-4 mr-1" />
                Call
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`mailto:${booking.provider.email}`, '_self')}
              >
                <Mail className="w-4 h-4 mr-1" />
                Email
              </Button>
              {canCancel && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onCancel}
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const BookingsSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <div className="flex justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default UpcomingBookings;