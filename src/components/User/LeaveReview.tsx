'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Loader2 } from 'lucide-react';
import { useCreateReview } from '@/hooks/useUserQueries';
import { Booking } from '@/domain/entities/User/Booking';
import { toast } from 'sonner';

interface LeaveReviewProps {
  booking: Booking;
  onSuccess: () => void;
  onCancel: () => void;
}

const LeaveReview = ({ booking, onSuccess, onCancel }: LeaveReviewProps) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const createReviewMutation = useCreateReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createReviewMutation.mutateAsync({
        booking: booking._id,
        rating,
        comment: comment.trim() || undefined,
      });
      
      toast.success('Review submitted successfully!');
      onSuccess();
    } catch (err) {
      console.log('Error submitting review:', err);
      
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Rate Your Experience</CardTitle>
        <p className="text-sm text-gray-600">
          How was your experience with {booking.service.name}?
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Rating</Label>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="p-1"
                  onClick={() => setRating(star)}
                >
                  <Star 
                    className={`w-8 h-8 ${
                      star <= rating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="comment">Your Review (optional)</Label>
            <Textarea
              id="comment"
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-2"
              rows={4}
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1">
              {comment.length}/500 characters
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={createReviewMutation.isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createReviewMutation.isPending}
              className="flex-1"
            >
              {createReviewMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LeaveReview;