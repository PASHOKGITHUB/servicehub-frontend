'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
} from 'lucide-react';
import { useServiceDetails } from '@/hooks/useUserQueries';
import { formatCurrency } from '@/lib/formatters';
import { useRouter } from 'next/navigation';
interface ServiceDetailsProps {
  serviceId: string;
}

const ServiceDetails = ({ serviceId }: ServiceDetailsProps) => {

  const router = useRouter();
  const { data, isLoading, error } = useServiceDetails(serviceId);

  if (isLoading) {
    return <ServiceDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Failed to load service details</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  const { service, reviews } = data || {};

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Service Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{service?.name}</CardTitle>
              <CardDescription className="text-lg">
                by {service?.provider.name}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(service?.price || 0)}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {service?.duration} minutes
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Service Info */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{service?.description}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Service Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {service?.serviceAreas?.map((area, index) => (
                    <Badge key={index} variant="outline">
                      <MapPin className="w-3 h-3 mr-1" />
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              {service?.tags && service.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Provider Info */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Service Provider</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <h4 className="font-medium">{service?.provider.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{service?.provider.averageRating?.toFixed(1) || 0}</span>
                      <span>({service?.provider.totalReviews || 0} reviews)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {service?.provider.phone || 'Not provided'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {service?.provider.email}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Service Stats</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-bold text-lg">{service?.totalBookings || 0}</div>
                    <div className="text-gray-600">Total Bookings</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-bold text-lg">{service?.totalReviews || 0}</div>
                    <div className="text-gray-600">Reviews</div>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={() => router.push(`/user/book-service/${service?._id}`)}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book This Service
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
          <CardDescription>
            What customers are saying about this service
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.slice(0, 5).map((review) => (
                <div key={review._id} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
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
                      <span className="font-medium">{review.customer?.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-gray-600 text-sm">{review.comment}</p>
                  )}
                </div>
              ))}
              {reviews.length > 5 && (
                <Button variant="outline" className="w-full">
                  View All {reviews.length} Reviews
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No reviews yet</p>
              <p className="text-sm">Be the first to book and review this service</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const ServiceDetailsSkeleton = () => (
  <div className="p-4 sm:p-6 space-y-6">
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="text-right space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default ServiceDetails;