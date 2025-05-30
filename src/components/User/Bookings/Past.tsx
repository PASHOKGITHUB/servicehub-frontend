'use client';

import React, { useState } from 'react';
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
  MessageSquare,
  Star,
  CheckCircle,
  X,
  RotateCcw
} from 'lucide-react';
import { useUserBookings, useCreateReview } from '@/hooks/useUserQueries';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { BookingStatus } from '@/domain/entities/User/Booking';
import { UserBooking } from '@/domain/entities';

const PastBookings = () => {
  const [page, setPage] = useState(1);
  const [reviewingBooking, setReviewingBooking] = useState<UserBooking | null>(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });

  const { data, isLoading, error } = useUserBookings({
    page,
    limit: 10,
    status: 'completed,cancelled',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const createReviewMutation = useCreateReview();

  const handleSubmitReview = async (): Promise<void> => {
    if (!reviewingBooking) return;

    try {
      await createReviewMutation.mutateAsync({
        booking: reviewingBooking._id,
        rating: reviewData.rating,
        comment: reviewData.comment.trim() || undefined
      });
      setReviewingBooking(null);
      setReviewData({ rating: 5, comment: '' });
    } catch (err) {
      // Error is handled by the mutation
      console.error('Failed to submit review:', err);
    }
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Failed to load past bookings</p>
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
          <h1 className="text-2xl sm:text-3xl font-bold">Past Bookings</h1>
          <p className="text-gray-600">View your booking history and leave reviews</p>
        </div>
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <BookingsSkeleton />
      ) : data?.bookings?.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No past bookings</h3>
            <p className="text-gray-600 mb-4">
              You haven&apos;t completed any services yet
            </p>
            <Button onClick={() => window.location.href = '/user/browse'}>
              Browse Services
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data?.bookings?.map((booking) => (
            <PastBookingCard 
              key={booking._id} 
              booking={booking}
              onReview={() => setReviewingBooking(booking)}
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

      {/* Review Dialog */}
      <Dialog 
        open={!!reviewingBooking} 
        onOpenChange={() => {
          if (!createReviewMutation.isPending) {
            setReviewingBooking(null);
            setReviewData({ rating: 5, comment: '' });
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rate Your Experience</DialogTitle>
            <DialogDescription>
              How was your experience with {reviewingBooking?.service.name}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rating</Label>
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="ghost"
                    size="sm"
                    className="p-1"
                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                  >
                    <Star 
                      className={`w-6 h-6 ${
                        star <= reviewData.rating 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="reviewComment">Your Review (optional)</Label>
              <Textarea
                id="reviewComment"
                placeholder="Share your experience..."
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                className="mt-2"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setReviewingBooking(null);
                  setReviewData({ rating: 5, comment: '' });
                }}
                disabled={createReviewMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={createReviewMutation.isPending}
              >
                {createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface PastBookingCardProps {
  booking: UserBooking;
  onReview: () => void;
}

const PastBookingCard: React.FC<PastBookingCardProps> = ({ booking, onReview }) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string): React.ReactElement | null => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      case 'refunded':
        return <RotateCcw className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleBookAgain = (): void => {
    window.location.href = `/user/services/${booking.service._id}`;
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
            <div className="flex items-center gap-1">
              {getStatusIcon(booking.status)}
              {booking.status.replace('_', ' ').toUpperCase()}
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Service Details */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Service Provider</h4>
              <p className="font-medium">{booking.provider.name}</p>
            </div>

            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Service Date</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{formatDate(booking.bookingDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{booking.timeSlot}</span>
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
                </div>
              </div>
            </div>

            {booking.status === BookingStatus.CANCELLED && booking.cancelReason && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Cancellation Reason</h4>
                <div className="bg-red-50 p-3 rounded-lg text-sm">
                  <p>{booking.cancelReason}</p>
                </div>
              </div>
            )}
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
              </div>
            </div>

            {booking.completedAt && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Completed On</h4>
                <p className="text-sm">{formatDate(booking.completedAt)}</p>
              </div>
            )}

            {booking.cancelledAt && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Cancelled On</h4>
                <p className="text-sm">{formatDate(booking.cancelledAt)}</p>
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
              {booking.status === BookingStatus.COMPLETED && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onReview}
                  className="border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white"
                >
                  <Star className="w-4 h-4 mr-1" />
                  Leave Review
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleBookAgain}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Book Again
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const BookingsSkeleton: React.FC = () => (
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

export default PastBookings;