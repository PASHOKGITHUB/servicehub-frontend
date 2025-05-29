// src/components/User/Reviews/index.tsx - Fixed version

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
  Star, 
  Edit, 
  Trash2, 
  MessageSquare,
  Calendar,
  AlertTriangle,
  Filter,
  SortDesc,
  Eye
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useUserReviews, useUpdateReview, useDeleteReview } from '@/hooks/useUserQueries';
import { formatDate } from '@/lib/formatters';
import { Review } from '@/domain/entities/User/Review';

const UserReviews = () => {
  const [page, setPage] = useState(1);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deletingReview, setDeletingReview] = useState<Review | null>(null);
  const [filters, setFilters] = useState({
    rating: 'all', // Changed from empty string to 'all'
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [editData, setEditData] = useState({
    rating: 5,
    comment: ''
  });

  // Convert 'all' values to empty strings for API calls
  const getApiParams = (params: typeof filters) => {
    return {
      ...params,
      rating: params.rating === 'all' ? '' : params.rating,
    };
  };

  const { data, isLoading, error, refetch } = useUserReviews({
    page,
    limit: 10,
    ...getApiParams(filters)
  });

  const updateReviewMutation = useUpdateReview();
  const deleteReviewMutation = useDeleteReview();

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setEditData({
      rating: review.rating,
      comment: review.comment || ''
    });
  };

  const handleUpdateReview = async () => {
    if (!editingReview) return;

    try {
      await updateReviewMutation.mutateAsync({
        reviewId: editingReview._id,
        data: {
          rating: editData.rating,
          comment: editData.comment.trim() || undefined
        }
      });
      setEditingReview(null);
      setEditData({ rating: 5, comment: '' });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleDeleteReview = async () => {
    if (!deletingReview) return;

    try {
      await deleteReviewMutation.mutateAsync(deletingReview._id);
      setDeletingReview(null);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setFilters({
      rating: 'all', // Reset to 'all' instead of empty string
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setPage(1);
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Failed to load reviews</p>
        <Button onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">My Reviews</h1>
          <p className="text-gray-600">Manage your service reviews and feedback</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '/user/bookings/past'}
            className="text-primary hover:text-primary/80"
          >
            <Eye className="w-4 h-4 mr-1" />
            Past Bookings
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Filter className="w-4 h-4" />
              Filters:
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <Select
                value={filters.rating}
                onValueChange={(value) => handleFilterChange('rating', value)}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.sortBy}
                onValueChange={(value) => handleFilterChange('sortBy', value)}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.sortOrder}
                onValueChange={(value) => handleFilterChange('sortOrder', value)}
              >
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest</SelectItem>
                  <SelectItem value="asc">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(filters.rating !== 'all') && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      {isLoading ? (
        <ReviewsSkeleton />
      ) : data?.reviews?.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Star className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No reviews found</h3>
            <p className="text-gray-600 mb-4">
              {filters.rating !== 'all' ? 
                'No reviews match your current filters' : 
                'Complete a service to leave your first review'
              }
            </p>
            {filters.rating !== 'all' ? (
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            ) : (
              <Button onClick={() => window.location.href = '/user/bookings/past'}>
                View Past Bookings
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Results count */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {data?.pagination.count || 0} review{(data?.pagination.count || 0) !== 1 ? 's' : ''} found
            </span>
          </div>

          {data?.reviews?.map((review) => (
            <ReviewCard 
              key={review._id} 
              review={review}
              onEdit={() => handleEditReview(review)}
              onDelete={() => setDeletingReview(review)}
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

      {/* Edit Review Dialog */}
      <Dialog 
        open={!!editingReview} 
        onOpenChange={() => {
          if (!updateReviewMutation.isPending) {
            setEditingReview(null);
            setEditData({ rating: 5, comment: '' });
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Your Review</DialogTitle>
            <DialogDescription>
              Update your review for {editingReview?.service.name}
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
                    onClick={() => setEditData({ ...editData, rating: star })}
                  >
                    <Star 
                      className={`w-6 h-6 ${
                        star <= editData.rating 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="editComment">Your Review</Label>
              <Textarea
                id="editComment"
                placeholder="Share your experience..."
                value={editData.comment}
                onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                className="mt-2"
                rows={4}
                maxLength={500}
              />
              <div className="text-xs text-gray-500 mt-1">
                {editData.comment.length}/500 characters
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingReview(null);
                  setEditData({ rating: 5, comment: '' });
                }}
                disabled={updateReviewMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateReview}
                disabled={updateReviewMutation.isPending}
              >
                {updateReviewMutation.isPending ? 'Updating...' : 'Update Review'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Review Dialog */}
      <Dialog 
        open={!!deletingReview} 
        onOpenChange={() => {
          if (!deleteReviewMutation.isPending) {
            setDeletingReview(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Delete Review
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your review for "{deletingReview?.service.name}"? 
              This action cannot be undone and will permanently remove your feedback.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeletingReview(null)}
              disabled={deleteReviewMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteReview}
              disabled={deleteReviewMutation.isPending}
            >
              {deleteReviewMutation.isPending ? 'Deleting...' : 'Delete Review'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ReviewCardProps {
  review: Review;
  onEdit: () => void;
  onDelete: () => void;
}

const ReviewCard = ({ review, onEdit, onDelete }: ReviewCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{review.service.name}</CardTitle>
            <CardDescription>
              Provider: {review.provider.name}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Rating and Date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
              <span className="font-medium">{review.rating}/5</span>
            </div>
            <span className="text-sm text-gray-500">
              {formatDate(review.createdAt)}
            </span>
          </div>

          {/* Comment */}
          {review.comment && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 mt-1 text-gray-500 flex-shrink-0" />
                <p className="text-sm leading-relaxed">{review.comment}</p>
              </div>
            </div>
          )}

          {/* Provider Reply */}
          {review.providerReply && (
            <div className="bg-blue-50 border-l-4 border-blue-200 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-blue-700">
                      Provider Response
                    </span>
                    {review.providerReplyAt && (
                      <span className="text-xs text-gray-500">
                        {formatDate(review.providerReplyAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed">{review.providerReply}</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer - Visibility Status and Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Badge variant={review.isVisible ? "default" : "secondary"}>
                {review.isVisible ? "Public" : "Hidden"}
              </Badge>
              <span className="text-xs text-gray-500">
                {review.isVisible ? "Visible to other users" : "Hidden from public view"}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = `/user/services/${review.service._id}`}
              className="text-primary hover:text-primary/80"
            >
              View Service
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ReviewsSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <div className="flex justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-20 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default UserReviews;