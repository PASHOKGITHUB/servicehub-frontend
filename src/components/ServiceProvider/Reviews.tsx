'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Star, 
  MessageCircle,
  TrendingUp
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  useProviderReviews, 
  useReplyToReview,
  useProviderDashboard
} from '@/hooks/useProviderQueries';
import { toast } from 'sonner';

const Reviews = () => {
  const [selectedRating, setSelectedRating] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  
  const { data: reviewsData, isLoading } = useProviderReviews({
    page: currentPage,
    limit: 10,
    rating: selectedRating === 'all' ? undefined : parseInt(selectedRating),
  });

  const { data: dashboardData } = useProviderDashboard();
  const replyMutation = useReplyToReview();

  const handleReply = async () => {
    if (!selectedReview || !replyText.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    try {
      await replyMutation.mutateAsync({
        id: selectedReview._id,
        reply: replyText
      });
      setReplyDialogOpen(false);
      setSelectedReview(null);
      setReplyText('');
    } catch (error) {
      console.error('Reply failed:', error);
    }
  };

  const openReplyDialog = (review: any) => {
    setSelectedReview(review);
    setReplyText(review.providerReply || '');
    setReplyDialogOpen(true);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  // Mock rating distribution data
  const ratingDistribution = [
    { rating: 5, count: 45, percentage: 60 },
    { rating: 4, count: 20, percentage: 27 },
    { rating: 3, count: 8, percentage: 11 },
    { rating: 2, count: 2, percentage: 3 },
    { rating: 1, count: 0, percentage: 0 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Ratings & Reviews
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Monitor customer feedback and manage your reputation
        </p>
      </div>

      {/* Rating Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-2">
                {renderStars(Math.floor(dashboardData?.rating?.average || 4.8))}
              </div>
              <h2 className="text-3xl font-bold mb-1">
                {dashboardData?.rating?.average?.toFixed(1) || '4.8'}
              </h2>
              <p className="text-yellow-100">
                Based on {dashboardData?.rating?.totalReviews || 75} reviews
              </p>
              <div className="flex items-center justify-center mt-2 text-yellow-200">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">Excellent rating!</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-white border border-gray-200 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ratingDistribution.map((item) => (
                <div key={item.rating} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-12">
                    <span className="text-sm font-medium">{item.rating}</span>
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6 border border-gray-200 shadow-sm rounded-2xl">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedRating} onValueChange={setSelectedRating}>
              <SelectTrigger className="w-full sm:w-48 border-gray-200">
                <SelectValue placeholder="Filter by rating" />
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
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          reviewsData?.reviews?.map((review: any) => (
            <Card key={review._id} className="border border-gray-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <AvatarImage src={review.customer?.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8] text-white font-semibold">
                      {getInitials(review.customer?.name || 'U')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{review.customer?.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-1">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">
                        {review.service?.name}
                      </Badge>
                    </div>
                    
                    {review.comment && (
                      <div className="mb-4">
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    )}
                    
                    {review.providerReply ? (
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <div className="flex items-start space-x-2">
                          <MessageCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-blue-900 mb-1">Your Reply:</p>
                            <p className="text-sm text-blue-800">{review.providerReply}</p>
                            <p className="text-xs text-blue-600 mt-1">
                              {new Date(review.providerReplyAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openReplyDialog(review)}
                        className="mt-2"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Reply to Review
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        
            {!isLoading && reviewsData?.reviews?.length === 0 && (
          <Card className="border border-gray-200 shadow-sm rounded-2xl">
            <CardContent className="p-12 text-center">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-600">Complete some services to start receiving customer reviews</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {reviewsData?.pagination && reviewsData.pagination.total > 1 && (
        <Card className="mt-6 border border-gray-200 shadow-sm rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, reviewsData.pagination.count)} of {reviewsData.pagination.count} reviews
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
                  disabled={currentPage >= reviewsData.pagination.total}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Review</DialogTitle>
            <DialogDescription>
              Respond professionally to customer feedback
            </DialogDescription>
          </DialogHeader>
          
          {selectedReview && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <strong>{selectedReview.customer?.name}</strong>
                  <div className="flex items-center space-x-1">
                    {renderStars(selectedReview.rating)}
                  </div>
                </div>
                <p className="text-gray-700">{selectedReview.comment}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Your Reply
                </label>
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Thank you for your feedback..."
                  rows={4}
                  className="border-gray-200 focus:border-[#1EC6D9] focus:ring-[#1EC6D9]"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleReply}
              disabled={replyMutation.isPending}
              className="bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8]"
            >
              {replyMutation.isPending ? 'Sending...' : 'Send Reply'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reviews;