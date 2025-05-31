// =====================================================
// src/components/User/Browse.tsx - FIXED VERSION
// =====================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Star, Clock} from 'lucide-react';
import { useBrowseServices } from '@/hooks/useUserQueries';
import type { UserService, ServiceCategory } from '@/domain/entities';

interface ServiceCardProps {
  service: UserService;
}

const Browse = () => {
  const [filters, setFilters] = useState({
    category: '',
    rating: '',
    page: 1,
    limit: 12,
    search: '',
    minPrice: '',
    maxPrice: '',
    city: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Convert string values to proper types for API
  const apiParams = {
    category: filters.category || undefined,
    rating: filters.rating ? parseInt(filters.rating) : undefined,
    page: filters.page,
    limit: filters.limit,
    search: filters.search || undefined,
    minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
    location: filters.city || undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder as 'asc' | 'desc',
  };

  const { data: servicesData, isLoading } = useBrowseServices(apiParams);

  const handleCategoryChange = (value: string) => {
    const categoryValue = value === 'all' ? '' : value;
    setFilters({ ...filters, category: categoryValue, page: 1 });
  };

  const handleRatingChange = (value: string) => {
    const ratingValue = value === 'all' ? '' : value;
    setFilters({ ...filters, rating: ratingValue, page: 1 });
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Browse Services</h1>
        <p className="text-gray-600">Find the perfect service for your needs</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search services..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="pl-10"
              />
            </div>
            
            <Select 
              value={filters.category || 'all'} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {servicesData?.filters?.categories?.map((category: ServiceCategory) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={filters.rating || 'all'} 
              onValueChange={handleRatingChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.sortBy} 
              onValueChange={(value) => setFilters({ ...filters, sortBy: value, page: 1 })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Newest</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="averageRating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full mb-4" />
                <Skeleton className="h-8 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData?.services?.map((service: UserService) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}

      {/* No results message */}
      {!isLoading && servicesData?.services?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No services found matching your criteria.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setFilters({
              category: '',
              rating: '',
              page: 1,
              limit: 12,
              search: '',
              minPrice: '',
              maxPrice: '',
              city: '',
              sortBy: 'createdAt',
              sortOrder: 'desc'
            })}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

const ServiceCard = ({ service }: ServiceCardProps) => {
  const router = useRouter();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // FIXED: Navigate to service details page first (not directly to booking)
  const handleViewDetails = () => {
    router.push(`/user/services/${service._id}`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{service.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{service.duration} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{service.averageRating.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              {formatCurrency(service.price)}
            </span>
            {/* FIXED: Changed from "Book Now" to "View Details" and navigate to service details */}
            <Button size="sm" onClick={handleViewDetails}>
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Browse;